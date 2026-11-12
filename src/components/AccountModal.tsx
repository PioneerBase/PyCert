import React, { useState, useEffect } from 'react';
import { useProgress } from '../context/ProgressContext';
import { MICRO_PROJECTS } from '../data/pcepCurriculum';
import {
  X,
  User,
  Mail,
  GitBranch,
  Calendar,
  Compass,
  Award,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  HelpCircle,
  Clock,
  Save,
} from 'lucide-react';

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
  } = useProgress();

  const [name, setName] = useState<string>(currentUser.name || '');
  const [email, setEmail] = useState<string>(currentUser.email || '');
  const [githubHandle, setGithubHandle] = useState<string>(currentUser.githubHandle || '');
  const [startingDomain, setStartingDomain] = useState<number>(currentUser.startingDomain || 1);
  const [experienceLevel, setExperienceLevel] = useState<string>(
    currentUser.experienceLevel || 'Beginner'
  );
  const [targetExamDate, setTargetExamDate] = useState<string>(
    currentUser.targetExamDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  );
  const [studyPace, setStudyPace] = useState<'relaxed' | 'standard' | 'intensive'>(
    currentUser.studyPace || 'standard'
  );
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Sync state whenever modal opens or currentUser updates
  useEffect(() => {
    setName(currentUser.name || '');
    setEmail(currentUser.email || '');
    setGithubHandle(currentUser.githubHandle || '');
    setStartingDomain(currentUser.startingDomain || 1);
    setExperienceLevel(currentUser.experienceLevel || 'Beginner');
    setTargetExamDate(
      currentUser.targetExamDate ||
        new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
    );
    setStudyPace(currentUser.studyPace || 'standard');
  }, [currentUser, isAccountModalOpen]);

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
      role: `Domain 0${startingDomain} Candidate · ${experienceLevel}`,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsAccountModalOpen(false);
    }, 1200);
  };

  const handleQuickExamDays = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setTargetExamDate(d.toISOString().split('T')[0]);
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
                  Target Exam Date
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
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-[10px] text-[#2C3E50]/60 dark:text-[#BDC3C7]">Presets:</span>
                  <button
                    type="button"
                    onClick={() => handleQuickExamDays(14)}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-[#FAF9F5] dark:bg-[#243342] border border-[#BDC3C7]/60 dark:border-[#2C3E50] hover:bg-[#EBE9DF]"
                  >
                    14 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickExamDays(30)}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-[#FAF9F5] dark:bg-[#243342] border border-[#BDC3C7]/60 dark:border-[#2C3E50] hover:bg-[#EBE9DF]"
                  >
                    30 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickExamDays(60)}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-[#FAF9F5] dark:bg-[#243342] border border-[#BDC3C7]/60 dark:border-[#2C3E50] hover:bg-[#EBE9DF]"
                  >
                    60 Days
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC] mb-1">
                  Study Pace
                </label>
                <select
                  value={studyPace}
                  onChange={(e) => setStudyPace(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-white dark:bg-[#141C24] text-[#2C3E50] dark:text-[#F5F5DC] focus:outline-hidden focus:border-[#1E3A78]"
                >
                  <option value="relaxed">Relaxed (1 Lab / 2 Days)</option>
                  <option value="standard">Standard (1-2 Labs / Day)</option>
                  <option value="intensive">Intensive (Full Immersion)</option>
                </select>
              </div>
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
