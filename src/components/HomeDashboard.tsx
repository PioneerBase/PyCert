import React, { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { PCEP_SECTIONS, MICRO_PROJECTS } from '../data/pcepCurriculum';
import { GitReadmeModal } from './GitReadmeModal';
import {
  Sparkles,
  Calendar,
  Flame,
  Award,
  Clock,
  BookOpen,
  ArrowRight,
  Code2,
  CheckCircle2,
  GitBranch,
  FileText,
  RotateCcw,
  Check,
  ChevronRight,
  Maximize2,
  Settings,
  RefreshCw,
} from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const { setActiveView, selectProject } = useProgress();
  const [isReadmeModalOpen, setIsReadmeModalOpen] = useState<boolean>(false);
  const [flashcardRevealed, setFlashcardRevealed] = useState<boolean>(false);
  const [flashcardMastered, setFlashcardMastered] = useState<boolean | null>(null);

  // Quick stats
  const readinessPercentage = 78;
  const daysRemaining = 14;
  const streakDays = 12;

  // Domain progress metrics
  const domainSummaries = [
    {
      num: 1,
      title: 'Computer Programming & Fundamentals',
      desc: 'Literals, variables, comments, numerical operators, type casting, console I/O...',
      progress: 95,
      badgeText: '95% Complete',
      badgeColor: 'text-emerald-700 bg-emerald-100/80 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800',
      footerLeft: '8 tasks completed',
      footerRight: '2 projects',
    },
    {
      num: 2,
      title: 'Control Flow: Decisions & Loops',
      desc: 'Conditional execution, if-elif-else branches, while & for loops, walrus operator...',
      progress: 82,
      badgeText: '82% In Progress',
      badgeColor: 'text-amber-800 bg-amber-100/80 dark:bg-amber-950/40 dark:text-amber-400 border-amber-300 dark:border-amber-800',
      footerLeft: '6 tasks completed',
      footerRight: '1 project',
    },
    {
      num: 3,
      title: 'Data Collections: Lists, Tuples & Dicts',
      desc: 'Slicing, indexing, immutability concepts, list methods, string algorithms...',
      progress: 64,
      badgeText: '64% Active',
      badgeColor: 'text-[#1E3A78] bg-[#1E3A78]/10 dark:bg-[#1E3A78]/30 dark:text-[#F5F5DC] border-[#1E3A78]/30 dark:border-[#BDC3C7]/40',
      footerLeft: '7 active drills',
      footerRight: 'Lab assigned',
    },
    {
      num: 4,
      title: 'Functions, Scopes & Exceptions',
      desc: 'def statements, positional vs keyword arguments, NoneType, try-except blocks...',
      progress: 45,
      badgeText: '45% Priority',
      badgeColor: 'text-[#5A1827] bg-[#5A1827]/10 dark:bg-[#5A1827]/30 dark:text-[#F5F5DC] border-[#5A1827]/30',
      footerLeft: 'Needs practice',
      footerRight: 'High exam weight',
    },
    {
      num: 5,
      title: 'File Handling & Module Imports',
      desc: 'Text file modes (r/w/a), context managers (with open), CSV processing, math and random modules...',
      progress: 70,
      badgeText: '70% Verified',
      badgeColor: 'text-emerald-700 bg-emerald-100/80 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800',
      footerLeft: '5 drills passed',
      footerRight: '1 project',
    },
  ];

  const handleLaunchCaesarCipher = () => {
    const cipherProj = MICRO_PROJECTS.find((p) => p.id === 'proj-03-caesar-cipher') || MICRO_PROJECTS[0];
    selectProject(cipherProj.id);
    setActiveView('workspace');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Welcome Hero Banner */}
      <div className="rounded-2xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#243342] p-6 sm:p-8 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative overflow-hidden">
        <div className="space-y-4 max-w-2xl z-10">
          {/* Status Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold tracking-wider uppercase bg-[#5A1827] text-[#F5F5DC] shadow-xs">
              PCEP-30-03 TARGET
            </span>
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-mono font-semibold bg-[#EBE9DF] dark:bg-[#1A2634] text-[#2C3E50] dark:text-[#BDC3C7] border border-[#BDC3C7]/60 dark:border-[#2C3E50]">
              <Calendar className="w-3.5 h-3.5 text-[#1E3A78] dark:text-[#BDC3C7]" />
              <span>{daysRemaining} Days Remaining</span>
            </span>
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-mono font-semibold bg-[#EBE9DF] dark:bg-[#1A2634] text-amber-700 dark:text-amber-400 border border-[#BDC3C7]/60 dark:border-[#2C3E50]">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{streakDays}-Day Streak</span>
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2C3E50] dark:text-[#F5F5DC] tracking-tight flex items-center gap-2">
              <span>Welcome back, Devon!</span>
              <span className="text-xl">🎯</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#2C3E50]/80 dark:text-[#BDC3C7] leading-relaxed">
              You're pacing ahead of 84% of fellow candidates. Complete your{' '}
              <strong className="text-[#1E3A78] dark:text-[#F5F5DC] font-semibold">
                Section 4: Functions & Exceptions
              </strong>{' '}
              drill today to bring study readiness above the 80% passing safety threshold.
            </p>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveView('flashcards')}
              className="px-4 py-2.5 rounded-lg text-xs font-semibold text-[#F5F5DC] bg-[#5A1827] hover:bg-[#48121E] dark:bg-[#6B1D2F] dark:hover:bg-[#541624] shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Launch Daily Flashcard Drill</span>
            </button>

            <button
              onClick={() => setActiveView('workspace')}
              className="px-4 py-2.5 rounded-lg text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC] bg-[#EBE9DF] dark:bg-[#1A2634] hover:bg-[#DFDDD0] dark:hover:bg-[#1E2936] border border-[#BDC3C7] dark:border-[#2C3E50] shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Code2 className="w-4 h-4 text-[#1E3A78] dark:text-[#BDC3C7]" />
              <span>Create Syllabus Project</span>
            </button>

            <button
              onClick={() => setActiveView('exam')}
              className="px-4 py-2.5 rounded-lg text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC] bg-[#FAF9F5] dark:bg-[#243342] hover:bg-[#EBE9DF] dark:hover:bg-[#1A2634] border border-[#BDC3C7] dark:border-[#2C3E50] shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Take 45-min Mock Exam</span>
            </button>
          </div>
        </div>

        {/* Circular Readiness Gauge Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1A2634] border border-[#BDC3C7] dark:border-[#2C3E50] shadow-xs flex items-center gap-6 shrink-0 z-10">
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* SVG circle track */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-[#EBE9DF] dark:stroke-[#2C3E50]"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-[#1E3A78] dark:stroke-[#BDC3C7] transition-all duration-1000 ease-out"
                strokeWidth="10"
                strokeDasharray={`${readinessPercentage * 2.51} 251`}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-extrabold text-[#2C3E50] dark:text-[#F5F5DC] font-mono leading-none">
                {readinessPercentage}%
              </span>
              <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-[#2C3E50]/70 dark:text-[#BDC3C7] mt-1">
                READINESS
              </span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="font-bold text-[#2C3E50] dark:text-[#F5F5DC]">
              Passing Mark: 70%
            </div>
            <div className="text-[11px] text-[#2C3E50]/70 dark:text-[#BDC3C7]">
              Recommended: 85%+
            </div>
            <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 pt-1">
              <span>📈</span>
              <span>+6% this week</span>
            </div>
          </div>
        </div>

        {/* Decorative background grid pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none bg-[radial-gradient(#1E3A78_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* Core Examination Matrix Header & 4 Domain Cards */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#1E3A78] dark:text-[#BDC3C7]">
              CORE EXAMINATION MATRIX
            </div>
            <h2 className="text-xl font-bold text-[#2C3E50] dark:text-[#F5F5DC]">
              PCEP-30-03 Official Syllabus Modules
            </h2>
          </div>

          <button
            onClick={() => setActiveView('curriculum')}
            className="text-xs font-semibold text-[#1E3A78] dark:text-[#BDC3C7] hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>Detailed breakdown</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 5 Domains Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {domainSummaries.map((dom) => (
            <div
              key={dom.num}
              onClick={() => setActiveView('curriculum')}
              className="p-4 rounded-xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#243342] shadow-xs space-y-3.5 hover:border-[#1E3A78]/70 dark:hover:border-[#BDC3C7] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2C3E50]/70 dark:text-[#BDC3C7]">
                    DOMAIN {dom.num} / 5
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${dom.badgeColor}`}
                  >
                    {dom.badgeText}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-[#2C3E50] dark:text-[#F5F5DC] leading-snug">
                  {dom.title}
                </h3>
                <p className="text-[11px] text-[#2C3E50]/70 dark:text-[#BDC3C7] line-clamp-2 leading-relaxed">
                  {dom.desc}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#BDC3C7]/40 dark:border-[#2C3E50]">
                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-[#E5E5D8] dark:bg-[#1A2634] overflow-hidden">
                  <div
                    className={`h-full ${
                      dom.progress >= 90
                        ? 'bg-emerald-600'
                        : dom.progress >= 80
                        ? 'bg-amber-600'
                        : dom.progress >= 60
                        ? 'bg-[#1E3A78] dark:bg-[#BDC3C7]'
                        : 'bg-[#5A1827] dark:bg-[#8B263E]'
                    }`}
                    style={{ width: `${dom.progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-[#2C3E50]/70 dark:text-[#BDC3C7]">
                  <span>{dom.footerLeft}</span>
                  <span className="font-semibold text-[#1E3A78] dark:text-[#F5F5DC]">
                    {dom.footerRight}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Split Row: Adaptive Flashcard Drill (Left) & Featured Syllabus Lab (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Adaptive Flashcard Drill */}
        <div className="p-6 rounded-2xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#243342] shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#2C3E50] dark:text-[#F5F5DC]">
                  ADAPTIVE FLASHCARD DRILL
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#EBE9DF] dark:bg-[#1A2634] text-[#2C3E50] dark:text-[#BDC3C7] border border-[#BDC3C7]/60 dark:border-[#2C3E50]">
                  PCEP Block 1.2
                </span>
                <span className="text-[11px] font-mono text-[#2C3E50]/70 dark:text-[#BDC3C7]">
                  Card 14 of 50
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#2C3E50]/70 dark:text-[#BDC3C7]">
                QUESTION PROMPT
              </div>
              <h3 className="text-base font-bold text-[#2C3E50] dark:text-[#F5F5DC]">
                What is the exact terminal output of the following Python 3 statement?
              </h3>
            </div>

            {/* Code Box */}
            <div className="p-4 rounded-xl bg-[#141C24] text-[#F5F5DC] font-mono text-xs flex items-center justify-between border border-[#2C3E50]">
              <code>print(3 * '7')</code>
              <span className="text-[10px] text-[#BDC3C7] font-mono bg-[#1E2936] px-2 py-0.5 rounded">
                Type: str * int
              </span>
            </div>

            {/* Answer Display */}
            {flashcardRevealed ? (
              <div className="p-4 rounded-xl bg-white dark:bg-[#1A2634] border border-[#BDC3C7] dark:border-[#2C3E50] space-y-2 text-xs animate-in fade-in duration-150">
                <div className="font-bold text-emerald-700 dark:text-emerald-400 font-mono text-sm">
                  Output: 777
                </div>
                <p className="text-[#2C3E50]/80 dark:text-[#BDC3C7] leading-relaxed text-[11px]">
                  Multiplying a string by an integer replicates the sequence rather than performing arithmetic addition. Thus, 3 * '7' produces three repetitions: <code>'777'</code>.
                </p>
              </div>
            ) : null}
          </div>

          {/* Drill Action Controls */}
          <div className="pt-4 border-t border-[#BDC3C7]/40 dark:border-[#2C3E50] flex flex-wrap items-center gap-2 justify-between">
            {!flashcardRevealed ? (
              <button
                onClick={() => setFlashcardRevealed(true)}
                className="w-full py-2.5 rounded-lg text-xs font-semibold text-[#F5F5DC] bg-[#1E3A78] hover:bg-[#162C5C] shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Reveal Answer</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 w-full">
                <button
                  onClick={() => {
                    setFlashcardMastered(false);
                    setTimeout(() => {
                      setFlashcardRevealed(false);
                      setFlashcardMastered(null);
                    }, 800);
                  }}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-900/40 hover:bg-rose-100 transition-colors cursor-pointer"
                >
                  Needs Review
                </button>
                <button
                  onClick={() => {
                    setFlashcardMastered(true);
                    setTimeout(() => {
                      setFlashcardRevealed(false);
                      setFlashcardMastered(null);
                    }, 800);
                  }}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 shadow-xs transition-colors cursor-pointer"
                >
                  Got it Mastered
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Featured Syllabus Lab */}
        <div className="p-6 rounded-2xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#243342] shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#1E3A78] dark:text-[#BDC3C7]" />
                <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#2C3E50] dark:text-[#F5F5DC]">
                  FEATURED SYLLABUS LAB
                </span>
              </div>

              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#1E3A78]/15 dark:bg-[#1E3A78]/40 text-[#1E3A78] dark:text-[#F5F5DC] border border-[#1E3A78]/30">
                Domain 3
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-[#2C3E50] dark:text-[#F5F5DC]">
                Interactive CLI Caesar Cipher
              </h3>
              <p className="text-xs text-[#2C3E50]/80 dark:text-[#BDC3C7] leading-relaxed">
                Solidify string slicing, ASCII boundary transforms, and list index iterations by completing the decode rotation loop.
              </p>
            </div>

            {/* Keyword tags */}
            <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
              {['ord()', 'chr()', 'modulo % 26', 'for loops'].map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded bg-white dark:bg-[#1A2634] text-[#2C3E50] dark:text-[#BDC3C7] border border-[#BDC3C7]/60 dark:border-[#2C3E50]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Progress Container */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#1A2634] border border-[#BDC3C7] dark:border-[#2C3E50] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#2C3E50] dark:text-[#F5F5DC]">
                  Milestone 3/5: Rotate Uppercase
                </span>
                <span className="font-mono text-[11px] font-bold text-[#1E3A78] dark:text-[#BDC3C7]">
                  60% Complete
                </span>
              </div>

              <div className="w-full h-2 rounded-full bg-[#E5E5D8] dark:bg-[#2C3E50] overflow-hidden">
                <div className="h-full bg-[#1E3A78] dark:bg-[#BDC3C7]" style={{ width: '60%' }} />
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#2C3E50]/70 dark:text-[#BDC3C7] font-mono pt-1">
                <span>Auto-graded tests: 4 / 6 passing</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Git Synced</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-[#BDC3C7]/40 dark:border-[#2C3E50] flex items-center gap-3">
            <button
              onClick={handleLaunchCaesarCipher}
              className="flex-1 py-2.5 rounded-lg text-xs font-semibold text-[#F5F5DC] bg-[#5A1827] hover:bg-[#48121E] dark:bg-[#6B1D2F] dark:hover:bg-[#541624] shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Code2 className="w-4 h-4" />
              <span>Resume in Workspace</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom GitHub Sync Status Bar */}
      <div className="p-4 rounded-xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#243342] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#1E3A78]/10 text-[#1E3A78] dark:text-[#BDC3C7] flex items-center justify-center border border-[#1E3A78]/20 shrink-0">
            <GitBranch className="w-4 h-4" />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#2C3E50] dark:text-[#F5F5DC]">
                github.com/devonvance/pcep-prep-2025
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                Up to date
              </span>
            </div>
            <p className="text-[11px] text-[#2C3E50]/70 dark:text-[#BDC3C7] font-mono">
              Last pushed commit: <code className="text-[#1E3A78] dark:text-[#BDC3C7]">e4f9b2c</code> "Add solution for Section 2 while-else puzzle" (2 hours ago)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsReadmeModalOpen(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC] bg-white dark:bg-[#1A2634] border border-[#BDC3C7] dark:border-[#2C3E50] hover:bg-[#EBE9DF] dark:hover:bg-[#1E2936] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5 text-[#1E3A78] dark:text-[#BDC3C7]" />
            <span>Launch README Architect</span>
          </button>
        </div>
      </div>

      <GitReadmeModal
        isOpen={isReadmeModalOpen}
        onClose={() => setIsReadmeModalOpen(false)}
      />
    </div>
  );
};
