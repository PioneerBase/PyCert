import express, { Request, Response } from 'express';
import path from 'path';
import crypto from 'crypto';
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
app.set('trust proxy', 1);

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

// =========================================================================
// GitHub OAuth & Repository Push Integration (Server-Side Token Management)
// =========================================================================

interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
}

interface GitHubSession {
  accessToken: string;
  user: GitHubUser;
  createdAt: number;
}

const SESSION_COOKIE_NAME = 'pycert_gh_session';
const githubSessions = new Map<string, GitHubSession>();
const pendingOAuthStates = new Map<string, number>();

function getAppBaseUrl(): string {
  const configured = process.env.APP_URL?.trim();
  if (configured && configured !== 'MY_APP_URL') {
    return configured.replace(/\/+$/, '');
  }
  return `http://localhost:${PORT}`;
}

function getCallbackUrl(): string {
  return `${getAppBaseUrl()}/auth/callback`;
}

function isGitHubConfigured(): boolean {
  const id = process.env.GITHUB_CLIENT_ID?.trim();
  const secret = process.env.GITHUB_CLIENT_SECRET?.trim();
  return Boolean(
    id &&
      secret &&
      id !== 'MY_GITHUB_CLIENT_ID' &&
      secret !== 'MY_GITHUB_CLIENT_SECRET'
  );
}

function parseCookies(cookieHeader?: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  for (const part of cookieHeader.split(';')) {
    const idx = part.indexOf('=');
    if (idx > 0) {
      const key = part.slice(0, idx).trim();
      const val = part.slice(idx + 1).trim();
      cookies[key] = decodeURIComponent(val);
    }
  }
  return cookies;
}

function getGitHubSession(req: Request): { sessionId: string; session: GitHubSession } | null {
  const cookies = parseCookies(req.headers.cookie);
  const authHeader = req.headers.authorization;
  const bearerToken =
    authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

  const sessionId = cookies[SESSION_COOKIE_NAME] || bearerToken;
  if (!sessionId) return null;

  const session = githubSessions.get(sessionId);
  if (!session) return null;
  return { sessionId, session };
}

function cleanupExpiredStates() {
  const cutoff = Date.now() - 10 * 60 * 1000;
  for (const [state, ts] of pendingOAuthStates.entries()) {
    if (ts < cutoff) pendingOAuthStates.delete(state);
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// 1. Check current GitHub session & OAuth configuration status
app.get('/api/github/session', (req: Request, res: Response) => {
  const found = getGitHubSession(req);
  res.json({
    configured: isGitHubConfigured(),
    connected: Boolean(found),
    user: found?.session.user || null,
  });
});

// 2. Construct GitHub OAuth authorization URL
app.get('/api/github/auth/url', (_req: Request, res: Response) => {
  const callbackUrl = getCallbackUrl();

  if (!isGitHubConfigured()) {
    return res.status(400).json({
      configured: false,
      error: 'GitHub account linking is not enabled in this environment yet.',
    });
  }

  cleanupExpiredStates();
  const state = crypto.randomBytes(24).toString('hex');
  pendingOAuthStates.set(state, Date.now());

  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!.trim(),
    redirect_uri: callbackUrl,
    scope: 'repo read:user',
    state,
    allow_signup: 'true',
  });

  res.json({
    url: `https://github.com/login/oauth/authorize?${params.toString()}`,
  });
});

// 3. OAuth Callback Handler (popup closes and posts result to opener iframe)
const handleOAuthCallback = async (req: Request, res: Response) => {
  const { code, state, error: oauthError, error_description } = req.query as Record<
    string,
    string | undefined
  >;

  const renderPopupResponse = (payload: Record<string, unknown>, heading: string, bodyText: string) => {
    const serialized = JSON.stringify(payload).replace(/</g, '\\u003c');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(`<!doctype html>
<html lang="en">
  <head><meta charset="utf-8" /><title>GitHub Connection</title></head>
  <body style="font-family:system-ui,sans-serif;background:#141C24;color:#F5F5DC;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:24px;text-align:center;">
    <div style="max-width:420px;background:#1A2634;border:1px solid #2C3E50;border-radius:16px;padding:24px;">
      <h2 style="margin:0 0 8px;font-size:18px;">${escapeHtml(heading)}</h2>
      <p style="margin:0;font-size:13px;color:#BDC3C7;line-height:1.5;">${escapeHtml(bodyText)}</p>
    </div>
    <script>
      (function() {
        var data = ${serialized};
        if (window.opener) {
          window.opener.postMessage(data, '*');
          setTimeout(function() { window.close(); }, 350);
        } else {
          setTimeout(function() { window.location.href = '/'; }, 1200);
        }
      })();
    </script>
  </body>
</html>`);
  };

  if (oauthError) {
    return renderPopupResponse(
      {
        type: 'GITHUB_OAUTH_ERROR',
        error: error_description || oauthError || 'GitHub authorization was cancelled.',
      },
      'GitHub Authorization Cancelled',
      error_description || 'You can close this window and try again.'
    );
  }

  if (!code || !state || !pendingOAuthStates.has(state)) {
    return renderPopupResponse(
      {
        type: 'GITHUB_OAUTH_ERROR',
        error: 'Invalid or expired GitHub authorization state. Please try connecting again.',
      },
      'Authorization Expired',
      'Your sign-in session expired. Close this window and click Link GitHub Account again.'
    );
  }

  pendingOAuthStates.delete(state);

  if (!isGitHubConfigured()) {
    return renderPopupResponse(
      {
        type: 'GITHUB_OAUTH_ERROR',
        error: 'GitHub account linking is not enabled in this environment.',
      },
      'Unavailable',
      'GitHub account linking is not enabled on the server right now.'
    );
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID!.trim(),
        client_secret: process.env.GITHUB_CLIENT_SECRET!.trim(),
        code,
        redirect_uri: getCallbackUrl(),
      }),
    });

    const tokenJson = (await tokenRes.json()) as {
      access_token?: string;
      error?: string;
      error_description?: string;
    };

    if (!tokenRes.ok || !tokenJson.access_token) {
      return renderPopupResponse(
        {
          type: 'GITHUB_OAUTH_ERROR',
          error: tokenJson.error_description || tokenJson.error || 'Could not exchange authorization code.',
        },
        'Connection Failed',
        tokenJson.error_description || 'GitHub did not issue an access token.'
      );
    }

    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenJson.access_token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'PyCert-30-03',
      },
    });

    if (!userRes.ok) {
      return renderPopupResponse(
        {
          type: 'GITHUB_OAUTH_ERROR',
          error: 'Could not retrieve your GitHub profile details.',
        },
        'Profile Lookup Failed',
        'GitHub connected, but your profile details could not be loaded.'
      );
    }

    const userData = (await userRes.json()) as GitHubUser;
    const sessionId = crypto.randomBytes(32).toString('hex');
    const userSummary: GitHubUser = {
      login: userData.login,
      name: userData.name,
      avatar_url: userData.avatar_url,
      html_url: userData.html_url,
    };

    githubSessions.set(sessionId, {
      accessToken: tokenJson.access_token,
      user: userSummary,
      createdAt: Date.now(),
    });

    res.cookie(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return renderPopupResponse(
      {
        type: 'GITHUB_OAUTH_SUCCESS',
        sessionToken: sessionId,
        user: userSummary,
      },
      'GitHub Account Linked',
      `Signed in as @${userSummary.login}. Returning you to PyCert 30-03...`
    );
  } catch {
    return renderPopupResponse(
      {
        type: 'GITHUB_OAUTH_ERROR',
        error: 'Network error while connecting to GitHub.',
      },
      'Connection Error',
      'Unable to complete GitHub sign-in. Please close this window and try again.'
    );
  }
};

app.get(['/auth/callback', '/auth/callback/'], handleOAuthCallback);

// 4. Disconnect GitHub session
app.post('/api/github/disconnect', (req: Request, res: Response) => {
  const found = getGitHubSession(req);
  if (found) {
    githubSessions.delete(found.sessionId);
  }
  res.clearCookie(SESSION_COOKIE_NAME, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
  res.json({ disconnected: true });
});

// 5. List authenticated user's repositories
app.get('/api/github/repos', async (req: Request, res: Response) => {
  const found = getGitHubSession(req);
  if (!found) {
    return res.status(401).json({ error: 'Please link your GitHub account first.' });
  }

  try {
    const ghRes = await fetch(
      'https://api.github.com/user/repos?sort=updated&per_page=50&affiliation=owner',
      {
        headers: {
          Authorization: `Bearer ${found.session.accessToken}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': 'PyCert-30-03',
        },
      }
    );

    if (!ghRes.ok) {
      if (ghRes.status === 401) {
        githubSessions.delete(found.sessionId);
        return res.status(401).json({ error: 'GitHub session expired. Please reconnect your account.' });
      }
      return res.status(ghRes.status).json({ error: 'Failed to load GitHub repositories.' });
    }

    const repos = (await ghRes.json()) as Array<{
      id: number;
      name: string;
      full_name: string;
      private: boolean;
      default_branch: string;
      html_url: string;
      owner: { login: string };
    }>;

    res.json({
      repos: repos.map((r) => ({
        id: r.id,
        name: r.name,
        full_name: r.full_name,
        owner: r.owner.login,
        private: r.private,
        default_branch: r.default_branch || 'main',
        html_url: r.html_url,
      })),
    });
  } catch {
    res.status(500).json({ error: 'Network error loading GitHub repositories.' });
  }
});

// 6. Create a new repository in the user's GitHub account
app.post('/api/github/repos', async (req: Request, res: Response) => {
  const found = getGitHubSession(req);
  if (!found) {
    return res.status(401).json({ error: 'Please link your GitHub account first.' });
  }

  const rawName = String(req.body?.name || '').trim();
  const description = String(
    req.body?.description || 'PCEP-30-03 Python Certification Projects & Notebooks'
  ).trim();
  const isPrivate = Boolean(req.body?.private);

  const sanitizedName = rawName.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/^-+|-+$/g, '');
  if (!sanitizedName) {
    return res.status(400).json({ error: 'Please enter a valid repository name.' });
  }

  try {
    const ghRes = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${found.session.accessToken}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'PyCert-30-03',
      },
      body: JSON.stringify({
        name: sanitizedName,
        description,
        private: isPrivate,
        auto_init: true,
      }),
    });

    const data = (await ghRes.json()) as {
      id?: number;
      name?: string;
      full_name?: string;
      private?: boolean;
      default_branch?: string;
      html_url?: string;
      owner?: { login: string };
      message?: string;
      errors?: Array<{ message?: string }>;
    };

    if (!ghRes.ok) {
      const detail = data.errors?.[0]?.message || data.message || 'Could not create repository.';
      return res.status(ghRes.status).json({ error: detail });
    }

    res.status(201).json({
      repo: {
        id: data.id,
        name: data.name,
        full_name: data.full_name,
        owner: data.owner?.login || found.session.user.login,
        private: Boolean(data.private),
        default_branch: data.default_branch || 'main',
        html_url: data.html_url,
      },
    });
  } catch {
    res.status(500).json({ error: 'Network error while creating GitHub repository.' });
  }
});

// 7. Push README-documented project files directly to a selected repository
app.post('/api/github/push', async (req: Request, res: Response) => {
  const found = getGitHubSession(req);
  if (!found) {
    return res.status(401).json({ error: 'Please link your GitHub account first.' });
  }

  const owner = String(req.body?.owner || found.session.user.login).trim();
  const repo = String(req.body?.repo || '').trim();
  const branch = String(req.body?.branch || '').trim();
  const commitMessage = String(
    req.body?.commitMessage || 'Add README-documented Python project from PyCert 30-03'
  ).trim();
  const files = Array.isArray(req.body?.files)
    ? (req.body.files as Array<{ path: string; content: string }>)
    : [];

  if (!repo || files.length === 0) {
    return res.status(400).json({ error: 'Repository name and project files are required.' });
  }

  const committedFiles: Array<{ path: string; htmlUrl: string }> = [];

  try {
    for (const file of files) {
      const cleanPath = String(file.path || '').replace(/^\/+/, '');
      if (!cleanPath || cleanPath.includes('..')) {
        return res.status(400).json({ error: `Invalid file path: ${file.path}` });
      }

      const encodedPath = cleanPath
        .split('/')
        .map((segment) => encodeURIComponent(segment))
        .join('/');

      const baseEndpoint = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${encodedPath}`;
      const lookupUrl = branch ? `${baseEndpoint}?ref=${encodeURIComponent(branch)}` : baseEndpoint;

      // Look up existing file SHA so updates succeed cleanly
      let existingSha: string | undefined;
      const existingRes = await fetch(lookupUrl, {
        headers: {
          Authorization: `Bearer ${found.session.accessToken}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': 'PyCert-30-03',
        },
      });

      if (existingRes.ok) {
        const existingData = (await existingRes.json()) as { sha?: string };
        existingSha = existingData.sha;
      }

      const putBody: Record<string, unknown> = {
        message: commitMessage,
        content: Buffer.from(String(file.content ?? ''), 'utf8').toString('base64'),
      };
      if (branch) putBody.branch = branch;
      if (existingSha) putBody.sha = existingSha;

      const putRes = await fetch(baseEndpoint, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${found.session.accessToken}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
          'User-Agent': 'PyCert-30-03',
        },
        body: JSON.stringify(putBody),
      });

      const putData = (await putRes.json()) as {
        content?: { html_url?: string; path?: string };
        message?: string;
      };

      if (!putRes.ok) {
        return res.status(putRes.status).json({
          error: putData.message || `Failed to push ${cleanPath} to ${owner}/${repo}.`,
        });
      }

      committedFiles.push({
        path: putData.content?.path || cleanPath,
        htmlUrl:
          putData.content?.html_url ||
          `https://github.com/${owner}/${repo}/blob/${branch || 'main'}/${cleanPath}`,
      });
    }

    res.json({
      success: true,
      repoFullName: `${owner}/${repo}`,
      repoUrl: `https://github.com/${owner}/${repo}`,
      committedFiles,
    });
  } catch {
    res.status(500).json({ error: 'Network error while pushing files to GitHub.' });
  }
});

// =========================================================================
// AI Routes (Optional Curriculum Breadcrumbs & Error Guidance)
// =========================================================================

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

    const prompt = `You are the Code Breadcrumb engine for PyCert 30-03, preparing a student for Python Institute PCEP-30-03 certification.
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
  } catch {
    res.status(500).json({
      error: 'Unable to generate AI breadcrumb right now.',
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
  } catch {
    res.status(500).json({
      error: 'Unable to diagnose code error right now.',
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
