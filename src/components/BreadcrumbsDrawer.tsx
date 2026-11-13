import React, { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { ProjectStep } from '../types';
import { Lightbulb, Code2, FileCode, Sparkles, Check, ChevronRight, Lock, Plus, AlertCircle, Copy } from 'lucide-react';

interface BreadcrumbsDrawerProps {
  step: ProjectStep;
  currentCode: string;
  isOpen: boolean;
  onClose: () => void;
}

export const BreadcrumbsDrawer: React.FC<BreadcrumbsDrawerProps> = ({
  step,
  currentCode,
  isOpen,
  onClose,
}) => {
  const { addCustomFlashcard, currentProject } = useProgress();

  // Tier unlocked states (Level 1 is always available, 2 and 3 can be progressively revealed)
  const [unlockedLevel, setUnlockedLevel] = useState<number>(1);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [copiedTier, setCopiedTier] = useState<number | null>(null);
  const [flashcardAdded, setFlashcardAdded] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopy = (text: string, tier: number) => {
    navigator.clipboard.writeText(text);
    setCopiedTier(tier);
    setTimeout(() => setCopiedTier(null), 2000);
  };

  const buildLocalStaticHint = (level: number) => {
    const codeLines = currentCode.trim().split('\n').filter((l) => l.trim() && !l.trim().startsWith('#')).length;
    if (level === 1) {
      return `Offline Static Mentor (Objective ${step.targetObjectiveId}):\n• Concept: ${step.breadcrumbs.level1Concept}\n• Your editor currently has ${codeLines} active line(s). Check that your logic matches the step specification before unlocking Level 2 syntax.`;
    }
    if (level === 2) {
      return `Offline Static Mentor (Objective ${step.targetObjectiveId}):\n• Target Syntax Pattern:\n${step.breadcrumbs.level2Syntax}\n• Compare your parameter names and indentation with the pattern above.`;
    }
    return `Offline Static Mentor (Objective ${step.targetObjectiveId}):\n• Structural Scaffold:\n${step.breadcrumbs.level3Scaffold}\n• Fill in the placeholders while preserving Python indentation and PCEP corner-case handling.`;
  };

  const handleAskAI = async (level: number) => {
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch('/api/ai/breadcrumb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: currentCode,
          objective: `Objective ${step.targetObjectiveId}`,
          stepDescription: step.taskInstruction,
          tierLevel: level,
          userQuestion: `I need a Level ${level} hint for ${step.title}`,
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        setAiHint(buildLocalStaticHint(level));
        return;
      }

      const data = await res.json();
      if (data.hint) {
        setAiHint(data.hint);
      } else {
        setAiHint(buildLocalStaticHint(level));
      }
    } catch {
      setAiHint(buildLocalStaticHint(level));
    } finally {
      setAiLoading(false);
    }
  };

  const handleConvertToFlashcard = () => {
    addCustomFlashcard({
      pcepSection: currentProject.sectionNumber,
      pcepObjective: step.targetObjectiveId,
      category: currentProject.sectionName,
      frontPrompt: `How do you implement: ${step.title}? (${step.taskInstruction})`,
      codeSnippet: step.breadcrumbs.level2Syntax,
      backAnswer: step.breadcrumbs.level1Concept,
      syntaxGotcha: step.breadcrumbs.level3Scaffold,
    });
    setFlashcardAdded(true);
    setTimeout(() => setFlashcardAdded(false), 3000);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-[#FAF9F5] dark:bg-[#1A2634] border-l border-[#BDC3C7] dark:border-[#2C3E50] shadow-2xl flex flex-col animate-in slide-in-from-right duration-250">
      {/* Header */}
      <div className="p-5 border-b border-[#BDC3C7]/80 dark:border-[#2C3E50] flex items-center justify-between bg-[#F5F5DC] dark:bg-[#151D26]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1E3A78]/15 dark:bg-[#1E3A78]/40 text-[#1E3A78] dark:text-[#F5F5DC] flex items-center justify-center border border-[#1E3A78]/30">
            <Lightbulb className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#1E3A78] dark:text-[#F5F5DC]">
              Code Breadcrumbs
            </h3>
            <p className="text-[11px] text-[#5D6D7E] dark:text-[#BDC3C7]">
              Objective {step.targetObjectiveId} · 3-Tier Progressive Guidance
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-xs px-2.5 py-1 text-[#2C3E50] dark:text-[#BDC3C7] hover:text-[#1E3A78] dark:hover:text-[#F5F5DC] rounded border border-[#BDC3C7] dark:border-[#2C3E50] hover:bg-[#FAF9F5] dark:hover:bg-[#243342] transition-colors"
        >
          Done
        </button>
      </div>

      {/* Task Summary Banner */}
      <div className="px-5 py-3.5 bg-[#1E3A78]/10 dark:bg-[#1E3A78]/25 border-b border-[#1E3A78]/20">
        <div className="text-[11px] font-mono text-[#1E3A78] dark:text-[#F5F5DC] font-semibold mb-1">
          STEP {step.stepNumber}: {step.title}
        </div>
        <p className="text-xs text-[#2C3E50] dark:text-[#BDC3C7] leading-relaxed">
          {step.taskInstruction}
        </p>
      </div>

      {/* Progressive Tier Cards */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Tier 1: Concept Primer */}
        <div className="rounded-xl border border-[#BDC3C7]/80 dark:border-[#2C3E50] bg-[#FFFFFF] dark:bg-[#243342] p-4 space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400">
              <span className="w-5 h-5 rounded-full bg-amber-500/15 flex items-center justify-center text-[11px] font-mono">
                1
              </span>
              <span>Level 1: Concept Primer</span>
            </div>
            <span className="text-[10px] text-[#7F8C8D] font-mono">Mental Model</span>
          </div>

          <p className="text-xs text-[#2C3E50] dark:text-[#BDC3C7] leading-relaxed">
            {step.breadcrumbs.level1Concept}
          </p>

          <div className="pt-2 flex items-center justify-between border-t border-[#BDC3C7]/40 dark:border-[#2C3E50]">
            <button
              onClick={() => handleCopy(step.breadcrumbs.level1Concept, 1)}
              className="text-[11px] text-[#5D6D7E] hover:text-[#1E3A78] dark:text-[#BDC3C7] dark:hover:text-[#F5F5DC] flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              {copiedTier === 1 ? 'Copied' : 'Copy Concept'}
            </button>

            {unlockedLevel < 2 && (
              <button
                onClick={() => setUnlockedLevel(2)}
                className="text-xs font-semibold text-[#1E3A78] dark:text-[#F5F5DC] hover:underline flex items-center gap-1"
              >
                <span>Unlock Level 2 Syntax</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Tier 2: Syntax Pattern */}
        {unlockedLevel >= 2 ? (
          <div className="rounded-xl border border-[#BDC3C7]/80 dark:border-[#2C3E50] bg-[#FFFFFF] dark:bg-[#243342] p-4 space-y-2.5 shadow-xs animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1E3A78] dark:text-[#F5F5DC]">
                <span className="w-5 h-5 rounded-full bg-[#1E3A78]/15 dark:bg-[#1E3A78]/40 flex items-center justify-center text-[11px] font-mono">
                  2
                </span>
                <span>Level 2: Syntax Pattern</span>
              </div>
              <span className="text-[10px] text-[#7F8C8D] font-mono">Parameter Signatures</span>
            </div>

            <pre className="p-3 rounded-lg bg-[#141C24] text-[#F5F5DC] font-mono text-xs overflow-x-auto border border-[#2C3E50]">
              <code>{step.breadcrumbs.level2Syntax}</code>
            </pre>

            <div className="pt-2 flex items-center justify-between border-t border-[#BDC3C7]/40 dark:border-[#2C3E50]">
              <button
                onClick={() => handleCopy(step.breadcrumbs.level2Syntax, 2)}
                className="text-[11px] text-[#5D6D7E] hover:text-[#1E3A78] dark:text-[#BDC3C7] dark:hover:text-[#F5F5DC] flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                {copiedTier === 2 ? 'Copied' : 'Copy Syntax'}
              </button>

              {unlockedLevel < 3 && (
                <button
                  onClick={() => setUnlockedLevel(3)}
                  className="text-xs font-semibold text-[#1E3A78] dark:text-[#F5F5DC] hover:underline flex items-center gap-1"
                >
                  <span>Unlock Level 3 Scaffold</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[#BDC3C7] dark:border-[#2C3E50] p-4 flex items-center justify-between text-xs text-[#7F8C8D]">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" />
              <span>Level 2: Syntax Pattern (Locked)</span>
            </div>
            <button
              onClick={() => setUnlockedLevel(2)}
              className="text-xs text-[#1E3A78] dark:text-[#F5F5DC] font-semibold hover:underline"
            >
              Reveal
            </button>
          </div>
        )}

        {/* Tier 3: Scaffold Skeleton */}
        {unlockedLevel >= 3 ? (
          <div className="rounded-xl border border-[#BDC3C7]/80 dark:border-[#2C3E50] bg-[#FFFFFF] dark:bg-[#243342] p-4 space-y-2.5 shadow-xs animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <span className="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center text-[11px] font-mono">
                  3
                </span>
                <span>Level 3: Structural Scaffold</span>
              </div>
              <span className="text-[10px] text-[#7F8C8D] font-mono">Fill-In Skeleton</span>
            </div>

            <pre className="p-3 rounded-lg bg-[#141C24] text-emerald-300 font-mono text-xs overflow-x-auto border border-[#2C3E50]">
              <code>{step.breadcrumbs.level3Scaffold}</code>
            </pre>

            <div className="pt-2 flex items-center justify-between border-t border-[#BDC3C7]/40 dark:border-[#2C3E50]">
              <button
                onClick={() => handleCopy(step.breadcrumbs.level3Scaffold, 3)}
                className="text-[11px] text-[#5D6D7E] hover:text-[#1E3A78] dark:text-[#BDC3C7] dark:hover:text-[#F5F5DC] flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                {copiedTier === 3 ? 'Copied' : 'Copy Scaffold'}
              </button>
              <span className="text-[11px] text-[#7F8C8D]">Paste and fill the blanks</span>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[#BDC3C7] dark:border-[#2C3E50] p-4 flex items-center justify-between text-xs text-[#7F8C8D]">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" />
              <span>Level 3: Structural Scaffold (Locked)</span>
            </div>
            <button
              onClick={() => setUnlockedLevel(3)}
              className="text-xs text-[#1E3A78] dark:text-[#F5F5DC] font-semibold hover:underline"
            >
              Reveal
            </button>
          </div>
        )}

        {/* Dynamic Gemini AI Expansion Box */}
        <div className="rounded-xl border border-purple-500/30 bg-purple-50/50 dark:bg-purple-950/20 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-800 dark:text-purple-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Dynamic Breadcrumb Expansion</span>
            </div>
            <span className="text-[10px] text-purple-700/80 dark:text-purple-300/80 font-mono">Gemini 3.8 Flash</span>
          </div>

          <p className="text-[11px] text-[#2C3E50]/80 dark:text-[#BDC3C7]">
            Inspect your current editor code and generate contextual guidance without spoiling the solution.
          </p>

          <button
            onClick={() => handleAskAI(unlockedLevel)}
            disabled={aiLoading}
            className="w-full py-2 px-3 text-xs font-semibold text-[#F5F5DC] bg-purple-700 hover:bg-purple-600 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{aiLoading ? 'Analyzing Code...' : 'Analyze My Code with Gemini'}</span>
          </button>

          {aiHint && (
            <div className="p-3 rounded-lg bg-[#FFFFFF] dark:bg-[#141C24] border border-purple-500/40 text-xs text-[#2C3E50] dark:text-[#F5F5DC] leading-relaxed space-y-1">
              <div className="font-semibold text-[11px] text-purple-700 dark:text-purple-300">
                AI Coach Insight:
              </div>
              <div className="whitespace-pre-wrap">{aiHint}</div>
            </div>
          )}

          {aiError && (
            <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-500/30 text-xs text-rose-700 dark:text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{aiError}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions: Spaced Repetition Conversion */}
      <div className="p-4 border-t border-[#BDC3C7]/80 dark:border-[#2C3E50] bg-[#F5F5DC] dark:bg-[#151D26]">
        <button
          onClick={handleConvertToFlashcard}
          disabled={flashcardAdded}
          className="w-full py-2 px-3 text-xs font-semibold text-[#F5F5DC] bg-[#1E3A78] hover:bg-[#152a57] border border-[#1E3A78] rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
        >
          {flashcardAdded ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300">Added to Leitner Deck!</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Convert this Concept into a Leitner Flashcard</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
