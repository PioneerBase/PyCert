import React, { useState, useRef, useEffect } from 'react';
import { useProgress } from '../context/ProgressContext';
import { MICRO_PROJECTS } from '../data/pcepCurriculum';
import { KernelVariable, NotebookCell, ProjectStep } from '../types';
import {
  executeNotebookCell,
  resetNotebookKernel,
  NotebookCellResult,
} from '../services/pythonRunner';
import { BreadcrumbsDrawer } from './BreadcrumbsDrawer';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  Lightbulb,
  Copy,
  Check,
  AlertTriangle,
  FlaskConical,
  GitCommit,
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Terminal,
  Database,
} from 'lucide-react';

interface CellRuntimeState {
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

export const Workspace: React.FC = () => {
  const {
    currentProject,
    selectProject,
    currentCode,
    getCellCode,
    setCellCode,
    resetCellCode,
    resetProjectCode,
    currentStepIndex,
    setCurrentStepIndex,
    markStepComplete,
    completedSteps,
    setActiveView,
  } = useProgress();

  const [cellResults, setCellResults] = useState<Record<string, CellRuntimeState>>({});
  const [runningCellId, setRunningCellId] = useState<string | null>(null);
  const [isRunningAll, setIsRunningAll] = useState<boolean>(false);
  const [isKernelResetting, setIsKernelResetting] = useState<boolean>(false);
  const [openPatterns, setOpenPatterns] = useState<Record<string, boolean>>({});
  const [copiedCellId, setCopiedCellId] = useState<string | null>(null);
  const [isBreadcrumbsOpen, setIsBreadcrumbsOpen] = useState<boolean>(false);
  const [kernelBannerMsg, setKernelBannerMsg] = useState<string | null>(null);

  const cellTextareaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});

  const cells: NotebookCell[] = currentProject.notebookCells || [
    {
      id: 'main',
      kind: 'step',
      stepNumber: 1,
      title: currentProject.title,
      starterCode: currentProject.starterCode,
      solutionCode: currentProject.solutionCode,
    },
  ];

  const currentStep: ProjectStep =
    currentProject.steps[currentStepIndex] || currentProject.steps[0];

  // Reset shared Python kernel & clear stale inline cell outputs whenever switching labs
  useEffect(() => {
    let active = true;
    setCellResults({});
    setRunningCellId(null);
    setIsRunningAll(false);
    setKernelBannerMsg(null);

    // Open the first incomplete step's worked pattern by default
    const firstStepCell = cells.find((c) => c.kind === 'step');
    if (firstStepCell) {
      setOpenPatterns({ [firstStepCell.id]: true });
    } else {
      setOpenPatterns({});
    }

    resetNotebookKernel().then(() => {
      if (active) {
        setKernelBannerMsg('Fresh shared Python kernel ready for this lab.');
      }
    });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProject.id]);

  const getStepForCell = (cell: NotebookCell): ProjectStep | undefined => {
    if (cell.kind !== 'step' || !cell.stepNumber) return undefined;
    return currentProject.steps.find((s) => s.stepNumber === cell.stepNumber);
  };

  const applyExecutionResult = (
    cell: NotebookCell,
    result: NotebookCellResult,
    step?: ProjectStep
  ) => {
    setCellResults((prev) => ({
      ...prev,
      [cell.id]: {
        executionCount: result.executionCount,
        stdout: result.stdout,
        stderr: result.stderr,
        isError: result.isError,
        durationMs: result.durationMs,
        engine: result.engine,
        variables: result.variables,
        stepCheck: result.stepCheck,
      },
    }));

    if (step && result.stepCheck?.passed) {
      markStepComplete(step.stepNumber);
    }
  };

  const handleRunCell = async (cell: NotebookCell, focusNext: boolean = false) => {
    if (isRunningAll) return;
    setRunningCellId(cell.id);
    setKernelBannerMsg(null);

    const step = getStepForCell(cell);
    if (step) {
      const idx = currentProject.steps.findIndex((s) => s.stepNumber === step.stepNumber);
      if (idx >= 0) setCurrentStepIndex(idx);
    }

    const code = getCellCode(cell.id);
    const result = await executeNotebookCell(
      cell.id,
      code,
      step
        ? {
            stepNumber: step.stepNumber,
            validationSnippet: step.validationSnippet,
            diagnosticExpr: step.diagnosticExpr,
            expectedExample: step.expectedExample,
          }
        : undefined
    );

    applyExecutionResult(cell, result, step);
    setRunningCellId(null);

    if (focusNext) {
      const curIdx = cells.findIndex((c) => c.id === cell.id);
      if (curIdx >= 0 && curIdx < cells.length - 1) {
        const nextCell = cells[curIdx + 1];
        requestAnimationFrame(() => {
          cellTextareaRefs.current[nextCell.id]?.focus();
        });
      }
    }
  };

  const handleRunAllCells = async () => {
    if (isRunningAll || runningCellId) return;
    setIsRunningAll(true);
    setCellResults({});
    setKernelBannerMsg('Restarted shared kernel · Running all cells top to bottom...');

    await resetNotebookKernel();

    for (const cell of cells) {
      setRunningCellId(cell.id);
      const step = getStepForCell(cell);
      const code = getCellCode(cell.id);
      const result = await executeNotebookCell(
        cell.id,
        code,
        step
          ? {
              stepNumber: step.stepNumber,
              validationSnippet: step.validationSnippet,
              diagnosticExpr: step.diagnosticExpr,
              expectedExample: step.expectedExample,
            }
          : undefined
      );
      applyExecutionResult(cell, result, step);
    }

    setRunningCellId(null);
    setIsRunningAll(false);
    setKernelBannerMsg('All cells executed top to bottom in the shared kernel.');
  };

  const handleRestartKernel = async () => {
    if (isRunningAll || runningCellId) return;
    setIsKernelResetting(true);
    await resetNotebookKernel();
    setCellResults({});
    setIsKernelResetting(false);
    setKernelBannerMsg('Kernel restarted. Live variables cleared (your code is preserved).');
  };

  const handleResetLab = async () => {
    if (isRunningAll || runningCellId) return;
    resetProjectCode();
    await resetNotebookKernel();
    setCellResults({});
    setKernelBannerMsg('All cells restored to starter code and kernel restarted.');
  };

  const handleCellKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    cell: NotebookCell
  ) => {
    const textarea = cellTextareaRefs.current[cell.id];
    if (!textarea) return;

    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      const newValue = value.substring(0, start) + '    ' + value.substring(end);
      setCellCode(cell.id, newValue);
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      });
    } else if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      handleRunCell(cell, true);
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRunCell(cell, false);
    } else if (e.key === 'Enter' && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const currentLine = value.slice(lineStart, start);
      const indentMatch = currentLine.match(/^(\s*)/);
      const currentIndent = indentMatch ? indentMatch[1] : '';
      const extraIndent = currentLine.trimEnd().endsWith(':') ? '    ' : '';

      e.preventDefault();
      const insertion = '\n' + currentIndent + extraIndent;
      const newValue = value.substring(0, start) + insertion + value.substring(end);
      setCellCode(cell.id, newValue);
      requestAnimationFrame(() => {
        const nextPos = start + insertion.length;
        textarea.selectionStart = textarea.selectionEnd = nextPos;
      });
    }
  };

  const handleCopyCell = (cellId: string) => {
    navigator.clipboard.writeText(getCellCode(cellId));
    setCopiedCellId(cellId);
    setTimeout(() => setCopiedCellId(null), 1800);
  };

  const handleLoadCellSolution = (cell: NotebookCell) => {
    setCellCode(cell.id, cell.solutionCode);
  };

  const completedCount = completedSteps.length;
  const totalSteps = currentProject.steps.length;
  const progressPct = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  const currentLabIdx = MICRO_PROJECTS.findIndex((p) => p.id === currentProject.id);
  const nextLab =
    currentLabIdx >= 0 && currentLabIdx < MICRO_PROJECTS.length - 1
      ? MICRO_PROJECTS[currentLabIdx + 1]
      : null;

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 space-y-6 animate-in fade-in duration-150">
      {/* Top Domain Lab Switcher Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#BDC3C7]/60 dark:border-[#2C3E50] pb-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[11px] font-bold text-[#2C3E50]/70 dark:text-[#BDC3C7] mr-1">
            Syllabus Labs:
          </span>
          {MICRO_PROJECTS.map((proj, idx) => {
            const isActive = proj.id === currentProject.id;
            return (
              <button
                key={proj.id}
                onClick={() => selectProject(proj.id)}
                className={`px-2.5 py-1 rounded-md font-mono text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'font-bold text-[#F5F5DC] bg-[#5A1827] shadow-xs'
                    : 'text-[#2C3E50]/80 dark:text-[#BDC3C7] bg-[#FAF9F5] dark:bg-[#1A2634] border border-[#BDC3C7]/60 dark:border-[#2C3E50] hover:border-[#1E3A78]'
                }`}
              >
                Lab {idx + 1}: D{proj.sectionNumber} · {proj.title.split(':')[0].split('(')[0].trim()}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-[#2C3E50]/70 dark:text-[#BDC3C7] shrink-0">
          <span>{currentProject.difficulty}</span>
          <span aria-hidden="true">·</span>
          <span>Est. {currentProject.estimatedMinutes} min</span>
        </div>
      </div>

      {/* Notebook Header & Shared Kernel Controls */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap text-xs font-mono text-[#1E3A78] dark:text-[#BDC3C7]">
            <span className="font-bold">
              Domain {currentProject.sectionNumber}: {currentProject.sectionName}
            </span>
            <span aria-hidden="true">·</span>
            <span>Objectives {currentProject.specificObjectives.join(', ')}</span>
            <span aria-hidden="true">·</span>
            <span>Interactive Python Notebook</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2C3E50] dark:text-[#F5F5DC] tracking-tight">
            {currentProject.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#2C3E50]/80 dark:text-[#BDC3C7] max-w-3xl leading-relaxed">
            {currentProject.description}
          </p>
        </div>

        {/* Notebook Kernel Action Bar */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="px-3 py-2 rounded-lg bg-[#FAF9F5] dark:bg-[#1A2634] border border-[#BDC3C7] dark:border-[#2C3E50] text-xs font-mono font-semibold text-[#2C3E50] dark:text-[#F5F5DC] tabular-nums whitespace-nowrap">
            Progress: <strong className="text-[#1E3A78] dark:text-amber-300">{progressPct}% ({completedCount}/{totalSteps})</strong>
          </div>

          <button
            type="button"
            onClick={handleRunAllCells}
            disabled={isRunningAll || Boolean(runningCellId)}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-[#F5F5DC] bg-[#1E3A78] hover:bg-[#162C5C] shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isRunningAll ? 'Running Notebook...' : 'Run All Cells'}</span>
          </button>

          <button
            type="button"
            onClick={handleRestartKernel}
            disabled={isRunningAll || isKernelResetting || Boolean(runningCellId)}
            className="px-3 py-2 rounded-lg text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC] bg-[#FAF9F5] dark:bg-[#1A2634] hover:bg-[#EBE9DF] dark:hover:bg-[#243342] border border-[#BDC3C7] dark:border-[#2C3E50] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
            title="Clear shared Python variables without deleting your code"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isKernelResetting ? 'animate-spin' : ''}`} />
            <span>Restart Kernel</span>
          </button>

          <button
            type="button"
            onClick={handleResetLab}
            disabled={isRunningAll || Boolean(runningCellId)}
            className="px-3 py-2 rounded-lg text-xs font-semibold text-[#2C3E50]/80 dark:text-[#BDC3C7] hover:text-[#2C3E50] dark:hover:text-[#F5F5DC] bg-[#FAF9F5] dark:bg-[#1A2634] hover:bg-[#EBE9DF] dark:hover:bg-[#243342] border border-[#BDC3C7] dark:border-[#2C3E50] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
            title="Reset all cells in this lab to starter code"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Lab</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('portfolio')}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[#F5F5DC] bg-[#5A1827] hover:bg-[#48121E] dark:bg-[#6B1D2F] dark:hover:bg-[#541624] shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
          >
            <GitCommit className="w-3.5 h-3.5" />
            <span>Portfolio</span>
          </button>
        </div>
      </div>

      {/* Quick Tip + Exam Watch-Out Strip */}
      {(currentProject.keyTip || currentProject.pitfallWarning) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentProject.keyTip && (
            <div className="p-3.5 rounded-xl bg-[#FAF9F5] dark:bg-[#1A2634] border border-[#BDC3C7]/80 dark:border-[#2C3E50] text-xs space-y-1">
              <div className="font-mono font-bold text-[11px] text-[#1E3A78] dark:text-sky-300">
                Quick Tip · Shared Notebook Kernel
              </div>
              <p className="text-[#2C3E50]/85 dark:text-[#BDC3C7] leading-relaxed">
                {currentProject.keyTip} Run each cell top to bottom with <code className="font-mono font-semibold">Shift+Enter</code> — variables and functions stay live across cells.
              </p>
            </div>
          )}
          {currentProject.pitfallWarning && (
            <div className="p-3.5 rounded-xl bg-[#5A1827] text-[#F5F5DC] text-xs space-y-1 shadow-xs">
              <div className="flex items-center gap-1.5 font-mono font-bold text-[11px] text-amber-300">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Exam Watch-Out</span>
              </div>
              <p className="text-[#F5F5DC]/90 leading-relaxed">
                {currentProject.pitfallWarning}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Subtle Kernel Status Line */}
      {kernelBannerMsg && (
        <div className="flex items-center justify-between px-3.5 py-2 rounded-lg bg-[#FAF9F5] dark:bg-[#141C24] border border-[#BDC3C7]/70 dark:border-[#2C3E50] text-[11px] font-mono text-[#2C3E50]/80 dark:text-[#BDC3C7]">
          <span>{kernelBannerMsg}</span>
          <span className="hidden sm:inline text-[#5D6D7E] dark:text-[#BDC3C7]/70">
            Shortcuts: Shift+Enter (Run &amp; Next) · Ctrl+Enter (Run Cell)
          </span>
        </div>
      )}

      {/* Sequential Jupyter Notebook Cells Stack */}
      <div className="space-y-6">
        {cells.map((cell, cellIndex) => {
          const step = getStepForCell(cell);
          const code = getCellCode(cell.id);
          const codeLines = code.split('\n');
          const result = cellResults[cell.id];
          const isThisRunning = runningCellId === cell.id;
          const isStepPassed = step
            ? result?.stepCheck
              ? result.stepCheck.passed
              : completedSteps.includes(step.stepNumber)
            : false;
          const isStepFailed = Boolean(step && result?.stepCheck && !result.stepCheck.passed);
          const isPatternOpen = Boolean(openPatterns[cell.id]);

          const promptLabel = isThisRunning
            ? 'In [*]:'
            : result?.executionCount
            ? `In [${result.executionCount}]:`
            : 'In [ ]:';

          return (
            <section
              key={cell.id}
              aria-label={cell.title}
              className={`rounded-2xl border transition-colors overflow-hidden shadow-xs ${
                isStepPassed
                  ? 'border-emerald-500/50 bg-[#FAF9F5] dark:bg-[#1A2634]'
                  : isStepFailed
                  ? 'border-rose-500/50 bg-[#FAF9F5] dark:bg-[#1A2634]'
                  : 'border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#1A2634]'
              }`}
            >
              {/* Cell Markdown / Instruction Header */}
              <div className="px-4 sm:px-5 py-4 space-y-2.5 border-b border-[#BDC3C7]/60 dark:border-[#2C3E50]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {cell.kind === 'setup' ? (
                      <span className="px-2 py-0.5 rounded font-mono text-[11px] font-bold bg-[#1E3A78] text-[#F5F5DC]">
                        SETUP
                      </span>
                    ) : isStepPassed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <span className="w-6 h-6 rounded-full bg-[#1E3A78] text-[#F5F5DC] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                        {cell.stepNumber || cellIndex + 1}
                      </span>
                    )}

                    <h2 className="text-sm sm:text-base font-bold text-[#2C3E50] dark:text-[#F5F5DC]">
                      {step ? step.title : cell.title}
                    </h2>

                    {step && (
                      <span className="font-mono text-[11px] text-[#5D6D7E] dark:text-[#BDC3C7]">
                        · Obj {step.targetObjectiveId}
                      </span>
                    )}
                  </div>

                  {/* Dual-Coded Step Status Label */}
                  {step && (
                    <div className="flex items-center gap-2 shrink-0">
                      {isStepPassed ? (
                        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>PASSED</span>
                        </span>
                      ) : isStepFailed ? (
                        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-rose-700 dark:text-rose-400">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>TRY AGAIN</span>
                        </span>
                      ) : (
                        <span className="font-mono text-xs font-semibold text-[#5D6D7E] dark:text-[#BDC3C7]">
                          NOT RUN
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Clear Step / Setup Instructions */}
                <p className="text-xs sm:text-sm text-[#2C3E50]/90 dark:text-[#BDC3C7] leading-relaxed">
                  {step ? step.taskInstruction : cell.description}
                </p>

                {/* Target Check & Worked Pattern Toggle Row */}
                {step && (
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                    {step.expectedExample && (
                      <div className="text-[11px] font-mono text-[#1E3A78] dark:text-sky-300">
                        Target check: <code>{step.expectedExample}</code>
                      </div>
                    )}

                    {step.patternCode && (
                      <button
                        type="button"
                        onClick={() =>
                          setOpenPatterns((prev) => ({
                            ...prev,
                            [cell.id]: !prev[cell.id],
                          }))
                        }
                        className="text-xs font-semibold text-[#1E3A78] dark:text-amber-300 hover:underline inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{isPatternOpen ? 'Hide Worked Pattern' : 'Show Worked Pattern'}</span>
                        {isPatternOpen ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                )}

                {/* Collapsible Analogous Worked Pattern Example */}
                {step && step.patternCode && isPatternOpen && (
                  <div className="mt-2 p-3.5 rounded-xl bg-white dark:bg-[#141C24] border border-[#BDC3C7]/80 dark:border-[#2C3E50] space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E3A78] dark:text-amber-300">
                      <BookOpen className="w-3.5 h-3.5 shrink-0" />
                      <span>{step.patternTitle || 'Worked Pattern Example'}</span>
                    </div>
                    <pre className="p-3 rounded-lg bg-[#1E2936] text-emerald-300 font-mono text-xs overflow-x-auto leading-relaxed">
                      <code>{step.patternCode}</code>
                    </pre>
                    {step.patternExplanation && (
                      <p className="text-xs text-[#2C3E50]/85 dark:text-[#BDC3C7] leading-relaxed">
                        {step.patternExplanation}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Jupyter Code Cell Frame */}
              <div className="bg-[#1E2936] text-[#F5F5DC]">
                {/* Cell Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-[#141C24] border-b border-[#2C3E50] text-[11px] font-mono">
                  <div className="flex items-center gap-2 text-[#BDC3C7]">
                    <span className="font-semibold text-[#F5F5DC]">{cell.title}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{codeLines.length} lines</span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {step && (
                      <button
                        type="button"
                        onClick={() => {
                          const idx = currentProject.steps.findIndex(
                            (s) => s.stepNumber === step.stepNumber
                          );
                          if (idx >= 0) setCurrentStepIndex(idx);
                          setIsBreadcrumbsOpen(true);
                        }}
                        className="px-2.5 py-1 rounded text-[#F5F5DC] bg-[#1E2936] hover:bg-[#2C3E50] border border-[#2C3E50] transition-colors inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
                      >
                        <Lightbulb className="w-3 h-3 text-amber-400" />
                        <span>Need Hint</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleLoadCellSolution(cell)}
                      className="px-2.5 py-1 rounded text-[#BDC3C7] hover:text-[#F5F5DC] border border-[#2C3E50] hover:bg-[#1E2936] transition-colors cursor-pointer whitespace-nowrap"
                      title="Fill this cell with the reference solution"
                    >
                      Show Solution
                    </button>

                    <button
                      type="button"
                      onClick={() => resetCellCode(cell.id)}
                      className="px-2.5 py-1 rounded text-[#BDC3C7] hover:text-[#F5F5DC] border border-[#2C3E50] hover:bg-[#1E2936] transition-colors cursor-pointer whitespace-nowrap"
                      title="Reset this cell to starter code"
                    >
                      Reset Cell
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyCell(cell.id)}
                      className="p-1 text-[#BDC3C7] hover:text-[#F5F5DC] rounded cursor-pointer"
                      title="Copy cell code"
                    >
                      {copiedCellId === cell.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Jupyter Prompt Margin + Line Numbers + Auto-Expanded Textarea */}
                <div className="flex items-stretch">
                  {/* Left Jupyter In [n]: Gutter */}
                  <div
                    onClick={() => cellTextareaRefs.current[cell.id]?.focus()}
                    className="w-16 sm:w-20 py-3.5 px-2 select-none text-right font-mono text-xs leading-6 border-r border-[#2C3E50] bg-[#141C24]/70 shrink-0 tabular-nums cursor-text"
                  >
                    <span
                      className={
                        isThisRunning
                          ? 'text-amber-300 font-bold'
                          : result?.executionCount
                          ? 'text-sky-300 font-bold'
                          : 'text-[#BDC3C7]/60'
                      }
                    >
                      {promptLabel}
                    </span>
                  </div>

                  {/* Line Numbers */}
                  <div
                    onClick={() => cellTextareaRefs.current[cell.id]?.focus()}
                    className="w-10 py-3.5 pr-2.5 pl-1 select-none text-right font-mono text-[13px] leading-6 text-[#BDC3C7]/40 border-r border-[#2C3E50]/70 bg-[#18222D] shrink-0 tabular-nums cursor-text"
                  >
                    {codeLines.map((_, lineIdx) => (
                      <div key={lineIdx} className="h-6 leading-6">
                        {lineIdx + 1 < 10 ? `0${lineIdx + 1}` : lineIdx + 1}
                      </div>
                    ))}
                  </div>

                  {/* Multi-line Editable Python Cell */}
                  <textarea
                    ref={(el) => {
                      cellTextareaRefs.current[cell.id] = el;
                    }}
                    value={code}
                    onChange={(e) => setCellCode(cell.id, e.target.value)}
                    onKeyDown={(e) => handleCellKeyDown(e, cell)}
                    rows={Math.max(6, codeLines.length + 1)}
                    wrap="off"
                    spellCheck={false}
                    autoCapitalize="off"
                    autoComplete="off"
                    aria-label={`${cell.title} Python editor`}
                    className="flex-1 block w-full min-h-[148px] py-3.5 px-4 font-mono text-[13px] leading-6 text-[#F5F5DC] bg-[#1E2936] resize-y overflow-x-auto focus:outline-hidden whitespace-pre selection:bg-[#1E3A78]/70 selection:text-[#F5F5DC]"
                  />
                </div>

                {/* Cell Action Footer */}
                <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-[#141C24] border-t border-[#2C3E50] text-xs">
                  <div className="font-mono text-[11px] text-[#BDC3C7]/80">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-[#1E2936] border border-[#2C3E50] text-[#F5F5DC]">Shift+Enter</kbd> to run &amp; advance · <kbd className="px-1.5 py-0.5 rounded bg-[#1E2936] border border-[#2C3E50] text-[#F5F5DC]">Tab</kbd> = 4 spaces
                  </div>

                  <button
                    type="button"
                    disabled={isRunningAll || isThisRunning}
                    onClick={() => handleRunCell(cell, false)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0 ${
                      cell.kind === 'setup'
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'bg-[#1E3A78] hover:bg-[#274B9A] text-[#F5F5DC]'
                    }`}
                  >
                    {cell.kind === 'setup' ? (
                      <Play className="w-3.5 h-3.5" />
                    ) : (
                      <FlaskConical className={`w-3.5 h-3.5 ${isThisRunning ? 'animate-spin' : ''}`} />
                    )}
                    <span>
                      {isThisRunning
                        ? 'Running Cell...'
                        : cell.kind === 'setup'
                        ? 'Run Setup Cell'
                        : `Run & Check Step ${cell.stepNumber}`}
                    </span>
                  </button>
                </div>
              </div>

              {/* Inline Output, Step Check Badge & Shared Kernel Variable Preview Tray */}
              {result && (
                <div className="bg-[#0E141B] text-[#F5F5DC] border-t border-[#2C3E50] divide-y divide-[#2C3E50]">
                  {/* 1. Step Check Result Banner */}
                  {result.stepCheck && (
                    <div
                      className={`px-4 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono ${
                        result.stepCheck.passed
                          ? 'bg-emerald-950/50 text-emerald-300'
                          : 'bg-rose-950/50 text-rose-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {result.stepCheck.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                        <span className="font-bold">
                          {result.stepCheck.passed
                            ? `PASSED · Step ${cell.stepNumber}`
                            : `TRY AGAIN · Step ${cell.stepNumber}`}
                        </span>
                        {result.stepCheck.message && (
                          <span className="text-[#F5F5DC]/90">
                            — {result.stepCheck.message}
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] text-[#BDC3C7] tabular-nums">
                        {result.durationMs}ms · {result.engine === 'pyodide-wasm' ? 'Pyodide 3.11' : 'Simulator'}
                      </span>
                    </div>
                  )}

                  {/* 2. Live Out [n]: Console Output / Error Traceback */}
                  <div className="flex items-start">
                    <div className="w-16 sm:w-20 py-3 px-2 text-right font-mono text-xs text-rose-300/80 border-r border-[#2C3E50] bg-[#141C24]/50 shrink-0 tabular-nums select-none">
                      {result.executionCount ? `Out [${result.executionCount}]:` : 'Out:'}
                    </div>
                    <div className="flex-1 p-3.5 font-mono text-xs overflow-x-auto space-y-2">
                      {!result.stepCheck && (
                        <div className="flex items-center justify-between text-[11px] text-[#BDC3C7]/70 pb-1">
                          <span className="inline-flex items-center gap-1.5">
                            <Terminal className="w-3 h-3" />
                            <span>Cell Output</span>
                          </span>
                          <span className="tabular-nums">{result.durationMs}ms</span>
                        </div>
                      )}

                      {result.stdout && (
                        <pre className="whitespace-pre-wrap text-[#F5F5DC] leading-relaxed">
                          <code>{result.stdout}</code>
                        </pre>
                      )}

                      {result.stderr && (
                        <pre className="whitespace-pre-wrap text-rose-300 bg-rose-950/40 p-2.5 rounded-lg border border-rose-500/30 leading-relaxed">
                          <code>{result.stderr}</code>
                        </pre>
                      )}

                      {!result.stdout && !result.stderr && (
                        <div className="text-[#BDC3C7]/70 italic">
                          (Cell executed with no printed output.)
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 3. Live Shared Kernel Variable Preview */}
                  {result.variables.length > 0 && (
                    <div className="px-4 sm:px-5 py-3 bg-[#141C24]/80 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#BDC3C7]">
                        <span className="inline-flex items-center gap-1.5 font-bold text-sky-300">
                          <Database className="w-3.5 h-3.5" />
                          <span>Shared Kernel Variables ({result.variables.length})</span>
                        </span>
                        <span className="text-[#BDC3C7]/70">
                          Available to all cells below
                        </span>
                      </div>

                      <div className="overflow-x-auto rounded-lg border border-[#2C3E50] bg-[#0E141B]">
                        <table className="w-full text-left font-mono text-[11px] tabular-nums">
                          <thead className="bg-[#18222D] text-[#BDC3C7] border-b border-[#2C3E50]">
                            <tr>
                              <th className="py-1.5 px-3 font-semibold">Variable</th>
                              <th className="py-1.5 px-3 font-semibold">Type</th>
                              <th className="py-1.5 px-3 font-semibold">Live Value Preview</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#2C3E50]/60">
                            {result.variables.map((v) => (
                              <tr key={v.name} className="hover:bg-[#18222D]/60">
                                <td className="py-1.5 px-3 font-bold text-amber-300 whitespace-nowrap">
                                  {v.name}
                                </td>
                                <td className="py-1.5 px-3 text-sky-300 whitespace-nowrap">
                                  {v.typeName}
                                </td>
                                <td className="py-1.5 px-3 text-[#F5F5DC]/90 break-all">
                                  {v.reprValue}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Lab Completion Next-Step Footer */}
      {completedCount >= totalSteps && totalSteps > 0 && (
        <div className="p-5 rounded-2xl border border-emerald-500/50 bg-emerald-50/70 dark:bg-emerald-950/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-5 h-5" />
              <span>Lab Complete ({completedCount}/{totalSteps} Steps Passed)</span>
            </div>
            <p className="text-xs text-[#2C3E50]/85 dark:text-[#BDC3C7]">
              Every cell in {currentProject.title} passed! Move on to the next domain lab or review your capstone project in Portfolio.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setActiveView('portfolio')}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-[#F5F5DC] bg-[#5A1827] hover:bg-[#48121E] transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <GitCommit className="w-3.5 h-3.5" />
              <span>Open Portfolio</span>
            </button>

            {nextLab && (
              <button
                type="button"
                onClick={() => selectProject(nextLab.id)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-[#F5F5DC] bg-[#1E3A78] hover:bg-[#162C5C] transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <span>Next: {nextLab.title.split(':')[0].split('(')[0].trim()}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Breadcrumbs Hint Drawer */}
      <BreadcrumbsDrawer
        isOpen={isBreadcrumbsOpen}
        onClose={() => setIsBreadcrumbsOpen(false)}
        step={currentStep}
        currentCode={currentCode}
      />
    </div>
  );
};
