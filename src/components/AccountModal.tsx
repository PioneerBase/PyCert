import React, { useState, useEffect, useMemo } from 'react';
import { useProgress } from '../context/ProgressContext';
import { MICRO_PROJECTS } from '../data/pcepCurriculum';
import { BONUS_PROJECTS } from '../data/bonusProjects';
import {
  X,
  User,
  Mail,
  GitBranch,
  Calendar,
  Compass,
  Sparkles,
  CheckCircle2,
  LogOut,
  HelpCircle,
  Clock,
  Save,
  Calculator,
  BookOpen,
  Layers,
  Award,
  Rocket,
} from 'lucide-react';

function daysFromNow(dateStr: string): number {
  if (!dateStr) return 30;
  const parsed = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return 30;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = Math.round((parsed.getTime() - now.getTime()) / 86400000);
  return Math.max(1, Math.min(365, diff));
}

function dateAfterDays(days: number): string {
  const clamped = Math.max(1, Math.min(365, Math.round(days)));
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + clamped);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDuration(totalMinutes: number): string {
  const mins = Math.max(0, Math.round(totalMinutes));
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  return rem > 0 ? `${hrs}h ${rem}m` : `${hrs}h`;
}

export const AccountModal: React.FC = () => {
  const {
    isAccountModalOpen,
    setIsAccountModalOpen,
    currentUser,
    updateUserProfile,
    resetAllProgress,
    setIsDiagnosticModalOpen,
    setIsTourModalOpen,
    logout,
    readinessPercentage,
    completedStepsMap,
    flashcards,
    quizHistory,
    selectedBonusProjectIds,
  } = useProgress();

  const [name, setName] = useState<string>(currentUser.name || '');
  const [email, setEmail] = useState<string>(currentUser.email || '');
  const [githubHandle, setGithubHandle] = useState<string>(currentUser.githubHandle || '');
  const [startingDomain, setStartingDomain] = useState<number>(currentUser.startingDomain || 1);
  const [experienceLevel, setExperienceLevel] = useState<string>(
    currentUser.experienceLevel || 'Beginner'
  );
  const [targetExamDate, setTargetExamDate] = useState<string>(
    currentUser.targetExamDate || dateAfterDays(30)
  );
  const [studyPace, setStudyPace] = useState<'relaxed' | 'standard' | 'intensive'>(
    currentUser.studyPace || 'standard'
  );
  const [practiceDaysPerWeek, setPracticeDaysPerWeek] = useState<number>(
    currentUser.practiceDaysPerWeek || 5
  );
  const [includeBonusInEstimate, setIncludeBonusInEstimate] = useState<boolean>(true);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Sync state whenever modal opens or currentUser updates
  useEffect(() => {
    setName(currentUser.name || '');
    setEmail(currentUser.email || '');
    setGithubHandle(currentUser.githubHandle || '');
    setStartingDomain(currentUser.startingDomain || 1);
    setExperienceLevel(currentUser.experienceLevel || 'Beginner');
    setTargetExamDate(currentUser.targetExamDate || dateAfterDays(30));
    setStudyPace(currentUser.studyPace || 'standard');
    setPracticeDaysPerWeek(currentUser.practiceDaysPerWeek || 5);
  }, [currentUser, isAccountModalOpen]);

  const practiceWindowDays = useMemo(() => daysFromNow(targetExamDate), [targetExamDate]);

  const estimator = useMemo(() => {
    const expMultiplierMap: Record<string, number> = {
      'Absolute Beginner': 1.2,
      Beginner: 1.15,
      Elementary: 1.0,
      Intermediate: 0.9,
      'Upper-Intermediate': 0.8,
      'Advanced / Capstone': 0.7,
    };
    const expMultiplier = expMultiplierMap[experienceLevel] ?? 1.0;

    // 1. Syllabus Concepts & Interactive Notebook Labs
    let labMinutes = 0;
    let remainingLabs = 0;
    MICRO_PROJECTS.forEach((proj) => {
      const doneCount = Math.min(proj.steps.length, completedStepsMap[proj.id]?.length || 0);
      const remainingRatio =
        proj.steps.length > 0 ? Math.max(0, (proj.steps.length - doneCount) / proj.steps.length) : 0;
      if (remainingRatio > 0) remainingLabs += 1;
      // Include domain concept reading, objective review, and debugging buffer alongside lab runtime
      const fullDomainMinutes = (proj.estimatedMinutes || 20) + 42;
      labMinutes += fullDomainMinutes * remainingRatio * expMultiplier;
    });
    labMinutes = Math.round(labMinutes);

    // 2. Spaced-Repetition Flashcards
    const unmasteredCards = flashcards.filter((c) => c.boxLevel < 3).length;
    const flashcardMinutes = Math.round(
      unmasteredCards > 0 ? unmasteredCards * 3.5 * expMultiplier : 15
    );

    // 3. Mock Exams & Explanation Review (40-min PCEP mock + ~15-min review)
    const targetMocks = 3;
    const completedMocks = quizHistory.length;
    const remainingMocks =
      readinessPercentage >= 90 && completedMocks >= targetMocks
        ? 0
        : Math.max(1, targetMocks - completedMocks);
    const mockExamMinutes = Math.round(remainingMocks * 50);

    // 4. Optional Queued Bonus Projects
    let bonusMinutes = 0;
    let remainingBonusCount = 0;
    if (includeBonusInEstimate && selectedBonusProjectIds.length > 0) {
      selectedBonusProjectIds.forEach((bonusId) => {
        const bonusProj = BONUS_PROJECTS.find((b) => b.id === bonusId);
        if (!bonusProj) return;
        const doneCount = Math.min(
          bonusProj.steps.length,
          completedStepsMap[bonusProj.id]?.length || 0
        );
        const remainingRatio =
          bonusProj.steps.length > 0
            ? Math.max(0, (bonusProj.steps.length - doneCount) / bonusProj.steps.length)
            : 0;
        if (remainingRatio > 0) remainingBonusCount += 1;
        bonusMinutes += (bonusProj.estimatedMinutes || 20) * 1.4 * remainingRatio * expMultiplier;
      });
    }
    bonusMinutes = Math.round(bonusMinutes);

    const totalMinutes = labMinutes + flashcardMinutes + mockExamMinutes + bonusMinutes;

    // Active practice days given chosen window & days/week
    const activePracticeDays = Math.max(
      1,
      Math.round((practiceWindowDays * practiceDaysPerWeek) / 7)
    );
    const dailyMinutesNeeded = totalMinutes > 0 ? Math.max(5, Math.ceil(totalMinutes / activePracticeDays)) : 0;
    const weeklyMinutesNeeded = Math.round(
      dailyMinutesNeeded * Math.min(practiceDaysPerWeek, activePracticeDays)
    );

    // Recommended days at user's selected Study Pace
    const paceDailyCapacity: Record<'relaxed' | 'standard' | 'intensive', number> = {
      relaxed: 25,
      standard: 45,
      intensive: 85,
    };
    const paceCapacity = paceDailyCapacity[studyPace];
    const activeDaysAtPace = totalMinutes > 0 ? Math.max(1, Math.ceil(totalMinutes / paceCapacity)) : 0;
    const calendarDaysAtPace =
      activeDaysAtPace > 0
        ? Math.max(1, Math.ceil((activeDaysAtPace * 7) / practiceDaysPerWeek))
        : 0;

    let outlook: {
      label: string;
      summary: string;
      badgeClass: string;
    };

    if (totalMinutes === 0) {
      outlook = {
        label: 'Exam-Ready',
        summary: 'Core labs, flashcards, and mock targets are covered. Use your remaining days for light refreshers.',
        badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      };
    } else if (dailyMinutesNeeded <= 30) {
      outlook = {
        label: 'Comfortable Pace',
        summary: 'Plenty of room for spaced repetition, hands-on debugging, and calm mock exam reviews.',
        badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      };
    } else if (dailyMinutesNeeded <= 60) {
      outlook = {
        label: 'Balanced Prep Plan',
        summary: 'Steady daily focus covers all PCEP objectives and 3 practice exam passes right on schedule.',
        badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border-blue-300 dark:border-blue-800',
      };
    } else if (dailyMinutesNeeded <= 95) {
      outlook = {
        label: 'Focused Sprint',
        summary: 'Expect dedicated daily coding sessions. Prioritize core Syllabus Labs and timed Mock Exams first.',
        badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-300 dark:border-amber-800',
      };
    } else {
      outlook = {
        label: 'High-Intensity Cram',
        summary: 'Heavy daily workload for this timeline. Consider adding more practice days or increasing days/week.',
        badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border-rose-300 dark:border-rose-800',
      };
    }

    return {
      labMinutes,
      remainingLabs,
      flashcardMinutes,
      unmasteredCards,
      mockExamMinutes,
      remainingMocks,
      bonusMinutes,
      remainingBonusCount,
      totalMinutes,
      activePracticeDays,
      dailyMinutesNeeded,
      weeklyMinutesNeeded,
      paceCapacity,
      activeDaysAtPace,
      calendarDaysAtPace,
      outlook,
    };
  }, [
    experienceLevel,
    completedStepsMap,
    flashcards,
    quizHistory,
    readinessPercentage,
    includeBonusInEstimate,
    selectedBonusProjectIds,
    practiceWindowDays,
    practiceDaysPerWeek,
    studyPace,
  ]);

  if (!isAccountModalOpen) return null;

  const totalCompleted = Object.values(completedStepsMap).reduce((acc, s) => acc + s.length, 0);

  const domainOptions = [
    { num: 1, label: 'Domain 1: Fundamentals & Console I/O', level: 'Absolute Beginner' },
    { num: 2, label: 'Domain 2: Control Flow: Decisions & Loops', level: 'Elementary' },
    { num: 3, label: 'Domain 3: Data Collections & Slicing', level: 'Intermediate' },
    { num: 4, label: 'Domain 4: Functions, Scopes & Exceptions', level: 'Upper-Intermediate' },
    { num: 5, label: 'Domain 5: File Streams & Capstones', level: 'Advanced / Capstone' },
  ];

  const handleDomainChange = (domainNum: number) => {
    setStartingDomain(domainNum);
    const matched = domainOptions.find((d) => d.num === domainNum);
    if (matched) {
      setExperienceLevel(matched.level);
    }
  };

  const handleProcessAccountChanges = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: name.trim() || 'Student Candidate',
      email: email.trim() || 'candidate@student.pcep',
      githubHandle: githubHandle.trim() || 'pcep-student',
      startingDomain,
      experienceLevel,
      targetExamDate,
      studyPace,
      practiceDaysPerWeek,
      role: `Domain 0${startingDomain} Candidate · ${experienceLevel}`,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsAccountModalOpen(false);
    }, 1200);
  };

  const handleQuickExamDays = (days: number) => {
    setTargetExamDate(dateAfterDays(days));
  };

  const handleConfirmReset = () => {
    resetAllProgress();
    setShowResetConfirm(false);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#141C24]/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-2xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-white dark:bg-[#1A2634] shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#BDC3C7]/60 dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#141C24]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1E3A78] text-[#F5F5DC] flex items-center justify-center font-bold text-sm shadow-xs font-mono">
              {currentUser.avatar || 'SC'}
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#2C3E50] dark:text-[#F5F5DC] tracking-tight">
                Account Settings & Study Profile
              </h2>
              <span className="text-[10px] font-mono text-[#1E3A78] dark:text-[#BDC3C7] font-semibold">
                Manage your credentials, starting domain, and study pace
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsAccountModalOpen(false)}
            className="p-1.5 rounded-lg text-[#2C3E50]/60 dark:text-[#BDC3C7] hover:text-[#2C3E50] dark:hover:text-[#F5F5DC] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            title="Close account settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleProcessAccountChanges} className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[78vh]">
          {/* Success Banner */}
          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Account changes processed successfully!</span>
            </div>
          )}

          {/* Section 1: Personal Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C3E50]/70 dark:text-[#BDC3C7] font-mono">
              Student Credentials
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-[#2C3E50]/50 dark:text-[#BDC3C7] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Candidate Name"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-white dark:bg-[#141C24] text-[#2C3E50] dark:text-[#F5F5DC] focus:outline-hidden focus:border-[#1E3A78]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-[#2C3E50]/50 dark:text-[#BDC3C7] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="candidate@student.pcep"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-white dark:bg-[#141C24] text-[#2C3E50] dark:text-[#F5F5DC] focus:outline-hidden focus:border-[#1E3A78]"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC] mb-1">
                  GitHub Profile Handle (For Portfolio Sync)
                </label>
                <div className="relative">
                  <GitBranch className="w-3.5 h-3.5 text-[#2C3E50]/50 dark:text-[#BDC3C7] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={githubHandle}
                    onChange={(e) => setGithubHandle(e.target.value)}
                    placeholder="e.g. alex-python-dev"
                    className="w-full pl-9 pr-3 py-2 text-xs font-mono rounded-xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-white dark:bg-[#141C24] text-[#2C3E50] dark:text-[#F5F5DC] focus:outline-hidden focus:border-[#1E3A78]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Starting Domain & Experience Placement */}
          <div className="space-y-3 pt-2 border-t border-[#BDC3C7]/40 dark:border-[#2C3E50]">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C3E50]/70 dark:text-[#BDC3C7] font-mono">
                Curriculum Starting Point
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAccountModalOpen(false);
                  setIsDiagnosticModalOpen(true);
                }}
                className="text-xs font-semibold text-[#1E3A78] dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Run Diagnostic Placement</span>
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC]">
                Active Starting Domain:
              </label>
              <select
                value={startingDomain}
                onChange={(e) => handleDomainChange(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-white dark:bg-[#141C24] text-[#2C3E50] dark:text-[#F5F5DC] focus:outline-hidden focus:border-[#1E3A78]"
              >
                {domainOptions.map((domain) => (
                  <option key={domain.num} value={domain.num}>
                    {domain.label} ({domain.level})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC] mb-1">
                  Target Exam Date ({practiceWindowDays}d away)
                </label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-[#2C3E50]/50 dark:text-[#BDC3C7] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={targetExamDate}
                    onChange={(e) => setTargetExamDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-white dark:bg-[#141C24] text-[#2C3E50] dark:text-[#F5F5DC] focus:outline-hidden focus:border-[#1E3A78]"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                  <span className="text-[10px] text-[#2C3E50]/60 dark:text-[#BDC3C7]">Presets:</span>
                  {[7, 14, 30, 45, 60].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleQuickExamDays(d)}
                      className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors cursor-pointer ${
                        practiceWindowDays === d
                          ? 'bg-[#1E3A78] text-[#F5F5DC] border-[#1E3A78] font-bold'
                          : 'bg-[#FAF9F5] dark:bg-[#243342] border-[#BDC3C7]/60 dark:border-[#2C3E50] text-[#2C3E50] dark:text-[#BDC3C7] hover:bg-[#EBE9DF] dark:hover:bg-[#2C3E50]'
                      }`}
                    >
                      {d}d
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC] mb-1">
                  Study Pace
                </label>
                <select
                  value={studyPace}
                  onChange={(e) => setStudyPace(e.target.value as 'relaxed' | 'standard' | 'intensive')}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-white dark:bg-[#141C24] text-[#2C3E50] dark:text-[#F5F5DC] focus:outline-hidden focus:border-[#1E3A78]"
                >
                  <option value="relaxed">Relaxed (~25 min/day)</option>
                  <option value="standard">Standard (~45 min/day)</option>
                  <option value="intensive">Intensive (~85 min/day)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2.5: Exam Prep & Practice Time Estimator */}
          <div className="p-4 sm:p-5 rounded-xl border border-[#BDC3C7]/70 dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#141C24] space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#1E3A78]/10 dark:bg-amber-400/10 text-[#1E3A78] dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C3E50] dark:text-[#F5F5DC] font-mono">
                    Prep & Practice Time Estimator
                  </h3>
                  <p className="text-[11px] text-[#2C3E50]/70 dark:text-[#BDC3C7]">
                    Adjust practice days to estimate daily study time needed before exam day.
                  </p>
                </div>
              </div>

              <span
                className={`px-2.5 py-1 rounded-md border text-[10px] font-mono font-bold ${estimator.outlook.badgeClass}`}
              >
                {estimator.outlook.label}
              </span>
            </div>

            {/* Interactive Controls: Days Slider + Days/Week Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label
                    htmlFor="prep-days-slider"
                    className="font-semibold text-[#2C3E50] dark:text-[#F5F5DC]"
                  >
                    Prep Window (Days)
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={1}
                      max={180}
                      value={practiceWindowDays}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!Number.isNaN(val)) {
                          handleQuickExamDays(Math.max(1, Math.min(180, val)));
                        }
                      }}
                      className="w-14 px-1.5 py-0.5 text-right text-xs font-mono font-bold rounded border border-[#BDC3C7] dark:border-[#2C3E50] bg-white dark:bg-[#1A2634] text-[#1E3A78] dark:text-amber-400 tabular-nums focus:outline-hidden focus:border-[#1E3A78]"
                    />
                    <span className="text-[11px] font-mono text-[#2C3E50]/65 dark:text-[#BDC3C7]">
                      days
                    </span>
                  </div>
                </div>
                <input
                  id="prep-days-slider"
                  type="range"
                  min={1}
                  max={90}
                  value={Math.min(90, practiceWindowDays)}
                  onChange={(e) => handleQuickExamDays(parseInt(e.target.value, 10))}
                  className="w-full accent-[#1E3A78] dark:accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#2C3E50]/55 dark:text-[#BDC3C7]/70">
                  <span>1 day</span>
                  <span>30 days</span>
                  <span>60 days</span>
                  <span>90 days</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#2C3E50] dark:text-[#F5F5DC]">
                    Days You Practice / Week
                  </span>
                  <span className="font-mono text-[11px] font-bold text-[#1E3A78] dark:text-amber-400 tabular-nums">
                    {estimator.activePracticeDays} active days total
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1.5 pt-0.5">
                  {[3, 4, 5, 6, 7].map((daysPerWk) => (
                    <button
                      key={daysPerWk}
                      type="button"
                      onClick={() => setPracticeDaysPerWeek(daysPerWk)}
                      className={`py-1.5 rounded-lg text-xs font-mono font-semibold border transition-colors cursor-pointer ${
                        practiceDaysPerWeek === daysPerWk
                          ? 'bg-[#1E3A78] text-[#F5F5DC] border-[#1E3A78] shadow-xs'
                          : 'bg-white dark:bg-[#1A2634] text-[#2C3E50] dark:text-[#BDC3C7] border-[#BDC3C7]/70 dark:border-[#2C3E50] hover:bg-[#EBE9DF] dark:hover:bg-[#243342]'
                      }`}
                    >
                      {daysPerWk}d
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-[#2C3E50]/65 dark:text-[#BDC3C7]">
                  Studying {practiceDaysPerWeek} days/wk over {practiceWindowDays} calendar days.
                </p>
              </div>
            </div>

            {/* Key Metric Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl bg-white dark:bg-[#1A2634] border border-[#BDC3C7]/60 dark:border-[#2C3E50]">
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#2C3E50]/65 dark:text-[#BDC3C7]">
                  <Clock className="w-3 h-3 text-[#1E3A78] dark:text-amber-400" />
                  <span>Total Prep Needed</span>
                </div>
                <div className="mt-1 text-lg font-extrabold font-mono text-[#1E3A78] dark:text-[#F5F5DC] tabular-nums">
                  {estimator.totalMinutes === 0 ? '0m' : `~${formatDuration(estimator.totalMinutes)}`}
                </div>
                <div className="text-[10px] text-[#2C3E50]/65 dark:text-[#BDC3C7]">
                  Adjusted for {experienceLevel}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-[#1A2634] border border-[#BDC3C7]/60 dark:border-[#2C3E50]">
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#2C3E50]/65 dark:text-[#BDC3C7]">
                  <Calendar className="w-3 h-3 text-[#5A1827] dark:text-rose-400" />
                  <span>Daily Practice Target</span>
                </div>
                <div className="mt-1 text-lg font-extrabold font-mono text-[#5A1827] dark:text-amber-400 tabular-nums">
                  {estimator.dailyMinutesNeeded === 0
                    ? 'Done'
                    : `~${formatDuration(estimator.dailyMinutesNeeded)}/day`}
                </div>
                <div className="text-[10px] text-[#2C3E50]/65 dark:text-[#BDC3C7] tabular-nums">
                  ~{formatDuration(estimator.weeklyMinutesNeeded)} / week
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-[#1A2634] border border-[#BDC3C7]/60 dark:border-[#2C3E50]">
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#2C3E50]/65 dark:text-[#BDC3C7]">
                  <Compass className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>At Selected Pace</span>
                </div>
                <div className="mt-1 text-lg font-extrabold font-mono text-[#2C3E50] dark:text-[#F5F5DC] tabular-nums">
                  {estimator.calendarDaysAtPace === 0
                    ? 'Ready'
                    : `~${estimator.calendarDaysAtPace} days`}
                </div>
                <div className="flex items-center justify-between gap-1 text-[10px] text-[#2C3E50]/65 dark:text-[#BDC3C7]">
                  <span>{estimator.paceCapacity}m/day pace</span>
                  {estimator.calendarDaysAtPace > 0 &&
                    estimator.calendarDaysAtPace !== practiceWindowDays && (
                      <button
                        type="button"
                        onClick={() => handleQuickExamDays(estimator.calendarDaysAtPace)}
                        className="text-[#1E3A78] dark:text-amber-400 font-semibold hover:underline cursor-pointer"
                      >
                        Match
                      </button>
                    )}
                </div>
              </div>
            </div>

            {/* Breakdown by Prep Activity */}
            <div className="space-y-2 pt-1 border-t border-[#BDC3C7]/40 dark:border-[#2C3E50]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-[#2C3E50] dark:text-[#F5F5DC]">
                  Remaining Workload Breakdown
                </span>
                {selectedBonusProjectIds.length > 0 && (
                  <label className="flex items-center gap-1.5 text-[11px] text-[#2C3E50]/80 dark:text-[#BDC3C7] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeBonusInEstimate}
                      onChange={(e) => setIncludeBonusInEstimate(e.target.checked)}
                      className="rounded border-[#BDC3C7] accent-[#1E3A78]"
                    />
                    <span>Include queued bonus projects ({selectedBonusProjectIds.length})</span>
                  </label>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/80 dark:bg-[#1A2634] border border-[#BDC3C7]/40 dark:border-[#2C3E50]">
                  <span className="flex items-center gap-1.5 text-[#2C3E50]/80 dark:text-[#BDC3C7]">
                    <BookOpen className="w-3.5 h-3.5 text-[#1E3A78] dark:text-blue-400" />
                    <span>Syllabus & Labs ({estimator.remainingLabs}/5 left)</span>
                  </span>
                  <span className="font-mono font-bold text-[#2C3E50] dark:text-[#F5F5DC] tabular-nums">
                    {formatDuration(estimator.labMinutes)}
                  </span>
                </div>

                <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/80 dark:bg-[#1A2634] border border-[#BDC3C7]/40 dark:border-[#2C3E50]">
                  <span className="flex items-center gap-1.5 text-[#2C3E50]/80 dark:text-[#BDC3C7]">
                    <Layers className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Flashcard Drills ({estimator.unmasteredCards} cards)</span>
                  </span>
                  <span className="font-mono font-bold text-[#2C3E50] dark:text-[#F5F5DC] tabular-nums">
                    {formatDuration(estimator.flashcardMinutes)}
                  </span>
                </div>

                <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/80 dark:bg-[#1A2634] border border-[#BDC3C7]/40 dark:border-[#2C3E50]">
                  <span className="flex items-center gap-1.5 text-[#2C3E50]/80 dark:text-[#BDC3C7]">
                    <Award className="w-3.5 h-3.5 text-[#5A1827] dark:text-rose-400" />
                    <span>Mock Exams ({estimator.remainingMocks} runs + review)</span>
                  </span>
                  <span className="font-mono font-bold text-[#2C3E50] dark:text-[#F5F5DC] tabular-nums">
                    {formatDuration(estimator.mockExamMinutes)}
                  </span>
                </div>

                {selectedBonusProjectIds.length > 0 && includeBonusInEstimate && (
                  <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/80 dark:bg-[#1A2634] border border-[#BDC3C7]/40 dark:border-[#2C3E50]">
                    <span className="flex items-center gap-1.5 text-[#2C3E50]/80 dark:text-[#BDC3C7]">
                      <Rocket className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Bonus Projects ({estimator.remainingBonusCount} left)</span>
                    </span>
                    <span className="font-mono font-bold text-[#2C3E50] dark:text-[#F5F5DC] tabular-nums">
                      {formatDuration(estimator.bonusMinutes)}
                    </span>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-[#2C3E50]/75 dark:text-[#BDC3C7] leading-relaxed">
                {estimator.outlook.summary}
              </p>
            </div>
          </div>

          {/* Section 3: Diagnostic Result Status */}
          <div className="p-4 rounded-xl border border-[#BDC3C7]/60 dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#141C24] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#2C3E50] dark:text-[#F5F5DC]">
                Diagnostic Readiness Assessment
              </span>
              {currentUser.diagnosticResult ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                  {currentUser.diagnosticResult.score} / {currentUser.diagnosticResult.total} Passed
                </span>
              ) : (
                <span className="text-[10px] font-mono text-[#2C3E50]/60 dark:text-[#BDC3C7]">
                  Not assessed yet
                </span>
              )}
            </div>

            <p className="text-xs text-[#2C3E50]/70 dark:text-[#BDC3C7]">
              {currentUser.diagnosticResult
                ? `Recommended Domain: Domain 0${currentUser.diagnosticResult.recommendedDomain} (${currentUser.diagnosticResult.recommendedLevel}).`
                : 'Take our 2-minute short readiness exam to pinpoint your exact knowledge level across PCEP-30-03 objectives.'}
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsAccountModalOpen(false);
                  setIsDiagnosticModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#1E3A78] dark:text-[#F5F5DC] bg-white dark:bg-[#1E2936] border border-[#BDC3C7] dark:border-[#2C3E50] hover:bg-[#FAF9F5] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>
                  {currentUser.diagnosticResult ? 'Retake Diagnostic Exam' : 'Launch Diagnostic Exam'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsAccountModalOpen(false);
                  setIsTourModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#2C3E50] dark:text-[#BDC3C7] hover:text-[#1E3A78] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Replay Site Tour</span>
              </button>
            </div>
          </div>

          {/* Section 4: Progress Stats & Danger Zone (Reset to 0%) */}
          <div className="pt-2 border-t border-[#BDC3C7]/40 dark:border-[#2C3E50] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C3E50]/70 dark:text-[#BDC3C7] font-mono">
              Progress & Data Controls
            </h3>

            <div className="flex items-center justify-between p-3 rounded-xl border border-[#BDC3C7]/50 dark:border-[#2C3E50] bg-white dark:bg-[#141C24] text-xs">
              <div>
                <span className="font-semibold text-[#2C3E50] dark:text-[#F5F5DC]">
                  Current Readiness: {readinessPercentage}%
                </span>
                <span className="text-[#2C3E50]/60 dark:text-[#BDC3C7] block text-[11px]">
                  {totalCompleted} lab tasks verified
                </span>
              </div>

              {!showResetConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  className="px-2.5 py-1 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900 transition-colors cursor-pointer"
                >
                  Reset Progress to 0%
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleConfirmReset}
                    className="px-2.5 py-1 text-xs font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer shadow-xs"
                  >
                    Confirm Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(false)}
                    className="px-2 py-1 text-xs text-[#2C3E50] dark:text-[#BDC3C7] hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#BDC3C7]/60 dark:border-[#2C3E50]">
            <button
              type="button"
              onClick={() => {
                logout();
                setIsAccountModalOpen(false);
              }}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => setIsAccountModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC] bg-[#EBE9DF] dark:bg-[#243342] hover:bg-[#DDD9CE] transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-semibold text-[#F5F5DC] bg-[#5A1827] hover:bg-[#48121E] dark:bg-[#6B1D2F] dark:hover:bg-[#541624] shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Process Account Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
