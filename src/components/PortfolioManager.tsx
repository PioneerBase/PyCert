import React, { useState, useEffect, useCallback } from 'react';
import { useProgress } from '../context/ProgressContext';
import { CAPSTONE_PROJECTS, MICRO_PROJECTS } from '../data/pcepCurriculum';
import { BONUS_PROJECTS } from '../data/bonusProjects';
import { MicroProject } from '../types';
import { GitReadmeModal } from './GitReadmeModal';
import {
  buildIpynbNotebook,
  downloadIpynbFile,
  getIpynbFilename,
} from '../utils/ipynbExporter';
import {
  CheckCircle2,
  Circle,
  Download,
  FolderGit2,
  Key,
  FileCode2,
  Code2,
  FileJson,
  RotateCcw,
  GitBranch,
  ExternalLink,
  Plus,
  UploadCloud,
  LogOut,
  AlertCircle,
  Lock,
  Globe,
} from 'lucide-react';

interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: string;
  private: boolean;
  default_branch: string;
  html_url: string;
}

interface PushedRecord {
  repoFullName: string;
  folderUrl: string;
  readmeUrl: string;
  pushedAt: string;
}

const GH_SESSION_STORAGE_KEY = 'pycert_gh_session_token';

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'python-project'
  );
}

function getStandardGitignore(): string {
  return `# Python virtual environments
.venv/
env/
venv/
ENV/

# Byte-compiled / cache files
__pycache__/
*.py[cod]
*$py.class
.ipynb_checkpoints/

# Environment variables & secrets
.env
.env.local
*.secret.json

# OS files
.DS_Store
Thumbs.db
`;
}

function buildProjectReadmeContent(
  project: MicroProject,
  authorName: string,
  githubLogin: string,
  doneSteps: number,
  totalSteps: number,
  pyFileName: string,
  ipynbFileName: string
): string {
  const outcomes = project.learningOutcomes.map((lo) => `- ${lo}`).join('\n');
  const objectives = project.specificObjectives.map((o) => `\`Objective ${o}\``).join(', ');

  return `# ${project.title}

## Overview
${project.description}

Completed as part of the **PyCert 30-03** project-first Python certification curriculum.

## PCEP-30-03 Syllabus Coverage
- **Domain:** Section 0${project.sectionNumber} — ${project.sectionName}
- **Objectives:** ${objectives}
- **Difficulty:** ${project.difficulty}
- **Verified Steps:** ${doneSteps}/${totalSteps} checks passed

## Key Concepts Practiced
${outcomes}

## Files in This Project
- \`${pyFileName}\` — Standalone Python 3 implementation
- \`${ipynbFileName}\` — Interactive Jupyter Notebook with step explanations
- \`README.md\` — Project documentation

## How to Run Locally
\`\`\`bash
python3 ${pyFileName}
\`\`\`

Or open the notebook in Jupyter:
\`\`\`bash
jupyter notebook ${ipynbFileName}
\`\`\`

## Author
- **Developer:** ${authorName} ([@${githubLogin}](https://github.com/${githubLogin}))
`;
}

export const PortfolioManager: React.FC = () => {
  const {
    selectProject,
    currentUser,
    updateUserProfile,
    completedStepsMap,
    checklistItems,
    toggleChecklistItem,
    resetChecklist,
    selectedBonusProjectIds,
    setActiveView,
    getProjectCellCode,
  } = useProgress();

  const [filterStatus, setFilterStatus] = useState<'all' | 'synced' | 'ready' | 'draft'>('all');
  const [isReadmeModalOpen, setIsReadmeModalOpen] = useState<boolean>(false);
  const [notice, setNotice] = useState<{ kind: 'success' | 'error' | 'info'; text: string } | null>(null);

  // GitHub OAuth & Repo Push State
  const [ghConfigured, setGhConfigured] = useState<boolean>(true);
  const [ghUser, setGhUser] = useState<GitHubUser | null>(null);
  const [ghSessionToken, setGhSessionToken] = useState<string>(() => {
    try {
      return sessionStorage.getItem(GH_SESSION_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });
  const [ghRepos, setGhRepos] = useState<GitHubRepo[]>([]);
  const [selectedRepoFullName, setSelectedRepoFullName] = useState<string>('');
  const [isConnectingGh, setIsConnectingGh] = useState<boolean>(false);
  const [isLoadingRepos, setIsLoadingRepos] = useState<boolean>(false);
  const [showCreateRepo, setShowCreateRepo] = useState<boolean>(false);
  const [newRepoName, setNewRepoName] = useState<string>('pycert-pcep-portfolio');
  const [newRepoPrivate, setNewRepoPrivate] = useState<boolean>(false);
  const [isCreatingRepo, setIsCreatingRepo] = useState<boolean>(false);
  const [pushingProjectId, setPushingProjectId] = useState<string | null>(null);
  const [isPushingAll, setIsPushingAll] = useState<boolean>(false);
  const [pushedRecords, setPushedRecords] = useState<Record<string, PushedRecord>>({});
  const [avatarLoadError, setAvatarLoadError] = useState<boolean>(false);

  const authHeaders = useCallback(
    (tokenOverride?: string): Record<string, string> => {
      const tok = tokenOverride ?? ghSessionToken;
      return tok ? { Authorization: `Bearer ${tok}` } : {};
    },
    [ghSessionToken]
  );

  const fetchRepos = useCallback(
    async (tokenOverride?: string) => {
      setIsLoadingRepos(true);
      try {
        const res = await fetch('/api/github/repos', {
          credentials: 'include',
          headers: authHeaders(tokenOverride),
        });
        if (!res.ok) {
          setIsLoadingRepos(false);
          return;
        }
        const data = (await res.json()) as { repos?: GitHubRepo[] };
        const list = data.repos || [];
        setGhRepos(list);
        if (list.length > 0) {
          setSelectedRepoFullName((prev) =>
            prev && list.some((r) => r.full_name === prev) ? prev : list[0].full_name
          );
        }
      } catch {
        // Ignore transient fetch failures
      } finally {
        setIsLoadingRepos(false);
      }
    },
    [authHeaders]
  );

  const checkGitHubSession = useCallback(async () => {
    try {
      const res = await fetch('/api/github/session', {
        credentials: 'include',
        headers: authHeaders(),
      });
      if (!res.ok) return;
      const data = (await res.json()) as {
        configured: boolean;
        connected: boolean;
        user: GitHubUser | null;
      };
      setGhConfigured(data.configured);
      if (data.connected && data.user) {
        setGhUser(data.user);
        setAvatarLoadError(false);
        updateUserProfile({ githubHandle: data.user.login });
        fetchRepos();
      } else {
        setGhUser(null);
      }
    } catch {
      // Ignore initial check errors
    }
  }, [authHeaders, fetchRepos, updateUserProfile]);

  useEffect(() => {
    checkGitHubSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for postMessage from GitHub OAuth popup
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin || '';
      const isAllowedOrigin =
        origin === window.location.origin ||
        origin.endsWith('.run.app') ||
        origin.includes('localhost');
      if (!isAllowedOrigin) return;

      if (event.data?.type === 'GITHUB_OAUTH_SUCCESS') {
        const token = String(event.data.sessionToken || '');
        const user = event.data.user as GitHubUser | undefined;
        if (token) {
          try {
            sessionStorage.setItem(GH_SESSION_STORAGE_KEY, token);
          } catch {
            // Ignore storage access failures
          }
          setGhSessionToken(token);
        }
        if (user) {
          setGhUser(user);
          setAvatarLoadError(false);
          updateUserProfile({ githubHandle: user.login });
          setNotice({
            kind: 'success',
            text: `Linked GitHub account @${user.login}. Select or create a repository to push completed projects.`,
          });
        }
        setIsConnectingGh(false);
        fetchRepos(token);
      } else if (event.data?.type === 'GITHUB_OAUTH_ERROR') {
        setIsConnectingGh(false);
        setNotice({
          kind: 'error',
          text: String(event.data.error || 'GitHub sign-in could not be completed.'),
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [fetchRepos, updateUserProfile]);

  const handleLinkGitHub = async () => {
    setIsConnectingGh(true);
    setNotice(null);
    try {
      const res = await fetch('/api/github/auth/url');
      const data = (await res.json()) as {
        url?: string;
        configured?: boolean;
        error?: string;
      };

      if (!res.ok || !data.url) {
        setGhConfigured(false);
        setIsConnectingGh(false);
        setNotice({
          kind: 'info',
          text:
            data.error ||
            'GitHub account linking is not enabled in this environment yet.',
        });
        return;
      }

      const authWindow = window.open(
        data.url,
        'github_oauth_popup',
        'width=620,height=720'
      );

      if (!authWindow) {
        setIsConnectingGh(false);
        setNotice({
          kind: 'error',
          text: 'Please allow popups for this site so GitHub sign-in can open.',
        });
      }
    } catch {
      setIsConnectingGh(false);
      setNotice({
        kind: 'error',
        text: 'Unable to start GitHub connection right now.',
      });
    }
  };

  const handleDisconnectGitHub = async () => {
    try {
      await fetch('/api/github/disconnect', {
        method: 'POST',
        credentials: 'include',
        headers: authHeaders(),
      });
    } catch {
      // Proceed with local clear
    }
    try {
      sessionStorage.removeItem(GH_SESSION_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
    setGhSessionToken('');
    setGhUser(null);
    setGhRepos([]);
    setSelectedRepoFullName('');
    setNotice({ kind: 'info', text: 'Disconnected GitHub account.' });
  };

  const handleCreateRepository = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepoName.trim()) return;
    setIsCreatingRepo(true);
    setNotice(null);
    try {
      const res = await fetch('/api/github/repos', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(),
        },
        body: JSON.stringify({
          name: newRepoName.trim(),
          description: 'Python projects, notebooks, and README documentation from PyCert 30-03',
          private: newRepoPrivate,
        }),
      });
      const data = (await res.json()) as { repo?: GitHubRepo; error?: string };
      if (!res.ok || !data.repo) {
        setNotice({
          kind: 'error',
          text: data.error || 'Could not create GitHub repository.',
        });
        setIsCreatingRepo(false);
        return;
      }

      setGhRepos((prev) => [data.repo!, ...prev]);
      setSelectedRepoFullName(data.repo.full_name);
      setShowCreateRepo(false);
      setNotice({
        kind: 'success',
        text: `Created repository ${data.repo.full_name} and selected it as your push target.`,
      });
    } catch {
      setNotice({ kind: 'error', text: 'Network error while creating repository.' });
    } finally {
      setIsCreatingRepo(false);
    }
  };

  // Map each capstone to its matching hands-on lab
  const capstoneToLabId: Record<string, string> = {
    'cap-01-pycalc-cli': 'proj-01-converter',
    'cap-02-flowmaster': 'proj-02-sentinel-loops',
    'cap-03-collection-crafter': 'proj-03-collections-strings',
    'cap-04-custom-exception': 'proj-04-functions-exceptions',
    'cap-05-file-stream-audit': 'proj-05-files-modules',
  };

  // Derive real progress per capstone from completedStepsMap
  const dynamicProjects = CAPSTONE_PROJECTS.map((proj) => {
    const labId = capstoneToLabId[proj.id] || 'proj-01-converter';
    const lab = MICRO_PROJECTS.find((m) => m.id === labId);
    const doneSteps = completedStepsMap[labId]?.length || 0;
    const totalSteps = lab?.steps.length || 3;
    const pct = totalSteps > 0 ? Math.min(100, Math.round((doneSteps / totalSteps) * 100)) : 0;
    const computedStatus: 'synced' | 'ready' | 'draft' =
      doneSteps >= totalSteps ? 'synced' : doneSteps > 0 ? 'ready' : 'draft';
    const computedLabel =
      doneSteps >= totalSteps
        ? 'Complete'
        : doneSteps > 0
        ? 'In Progress'
        : 'Not Started';

    return {
      ...proj,
      labId,
      lab,
      doneSteps,
      totalSteps,
      status: computedStatus,
      statusLabel: computedLabel,
      coveragePercent: pct,
      unitTestsPassing: `${doneSteps}/${totalSteps}`,
    };
  });

  // Any completed Bonus Projects ready to push as well
  const completedBonusProjects = BONUS_PROJECTS.filter((bp) => {
    const done = completedStepsMap[bp.id]?.length || 0;
    return bp.steps.length > 0 && done >= bp.steps.length;
  });

  const completedCapstonesCount = dynamicProjects.filter((p) => p.status === 'synced').length;
  const totalPassedTests = dynamicProjects.reduce((acc, p) => acc + p.doneSteps, 0);
  const totalPossibleTests = dynamicProjects.reduce((acc, p) => acc + p.totalSteps, 0);
  const overallPassPct =
    totalPossibleTests > 0 ? Math.round((totalPassedTests / totalPossibleTests) * 100) : 0;
  const checkedChecklistCount = checklistItems.filter((item) => item.checked).length;

  const filteredProjects =
    filterStatus === 'all'
      ? dynamicProjects
      : dynamicProjects.filter((p) => p.status === filterStatus);

  const buildFilesForProject = (
    project: MicroProject,
    doneSteps: number,
    totalSteps: number,
    folderPrefix: string
  ): Array<{ path: string; content: string }> => {
    const cells = project.notebookCells || [
      {
        id: 'main',
        kind: 'step' as const,
        stepNumber: 1,
        title: project.title,
        starterCode: project.starterCode,
        solutionCode: project.solutionCode,
      },
    ];

    const pyFileName = project.fileName || `${slugify(project.title)}.py`;
    const ipynbFileName = getIpynbFilename(project);
    const pythonSource = cells
      .map((cell) => getProjectCellCode(project.id, cell.id))
      .join('\n\n')
      .trimEnd() + '\n';

    const ipynbDoc = buildIpynbNotebook(
      project,
      cells,
      (cellId) => getProjectCellCode(project.id, cellId),
      {}
    );

    const readmeContent = buildProjectReadmeContent(
      project,
      currentUser.name || ghUser?.name || ghUser?.login || 'Student Developer',
      ghUser?.login || currentUser.githubHandle || 'candidate',
      doneSteps,
      totalSteps,
      pyFileName,
      ipynbFileName
    );

    const folder = `${folderPrefix}/${slugify(project.title)}`;
    return [
      { path: `${folder}/README.md`, content: readmeContent },
      { path: `${folder}/${pyFileName}`, content: pythonSource },
      { path: `${folder}/${ipynbFileName}`, content: JSON.stringify(ipynbDoc, null, 2) },
    ];
  };

  const pushSingleProjectToGitHub = async (
    project: MicroProject,
    doneSteps: number,
    totalSteps: number,
    folderPrefix: string = 'pcep-syllabus-labs'
  ) => {
    if (!ghUser) {
      setNotice({ kind: 'info', text: 'Link your GitHub account first to push projects.' });
      return false;
    }

    const targetRepo = ghRepos.find((r) => r.full_name === selectedRepoFullName);
    if (!targetRepo) {
      setNotice({
        kind: 'info',
        text: 'Select an existing repository or create a new one first.',
      });
      return false;
    }

    setPushingProjectId(project.id);
    setNotice(null);

    try {
      const projectFiles = buildFilesForProject(project, doneSteps, totalSteps, folderPrefix);
      const files = [
        ...projectFiles,
        { path: '.gitignore', content: getStandardGitignore() },
      ];

      const res = await fetch('/api/github/push', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(),
        },
        body: JSON.stringify({
          owner: targetRepo.owner,
          repo: targetRepo.name,
          branch: targetRepo.default_branch,
          commitMessage: `Add ${project.title} (README + Python + Notebook) via PyCert 30-03`,
          files,
        }),
      });

      const data = (await res.json()) as {
        success?: boolean;
        repoFullName?: string;
        repoUrl?: string;
        committedFiles?: Array<{ path: string; htmlUrl: string }>;
        error?: string;
      };

      if (!res.ok || !data.success) {
        setNotice({
          kind: 'error',
          text: data.error || 'Could not push project files to GitHub.',
        });
        setPushingProjectId(null);
        return false;
      }

      const folderSlug = `${folderPrefix}/${slugify(project.title)}`;
      const readmeEntry = data.committedFiles?.find((f) => f.path.endsWith('README.md'));
      const folderUrl = `https://github.com/${targetRepo.owner}/${targetRepo.name}/tree/${targetRepo.default_branch}/${folderSlug}`;

      setPushedRecords((prev) => ({
        ...prev,
        [project.id]: {
          repoFullName: targetRepo.full_name,
          folderUrl,
          readmeUrl: readmeEntry?.htmlUrl || `${folderUrl}/README.md`,
          pushedAt: new Date().toLocaleTimeString(),
        },
      }));

      setNotice({
        kind: 'success',
        text: `Pushed "${project.title}" (README.md, .py, and .ipynb) to ${targetRepo.full_name}.`,
      });
      setPushingProjectId(null);
      return true;
    } catch {
      setPushingProjectId(null);
      setNotice({
        kind: 'error',
        text: 'Network error while pushing project to GitHub.',
      });
      return false;
    }
  };

  const handlePushAllCompleted = async () => {
    const readyLabs = dynamicProjects.filter((p) => p.status === 'synced' && p.lab);
    if (readyLabs.length === 0 && completedBonusProjects.length === 0) {
      setNotice({
        kind: 'info',
        text: 'Complete all steps in at least one lab or bonus project before pushing.',
      });
      return;
    }

    setIsPushingAll(true);
    let pushedCount = 0;

    for (const item of readyLabs) {
      if (item.lab) {
        const ok = await pushSingleProjectToGitHub(
          item.lab,
          item.doneSteps,
          item.totalSteps,
          'pcep-syllabus-labs'
        );
        if (ok) pushedCount += 1;
      }
    }

    for (const bp of completedBonusProjects) {
      const done = completedStepsMap[bp.id]?.length || 0;
      const ok = await pushSingleProjectToGitHub(
        bp,
        done,
        bp.steps.length,
        'bonus-portfolio-projects'
      );
      if (ok) pushedCount += 1;
    }

    setIsPushingAll(false);
    if (pushedCount > 0) {
      setNotice({
        kind: 'success',
        text: `Pushed ${pushedCount} completed README-documented project${pushedCount === 1 ? '' : 's'} to ${selectedRepoFullName}.`,
      });
    }
  };

  const handleExportSummary = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      candidate: {
        name: currentUser.name || 'Student Candidate',
        githubHandle: ghUser?.login || currentUser.githubHandle || '',
      },
      summary: {
        completedLabs: completedCapstonesCount,
        totalLabs: dynamicProjects.length,
        passedSteps: totalPassedTests,
        totalSteps: totalPossibleTests,
        selectedBonusProjects: selectedBonusProjectIds.length,
        completedBonusProjects: completedBonusProjects.length,
        checklistCompleted: `${checkedChecklistCount}/${checklistItems.length}`,
      },
      projects: dynamicProjects.map(({ id, title, domain, statusLabel, coveragePercent, unitTestsPassing, tags }) => ({
        id,
        title,
        domain,
        status: statusLabel,
        completionPercent: coveragePercent,
        stepsPassed: unitTestsPassing,
        skills: tags,
      })),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pycert-portfolio-summary.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice({ kind: 'success', text: 'Downloaded pycert-portfolio-summary.json' });
  };

  const handleDownloadLabNotebook = (labId: string) => {
    const lab = MICRO_PROJECTS.find((p) => p.id === labId);
    if (!lab) return;
    const cells = lab.notebookCells || [
      {
        id: 'main',
        kind: 'step' as const,
        stepNumber: 1,
        title: lab.title,
        starterCode: lab.starterCode,
        solutionCode: lab.solutionCode,
      },
    ];
    const filename = downloadIpynbFile(
      lab,
      cells,
      (cellId) => getProjectCellCode(lab.id, cellId),
      {}
    );
    setNotice({ kind: 'success', text: `Downloaded ${filename} with your saved code.` });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono text-[#1E3A78] dark:text-[#BDC3C7]">
            <span className="font-semibold text-[#5A1827] dark:text-amber-300">
              Syllabus to Portfolio
            </span>
            <span aria-hidden="true">·</span>
            <span>PCEP-30-03 Aligned</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">
              {completedCapstonesCount} of {dynamicProjects.length} Labs Complete
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2C3E50] dark:text-[#F5F5DC] tracking-tight">
            Certified Project Portfolio
          </h1>
          <p className="text-xs sm:text-sm text-[#2C3E50]/80 dark:text-[#BDC3C7] max-w-3xl leading-relaxed">
            Link your GitHub account to push completed Python labs directly to a repository as README-documented files, or export notebooks and project summaries locally.
          </p>
        </div>

        {/* Top Right Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsReadmeModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC] bg-[#FAF9F5] dark:bg-[#1A2634] hover:bg-[#EBE9DF] dark:hover:bg-[#243342] border border-[#BDC3C7] dark:border-[#2C3E50] rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Key className="w-3.5 h-3.5 text-[#1E3A78] dark:text-[#BDC3C7]" />
            <span>README &amp; .gitignore Preview</span>
          </button>

          <button
            onClick={handleExportSummary}
            className="px-3.5 py-2 text-xs font-semibold text-[#F5F5DC] bg-[#1E3A78] hover:bg-[#162C5C] rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <FileJson className="w-3.5 h-3.5" />
            <span>Export Summary (.json)</span>
          </button>
        </div>
      </div>

      {/* Inline Status Notice */}
      {notice && (
        <div
          className={`px-4 py-3 rounded-xl border text-xs font-medium flex items-start justify-between gap-3 ${
            notice.kind === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              : notice.kind === 'error'
              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300'
              : 'bg-sky-50 dark:bg-sky-950/30 border-sky-300 dark:border-sky-800 text-sky-900 dark:text-sky-200'
          }`}
        >
          <div className="flex items-start gap-2">
            {notice.kind === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            <span>{notice.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="text-xs opacity-70 hover:opacity-100 cursor-pointer shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Dual-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: GitHub Account Link, Repo Selector & Checklist */}
        <div className="lg:col-span-4 space-y-6">
          {/* GitHub Account Connection & Repository Target */}
          <div className="p-5 rounded-2xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#243342] shadow-xs space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#2C3E50] dark:text-[#F5F5DC] flex items-center gap-1.5">
                <GitBranch className="w-4 h-4 text-[#1E3A78] dark:text-amber-300" />
                <span>GitHub Repository Sync</span>
              </span>
              <span className="font-mono text-[11px] text-[#5D6D7E] dark:text-[#BDC3C7]">
                {ghUser ? 'Connected' : 'Not linked'}
              </span>
            </div>

            {!ghUser ? (
              <div className="space-y-3">
                <p className="text-xs text-[#2C3E50]/80 dark:text-[#BDC3C7] leading-relaxed">
                  Link your GitHub account to push completed projects directly as folders with <code className="font-mono">README.md</code>, Python source, and <code className="font-mono">.ipynb</code> notebooks.
                </p>

                <button
                  type="button"
                  onClick={handleLinkGitHub}
                  disabled={isConnectingGh}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-[#F5F5DC] bg-[#1E3A78] hover:bg-[#162C5C] shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <GitBranch className="w-4 h-4" />
                  <span>{isConnectingGh ? 'Waiting for GitHub...' : 'Link GitHub Account'}</span>
                </button>

                {!ghConfigured && (
                  <div className="p-3 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/20 text-[11px] text-[#2C3E50]/85 dark:text-[#BDC3C7] space-y-1">
                    <div className="font-bold text-amber-900 dark:text-amber-300">
                      GitHub Sync Unavailable
                    </div>
                    <p className="leading-relaxed">
                      GitHub account linking is not enabled in this environment yet. You can still generate and copy README documentation from your project cards.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Connected User Header */}
                <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-white dark:bg-[#1A2634] border border-[#BDC3C7]/60 dark:border-[#2C3E50]">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {!avatarLoadError && ghUser.avatar_url ? (
                      <img
                        src={ghUser.avatar_url}
                        alt={ghUser.login}
                        referrerPolicy="no-referrer"
                        onError={() => setAvatarLoadError(true)}
                        className="w-9 h-9 rounded-full border border-[#BDC3C7] dark:border-[#2C3E50] shrink-0 object-cover"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#1E3A78] text-[#F5F5DC] flex items-center justify-center font-bold text-xs shrink-0">
                        {ghUser.login.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-[#2C3E50] dark:text-[#F5F5DC] truncate">
                        {ghUser.name || ghUser.login}
                      </div>
                      <a
                        href={ghUser.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-mono text-[#1E3A78] dark:text-sky-300 hover:underline inline-flex items-center gap-1"
                      >
                        <span>@{ghUser.login}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDisconnectGitHub}
                    className="p-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer shrink-0"
                    title="Disconnect GitHub account"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Target Repository Picker */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-[#2C3E50] dark:text-[#F5F5DC]">
                      Target Repository
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCreateRepo((prev) => !prev)}
                      className="text-[11px] font-semibold text-[#1E3A78] dark:text-amber-300 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{showCreateRepo ? 'Cancel' : 'New Repo'}</span>
                    </button>
                  </div>

                  {showCreateRepo ? (
                    <form
                      onSubmit={handleCreateRepository}
                      className="p-3 rounded-xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-white dark:bg-[#141C24] space-y-2.5"
                    >
                      <input
                        type="text"
                        required
                        value={newRepoName}
                        onChange={(e) => setNewRepoName(e.target.value)}
                        placeholder="pycert-pcep-portfolio"
                        className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#1A2634] text-[#2C3E50] dark:text-[#F5F5DC] focus:outline-hidden focus:border-[#1E3A78]"
                      />

                      <label className="flex items-center gap-2 text-xs text-[#2C3E50]/80 dark:text-[#BDC3C7] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newRepoPrivate}
                          onChange={(e) => setNewRepoPrivate(e.target.checked)}
                          className="rounded border-[#BDC3C7] dark:border-[#2C3E50]"
                        />
                        <span className="inline-flex items-center gap-1">
                          {newRepoPrivate ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                          <span>Private repository</span>
                        </span>
                      </label>

                      <button
                        type="submit"
                        disabled={isCreatingRepo}
                        className="w-full py-1.5 rounded-lg text-xs font-semibold text-[#F5F5DC] bg-[#1E3A78] hover:bg-[#162C5C] transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {isCreatingRepo ? 'Creating...' : 'Create & Select Repository'}
                      </button>
                    </form>
                  ) : (
                    <select
                      value={selectedRepoFullName}
                      onChange={(e) => setSelectedRepoFullName(e.target.value)}
                      disabled={isLoadingRepos || ghRepos.length === 0}
                      className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-white dark:bg-[#141C24] text-[#2C3E50] dark:text-[#F5F5DC] focus:outline-hidden focus:border-[#1E3A78]"
                    >
                      {isLoadingRepos ? (
                        <option>Loading repositories...</option>
                      ) : ghRepos.length === 0 ? (
                        <option value="">No repositories found — create one above</option>
                      ) : (
                        ghRepos.map((repo) => (
                          <option key={repo.id} value={repo.full_name}>
                            {repo.full_name} ({repo.private ? 'Private' : 'Public'})
                          </option>
                        ))
                      )}
                    </select>
                  )}
                </div>

                {/* Push All Completed CTA */}
                <button
                  type="button"
                  onClick={handlePushAllCompleted}
                  disabled={
                    isPushingAll ||
                    !selectedRepoFullName ||
                    (completedCapstonesCount === 0 && completedBonusProjects.length === 0)
                  }
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-[#F5F5DC] bg-[#5A1827] hover:bg-[#48121E] dark:bg-[#6B1D2F] dark:hover:bg-[#541624] shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>
                    {isPushingAll
                      ? 'Pushing Completed Projects...'
                      : `Push All Completed (${completedCapstonesCount + completedBonusProjects.length})`}
                  </span>
                </button>
              </div>
            )}

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#BDC3C7]/40 dark:border-[#2C3E50]">
              <div className="p-3 rounded-xl bg-white dark:bg-[#1A2634] border border-[#BDC3C7]/60 dark:border-[#2C3E50] text-center">
                <div className="text-xl font-extrabold text-[#2C3E50] dark:text-[#F5F5DC] font-mono tabular-nums">
                  {completedCapstonesCount} / {dynamicProjects.length}
                </div>
                <div className="text-[10px] text-[#2C3E50]/70 dark:text-[#BDC3C7] font-mono mt-0.5">
                  Labs Complete
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-[#1A2634] border border-[#BDC3C7]/60 dark:border-[#2C3E50] text-center">
                <div className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400 font-mono tabular-nums">
                  {overallPassPct}%
                </div>
                <div className="text-[10px] text-[#2C3E50]/70 dark:text-[#BDC3C7] font-mono mt-0.5">
                  Steps Verified
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Portfolio Preparation Checklist */}
          <div className="p-5 rounded-2xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#243342] shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-sm text-[#2C3E50] dark:text-[#F5F5DC]">
                GitHub Readiness Checklist
              </span>
              <span className="text-[11px] font-mono font-bold text-[#1E3A78] dark:text-amber-300 tabular-nums">
                {checkedChecklistCount} / {checklistItems.length} Done
              </span>
            </div>

            <p className="text-[11px] text-[#2C3E50]/75 dark:text-[#BDC3C7] leading-relaxed">
              Check off each milestone as you organize and publish your completed Python projects.
            </p>

            <div className="space-y-2.5 pt-1">
              {checklistItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleChecklistItem(item.id)}
                  className="w-full text-left flex items-start gap-2.5 text-xs p-2 rounded-lg hover:bg-white/70 dark:hover:bg-[#1A2634]/70 transition-colors cursor-pointer"
                >
                  <div className="pt-0.5 shrink-0">
                    {item.checked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 fill-emerald-600/10" />
                    ) : (
                      <Circle className="w-4 h-4 text-[#BDC3C7] dark:text-[#BDC3C7]/60" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <div
                      className={`font-semibold ${
                        item.checked
                          ? 'text-[#2C3E50] dark:text-[#F5F5DC] line-through opacity-75'
                          : 'text-[#2C3E50] dark:text-[#F5F5DC]'
                      }`}
                    >
                      {item.label}
                    </div>
                    <div className="text-[10px] text-[#2C3E50]/65 dark:text-[#BDC3C7]/75">
                      {item.sublines[0]}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-[#BDC3C7]/40 dark:border-[#2C3E50] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setActiveView('bonus')}
                className="text-xs font-semibold text-[#1E3A78] dark:text-amber-300 hover:underline cursor-pointer"
              >
                Browse Bonus Projects →
              </button>
              {checkedChecklistCount > 0 && (
                <button
                  type="button"
                  onClick={resetChecklist}
                  className="text-[11px] text-[#5D6D7E] dark:text-[#BDC3C7] hover:text-[#2C3E50] dark:hover:text-[#F5F5DC] inline-flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Syllabus Capstone Projects & Completed Bonus Projects */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header & Filter Tabs */}
          <div className="p-4 rounded-xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#243342] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-[#1E3A78] dark:text-[#BDC3C7]" />
              <h2 className="font-bold text-sm text-[#2C3E50] dark:text-[#F5F5DC]">
                Syllabus Capstone Projects
              </h2>
              <span className="text-xs font-mono text-[#5D6D7E] dark:text-[#BDC3C7] tabular-nums">
                ({completedCapstonesCount}/{dynamicProjects.length} Complete)
              </span>
            </div>

            {/* Interactive Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-[#EBE9DF] dark:bg-[#1A2634] rounded-lg text-xs border border-[#BDC3C7]/60 dark:border-[#2C3E50] overflow-x-auto">
              {(
                [
                  { id: 'all', label: `All (${dynamicProjects.length})` },
                  { id: 'synced', label: `Complete (${dynamicProjects.filter((p) => p.status === 'synced').length})` },
                  { id: 'ready', label: `In Progress (${dynamicProjects.filter((p) => p.status === 'ready').length})` },
                  { id: 'draft', label: `Not Started (${dynamicProjects.filter((p) => p.status === 'draft').length})` },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id)}
                  className={`px-3 py-1 font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    filterStatus === tab.id
                      ? 'bg-white dark:bg-[#243342] text-[#2C3E50] dark:text-[#F5F5DC] shadow-xs font-semibold'
                      : 'text-[#2C3E50]/70 dark:text-[#BDC3C7] hover:text-[#2C3E50] dark:hover:text-[#F5F5DC]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Syllabus Capstone Cards */}
          <div className="space-y-4">
            {filteredProjects.map((project) => {
              const isComplete = project.status === 'synced';
              const isPushingThis = pushingProjectId === project.labId;
              const pushed = pushedRecords[project.labId];

              return (
                <div
                  key={project.id}
                  className="p-6 rounded-2xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#243342] shadow-xs space-y-4 hover:border-[#1E3A78]/70 dark:hover:border-[#BDC3C7] transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#5D6D7E] dark:text-[#BDC3C7] flex-wrap">
                      <span
                        className={`font-bold ${
                          isComplete
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : project.status === 'ready'
                            ? 'text-amber-700 dark:text-amber-300'
                            : 'text-[#5D6D7E] dark:text-[#BDC3C7]'
                        }`}
                      >
                        {project.statusLabel}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{project.domain}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{project.unitTestsPassing} Steps</span>
                    </div>

                    <h3 className="text-base font-bold text-[#2C3E50] dark:text-[#F5F5DC]">
                      {project.title}
                    </h3>
                  </div>

                  <p className="text-xs text-[#2C3E50]/80 dark:text-[#BDC3C7] leading-relaxed">
                    {project.description}
                  </p>

                  {/* Code preview & metrics */}
                  <div className="space-y-2">
                    <pre className="p-3.5 rounded-xl bg-[#141C24] text-[#F5F5DC] font-mono text-xs overflow-x-auto border border-[#2C3E50] leading-relaxed">
                      <code>{project.codePreviewSnippet}</code>
                    </pre>

                    <div className="flex items-center justify-between text-[11px] font-mono text-[#2C3E50]/70 dark:text-[#BDC3C7] px-1 tabular-nums">
                      <span>
                        Completion:{' '}
                        <strong className="text-emerald-700 dark:text-emerald-400 font-semibold">
                          {project.coveragePercent}%
                        </strong>
                      </span>
                      <span>
                        Steps passed:{' '}
                        <strong className="text-emerald-700 dark:text-emerald-400 font-semibold">
                          {project.unitTestsPassing}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Pushed link confirmation */}
                  {pushed && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-emerald-800 dark:text-emerald-300 font-medium">
                        Pushed to <code className="font-mono">{pushed.repoFullName}</code> ({pushed.pushedAt})
                      </span>
                      <div className="flex items-center gap-3">
                        <a
                          href={pushed.readmeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-[#1E3A78] dark:text-sky-300 hover:underline inline-flex items-center gap-1"
                        >
                          <span>View README.md</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <a
                          href={pushed.folderUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-[#1E3A78] dark:text-sky-300 hover:underline inline-flex items-center gap-1"
                        >
                          <span>Open Folder</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Skills metadata & Action Buttons */}
                  <div className="pt-3 border-t border-[#BDC3C7]/40 dark:border-[#2C3E50] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-[11px] font-mono text-[#5D6D7E] dark:text-[#BDC3C7]">
                      {project.tags.join(' · ')}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        onClick={() => selectProject(project.labId)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-[#F5F5DC] bg-[#1E3A78] hover:bg-[#162C5C] rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Open Lab in IDE</span>
                      </button>

                      <button
                        onClick={() => handleDownloadLabNotebook(project.labId)}
                        className="px-3 py-1.5 text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC] bg-white dark:bg-[#1A2634] hover:bg-[#EBE9DF] dark:hover:bg-[#1E2936] border border-[#BDC3C7] dark:border-[#2C3E50] rounded-lg transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
                      >
                        <Download className="w-3.5 h-3.5 text-[#1E3A78] dark:text-[#BDC3C7]" />
                        <span>Export .ipynb</span>
                      </button>

                      {isComplete ? (
                        <button
                          type="button"
                          disabled={isPushingThis || isPushingAll || !ghUser || !selectedRepoFullName}
                          onClick={() =>
                            project.lab &&
                            pushSingleProjectToGitHub(
                              project.lab,
                              project.doneSteps,
                              project.totalSteps,
                              'pcep-syllabus-labs'
                            )
                          }
                          title={
                            !ghUser
                              ? 'Link your GitHub account on the left to push'
                              : !selectedRepoFullName
                              ? 'Select or create a GitHub repository first'
                              : 'Push README.md, Python file, and .ipynb notebook to GitHub'
                          }
                          className="px-3.5 py-1.5 text-xs font-semibold text-[#F5F5DC] bg-[#5A1827] hover:bg-[#48121E] dark:bg-[#6B1D2F] dark:hover:bg-[#541624] rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap disabled:opacity-45 disabled:cursor-not-allowed"
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>
                            {isPushingThis ? 'Pushing...' : pushed ? 'Update on GitHub' : 'Push to GitHub'}
                          </span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setIsReadmeModalOpen(true)}
                          className="px-3 py-1.5 text-xs font-semibold text-[#F5F5DC] bg-[#5A1827] hover:bg-[#48121E] dark:bg-[#6B1D2F] dark:hover:bg-[#541624] rounded-lg shadow-xs transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
                        >
                          <FileCode2 className="w-3.5 h-3.5" />
                          <span>README Preview</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Completed Bonus Projects Ready for GitHub Push */}
          {completedBonusProjects.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-sm text-[#2C3E50] dark:text-[#F5F5DC]">
                  Completed Bonus Projects Ready to Push ({completedBonusProjects.length})
                </h2>
              </div>

              <div className="space-y-3">
                {completedBonusProjects.map((bp) => {
                  const done = completedStepsMap[bp.id]?.length || 0;
                  const pushed = pushedRecords[bp.id];
                  const isPushingThis = pushingProjectId === bp.id;

                  return (
                    <div
                      key={bp.id}
                      className="p-5 rounded-2xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#243342] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="text-xs font-mono text-[#5D6D7E] dark:text-[#BDC3C7]">
                          <span className="font-bold text-emerald-700 dark:text-emerald-400">
                            Complete
                          </span>{' '}
                          · {bp.tier} · {done}/{bp.steps.length} Steps
                        </div>
                        <h3 className="font-bold text-sm text-[#2C3E50] dark:text-[#F5F5DC]">
                          {bp.title}
                        </h3>
                        {pushed && (
                          <a
                            href={pushed.readmeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-semibold text-[#1E3A78] dark:text-sky-300 hover:underline inline-flex items-center gap-1"
                          >
                            <span>View README.md in {pushed.repoFullName}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => selectProject(bp.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC] bg-white dark:bg-[#1A2634] border border-[#BDC3C7] dark:border-[#2C3E50] hover:bg-[#EBE9DF] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                        >
                          Open in IDE
                        </button>
                        <button
                          type="button"
                          disabled={isPushingThis || isPushingAll || !ghUser || !selectedRepoFullName}
                          onClick={() =>
                            pushSingleProjectToGitHub(
                              bp,
                              done,
                              bp.steps.length,
                              'bonus-portfolio-projects'
                            )
                          }
                          className="px-3.5 py-1.5 text-xs font-semibold text-[#F5F5DC] bg-[#5A1827] hover:bg-[#48121E] rounded-lg shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap disabled:opacity-45 disabled:cursor-not-allowed"
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>
                            {isPushingThis ? 'Pushing...' : pushed ? 'Update on GitHub' : 'Push to GitHub'}
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <GitReadmeModal
        isOpen={isReadmeModalOpen}
        onClose={() => setIsReadmeModalOpen(false)}
      />
    </div>
  );
};
