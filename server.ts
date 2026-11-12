import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parsePort(): number {
  const portIndex = process.argv.indexOf('--port');
  if (portIndex !== -1 && process.argv[portIndex + 1]) {
    const p = parseInt(process.argv[portIndex + 1], 10);
    if (!isNaN(p)) return p;
  }
  if (process.env.PORT) {
    const p = parseInt(process.env.PORT, 10);
    if (!isNaN(p)) return p;
  }
  return 3000;
}
const PORT = parsePort();
const app = express();

app.use(express.json({ limit: '5mb' }));

// Initialize GoogleGenAI SDK server-side
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// API Route: AI Breadcrumb Generation & Expansion
app.post('/api/ai/breadcrumb', async (req: Request, res: Response) => {
  try {
    const { code, objective, stepDescription, tierLevel, userQuestion } = req.body;

    if (!ai) {
      return res.status(200).json({
        fallback: true,
        message: 'Gemini API key is not configured. Serving local curated syllabus breadcrumbs.',
        hint: `Curated PCEP Breadcrumb: Remember the fundamental syntax rule for this objective (${objective || 'Python syntax'}). Check parameter types, proper indentation (PEP 8 4 spaces), and return values.`,
      });
    }

    const tierPromptMap: Record<number, string> = {
      1: 'Provide Level 1 Concept Primer hint only: explain the core algorithmic logic and why it applies, without naming exact syntax or solutions.',
      2: 'Provide Level 2 Syntax Pattern hint only: show the formal parameter signature or abstract statement structure (e.g. `for item in iterable:` or `try...except SpecificError:`), highlighting gotchas without completing the task.',
      3: 'Provide Level 3 Scaffold Skeleton hint only: provide a 2-4 line structural scaffold with `___` blanks or comments indicating where user logic plugs in.',
    };

    const targetTierDirective = tierPromptMap[tierLevel] || tierPromptMap[1];

    const prompt = `You are the Code Breadcrumb engine for PyCert (BuildTrace AI), preparing a student for Python Institute PCEP-30-03 certification.
The user is working on objective: "${objective || 'General Python'}"
Project step: "${stepDescription || 'Working on solution'}"
User's query/focus: "${userQuestion || 'Help understanding how to implement this'}"

Current code snapshot:
\`\`\`python
${(code || '').slice(0, 1000)}
\`\`\`

Strict Requirement: DO NOT provide the full complete solution code.
${targetTierDirective}
Keep response concise, authoritative, and under 120 words. Format cleanly in Markdown with small code blocks if appropriate.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const hintText = response.text || 'Keep exploring the syllabus pattern!';
    res.json({
      fallback: false,
      hint: hintText,
    });
  } catch (error: any) {
    console.error('Error generating AI breadcrumb:', error);
    res.status(500).json({
      error: 'Failed to generate AI breadcrumb',
      details: error?.message || 'Server error',
    });
  }
});

// API Route: AI Error Diagnosis
app.post('/api/ai/diagnose', async (req: Request, res: Response) => {
  try {
    const { code, traceback, objective } = req.body;

    if (!ai) {
      return res.status(200).json({
        fallback: true,
        diagnosis: 'Check your indentation and syntax near the line mentioned in the traceback.',
      });
    }

    const prompt = `You are a Python instructor diagnosing an error for a PCEP-30-03 student.
Objective: "${objective || 'Python Execution'}"

Traceback / Error:
${traceback || 'Unknown runtime issue'}

User Code:
\`\`\`python
${(code || '').slice(0, 1000)}
\`\`\`

Explain:
1. Exactly what the Python exception means (e.g., ValueError, TypeError, ZeroDivisionError, IndexError, KeyError, NameError, IndentationError).
2. The exact logical mistake or edge case triggering it.
3. A guidance hint to fix it (WITHOUT giving the entire code block away).
Keep under 100 words.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({
      fallback: false,
      diagnosis: response.text || 'Check syntax and data types.',
    });
  } catch (error: any) {
    console.error('Error in AI diagnosis:', error);
    res.status(500).json({
      error: 'Failed to diagnose code error',
      details: error?.message || 'Server error',
    });
  }
});

// Setup Vite or Static File Serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PyCert server running on port ${PORT} [${isProduction ? 'prod' : 'dev'}]`);
  });
}

startServer();
