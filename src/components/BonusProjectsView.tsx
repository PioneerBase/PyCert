import React, { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { BONUS_PROJECTS } from '../data/bonusProjects';
import { BonusProject } from '../types';
import {
  CheckCircle2,
  Code2,
  Bookmark,
  BookmarkCheck,
  Clock,
  ArrowRight,
  Layers,
} from 'lucide-react';

type TierFilter = 'all' | 'Easy' | 'Intermediate' | 'Advanced' | 'selected';

const TIER_META: Array<{
  tier: 'Easy' | 'Intermediate' | 'Advanced';
  heading: string;
  subtitle: string;
}> = [
  {
    tier: 'Easy',
    heading: 'Easy Projects',
    subtitle:
      'Foundational Python builds covering digital clocks, binary & unit conversions, Tkinter calculator architecture, and local JSON storage.',
  },
  {
    tier: 'Intermediate',
    heading: 'Intermediate Projects',
    subtitle:
      'Applied Python projects including the relocated CLI Cipher (formerly Lab 6), JSON weather dashboards, and stateful text-based games.',
  },
  {
    tier: 'Advanced',
    heading: 'Advanced Projects',
    subtitle:
      'Portfolio-grade engineering: astronomy sundial trigonometry, blog API & webhook integrations, e-commerce checkout backends, and consumer decision algorithms.',
  },
];

export const BonusProjectsView: React.FC = () => {
  const {
    selectProject,
    completedStepsMap,
    selectedBonusProjectIds,
    toggleBonusProjectSelection,
  } = useProgress();

  const [tierFilter, setTierFilter] = useState<TierFilter>('all');

  const selectedProjects = BONUS_PROJECTS.filter((p) =>
    selectedBonusProjectIds.includes(p.id)
  );

  const totalBonusCompleted = BONUS_PROJECTS.filter((p) => {
    const done = completedStepsMap[p.id]?.length || 0;
    return done >= p.steps.length;
  }).length;

  const getTierProjects = (tier: 'Easy' | 'Intermediate' | 'Advanced') => {
    return BONUS_PROJECTS.filter((p) => p.tier === tier);
  };

  const renderProjectCard = (project: BonusProject) => {
    const doneSteps = completedStepsMap[project.id]?.length || 0;
    const totalSteps = project.steps.length;
    const isComplete = doneSteps >= totalSteps && totalSteps > 0;
    const isSelected = selectedBonusProjectIds.includes(project.id);

    return (
      <article
        key={project.id}
        className={`rounded-2xl border p-5 sm:p-6 flex flex-col justify-between gap-5 transition-colors shadow-xs ${
          isSelected
            ? 'border-[#1E3A78] dark:border-amber-400/70 bg-white dark:bg-[#1E2936]'
            : 'border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#243342]'
        }`}
      >
        <div className="space-y-3.5">
          {/* Unboxed typographic metadata line */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#5D6D7E] dark:text-[#BDC3C7] tabular-nums">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-[#1E3A78] dark:text-sky-300">
                Project {project.bonusNumber < 10 ? `0${project.bonusNumber}` : project.bonusNumber}
              </span>
              <span aria-hidden="true">·</span>
              <span>{project.tier}</span>
              {project.movedFromLab && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#5A1827] dark:text-amber-300 font-semibold">
                    From {project.movedFromLab}
                  </span>
                </>
              )}
            </div>

            <span className="inline-flex items-center gap-1 shrink-0">
              <Clock className="w-3.5 h-3.5" />
              <span>{project.estimatedMinutes}m</span>
            </span>
          </div>

          {/* Title & Description */}
          <div className="space-y-1.5">
            <h3 className="text-base sm:text-lg font-bold text-[#2C3E50] dark:text-[#F5F5DC] leading-snug">
              {project.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#2C3E50]/85 dark:text-[#BDC3C7] leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Key Build Outcomes */}
          <ul className="space-y-1.5 pt-1 text-xs text-[#2C3E50]/85 dark:text-[#BDC3C7]">
            {project.learningOutcomes.slice(0, 3).map((outcome, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                  ✓
                </span>
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom Progress & Actions */}
        <div className="pt-4 border-t border-[#BDC3C7]/60 dark:border-[#2C3E50] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 font-mono text-xs tabular-nums">
            {isComplete ? (
              <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{doneSteps}/{totalSteps} Passed</span>
              </span>
            ) : (
              <span className="text-[#5D6D7E] dark:text-[#BDC3C7] font-semibold">
                {doneSteps}/{totalSteps} Steps
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => toggleBonusProjectSelection(project.id)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 border ${
                isSelected
                  ? 'bg-[#5A1827] text-[#F5F5DC] border-[#5A1827] hover:bg-[#48121E]'
                  : 'bg-white dark:bg-[#1A2634] text-[#2C3E50] dark:text-[#F5F5DC] border-[#BDC3C7] dark:border-[#2C3E50] hover:border-[#1E3A78]'
              }`}
              title={
                isSelected
                  ? 'Remove from your selected bonus projects'
                  : 'Select this bonus project to work on'
              }
            >
              {isSelected ? (
                <BookmarkCheck className="w-3.5 h-3.5" />
              ) : (
                <Bookmark className="w-3.5 h-3.5" />
              )}
              <span>{isSelected ? 'Selected' : 'Select'}</span>
            </button>

            <button
              type="button"
              onClick={() => selectProject(project.id)}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[#F5F5DC] bg-[#1E3A78] hover:bg-[#162C5C] shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{doneSteps > 0 ? 'Resume' : 'Start Build'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </article>
    );
  };

  const visibleTiers =
    tierFilter === 'all'
      ? TIER_META
      : tierFilter === 'selected'
      ? []
      : TIER_META.filter((t) => t.tier === tierFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-150">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#BDC3C7]/70 dark:border-[#2C3E50] pb-6">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-mono text-[#1E3A78] dark:text-amber-300 font-semibold">
            <span>Portfolio Expansion Tracks</span>
            <span aria-hidden="true">·</span>
            <span>Easy, Intermediate &amp; Advanced</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{BONUS_PROJECTS.length} Hands-On Builds</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2C3E50] dark:text-[#F5F5DC] tracking-tight text-balance">
            Bonus Portfolio Projects
          </h1>
          <p className="text-xs sm:text-sm text-[#2C3E50]/85 dark:text-[#BDC3C7] leading-relaxed">
            Pick bonus projects to build outside the 5 core PCEP syllabus labs—including the CLI Cipher relocated from Lab 6. Select projects to queue them up, then code and verify each step inside the interactive Python notebook.
          </p>
        </div>

        {/* Summary Counts */}
        <div className="flex items-center gap-4 shrink-0 font-mono text-xs tabular-nums">
          <div className="px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] dark:bg-[#1A2634] border border-[#BDC3C7] dark:border-[#2C3E50]">
            <div className="text-[11px] text-[#5D6D7E] dark:text-[#BDC3C7]">Selected</div>
            <div className="text-base font-bold text-[#1E3A78] dark:text-amber-300">
              {selectedBonusProjectIds.length} / {BONUS_PROJECTS.length}
            </div>
          </div>
          <div className="px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] dark:bg-[#1A2634] border border-[#BDC3C7] dark:border-[#2C3E50]">
            <div className="text-[11px] text-[#5D6D7E] dark:text-[#BDC3C7]">Completed</div>
            <div className="text-base font-bold text-emerald-700 dark:text-emerald-400">
              {totalBonusCompleted} / {BONUS_PROJECTS.length}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Tier Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#FAF9F5] dark:bg-[#141C24] border border-[#BDC3C7]/80 dark:border-[#2C3E50] overflow-x-auto">
          {(
            [
              { id: 'all', label: `All Projects (${BONUS_PROJECTS.length})` },
              { id: 'Easy', label: `Easy (${getTierProjects('Easy').length})` },
              { id: 'Intermediate', label: `Intermediate (${getTierProjects('Intermediate').length})` },
              { id: 'Advanced', label: `Advanced (${getTierProjects('Advanced').length})` },
              { id: 'selected', label: `My Selected (${selectedBonusProjectIds.length})` },
            ] as Array<{ id: TierFilter; label: string }>
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTierFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer tabular-nums ${
                tierFilter === tab.id
                  ? 'bg-[#1E3A78] text-[#F5F5DC] shadow-xs'
                  : 'text-[#2C3E50]/80 dark:text-[#BDC3C7] hover:text-[#1E3A78] dark:hover:text-[#F5F5DC]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-[#5D6D7E] dark:text-[#BDC3C7]">
          Every project runs live in your Jupyter-style Python notebook
        </span>
      </div>

      {/* Selected Projects Queue (visible on 'all' when user selected >=1, or when viewing 'selected') */}
      {(tierFilter === 'selected' || (tierFilter === 'all' && selectedProjects.length > 0)) && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#BDC3C7]/60 dark:border-[#2C3E50] pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#5A1827] dark:text-amber-300" />
              <h2 className="text-lg font-bold text-[#2C3E50] dark:text-[#F5F5DC]">
                Your Selected Projects Queue
              </h2>
            </div>
            <span className="text-xs font-mono text-[#5D6D7E] dark:text-[#BDC3C7] tabular-nums">
              {selectedProjects.length} active
            </span>
          </div>

          {selectedProjects.length === 0 ? (
            <div className="p-8 rounded-2xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#243342] text-center space-y-2">
              <p className="text-sm font-semibold text-[#2C3E50] dark:text-[#F5F5DC]">
                No bonus projects selected yet
              </p>
              <p className="text-xs text-[#5D6D7E] dark:text-[#BDC3C7]">
                Click &ldquo;Select&rdquo; on any Easy, Intermediate, or Advanced project below to pin it to your build queue, or click &ldquo;Start Build&rdquo; directly.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {selectedProjects.map(renderProjectCard)}
            </div>
          )}
        </section>
      )}

      {/* 3 Difficulty Sections: Easy, Intermediate, Advanced */}
      <div className="space-y-10">
        {visibleTiers.map(({ tier, heading, subtitle }) => {
          const tierProjects = getTierProjects(tier);
          return (
            <section key={tier} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#BDC3C7]/60 dark:border-[#2C3E50] pb-3">
                <div className="space-y-1">
                  <h2 className="text-xl font-extrabold text-[#2C3E50] dark:text-[#F5F5DC] tracking-tight">
                    {heading}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#2C3E50]/80 dark:text-[#BDC3C7] max-w-3xl">
                    {subtitle}
                  </p>
                </div>
                <span className="text-xs font-mono font-semibold text-[#1E3A78] dark:text-sky-300 tabular-nums shrink-0">
                  {tierProjects.length} Projects
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {tierProjects.map(renderProjectCard)}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
