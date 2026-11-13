import React, { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { PCEP_SECTIONS, MICRO_PROJECTS } from '../data/pcepCurriculum';
import { BookOpen, ChevronRight, Clock, Award, Terminal, ArrowRight, CheckCircle2, Sparkles, Filter } from 'lucide-react';

export const CurriculumView: React.FC = () => {
  const { selectProject, completedStepsMap } = useProgress();
  const [selectedSectionFilter, setSelectedSectionFilter] = useState<number | 'all'>('all');
  const [expandedSectionNumber, setExpandedSectionNumber] = useState<number | null>(null);

  const filteredProjects =
    selectedSectionFilter === 'all'
      ? MICRO_PROJECTS
      : MICRO_PROJECTS.filter((p) => p.sectionNumber === selectedSectionFilter);

  const totalObjectivesCount = PCEP_SECTIONS.reduce((acc, sec) => acc + sec.objectives.length, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Hero Banner with Syllabus Overview */}
      <div className="relative overflow-hidden rounded-2xl border border-[#BDC3C7]/60 dark:border-[#2C3E50] bg-gradient-to-br from-[#1E3A78] via-[#243342] to-[#1A2634] text-[#F5F5DC] p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#F5F5DC]/80">
            <span>Official Python Institute Syllabus</span>
            <span aria-hidden="true">·</span>
            <span>PCEP-30-03 & PCAD Aligned</span>
            <span aria-hidden="true">·</span>
            <span>36 Objectives Complete</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F5F5DC] text-balance">
            Project-First Python Learning & Recruiter-Ready Portfolio
          </h1>

          <p className="text-sm sm:text-base text-[#F5F5DC]/85 leading-relaxed max-w-2xl">
            Never memorize syntax in a vacuum. Master all 5 PCEP certification domains by building real micro-projects, receiving 3-tier progressive Code Breadcrumbs, and generating a verified GitHub portfolio.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-[#F5F5DC]">
            <div className="flex items-center gap-1.5 bg-[#F5F5DC]/10 border border-[#BDC3C7]/30 px-3 py-1.5 rounded-lg">
              <Award className="w-4 h-4 text-amber-400" />
              <span>5 Core Exam Domains (100% Weight)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#F5F5DC]/10 border border-[#BDC3C7]/30 px-3 py-1.5 rounded-lg">
              <Terminal className="w-4 h-4 text-[#F5F5DC]" />
              <span>In-Browser WebAssembly Python IDE</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#F5F5DC]/10 border border-[#BDC3C7]/30 px-3 py-1.5 rounded-lg">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>3-Tier Progressive Breadcrumb Hints</span>
            </div>
          </div>
        </div>

        {/* Subtle decorative grid background */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none bg-[radial-gradient(#F5F5DC_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* 5-Domain Exam Weight Summary Bar */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-[#1E3A78] dark:text-[#F5F5DC]">
              PCEP-30-03 Curriculum Architecture
            </h2>
            <p className="text-xs text-[#5D6D7E] dark:text-[#BDC3C7]">
              Exam syllabus weight distribution across 36 verified test items
            </p>
          </div>
          <div className="text-xs text-[#5D6D7E] dark:text-[#BDC3C7] font-mono">
            Passing Score: 70% · Total Questions: 30
          </div>
        </div>

        {/* Visual weight distribution track */}
        <div className="w-full h-3 rounded-full overflow-hidden flex bg-[#BDC3C7]/40 dark:bg-[#2C3E50]">
          <div className="bg-[#1E3A78] h-full" style={{ width: '17%' }} title="Section 01: 17%" />
          <div className="bg-[#2C3E50] h-full" style={{ width: '23%' }} title="Section 02: 23%" />
          <div className="bg-[#27AE60] h-full" style={{ width: '26%' }} title="Section 03: 26%" />
          <div className="bg-[#D35400] h-full" style={{ width: '20%' }} title="Section 04: 20%" />
          <div className="bg-[#C0392B] h-full" style={{ width: '14%' }} title="Section 05: 14%" />
        </div>

        {/* Section domain cards with objective expansion */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-1">
          {PCEP_SECTIONS.map((sec) => {
            const isExpanded = expandedSectionNumber === sec.sectionNumber;

            return (
              <div
                key={sec.sectionNumber}
                className="rounded-xl border border-[#BDC3C7]/80 dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#243342] p-4 space-y-2 hover:border-[#1E3A78] dark:hover:border-[#BDC3C7] transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-semibold text-[#1E3A78] dark:text-[#BDC3C7]">
                    SEC 0{sec.sectionNumber}
                  </span>
                  <span className="font-bold text-[#2C3E50] dark:text-[#F5F5DC] font-mono">
                    {sec.weightPercentage}%
                  </span>
                </div>

                <h3 className="font-semibold text-xs text-[#2C3E50] dark:text-[#F5F5DC] line-clamp-2">
                  {sec.shortTitle}
                </h3>

                <p className="text-[11px] text-[#5D6D7E] dark:text-[#BDC3C7]/80 leading-normal line-clamp-2">
                  {sec.description}
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-[#7F8C8D] dark:text-[#BDC3C7]/70">
                    {sec.objectives.length} Objectives
                  </span>
                  <button
                    onClick={() =>
                      setExpandedSectionNumber(isExpanded ? null : sec.sectionNumber)
                    }
                    className="text-[11px] text-[#1E3A78] dark:text-[#BDC3C7] hover:underline font-semibold"
                  >
                    {isExpanded ? 'Hide' : 'Details'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed objective drawer if a section is expanded */}
        {expandedSectionNumber !== null && (
          <div className="rounded-xl border border-[#1E3A78]/30 dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#1A2634] p-5 space-y-4 animate-in fade-in duration-200">
            {(() => {
              const sec = PCEP_SECTIONS.find((s) => s.sectionNumber === expandedSectionNumber);
              if (!sec) return null;
              return (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#1E3A78] dark:text-[#F5F5DC]">
                        Section 0{sec.sectionNumber}: {sec.title}
                      </h4>
                      <p className="text-xs text-[#5D6D7E] dark:text-[#BDC3C7]">
                        {sec.weightPercentage}% of the official PCEP-30-03 exam ({sec.itemCount} exam items)
                      </p>
                    </div>
                    <button
                      onClick={() => setExpandedSectionNumber(null)}
                      className="text-xs text-[#5D6D7E] hover:text-[#1E3A78] dark:hover:text-[#F5F5DC] font-medium"
                    >
                      Close Details
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                    {sec.objectives.map((obj) => (
                      <div
                        key={obj.id}
                        className="rounded-lg border border-[#BDC3C7]/60 dark:border-[#2C3E50] bg-[#FFFFFF] dark:bg-[#243342] p-3 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-[#1E3A78] dark:text-[#F5F5DC]">
                            Obj {obj.id}
                          </span>
                        </div>
                        <h5 className="font-semibold text-xs text-[#2C3E50] dark:text-[#F5F5DC]">
                          {obj.title}
                        </h5>
                        <p className="text-[11px] text-[#5D6D7E] dark:text-[#BDC3C7] leading-relaxed">
                          {obj.description}
                        </p>
                        <div className="flex flex-wrap gap-1 pt-1 text-[10px] text-[#5D6D7E] font-mono">
                          {obj.syllabusKeywords.map((kw) => (
                            <span key={kw} className="bg-[#FAF9F5] dark:bg-[#1A2634] px-1.5 py-0.5 rounded border border-[#BDC3C7]/40 dark:border-[#2C3E50]">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </section>

      {/* Filter Tabs for Micro-Projects */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#BDC3C7]/80 dark:border-[#2C3E50] pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#1E3A78] dark:text-[#F5F5DC]">
              Hands-On Domain Micro-Projects
            </h2>
            <p className="text-xs text-[#5D6D7E] dark:text-[#BDC3C7]">
              Select a project to write code in the dual-pane IDE with real-time Code Breadcrumbs
            </p>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#FAF9F5] dark:bg-[#1A2634] border border-[#BDC3C7]/60 dark:border-[#2C3E50] rounded-lg overflow-x-auto">
            <button
              onClick={() => setSelectedSectionFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                selectedSectionFilter === 'all'
                  ? 'bg-[#1E3A78] text-[#F5F5DC] shadow-sm font-semibold'
                  : 'text-[#2C3E50] dark:text-[#BDC3C7] hover:text-[#1E3A78] dark:hover:text-[#F5F5DC]'
              }`}
            >
              All Sections
            </button>
            {[1, 2, 3, 4, 5].map((secNum) => (
              <button
                key={secNum}
                onClick={() => setSelectedSectionFilter(secNum)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  selectedSectionFilter === secNum
                    ? 'bg-[#1E3A78] text-[#F5F5DC] shadow-sm font-semibold'
                    : 'text-[#2C3E50] dark:text-[#BDC3C7] hover:text-[#1E3A78] dark:hover:text-[#F5F5DC]'
                }`}
              >
                Sec 0{secNum}
              </button>
            ))}
          </div>
        </div>

        {/* Micro-Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const projDoneSteps = completedStepsMap[project.id] || [];
            const completedCount = project.steps.filter((s) => projDoneSteps.includes(s.stepNumber)).length;
            const isFullyComplete = completedCount === project.steps.length;

            return (
              <div
                key={project.id}
                className="group flex flex-col justify-between rounded-xl border border-[#BDC3C7]/80 dark:border-[#2C3E50] bg-[#FFFFFF] dark:bg-[#243342] p-6 hover:border-[#1E3A78] dark:hover:border-[#BDC3C7] transition-all hover:shadow-md"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-[#5D6D7E] dark:text-[#BDC3C7]/80">
                    <span className="font-mono text-[#1E3A78] dark:text-[#BDC3C7] font-semibold">
                      Section 0{project.sectionNumber} ({project.examWeightPercentage}%)
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-[#7F8C8D]" />
                      {project.estimatedMinutes}m
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-bold text-base text-[#2C3E50] dark:text-[#F5F5DC] group-hover:text-[#1E3A78] dark:group-hover:text-[#F5F5DC] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-[#5D6D7E] dark:text-[#BDC3C7]/85 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  {/* Objective Tags */}
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] font-semibold text-[#2C3E50] dark:text-[#F5F5DC]">
                      Syllabus Objectives Tested:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {project.specificObjectives.map((objId) => (
                        <span
                          key={objId}
                          className="font-mono text-[11px] text-[#1E3A78] dark:text-[#BDC3C7] bg-[#FAF9F5] dark:bg-[#1A2634] border border-[#BDC3C7]/50 dark:border-[#2C3E50] px-2 py-0.5 rounded"
                        >
                          Obj {objId}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Learning Outcomes */}
                  <div className="space-y-1 pt-1 text-[11px] text-[#5D6D7E] dark:text-[#BDC3C7]/80">
                    {project.learningOutcomes.slice(0, 2).map((lo, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <span className="text-[#1E3A78] dark:text-[#F5F5DC]">✓</span>
                        <span className="line-clamp-1">{lo}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-[#BDC3C7]/60 dark:border-[#2C3E50]/80 mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-[#7F8C8D] dark:text-[#BDC3C7]/70">
                    <span>{project.steps.length} Milestones</span>
                  </div>

                  <button
                    onClick={() => selectProject(project.id)}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#F5F5DC] bg-[#1E3A78] hover:bg-[#152a57] rounded-lg transition-colors shadow-sm border border-[#1E3A78]"
                  >
                    <span>Launch in IDE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
