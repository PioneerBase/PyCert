import React, { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { MICRO_PROJECTS } from '../data/pcepCurriculum';
import { GitReadmeModal } from './GitReadmeModal';
import { DailyStreakTracker } from './DailyStreakTracker';
import {
  Calendar,
  Flame,
  Award,
  Clock,
  ArrowRight,
  Code2,
  CheckCircle2,
  FileText,
  Compass,
  HelpCircle,
  Settings,
  Rocket,
  Layers,
  BookOpen,
  X,
} from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const {
    setActiveView,
    selectProject,
    currentProject,
    currentUser,
    updateUserProfile,
    completedStepsMap,
    readinessPercentage,
    setIsDiagnosticModalOpen,
    setIsTourModalOpen,
    setIsAccountModalOpen,
    currentStreak,
    flashcards,
    reviewFlashcard,
    quizHistory,
    selectedBonusProjectIds,
  } = useProgress();
  const [isReadmeModalOpen, setIsReadmeModalOpen] = useState<boolean>(false);
  const [flashcardRevealed, setFlashcardRevealed] = useState<boolean>(false);
  const [flashcardOffset, setFlashcardOffset] = useState<number>(0);

  // Calculate dynamic days remaining from user's target exam date
  const targetDate = currentUser.targetExamDate
    ? new Date(currentUser.targetExamDate)
    : new Date(Date.now() + 30 * 86400000);
  const diffTime = targetDate.getTime() - Date.now();
  const daysRemaining = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Real progress totals across all 5 syllabus labs
  const totalLabSteps = MICRO_PROJECTS.reduce((acc, p) => acc + p.steps.length, 0);
  const totalCompletedTasks = MICRO_PROJECTS.reduce(
    (acc, p) => acc + (completedStepsMap[p.id]?.length || 0),
    0
  );
  const completedLabsCount = MICRO_PROJECTS.filter(
    (p) => (completedStepsMap[p.id]?.length || 0) >= p.steps.length
  ).length;
  const nextIncompleteLab =
    MICRO_PROJECTS.find((p) => (completedStepsMap[p.id]?.length || 0) < p.steps.length) ||
    MICRO_PROJECTS[0];

  const isFirstTimeUser = !currentUser.hasDismissedWelcome;
  const firstName = currentUser.name ? currentUser.name.split(' ')[0] : 'Candidate';

  // Live flashcard from user's real Leitner study deck
  const todayStr = new Date().toISOString().split('T')[0];
  const dueCards = flashcards.filter((c) => c.nextReviewDate <= todayStr);
  const activeDeck = dueCards.length > 0 ? dueCards : flashcards;
  const safeIndex = activeDeck.length > 0 ? flashcardOffset % activeDeck.length : 0;
  const activeCard = activeDeck[safeIndex];

  const handleReviewHomeCard = (gotRight: boolean) => {
    if (!activeCard) return;
    reviewFlashcard(activeCard.id, gotRight);
    setFlashcardRevealed(false);
    setFlashcardOffset((prev) => prev + 1);
  };

  // Dynamic domain progress metrics: starts at 0% for new users
  const getDomainMetrics = (domainNum: number) => {
    const domainProjects = MICRO_PROJECTS.filter((p) => p.sectionNumber === domainNum);
    const totalSteps = domainProjects.reduce((acc, p) => acc + p.steps.length, 0);
    const completedSteps = domainProjects.reduce(
      (acc, p) => acc + (completedStepsMap[p.id]?.length || 0),
      0
    );
    const pct = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
    return {
      pct,
      completedSteps,
      totalSteps,
      projectsCount: domainProjects.length,
    };
  };

  const domain1 = getDomainMetrics(1);
  const domain2 = getDomainMetrics(2);
  const domain3 = getDomainMetrics(3);
  const domain4 = getDomainMetrics(4);
  const domain5 = getDomainMetrics(5);

  const domainSummaries = [
    {
      num: 1,
      title: 'Computer Programming & Fundamentals',
      desc: 'Literals, variables, comments, numerical operators, type casting, console I/O.',
      progress: domain1.pct,
      statusText: domain1.pct === 0 ? 'Not Started' : domain1.pct === 100 ? 'Complete' : `${domain1.pct}%`,
      footerLeft: `${domain1.completedSteps} of ${domain1.totalSteps} steps`,
      footerRight: `${domain1.projectsCount} lab`,
    },
    {
      num: 2,
      title: 'Control Flow: Decisions & Loops',
      desc: 'Conditional execution, if-elif-else branches, while & for loops, break & continue.',
      progress: domain2.pct,
      statusText: domain2.pct === 0 ? 'Not Started' : domain2.pct === 100 ? 'Complete' : `${domain2.pct}%`,
      footerLeft: `${domain2.completedSteps} of ${domain2.totalSteps} steps`,
      footerRight: `${domain2.projectsCount} lab`,
    },
    {
      num: 3,
      title: 'Data Collections: Lists, Tuples & Dicts',
      desc: 'Slicing, indexing, immutability concepts, list methods, string formatting.',
      progress: domain3.pct,
      statusText: domain3.pct === 0 ? 'Not Started' : domain3.pct === 100 ? 'Complete' : `${domain3.pct}%`,
      footerLeft: `${domain3.completedSteps} of ${domain3.totalSteps} steps`,
      footerRight: `${domain3.projectsCount} lab`,
    },
    {
      num: 4,
      title: 'Functions, Scopes & Exceptions',
      desc: 'def statements, positional vs keyword arguments, NoneType, try-except blocks.',
      progress: domain4.pct,
      statusText: domain4.pct === 0 ? 'Not Started' : domain4.pct === 100 ? 'Complete' : `${domain4.pct}%`,
      footerLeft: `${domain4.completedSteps} of ${domain4.totalSteps} steps`,
      footerRight: '20% exam weight',
    },
    {
      num: 5,
      title: 'File Handling & Module Imports',
      desc: 'CSV parsing, context managers, math and random standard library modules.',
      progress: domain5.pct,
      statusText: domain5.pct === 0 ? 'Not Started' : domain5.pct === 100 ? 'Complete' : `${domain5.pct}%`,
      footerLeft: `${domain5.completedSteps} of ${domain5.totalSteps} steps`,
      footerRight: `${domain5.projectsCount} lab`,
    },
  ];

  const featuredCompleted = completedStepsMap[currentProject.id]?.length || 0;
  const featuredTotal = currentProject.steps.length;
  const featuredPct = featuredTotal > 0 ? Math.round((featuredCompleted / featuredTotal) * 100) : 0;
  const nextStepObj =
    currentProject.steps.find((s) => !(completedStepsMap[currentProject.id] || []).includes(s.stepNumber)) ||
    currentProject.steps[0];

  const handleLaunchFeaturedLab = () => {
    selectProject(currentProject.id);
    setActiveView('workspace');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-200">
      {/* First-Time User Welcome Banner */}
      {isFirstTimeUser && (
        <section
          aria-label="Welcome to PyCert 30-03"
          className="rounded-2xl border border-[#1E3A78]/35 dark:border-amber-400/35 bg-[#FAF9F5] dark:bg-[#1E2936] p-6 sm:p-8 shadow-xs space-y-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 max-w-3xl">
              <div className="text-xs font-mono font-semibold text-[#5A1827] dark:text-amber-300">
                First-Time Welcome · Getting Started
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#2C3E50] dark:text-[#F5F5DC] tracking-tight text-balance">
                Welcome to PyCert 30-03, {firstName}
              </h2>
              <p className="text-xs sm:text-sm text-[#2C3E50]/85 dark:text-[#BDC3C7] leading-relaxed">
                PyCert 30-03 is a hands-on Python learning studio built for the Python Institute PCEP-30-03 certification. Instead of just reading slides, you write and run real Python step by step inside your browser—with zero setup.
              </p>
            </div>

            <button
              type="button"
              onClick={() => updateUserProfile({ hasDismissedWelcome: true })}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#5D6D7E] dark:text-[#BDC3C7] hover:text-[#2C3E50] dark:hover:text-[#F5F5DC] hover:bg-[#EBE9DF] dark:hover:bg-[#243342] transition-colors inline-flex items-center gap-1 cursor-pointer shrink-0 whitespace-nowrap"
              title="Dismiss welcome guide"
            >
              <X className="w-3.5 h-3.5" />
              <span>Dismiss</span>
            </button>
          </div>

          {/* Main Features Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-xl border border-[#BDC3C7]/70 dark:border-[#2C3E50] bg-white dark:bg-[#141C24] space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1E3A78] dark:text-[#F5F5DC]">
                <Code2 className="w-4 h-4 text-[#5A1827] dark:text-amber-400 shrink-0" />
                <span>Jupyter-Style Syllabus Labs</span>
              </div>
              <p className="text-xs text-[#2C3E50]/75 dark:text-[#BDC3C7] leading-relaxed">
                5 core coding labs covering every PCEP objective cell by cell, with Worked Patterns, live variable previews, and .ipynb export.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#BDC3C7]/70 dark:border-[#2C3E50] bg-white dark:bg-[#141C24] space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1E3A78] dark:text-[#F5F5DC]">
                <Rocket className="w-4 h-4 text-[#5A1827] dark:text-amber-400 shrink-0" />
                <span>51 Bonus Projects</span>
              </div>
              <p className="text-xs text-[#2C3E50]/75 dark:text-[#BDC3C7] leading-relaxed">
                Practice with optional portfolio challenges across Easy, Intermediate, Advanced, and Cerebral Conquest (Hard Mode).
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#BDC3C7]/70 dark:border-[#2C3E50] bg-white dark:bg-[#141C24] space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1E3A78] dark:text-[#F5F5DC]">
                <Layers className="w-4 h-4 text-[#5A1827] dark:text-amber-400 shrink-0" />
                <span>Flashcards &amp; Mock Exam</span>
              </div>
              <p className="text-xs text-[#2C3E50]/75 dark:text-[#BDC3C7] leading-relaxed">
                Lock in syntax rules using spaced-repetition flashcards and test your readiness with a timed 45-minute exam simulator.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#BDC3C7]/70 dark:border-[#2C3E50] bg-white dark:bg-[#141C24] space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1E3A78] dark:text-[#F5F5DC]">
                <BookOpen className="w-4 h-4 text-[#5A1827] dark:text-amber-400 shrink-0" />
                <span>Portfolio &amp; Export</span>
              </div>
              <p className="text-xs text-[#2C3E50]/75 dark:text-[#BDC3C7] leading-relaxed">
                Turn completed labs into shareable work with README.md templates, .gitignore configs, and standard Jupyter .ipynb downloads.
              </p>
            </div>
          </div>

          {/* Where to Start */}
          <div className="pt-4 border-t border-[#BDC3C7]/50 dark:border-[#2C3E50] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-bold text-[#2C3E50] dark:text-[#F5F5DC]">
                Where to Start
              </div>
              <p className="text-xs text-[#2C3E50]/80 dark:text-[#BDC3C7]">
                1. Take the 5-question Diagnostic (optional) or jump straight into <strong className="text-[#1E3A78] dark:text-[#F5F5DC]">{currentProject.title}</strong>. 2. Run one cell at a time with Shift+Enter. 3. Review flashcards daily.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleLaunchFeaturedLab}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-[#F5F5DC] bg-[#5A1827] hover:bg-[#48121E] shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Start First Lab</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDiagnosticModalOpen(true)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-[#F5F5DC] bg-[#1E3A78] hover:bg-[#162C5C] shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Take 5-Question Diagnostic</span>
              </button>

              <button
                type="button"
                onClick={() => setIsTourModalOpen(true)}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC] bg-white dark:bg-[#141C24] border border-[#BDC3C7] dark:border-[#2C3E50] hover:bg-[#EBE9DF] dark:hover:bg-[#243342] transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#1E3A78] dark:text-amber-300" />
                <span>Quick Feature Tour</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Main Hero Overview */}
      <div className="rounded-2xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#243342] p-6 sm:p-8 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative overflow-hidden">
        <div className="space-y-4 max-w-2xl z-10">
          {/* Clean unboxed metadata row */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#2C3E50]/80 dark:text-[#BDC3C7]">
            <span className="font-bold text-[#5A1827] dark:text-amber-300">
              PCEP-30-03
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 tabular-nums">
              <Calendar className="w-3.5 h-3.5 text-[#1E3A78] dark:text-[#BDC3C7]" />
              <span>{daysRemaining} Days to Exam Target</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 tabular-nums text-amber-700 dark:text-amber-400 font-semibold">
              <Flame className={`w-3.5 h-3.5 ${currentStreak > 0 ? 'fill-amber-500 text-amber-500' : 'text-[#7F8C8D]'}`} />
              <span>{currentStreak} {currentStreak === 1 ? 'Day' : 'Days'} Streak</span>
            </span>
            {currentUser.hasDismissedWelcome && (
              <>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() => updateUserProfile({ hasDismissedWelcome: false })}
                  className="text-[#1E3A78] dark:text-sky-300 hover:underline font-semibold cursor-pointer"
                >
                  Show Welcome Guide
                </button>
              </>
            )}
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2C3E50] dark:text-[#F5F5DC] tracking-tight text-balance">
              {totalCompletedTasks === 0 && quizHistory.length === 0
                ? `Ready to build, ${firstName}`
                : `Welcome back, ${firstName}`}
            </h1>
            <p className="text-xs sm:text-sm text-[#2C3E50]/80 dark:text-[#BDC3C7] leading-relaxed">
              {totalCompletedTasks === 0 && quizHistory.length === 0 ? (
                <>
                  Your workspace starts at <strong className="text-[#1E3A78] dark:text-[#F5F5DC]">0%</strong> so every point reflects verified code you write. Open{' '}
                  <strong className="text-[#1E3A78] dark:text-[#F5F5DC]">{currentProject.title}</strong> or take the diagnostic to begin.
                </>
              ) : (
                <>
                  You have passed <strong className="text-[#1E3A78] dark:text-[#F5F5DC] tabular-nums">{totalCompletedTasks} of {totalLabSteps}</strong> syllabus lab steps across{' '}
                  <strong className="text-[#1E3A78] dark:text-[#F5F5DC] tabular-nums">{completedLabsCount} of 5</strong> domains. Continue with{' '}
                  <strong className="text-[#1E3A78] dark:text-[#F5F5DC]">{nextIncompleteLab.title}</strong> to raise your readiness toward the 70% passing threshold.
                </>
              )}
            </p>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveView('workspace')}
              className="px-4 py-2.5 rounded-lg text-xs font-semibold text-[#F5F5DC] bg-[#5A1827] hover:bg-[#48121E] dark:bg-[#6B1D2F] dark:hover:bg-[#541624] shadow-xs transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Code2 className="w-4 h-4" />
              <span>Open Syllabus Labs</span>
            </button>

            <button
              onClick={() => setActiveView('flashcards')}
              className="px-4 py-2.5 rounded-lg text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC] bg-[#EBE9DF] dark:bg-[#1A2634] hover:bg-[#DFDDD0] dark:hover:bg-[#1E2936] border border-[#BDC3C7] dark:border-[#2C3E50] shadow-xs transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Award className="w-4 h-4 text-[#1E3A78] dark:text-[#BDC3C7]" />
              <span>Practice Flashcards</span>
            </button>

            <button
              onClick={() => setActiveView('exam')}
              className="px-4 py-2.5 rounded-lg text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC] bg-white dark:bg-[#243342] hover:bg-[#EBE9DF] dark:hover:bg-[#1A2634] border border-[#BDC3C7] dark:border-[#2C3E50] shadow-xs transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>45-min Mock Exam</span>
            </button>
          </div>
        </div>

        {/* Circular Readiness Gauge Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1A2634] border border-[#BDC3C7] dark:border-[#2C3E50] shadow-xs flex items-center gap-6 shrink-0 z-10">
          <div className="relative w-28 h-28 flex items-center justify-center">
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
              <span className="text-2xl font-extrabold text-[#2C3E50] dark:text-[#F5F5DC] font-mono leading-none tabular-nums">
                {readinessPercentage}%
              </span>
              <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-[#2C3E50]/70 dark:text-[#BDC3C7] mt-1">
                READINESS
              </span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs tabular-nums">
            <div className="font-bold text-[#2C3E50] dark:text-[#F5F5DC]">
              Passing Mark: 70%
            </div>
            <div className="text-[11px] text-[#2C3E50]/70 dark:text-[#BDC3C7]">
              Steps passed: {totalCompletedTasks} / {totalLabSteps}
            </div>
            <div className="text-[11px] text-[#2C3E50]/70 dark:text-[#BDC3C7]">
              Mock exams: {quizHistory.length}
            </div>
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none bg-[radial-gradient(#1E3A78_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* Onboarding & Calibration Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/20 flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-900 dark:text-amber-300">
              <Compass className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Readiness Diagnostic</span>
            </div>
            <p className="text-xs text-[#2C3E50]/80 dark:text-[#BDC3C7] leading-relaxed">
              Take a short 5-question check to gauge your Python experience and get a tailored domain recommendation.
            </p>
          </div>
          <button
            onClick={() => setIsDiagnosticModalOpen(true)}
            className="self-start px-3 py-1.5 text-xs font-semibold text-[#F5F5DC] bg-[#5A1827] hover:bg-[#48121E] rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Run Diagnostic</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-4 rounded-xl border border-sky-300 dark:border-sky-800 bg-sky-50/70 dark:bg-sky-950/20 flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-sky-900 dark:text-sky-300">
              <HelpCircle className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Site How-To Guide</span>
            </div>
            <p className="text-xs text-[#2C3E50]/80 dark:text-[#BDC3C7] leading-relaxed">
              Walk through the notebook code cells, Worked Patterns, tiered hints, and .ipynb export workflow.
            </p>
          </div>
          <button
            onClick={() => setIsTourModalOpen(true)}
            className="self-start px-3 py-1.5 text-xs font-semibold text-[#F5F5DC] bg-[#1E3A78] hover:bg-[#162C5C] rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Launch Guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-4 rounded-xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#243342] flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#1E3A78] dark:text-[#BDC3C7]">
              <Settings className="w-4 h-4 text-[#1E3A78] dark:text-[#BDC3C7]" />
              <span>Account &amp; Study Settings</span>
            </div>
            <p className="text-xs text-[#2C3E50]/80 dark:text-[#BDC3C7] leading-relaxed">
              Update your name, starting domain (Domain 1–5), target exam date, or reset session progress.
            </p>
          </div>
          <button
            onClick={() => setIsAccountModalOpen(true)}
            className="self-start px-3 py-1.5 text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC] bg-white dark:bg-[#1A2634] hover:bg-[#EBE9DF] border border-[#BDC3C7] dark:border-[#2C3E50] rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Open Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Daily Learning Streak & Consistency Tracker */}
      <DailyStreakTracker />

      {/* Core Examination Matrix */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-mono font-semibold text-[#1E3A78] dark:text-[#BDC3C7]">
              Core Examination Matrix
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
            <button
              key={dom.num}
              type="button"
              onClick={() => setActiveView('curriculum')}
              className="text-left p-4 rounded-xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#243342] shadow-xs space-y-3.5 hover:border-[#1E3A78]/70 dark:hover:border-[#BDC3C7] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-2 w-full">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="font-bold text-[#2C3E50]/70 dark:text-[#BDC3C7]">
                    Domain {dom.num}/5
                  </span>
                  <span
                    className={`font-semibold tabular-nums ${
                      dom.progress > 0
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-[#5D6D7E] dark:text-[#BDC3C7]'
                    }`}
                  >
                    {dom.statusText}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-[#2C3E50] dark:text-[#F5F5DC] leading-snug">
                  {dom.title}
                </h3>
                <p className="text-[11px] text-[#2C3E50]/70 dark:text-[#BDC3C7] line-clamp-2 leading-relaxed">
                  {dom.desc}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#BDC3C7]/40 dark:border-[#2C3E50] w-full">
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

                <div className="flex items-center justify-between text-[10px] font-mono text-[#2C3E50]/70 dark:text-[#BDC3C7] tabular-nums">
                  <span>{dom.footerLeft}</span>
                  <span className="font-semibold text-[#1E3A78] dark:text-[#F5F5DC]">
                    {dom.footerRight}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Split Row: Real Adaptive Flashcard Drill (Left) & Featured Syllabus Lab (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Live Flashcard from Leitner Study Deck */}
        {activeCard && (
          <div className="p-6 rounded-2xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#243342] shadow-xs space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 text-xs font-mono">
                <span className="font-bold text-[#2C3E50] dark:text-[#F5F5DC]">
                  Quick Flashcard Practice
                </span>

                <span className="text-[11px] text-[#2C3E50]/70 dark:text-[#BDC3C7] tabular-nums">
                  Obj {activeCard.pcepObjective} · Box {activeCard.boxLevel} · {safeIndex + 1} of {activeDeck.length}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-[#2C3E50] dark:text-[#F5F5DC]">
                  {activeCard.frontPrompt}
                </h3>
              </div>

              {activeCard.codeSnippet && (
                <div className="p-4 rounded-xl bg-[#141C24] text-[#F5F5DC] font-mono text-xs overflow-x-auto border border-[#2C3E50]">
                  <pre className="whitespace-pre-wrap">
                    <code>{activeCard.codeSnippet}</code>
                  </pre>
                </div>
              )}

              {flashcardRevealed && (
                <div className="p-4 rounded-xl bg-white dark:bg-[#1A2634] border border-[#BDC3C7] dark:border-[#2C3E50] space-y-2 text-xs animate-in fade-in duration-150">
                  <div className="font-bold text-emerald-700 dark:text-emerald-400 font-mono text-sm">
                    {activeCard.backAnswer}
                  </div>
                  {activeCard.syntaxGotcha && (
                    <p className="text-[#2C3E50]/80 dark:text-[#BDC3C7] leading-relaxed text-[11px]">
                      {activeCard.syntaxGotcha}
                    </p>
                  )}
                </div>
              )}
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
                    onClick={() => handleReviewHomeCard(false)}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-900/40 hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    Needs Review
                  </button>
                  <button
                    onClick={() => handleReviewHomeCard(true)}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 shadow-xs transition-colors cursor-pointer"
                  >
                    Got It Mastered
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right: Featured Syllabus Lab */}
        <div className="p-6 rounded-2xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#243342] shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#1E3A78] dark:text-[#BDC3C7]" />
                <span className="font-bold text-[#2C3E50] dark:text-[#F5F5DC]">
                  Active Syllabus Lab
                </span>
              </div>

              <span className="text-[#1E3A78] dark:text-[#BDC3C7] font-semibold">
                Domain {currentProject.sectionNumber} · {currentProject.estimatedMinutes} min
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-[#2C3E50] dark:text-[#F5F5DC]">
                {currentProject.title}
              </h3>
              <p className="text-xs text-[#2C3E50]/80 dark:text-[#BDC3C7] leading-relaxed">
                {currentProject.description}
              </p>
            </div>

            <div className="text-[11px] font-mono text-[#5D6D7E] dark:text-[#BDC3C7]">
              Objectives: {currentProject.specificObjectives.join(' · ')}
            </div>

            {/* Progress Container */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#1A2634] border border-[#BDC3C7] dark:border-[#2C3E50] space-y-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-[#2C3E50] dark:text-[#F5F5DC] truncate">
                  {featuredCompleted === featuredTotal
                    ? `All ${featuredTotal} Steps Complete`
                    : `Next: ${nextStepObj.title}`}
                </span>
                <span className="font-mono text-[11px] font-bold text-[#1E3A78] dark:text-[#BDC3C7] shrink-0 tabular-nums">
                  {featuredPct}%
                </span>
              </div>

              <div className="w-full h-2 rounded-full bg-[#E5E5D8] dark:bg-[#2C3E50] overflow-hidden">
                <div className="h-full bg-[#1E3A78] dark:bg-[#BDC3C7] transition-all" style={{ width: `${featuredPct}%` }} />
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#2C3E50]/70 dark:text-[#BDC3C7] font-mono pt-1 tabular-nums">
                <span>Steps passed: {featuredCompleted} / {featuredTotal}</span>
                <span className="text-[#1E3A78] dark:text-[#BDC3C7] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{featuredCompleted === featuredTotal ? 'Complete' : 'Ready in IDE'}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#BDC3C7]/40 dark:border-[#2C3E50] flex items-center gap-3">
            <button
              onClick={handleLaunchFeaturedLab}
              className="flex-1 py-2.5 rounded-lg text-xs font-semibold text-[#F5F5DC] bg-[#5A1827] hover:bg-[#48121E] dark:bg-[#6B1D2F] dark:hover:bg-[#541624] shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Code2 className="w-4 h-4" />
              <span>{featuredCompleted > 0 ? 'Resume Lab in IDE' : 'Start Lab in IDE'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Portfolio & Bonus Projects Action Bar */}
      <div className="p-4 rounded-xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#243342] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <div className="font-semibold text-xs text-[#2C3E50] dark:text-[#F5F5DC]">
            Portfolio &amp; Bonus Challenges
          </div>
          <p className="text-[11px] text-[#2C3E50]/75 dark:text-[#BDC3C7] tabular-nums">
            {completedLabsCount} of 5 Syllabus Labs complete · {selectedBonusProjectIds.length} Bonus Projects bookmarked · Generate README.md and .gitignore files anytime
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveView('bonus')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#F5F5DC] bg-[#1E3A78] hover:bg-[#162C5C] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Explore Bonus Projects</span>
          </button>

          <button
            onClick={() => setIsReadmeModalOpen(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC] bg-white dark:bg-[#1A2634] border border-[#BDC3C7] dark:border-[#2C3E50] hover:bg-[#EBE9DF] dark:hover:bg-[#1E2936] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5 text-[#1E3A78] dark:text-[#BDC3C7]" />
            <span>README Generator</span>
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
