import { KernelVariable, MicroProject, NotebookCell } from '../types';

export interface ExportableCellResult {
  executionCount: number | null;
  stdout: string;
  stderr: string;
  isError: boolean;
  durationMs: number;
  engine: 'pyodide-wasm' | 'simulated-engine';
  variables: KernelVariable[];
  stepCheck?: {
    passed: boolean;
    message?: string;
  };
}

interface JupyterOutputStream {
  output_type: 'stream';
  name: 'stdout' | 'stderr';
  text: string[];
}

interface JupyterMarkdownCell {
  id: string;
  cell_type: 'markdown';
  metadata: Record<string, unknown>;
  source: string[];
}

interface JupyterCodeCell {
  id: string;
  cell_type: 'code';
  execution_count: number | null;
  metadata: Record<string, unknown>;
  outputs: JupyterOutputStream[];
  source: string[];
}

type JupyterCell = JupyterMarkdownCell | JupyterCodeCell;

export interface JupyterNotebookDocument {
  cells: JupyterCell[];
  metadata: {
    kernelspec: {
      display_name: string;
      language: string;
      name: string;
    };
    language_info: {
      codemirror_mode: {
        name: string;
        version: number;
      };
      file_extension: string;
      mimetype: string;
      name: string;
      pygments_lexer: string;
      version: string;
    };
  };
  nbformat: number;
  nbformat_minor: number;
}

/**
 * Split multi-line text into Jupyter's standard line-array source format
 * where every line except the final line preserves its trailing newline.
 */
function toJupyterSourceLines(text: string): string[] {
  const normalized = text.replace(/\r\n/g, '\n');
  if (!normalized) return [];
  const rawLines = normalized.split('\n');
  return rawLines.map((line, index) =>
    index < rawLines.length - 1 ? `${line}\n` : line
  );
}

function sanitizeCellId(raw: string): string {
  const cleaned = raw.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
  return cleaned.slice(0, 64) || 'cell';
}

export function getIpynbFilename(project: MicroProject): string {
  if (project.fileName) {
    return project.fileName.replace(/\.py$/i, '') + '.ipynb';
  }
  const slug = project.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return `${slug || 'python_lab'}.ipynb`;
}

export function buildIpynbNotebook(
  project: MicroProject,
  cells: NotebookCell[],
  getCellCode: (cellId: string) => string,
  cellResults: Record<string, ExportableCellResult>
): JupyterNotebookDocument {
  const nbCells: JupyterCell[] = [];

  // Intro Markdown overview cell
  const overviewLines: string[] = [
    `# ${project.title}`,
    '',
    `**Domain ${project.sectionNumber}:** ${project.sectionName}  `,
    `**Objectives:** ${project.specificObjectives.join(', ')} · **Difficulty:** ${project.difficulty}`,
    '',
    project.description,
  ];

  if (project.learningOutcomes.length > 0) {
    overviewLines.push('', '### Learning Outcomes');
    for (const outcome of project.learningOutcomes) {
      overviewLines.push(`- ${outcome}`);
    }
  }

  if (project.keyTip) {
    overviewLines.push('', `> **Quick Tip:** ${project.keyTip}`);
  }

  if (project.pitfallWarning) {
    overviewLines.push('', `> **Exam Watch-Out:** ${project.pitfallWarning}`);
  }

  nbCells.push({
    id: sanitizeCellId(`${project.id}-overview`),
    cell_type: 'markdown',
    metadata: {},
    source: toJupyterSourceLines(overviewLines.join('\n')),
  });

  // Sequential Setup & Step pairs (Markdown instructions + Student code cell)
  cells.forEach((cell, idx) => {
    const step =
      cell.kind === 'step' && cell.stepNumber
        ? project.steps.find((s) => s.stepNumber === cell.stepNumber)
        : undefined;

    const mdLines: string[] = [];
    if (step) {
      mdLines.push(
        `## ${step.title}`,
        `*Objective ${step.targetObjectiveId}*`,
        '',
        step.taskInstruction
      );
      if (step.expectedExample) {
        mdLines.push('', `**Target Check:** \`${step.expectedExample}\``);
      }
      if (step.patternCode) {
        mdLines.push(
          '',
          `### ${step.patternTitle || 'Worked Pattern'}`,
          '```python',
          step.patternCode.trimEnd(),
          '```'
        );
        if (step.patternExplanation) {
          mdLines.push('', step.patternExplanation);
        }
      }
    } else {
      mdLines.push(`## ${cell.title}`);
      if (cell.description) {
        mdLines.push('', cell.description);
      }
    }

    nbCells.push({
      id: sanitizeCellId(`${project.id}-md-${cell.id}-${idx}`),
      cell_type: 'markdown',
      metadata: {},
      source: toJupyterSourceLines(mdLines.join('\n')),
    });

    const runtime = cellResults[cell.id];
    const outputs: JupyterOutputStream[] = [];
    if (runtime?.stdout) {
      outputs.push({
        output_type: 'stream',
        name: 'stdout',
        text: toJupyterSourceLines(
          runtime.stdout.endsWith('\n') ? runtime.stdout : `${runtime.stdout}\n`
        ),
      });
    }
    if (runtime?.stderr) {
      outputs.push({
        output_type: 'stream',
        name: 'stderr',
        text: toJupyterSourceLines(
          runtime.stderr.endsWith('\n') ? runtime.stderr : `${runtime.stderr}\n`
        ),
      });
    }

    nbCells.push({
      id: sanitizeCellId(`${project.id}-code-${cell.id}-${idx}`),
      cell_type: 'code',
      execution_count: runtime?.executionCount ?? null,
      metadata: {},
      outputs,
      source: toJupyterSourceLines(getCellCode(cell.id)),
    });
  });

  return {
    cells: nbCells,
    metadata: {
      kernelspec: {
        display_name: 'Python 3 (ipykernel)',
        language: 'python',
        name: 'python3',
      },
      language_info: {
        codemirror_mode: {
          name: 'ipython',
          version: 3,
        },
        file_extension: '.py',
        mimetype: 'text/x-python',
        name: 'python',
        pygments_lexer: 'ipython3',
        version: '3.11.0',
      },
    },
    nbformat: 4,
    nbformat_minor: 5,
  };
}

export function downloadIpynbFile(
  project: MicroProject,
  cells: NotebookCell[],
  getCellCode: (cellId: string) => string,
  cellResults: Record<string, ExportableCellResult>
): string {
  const filename = getIpynbFilename(project);
  const notebookDoc = buildIpynbNotebook(project, cells, getCellCode, cellResults);
  const jsonPayload = JSON.stringify(notebookDoc, null, 2);

  const blob = new Blob([jsonPayload], {
    type: 'application/x-ipynb+json;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);

  return filename;
}
