import React, { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import {
  Flame,
  Calendar,
  CheckCircle2,
  Circle,
  Award,
  Sparkles,
  ArrowRight,
  Code2,
  Layers,
  HelpCircle,
  Zap,
  TrendingUp,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export const DailyStreakTracker: React.FC = () => {
  const {
    currentStreak,
    longestStreak,
    hasPracticedToday,
    recordActivity,
    streakData,
    setActiveView,
  } = useProgress();

  const [checkinToast, setCheckinToast] = useState<string | null>(null);

  // Generate 7-day window (ending with Today)
  const today = new Date();
  const pastSevenDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - i));
    const isoDate = d.toISOString().split('T')[0];
    const isToday = i === 6;
    const isPracticed = streakData.activityHistory?.includes(isoDate);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();

    return {
      date: isoDate,
      dayName,
      dayNum,
      isToday,
      isPracticed,
    };
  });

  const handleManualCheckin = () => {
    if (!hasPracticedToday) {
      recordActivity('checkin');
      setCheckinToast('Daily streak logged! Great job practicing today.');
      setTimeout(() => setCheckinToast(null), 3000);
    }
  };

  // Streak Milestones
  const milestones = [
    { days: 3, label: '3-Day Novice', desc: 'Establish daily habit' },
    { days: 7, label: '7-Day Consistent', desc: '1 full week of Python' },
    { days: 14, label: '14-Day Resilient', desc: 'Halfway to PCEP mastery' },
    { days: 30, label: '30-Day Exam Ready', desc: 'Full syllabus retention' },
  ];

  const nextMilestone = milestones.find((m) => m.days > currentStreak) || milestones[milestones.length - 1];
  const progressToNext = Math.min(100, Math.round((currentStreak / nextMilestone.days) * 100));

  const todaysTasks = streakData.todaysTasksCompleted || {
    lab: false,
    flashcards: false,
    quiz: false,
  };

  return (
    <div className="rounded-2xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#1A2634] p-5 sm:p-7 shadow-xs space-y-6">
      {/* Header Row: Flame Badge, Current Count, Best Record */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#BDC3C7]/50 dark:border-[#2C3E50] pb-5">
        <div className="flex items-center gap-3.5">
          {/* Flame Icon Container with warm burgundy/amber treatment */}
          <div
            className={`w-13 h-13 rounded-2xl flex items-center justify-center shadow-xs transition-colors shrink-0 ${
              currentStreak > 0
                ? 'bg-[#5A1827] text-[#F5F5DC]'
                : 'bg-[#EBE9DF] dark:bg-[#243342] text-[#2C3E50]/60 dark:text-[#BDC3C7]'
            }`}
          >
            <Flame
              className={`w-7 h-7 ${
                currentStreak > 0 ? 'fill-amber-400 text-amber-400' : 'text-[#7F8C8D]'
              }`}
            />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-black text-[#2C3E50] dark:text-[#F5F5DC] tracking-tight">
                {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}
              </h3>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#5A1827] text-[#F5F5DC]">
                DAILY STREAK
              </span>
            </div>
            <p className="text-xs text-[#2C3E50]/80 dark:text-[#BDC3C7]">
              {hasPracticedToday ? (
                <span className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Streak active for today! Keep the momentum tomorrow.
                </span>
              ) : currentStreak > 0 ? (
                <span className="text-amber-800 dark:text-amber-400 font-semibold">
                  Practice today to maintain your {currentStreak}-day learning streak!
                </span>
              ) : (
                <span>Complete a lab, flashcard drill, or quiz today to start Day 1!</span>
              )}
            </p>
          </div>
        </div>

        {/* Longest Record & Quick Check-in Button */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-mono text-[#2C3E50]/60 dark:text-[#BDC3C7] uppercase font-bold block">
              Personal Best
            </span>
            <span className="font-mono text-sm font-bold text-[#1E3A78] dark:text-[#F5F5DC]">
              {longestStreak} {longestStreak === 1 ? 'Day' : 'Days'}
            </span>
          </div>

          <button
            onClick={handleManualCheckin}
            disabled={hasPracticedToday}
            className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:cursor-default ${
              hasPracticedToday
                ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                : 'bg-[#5A1827] hover:bg-[#48121E] text-[#F5F5DC]'
            }`}
          >
            {hasPracticedToday ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Today Completed</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Log Daily Practice</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {checkinToast && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{checkinToast}</span>
        </div>
      )}

      {/* 7-Day Habit Activity Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#2C3E50] dark:text-[#F5F5DC] flex items-center gap-1.5 font-mono">
            <Calendar className="w-3.5 h-3.5 text-[#1E3A78] dark:text-[#BDC3C7]" />
            <span>Past 7 Days Consistency:</span>
          </span>
          <span className="text-[11px] font-mono text-[#2C3E50]/70 dark:text-[#BDC3C7]">
            {streakData.activityHistory?.length || 0} total active days logged
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {pastSevenDays.map((day) => (
            <div
              key={day.date}
              className={`p-2.5 sm:p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-between gap-1.5 ${
                day.isToday
                  ? day.isPracticed
                    ? 'border-[#5A1827] dark:border-amber-400 bg-[#5A1827]/10 dark:bg-[#5A1827]/30 ring-1 ring-[#5A1827]'
                    : 'border-amber-400 bg-amber-50/70 dark:bg-amber-950/20 ring-1 ring-amber-400'
                  : day.isPracticed
                  ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300'
                  : 'border-[#BDC3C7]/60 dark:border-[#2C3E50] bg-white dark:bg-[#141C24] opacity-60'
              }`}
            >
              <span className="text-[10px] font-mono font-bold uppercase text-[#2C3E50]/70 dark:text-[#BDC3C7]">
                {day.dayName}
              </span>

              <div className="w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold">
                {day.isPracticed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                ) : day.isToday ? (
                  <Flame className="w-4 h-4 text-amber-500" />
                ) : (
                  <span className="text-[#2C3E50]/40 dark:text-[#BDC3C7]/40 text-[11px]">
                    {day.dayNum}
                  </span>
                )}
              </div>

              <span className="text-[9px] font-mono font-semibold">
                {day.isToday ? (day.isPracticed ? 'Done' : 'Today') : day.isPracticed ? 'Active' : 'Rest'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Section: Today's Practice Drills & Next Milestone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* Left: Today's Recommended Drills (Any 1 activates streak) */}
        <div className="p-4 rounded-xl border border-[#BDC3C7]/60 dark:border-[#2C3E50] bg-white dark:bg-[#141C24] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#2C3E50] dark:text-[#F5F5DC] flex items-center gap-1.5 font-mono">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Today's Practice Targets</span>
            </span>
            <span className="text-[10px] font-mono text-[#2C3E50]/60 dark:text-[#BDC3C7]">
              Any 1 logs your streak
            </span>
          </div>

          <div className="space-y-2">
            {/* Target 1: IDE Lab */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#FAF9F5] dark:bg-[#1A2634] border border-[#BDC3C7]/40 dark:border-[#2C3E50] text-xs">
              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    todaysTasks.lab
                      ? 'bg-emerald-500 text-white'
                      : 'border border-[#BDC3C7] dark:border-[#2C3E50] text-transparent'
                  }`}
                >
                  ✓
                </div>
                <span className="font-semibold text-[#2C3E50] dark:text-[#F5F5DC]">
                  Pass 1 IDE Lab Task
                </span>
              </div>
              <button
                onClick={() => setActiveView('workspace')}
                className="text-[11px] font-semibold text-[#1E3A78] dark:text-amber-400 hover:underline cursor-pointer"
              >
                {todaysTasks.lab ? 'Verified' : 'Open IDE →'}
              </button>
            </div>

            {/* Target 2: Flashcards */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#FAF9F5] dark:bg-[#1A2634] border border-[#BDC3C7]/40 dark:border-[#2C3E50] text-xs">
              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    todaysTasks.flashcards
                      ? 'bg-emerald-500 text-white'
                      : 'border border-[#BDC3C7] dark:border-[#2C3E50] text-transparent'
                  }`}
                >
                  ✓
                </div>
                <span className="font-semibold text-[#2C3E50] dark:text-[#F5F5DC]">
                  Review Flashcard Deck
                </span>
              </div>
              <button
                onClick={() => setActiveView('flashcards')}
                className="text-[11px] font-semibold text-[#1E3A78] dark:text-amber-400 hover:underline cursor-pointer"
              >
                {todaysTasks.flashcards ? 'Reviewed' : 'Study Cards →'}
              </button>
            </div>

            {/* Target 3: Quiz Drill */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#FAF9F5] dark:bg-[#1A2634] border border-[#BDC3C7]/40 dark:border-[#2C3E50] text-xs">
              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    todaysTasks.quiz
                      ? 'bg-emerald-500 text-white'
                      : 'border border-[#BDC3C7] dark:border-[#2C3E50] text-transparent'
                  }`}
                >
                  ✓
                </div>
                <span className="font-semibold text-[#2C3E50] dark:text-[#F5F5DC]">
                  Take 1 Section Quiz
                </span>
              </div>
              <button
                onClick={() => setActiveView('exam')}
                className="text-[11px] font-semibold text-[#1E3A78] dark:text-amber-400 hover:underline cursor-pointer"
              >
                {todaysTasks.quiz ? 'Recorded' : 'Take Quiz →'}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Next Habit Milestone & Unlocks */}
        <div className="p-4 rounded-xl border border-[#BDC3C7]/60 dark:border-[#2C3E50] bg-white dark:bg-[#141C24] space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#2C3E50] dark:text-[#F5F5DC] flex items-center gap-1.5 font-mono">
                <Award className="w-3.5 h-3.5 text-[#5A1827] dark:text-amber-400" />
                <span>Next Milestone: {nextMilestone.label}</span>
              </span>
              <span className="text-[11px] font-mono font-semibold text-[#1E3A78] dark:text-[#BDC3C7]">
                {currentStreak} / {nextMilestone.days} Days
              </span>
            </div>

            <p className="text-xs text-[#2C3E50]/70 dark:text-[#BDC3C7]">
              {nextMilestone.desc}. Consistent practice is proven to improve Python syntax retention by 3.4x for PCEP-30-03 exam questions.
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-[#EBE9DF] dark:bg-[#2C3E50] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#5A1827] h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressToNext}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-[#2C3E50]/70 dark:text-[#BDC3C7] pt-1 border-t border-[#BDC3C7]/40 dark:border-[#2C3E50]">
            <span>{Math.max(0, nextMilestone.days - currentStreak)} days to unlock badge</span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">
              {currentStreak >= nextMilestone.days ? 'Unlocked! 🏆' : 'In Progress'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
