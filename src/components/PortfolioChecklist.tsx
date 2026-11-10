import React, { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { GitReadmeModal } from './GitReadmeModal';
import {
  CheckCircle2,
  Circle,
  GitBranch,
  FileText,
  ShieldCheck,
  Briefcase,
  RotateCcw,
} from 'lucide-react';

export const PortfolioChecklist: React.FC = () => {
  const { checklistItems, toggleChecklistItem, resetChecklist } = useProgress();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isReadmeModalOpen, setIsReadmeModalOpen] = useState<boolean>(false);

  const categories = [
    'All',
    'Repository Setup',
    'Documentation (README)',
    'Deployment & Security',
    'Showcase & Resume',
  ];

  const totalCount = checklistItems.length;
  const completedCount = checklistItems.filter((i) => i.checked).length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  const filteredItems =
    selectedCategory === 'All'
      ? checklistItems
      : checklistItems.filter((item) => item.category === selectedCategory);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Repository Setup':
        return <GitBranch className="w-4 h-4 text-[#1E3A78] dark:text-[#BDC3C7]" />;
      case 'Documentation (README)':
        return <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'Deployment & Security':
        return <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'Showcase & Resume':
        return <Briefcase className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-[#1E3A78] dark:text-[#BDC3C7]" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#1E3A78] dark:text-[#BDC3C7] font-semibold mb-1">
            <span>Career Portfolio Engine</span>
            <span>·</span>
            <span>Recruiter Readiness Audit</span>
          </div>
          <h1 className="text-2xl font-bold text-[#2C3E50] dark:text-[#F5F5DC]">
            Portfolio Repository Readiness Checklist
          </h1>
          <p className="text-xs text-[#2C3E50]/70 dark:text-[#BDC3C7]">
            Audit your project against top engineering hiring benchmarks before linking on resumes and LinkedIn
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsReadmeModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-[#F5F5DC] bg-[#1E3A78] hover:bg-[#162C5C] rounded-lg shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate README.md</span>
          </button>
        </div>
      </div>

      {/* Progress Metric Card */}
      <div className="p-6 rounded-2xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#243342] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-[#2C3E50]/70 dark:text-[#BDC3C7]">
              Audit Completion
            </span>
            <div className="text-2xl font-extrabold text-[#2C3E50] dark:text-[#F5F5DC] font-mono">
              {percentage}% Complete
            </div>
          </div>

          <div className="text-right space-y-0.5">
            <span className="text-xs text-[#2C3E50]/70 dark:text-[#BDC3C7] font-mono">
              {completedCount} of {totalCount} Items Checked
            </span>
            <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              {percentage === 100
                ? 'Ready for Recruiters!'
                : `${totalCount - completedCount} items remaining`}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2.5 rounded-full bg-[#E5E5D8] dark:bg-[#1A2634] overflow-hidden">
          <div
            className="h-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#EBE9DF] dark:bg-[#1A2634] rounded-lg overflow-x-auto text-xs border border-[#BDC3C7]/60 dark:border-[#2C3E50]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === cat
                ? 'bg-white dark:bg-[#243342] text-[#2C3E50] dark:text-[#F5F5DC] shadow-xs font-semibold border border-[#BDC3C7]/40 dark:border-[#2C3E50]'
                : 'text-[#2C3E50]/70 dark:text-[#BDC3C7] hover:text-[#2C3E50] dark:hover:text-[#F5F5DC]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Checklist Items List */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleChecklistItem(item.id)}
            className={`cursor-pointer p-4 rounded-xl border transition-all flex items-start gap-3.5 select-none ${
              item.checked
                ? 'border-emerald-600/30 bg-emerald-50/30 dark:bg-emerald-950/20'
                : 'border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#243342] hover:border-[#1E3A78]/60 dark:hover:border-[#BDC3C7]/50'
            }`}
          >
            <div className="pt-0.5 shrink-0">
              {item.checked ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 fill-emerald-600/10" />
              ) : (
                <Circle className="w-5 h-5 text-[#BDC3C7] dark:text-[#BDC3C7]/60" />
              )}
            </div>

            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <span
                  className={`text-sm font-semibold ${
                    item.checked
                      ? 'text-[#2C3E50]/60 dark:text-[#BDC3C7]/60 line-through'
                      : 'text-[#2C3E50] dark:text-[#F5F5DC]'
                  }`}
                >
                  {item.label}
                </span>

                <div className="flex items-center gap-1 text-[11px] font-mono text-[#2C3E50]/60 dark:text-[#BDC3C7]">
                  {getCategoryIcon(item.category)}
                  <span className="hidden sm:inline">{item.category}</span>
                </div>
              </div>

              {item.sublines && item.sublines.length > 0 && (
                <div className="text-xs text-[#2C3E50]/70 dark:text-[#BDC3C7] leading-relaxed">
                  {item.sublines.map((sub, i) => (
                    <p key={i}>{sub}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Utility Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-[#BDC3C7]/60 dark:border-[#2C3E50] text-xs text-[#2C3E50]/70 dark:text-[#BDC3C7]">
        <button
          onClick={resetChecklist}
          className="flex items-center gap-1 text-[#2C3E50]/70 dark:text-[#BDC3C7] hover:text-[#2C3E50] dark:hover:text-[#F5F5DC] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Checklist</span>
        </button>

        <span className="font-mono text-[11px]">
          Standard: PEP 8 · Git Flow · PCEP-30-03
        </span>
      </div>

      {/* Recruiter README Modal */}
      <GitReadmeModal
        isOpen={isReadmeModalOpen}
        onClose={() => setIsReadmeModalOpen(false)}
      />
    </div>
  );
};
