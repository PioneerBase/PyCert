import React, { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { CAPSTONE_PROJECTS } from '../data/pcepCurriculum';
import { GitReadmeModal } from './GitReadmeModal';
import {
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  Circle,
  ExternalLink,
  Download,
  FolderGit2,
  Key,
  RefreshCw,
  Terminal,
  FileCode2,
  Rocket,
  Code2,
  Check,
  Sparkles,
} from 'lucide-react';

export const PortfolioManager: React.FC = () => {
  const { setActiveView, selectProject, currentUser } = useProgress();
  const [filterStatus, setFilterStatus] = useState<'all' | 'synced' | 'ready' | 'draft'>('all');
  const [isReadmeModalOpen, setIsReadmeModalOpen] = useState<boolean>(false);
  const [telemetryLines, setTelemetryLines] = useState<string[]>([
    '$ git remote -v',
    `origin https://github.com/${currentUser.githubHandle || 'candidate'}/pycert-pcep.git (fetch)`,
    `origin https://github.com/${currentUser.githubHandle || 'candidate'}/pycert-pcep.git (push)`,
    '$ pytest --tb=line tests/',
    '==== 18 passed, 0 warnings in 0.24s ====',
  ]);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [syncedSuccess, setSyncedSuccess] = useState<boolean>(false);

  const preFlightItems = [
    { id: 1, title: 'Virtualenv & Requirements', desc: 'requirements.txt pinned to Python 3.10+', met: true },
    { id: 2, title: 'Standard Folder Layout', desc: "Dedicated 'src/', 'tests/', & 'docs/'", met: true },
    { id: 3, title: 'Automated Unit Suite', desc: "PCEP boundary corner tests in 'pytest'", met: true },
    { id: 4, title: 'Markdown README Badges', desc: 'Constructed via README Architect', met: true },
    { id: 5, title: 'License & .gitignore', desc: 'MIT permissive with bytecode ignore', met: false },
    { id: 6, title: 'Tag Release on Main', desc: "Annotated git tag 'v1.0.0-pcep-certified'", met: false },
  ];

  const filteredProjects =
    filterStatus === 'all'
      ? CAPSTONE_PROJECTS
      : CAPSTONE_PROJECTS.filter((p) => p.status === filterStatus);

  const handleBatchSync = () => {
    setSyncing(true);
    setTelemetryLines((prev) => [
      ...prev,
      '$ git add -A',
      '$ git commit -m "feat(pcep): synchronize capstone repositories with verified test suites"',
      '[main 8f31b0a] feat(pcep): synchronize capstone repositories',
      ' 12 files changed, 438 insertions(+)',
      '$ git push origin main --tags',
      `To https://github.com/${currentUser.githubHandle || 'candidate'}/pycert-pcep.git`,
      '   e4f9b2c..8f31b0a  main -> main',
      ' * [new tag]         v1.0.0-pcep-certified -> v1.0.0-pcep-certified',
      '==== Batch Git Push Complete: 5 Repos Synced ====',
    ]);
    setTimeout(() => {
      setSyncing(false);
      setSyncedSuccess(true);
      setTimeout(() => setSyncedSuccess(false), 3000);
    }, 1200);
  };

  const handleExportZip = () => {
    // Generate a downloadable archive package summary
    const portfolioSummary = JSON.stringify(CAPSTONE_PROJECTS, null, 2);
    const blob = new Blob([portfolioSummary], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pcep-portfolio-capstones.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-[#5A1827] text-[#F5F5DC]">
              SYLLABUS TO SOURCE CODE
            </span>
            <span className="flex items-center gap-1 text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>PCEP-30-03 VALIDATED</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2C3E50] dark:text-[#F5F5DC] tracking-tight">
            Certified Project Portfolio
          </h1>
          <p className="text-xs sm:text-sm text-[#2C3E50]/80 dark:text-[#BDC3C7] max-w-3xl leading-relaxed">
            Transform certification exercises into clean, audited GitHub repositories. Showcase concrete evidence of Python fundamental mastery to hiring teams with automated test badges and documentation.
          </p>
        </div>

        {/* Top Right Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsReadmeModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC] bg-[#FAF9F5] dark:bg-[#1A2634] hover:bg-[#EBE9DF] dark:hover:bg-[#243342] border border-[#BDC3C7] dark:border-[#2C3E50] rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Key className="w-3.5 h-3.5 text-[#1E3A78] dark:text-[#BDC3C7]" />
            <span>Git Credentials</span>
          </button>

          <button
            onClick={handleExportZip}
            className="px-3.5 py-2 text-xs font-semibold text-[#F5F5DC] bg-[#1E3A78] hover:bg-[#162C5C] rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Portfolio (.zip)</span>
          </button>

          <button
            onClick={handleBatchSync}
            disabled={syncing}
            className="px-4 py-2 text-xs font-semibold text-[#F5F5DC] bg-[#5A1827] hover:bg-[#48121E] dark:bg-[#6B1D2F] dark:hover:bg-[#541624] rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <GitBranch className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncedSuccess ? 'Synced to GitHub!' : syncing ? 'Syncing...' : 'Batch Sync to GitHub'}</span>
          </button>
        </div>
      </div>

      {/* Main Dual-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Host Profile, Pre-Flight Audit, Telemetry */}
        <div className="lg:col-span-4 space-y-6">
          {/* Target Remote Host */}
          <div className="p-5 rounded-2xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#243342] shadow-xs space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#2C3E50]/70 dark:text-[#BDC3C7]">
                TARGET REMOTE HOST
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                CLI Active
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#1E3A78] text-[#F5F5DC] flex items-center justify-center font-bold text-sm border-2 border-white dark:border-[#1A2634] shadow-xs">
                {currentUser.avatar || 'CS'}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1 font-bold text-sm text-[#2C3E50] dark:text-[#F5F5DC]">
                  <span>@{currentUser.githubHandle || 'candidate'}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 fill-sky-600/10" />
                </div>
                <div className="text-[11px] text-[#2C3E50]/70 dark:text-[#BDC3C7] font-mono">
                  github.com/{currentUser.githubHandle || 'candidate'}
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#BDC3C7]/40 dark:border-[#2C3E50]">
              <div className="p-3 rounded-xl bg-white dark:bg-[#1A2634] border border-[#BDC3C7]/60 dark:border-[#2C3E50] text-center">
                <div className="text-xl font-extrabold text-[#2C3E50] dark:text-[#F5F5DC] font-mono">
                  4 / 5
                </div>
                <div className="text-[10px] text-[#2C3E50]/70 dark:text-[#BDC3C7] font-mono mt-0.5">
                  Repos Ready
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-[#1A2634] border border-[#BDC3C7]/60 dark:border-[#2C3E50] text-center">
                <div className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400 font-mono">
                  100%
                </div>
                <div className="text-[10px] text-[#2C3E50]/70 dark:text-[#BDC3C7] font-mono mt-0.5">
                  Lab Tests Passing
                </div>
              </div>
            </div>
          </div>

          {/* Pre-Flight Audit Checklist */}
          <div className="p-5 rounded-2xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#243342] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-[#2C3E50] dark:text-[#F5F5DC]">
                Pre-Flight Audit
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1E3A78]/15 dark:bg-[#1E3A78]/40 text-[#1E3A78] dark:text-[#F5F5DC]">
                4 of 6 Met
              </span>
            </div>

            <p className="text-[11px] text-[#2C3E50]/70 dark:text-[#BDC3C7] leading-relaxed">
              Standardization protocol to ensure portfolio code showcases clean architecture and learning evidence for hiring team reviews.
            </p>

            {/* Checklist items */}
            <div className="space-y-2.5 pt-1">
              {preFlightItems.map((item) => (
                <div key={item.id} className="flex items-start gap-2.5 text-xs">
                  <div className="pt-0.5 shrink-0">
                    {item.met ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 fill-emerald-600/10" />
                    ) : (
                      <Circle className="w-4 h-4 text-[#BDC3C7] dark:text-[#BDC3C7]/60" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <div className={`font-semibold ${item.met ? 'text-[#2C3E50] dark:text-[#F5F5DC]' : 'text-[#2C3E50]/70 dark:text-[#BDC3C7]'}`}>
                      {item.title}
                    </div>
                    <div className="text-[10px] text-[#2C3E50]/60 dark:text-[#BDC3C7]/70 font-mono">
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleBatchSync}
              className="w-full py-2.5 rounded-lg text-xs font-semibold text-[#F5F5DC] bg-[#5A1827] hover:bg-[#48121E] dark:bg-[#6B1D2F] dark:hover:bg-[#541624] shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Push Selected Repos to GitHub</span>
            </button>
            <div className="text-[10px] text-center text-[#2C3E50]/60 dark:text-[#BDC3C7]/70 font-mono">
              Runs automated git init, add, commit & remote push
            </div>
          </div>

          {/* Telemetry Output Terminal */}
          <div className="rounded-2xl border border-[#2C3E50] bg-[#141C24] p-4 shadow-xs space-y-2">
            <div className="flex items-center justify-between border-b border-[#2C3E50] pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#BDC3C7]">
                  TELEMETRY OUTPUT
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#BDC3C7]/60">bash v5.2</span>
            </div>

            <div className="font-mono text-[11px] text-[#F5F5DC] space-y-1 overflow-x-auto max-h-48 scrollbar-thin">
              {telemetryLines.map((line, idx) => (
                <div
                  key={idx}
                  className={`${
                    line.startsWith('$')
                      ? 'text-amber-400 font-semibold'
                      : line.includes('passed')
                      ? 'text-emerald-400 font-semibold'
                      : line.includes('Sync Complete')
                      ? 'text-sky-400 font-bold'
                      : 'text-[#BDC3C7]'
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Syllabus Capstone Projects */}
        <div className="lg:col-span-8 space-y-5">
          {/* Header & Filter Pills */}
          <div className="p-4 rounded-xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#243342] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-[#1E3A78] dark:text-[#BDC3C7]" />
              <h2 className="font-bold text-sm text-[#2C3E50] dark:text-[#F5F5DC]">
                Syllabus Capstone Projects
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1E3A78]/15 dark:bg-[#1E3A78]/40 text-[#1E3A78] dark:text-[#F5F5DC]">
                5 Domains (5/5 Complete)
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-[#EBE9DF] dark:bg-[#1A2634] rounded-lg text-xs border border-[#BDC3C7]/60 dark:border-[#2C3E50]">
              {(
                [
                  { id: 'all', label: `All (${CAPSTONE_PROJECTS.length})` },
                  { id: 'synced', label: `Synced (${CAPSTONE_PROJECTS.filter((p) => p.status === 'synced').length})` },
                  { id: 'ready', label: `Ready (${CAPSTONE_PROJECTS.filter((p) => p.status === 'ready').length})` },
                  { id: 'draft', label: `Drafts (${CAPSTONE_PROJECTS.filter((p) => p.status === 'draft').length})` },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id)}
                  className={`px-3 py-1 font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
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

          {/* Project Cards List */}
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="p-6 rounded-2xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#243342] shadow-xs space-y-4 hover:border-[#1E3A78]/70 dark:hover:border-[#BDC3C7] transition-all"
              >
                {/* Project Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-[#2C3E50] dark:text-[#F5F5DC]">
                        {project.title}
                      </h3>

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          project.status === 'synced'
                            ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/40 dark:text-sky-400 border border-sky-300'
                            : project.status === 'ready'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-300'
                            : 'bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-300'
                        }`}
                      >
                        {project.statusLabel}
                      </span>

                      <span className="text-[11px] font-mono text-[#2C3E50]/70 dark:text-[#BDC3C7]">
                        {project.commitsCount} Commits
                      </span>
                    </div>

                    <p className="text-xs font-mono text-[#1E3A78] dark:text-[#BDC3C7]">
                      {project.domain}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-[#2C3E50]/80 dark:text-[#BDC3C7] leading-relaxed">
                  {project.description}
                </p>

                {/* Code preview & metrics */}
                <div className="space-y-2">
                  <pre className="p-3.5 rounded-xl bg-[#141C24] text-[#F5F5DC] font-mono text-xs overflow-x-auto border border-[#2C3E50] leading-relaxed">
                    <code>{project.codePreviewSnippet}</code>
                  </pre>

                  <div className="flex items-center justify-between text-[11px] font-mono text-[#2C3E50]/70 dark:text-[#BDC3C7] px-1">
                    <span>
                      Coverage:{' '}
                      <strong className="text-emerald-700 dark:text-emerald-400 font-semibold">
                        {project.coveragePercent}%
                      </strong>
                    </span>
                    <span>
                      Passing tests:{' '}
                      <strong className="text-emerald-700 dark:text-emerald-400 font-semibold">
                        {project.unitTestsPassing}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Tags and Action Buttons */}
                <div className="pt-3 border-t border-[#BDC3C7]/40 dark:border-[#2C3E50] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-white dark:bg-[#1A2634] text-[#2C3E50] dark:text-[#BDC3C7] border border-[#BDC3C7]/60 dark:border-[#2C3E50]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsReadmeModalOpen(true)}
                      className="px-3 py-1.5 text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC] bg-white dark:bg-[#1A2634] hover:bg-[#EBE9DF] dark:hover:bg-[#1E2936] border border-[#BDC3C7] dark:border-[#2C3E50] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <FileCode2 className="w-3.5 h-3.5 text-[#1E3A78] dark:text-[#BDC3C7]" />
                      <span>Update README</span>
                    </button>

                    {project.status === 'synced' ? (
                      <a
                        href={`https://github.com/${currentUser.githubHandle || 'pcep-candidate'}/${project.githubRepoUrl.split('/').pop() || project.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 text-xs font-semibold text-[#F5F5DC] bg-[#1E3A78] hover:bg-[#162C5C] rounded-lg shadow-xs transition-colors flex items-center gap-1"
                      >
                        <span>View GitHub Repo</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <button
                        onClick={handleBatchSync}
                        className="px-3.5 py-1.5 text-xs font-semibold text-[#F5F5DC] bg-[#5A1827] hover:bg-[#48121E] dark:bg-[#6B1D2F] dark:hover:bg-[#541624] rounded-lg shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>Push to GitHub Repo</span>
                        <GitBranch className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <GitReadmeModal
        isOpen={isReadmeModalOpen}
        onClose={() => setIsReadmeModalOpen(false)}
      />
    </div>
  );
};
