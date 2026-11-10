import React, { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { Flashcard } from '../types';
import { Layers, RotateCw, Check, X, Plus, Calendar, Sparkles, Filter, AlertCircle, BookOpen } from 'lucide-react';

export const FlashcardsView: React.FC = () => {
  const { flashcards, reviewFlashcard, addCustomFlashcard } = useProgress();

  const [activeBoxFilter, setActiveBoxFilter] = useState<number | 'all'>('all');
  const [activeSectionFilter, setActiveSectionFilter] = useState<number | 'all'>('all');
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New card modal form state
  const [newPrompt, setNewPrompt] = useState<string>('');
  const [newAnswer, setNewAnswer] = useState<string>('');
  const [newCode, setNewCode] = useState<string>('');
  const [newGotcha, setNewGotcha] = useState<string>('');
  const [newSection, setNewSection] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [newObjective, setNewObjective] = useState<string>('1.4');

  const todayStr = new Date().toISOString().split('T')[0];

  // Filtering cards
  const filteredCards = flashcards.filter((card) => {
    if (activeBoxFilter !== 'all' && card.boxLevel !== activeBoxFilter) return false;
    if (activeSectionFilter !== 'all' && card.pcepSection !== activeSectionFilter) return false;
    return true;
  });

  const currentCard: Flashcard | undefined = filteredCards[currentCardIndex];

  // Leitner box counts
  const boxCounts = [1, 2, 3, 4, 5].map(
    (b) => flashcards.filter((c) => c.boxLevel === b).length
  );

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1 < filteredCards.length ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev > 0 ? prev - 1 : filteredCards.length - 1));
  };

  const handleGrade = (gotRight: boolean) => {
    if (!currentCard) return;
    reviewFlashcard(currentCard.id, gotRight);
    setIsFlipped(false);
    // Advance to next card
    if (currentCardIndex + 1 < filteredCards.length) {
      setCurrentCardIndex((prev) => prev + 1);
    } else {
      setCurrentCardIndex(0);
    }
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrompt.trim() || !newAnswer.trim()) return;

    addCustomFlashcard({
      pcepSection: newSection,
      pcepObjective: newObjective,
      category: `Section 0${newSection}`,
      frontPrompt: newPrompt,
      codeSnippet: newCode.trim() || undefined,
      backAnswer: newAnswer,
      syntaxGotcha: newGotcha.trim() || undefined,
    });

    // Reset form
    setNewPrompt('');
    setNewAnswer('');
    setNewCode('');
    setNewGotcha('');
    setShowAddModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-700 dark:text-amber-400 font-semibold mb-1">
            <span>Leitner Spaced-Repetition Engine</span>
            <span>·</span>
            <span>5 Interval Boxes</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1E3A78] dark:text-[#F5F5DC]">
            PCEP Syntax & Concept Flashcards
          </h1>
          <p className="text-xs text-[#5D6D7E] dark:text-[#BDC3C7]">
            Retain Python operator precedence, slicing rules, and scope nuances via graduated interval recall
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 text-xs font-semibold text-[#F5F5DC] bg-[#1E3A78] hover:bg-[#152a57] border border-[#1E3A78] rounded-lg shadow-sm transition-colors flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom Card</span>
        </button>
      </div>

      {/* Leitner Box Progress Track */}
      <div className="p-4 rounded-xl border border-[#BDC3C7]/80 dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#243342] shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC]">
          <span>Leitner Memory Distribution</span>
          <span className="text-[#5D6D7E] dark:text-[#BDC3C7] font-mono text-[11px]">
            {flashcards.length} Total Cards
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {[
            { box: 1, label: 'Box 1: 1 Day', desc: 'Daily Review' },
            { box: 2, label: 'Box 2: 3 Days', desc: 'Bi-Weekly' },
            { box: 3, label: 'Box 3: 7 Days', desc: 'Weekly' },
            { box: 4, label: 'Box 4: 14 Days', desc: 'Fortnightly' },
            { box: 5, label: 'Box 5: 30 Days', desc: 'Mastery' },
          ].map((item, idx) => {
            const count = boxCounts[idx];
            const isFilterActive = activeBoxFilter === item.box;

            return (
              <button
                key={item.box}
                onClick={() =>
                  setActiveBoxFilter(isFilterActive ? 'all' : item.box)
                }
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  isFilterActive
                    ? 'border-[#1E3A78] bg-[#1E3A78]/15 dark:border-[#BDC3C7] dark:bg-[#1E3A78]/40'
                    : 'border-[#BDC3C7]/60 dark:border-[#2C3E50] hover:border-[#1E3A78] dark:hover:border-[#BDC3C7]'
                }`}
              >
                <div className="text-[11px] font-mono font-bold text-[#1E3A78] dark:text-[#F5F5DC]">
                  {count} Cards
                </div>
                <div className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold truncate">
                  {item.label}
                </div>
                <div className="text-[9px] text-[#7F8C8D] dark:text-[#BDC3C7]/70 truncate">
                  {item.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
        <span className="text-[#5D6D7E] dark:text-[#BDC3C7] font-mono pr-1">Domain:</span>
        <button
          onClick={() => setActiveSectionFilter('all')}
          className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap ${
            activeSectionFilter === 'all'
              ? 'bg-[#1E3A78] text-[#F5F5DC] font-semibold'
              : 'bg-[#FAF9F5] dark:bg-[#1A2634] text-[#2C3E50] dark:text-[#BDC3C7] border border-[#BDC3C7]/50 dark:border-[#2C3E50]'
          }`}
        >
          All Domains
        </button>
        {[1, 2, 3, 4, 5].map((secNum) => (
          <button
            key={secNum}
            onClick={() => setActiveSectionFilter(secNum)}
            className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap ${
              activeSectionFilter === secNum
                ? 'bg-[#1E3A78] text-[#F5F5DC] font-semibold'
                : 'bg-[#FAF9F5] dark:bg-[#1A2634] text-[#2C3E50] dark:text-[#BDC3C7] border border-[#BDC3C7]/50 dark:border-[#2C3E50]'
            }`}
          >
            Section 0{secNum}
          </button>
        ))}
      </div>

      {/* Interactive 3D Flip Flashcard */}
      {currentCard ? (
        <div className="space-y-4">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer min-h-[300px] rounded-2xl border border-[#BDC3C7]/80 dark:border-[#2C3E50] bg-[#FFFFFF] dark:bg-[#243342] p-8 shadow-sm flex flex-col justify-between hover:border-[#1E3A78] dark:hover:border-[#BDC3C7] transition-all select-none relative group"
          >
            {/* Top metadata */}
            <div className="flex items-center justify-between text-xs text-[#5D6D7E] dark:text-[#BDC3C7]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[#1E3A78] dark:text-[#F5F5DC] font-semibold">
                  Section 0{currentCard.pcepSection} · Obj {currentCard.pcepObjective}
                </span>
                <span>·</span>
                <span>{currentCard.category}</span>
              </div>

              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold">
                  Box {currentCard.boxLevel} ({currentCard.intervalDays}d)
                </span>
                <span>
                  Card {currentCardIndex + 1} of {filteredCards.length}
                </span>
              </div>
            </div>

            {/* Content Body (Front vs Back) */}
            <div className="py-6 space-y-4 text-center my-auto">
              {!isFlipped ? (
                /* FRONT */
                <div className="space-y-4">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#7F8C8D]">
                    Prompt / Question
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#2C3E50] dark:text-[#F5F5DC] max-w-xl mx-auto leading-snug">
                    {currentCard.frontPrompt}
                  </h2>
                  {currentCard.codeSnippet && (
                    <div className="pt-2 max-w-md mx-auto">
                      <pre className="p-3.5 rounded-lg bg-[#141C24] text-[#F5F5DC] font-mono text-xs text-left border border-[#2C3E50] overflow-x-auto">
                        <code>{currentCard.codeSnippet}</code>
                      </pre>
                    </div>
                  )}
                  <div className="pt-4 text-xs text-[#7F8C8D] flex items-center justify-center gap-1.5">
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Click card to reveal answer</span>
                  </div>
                </div>
              ) : (
                /* BACK */
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
                    Verified Answer
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-[#2C3E50] dark:text-[#F5F5DC] max-w-xl mx-auto">
                    {currentCard.backAnswer}
                  </div>

                  {currentCard.syntaxGotcha && (
                    <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 max-w-lg mx-auto text-left text-xs text-amber-950 dark:text-amber-200 space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Syllabus Gotcha / Nuance:</span>
                      </div>
                      <p className="leading-relaxed">{currentCard.syntaxGotcha}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom hint */}
            <div className="text-center text-[11px] text-[#7F8C8D] font-mono">
              Times Reviewed: {currentCard.timesReviewed} · Accuracy:{' '}
              {currentCard.timesReviewed > 0
                ? `${Math.round((currentCard.timesCorrect / currentCard.timesReviewed) * 100)}%`
                : 'New'}
            </div>
          </div>

          {/* Grading & Navigation Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="px-3 py-1.5 text-xs text-[#2C3E50] dark:text-[#BDC3C7] hover:text-[#1E3A78] dark:hover:text-[#F5F5DC] rounded-lg border border-[#BDC3C7] dark:border-[#2C3E50]"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                className="px-3 py-1.5 text-xs text-[#2C3E50] dark:text-[#BDC3C7] hover:text-[#1E3A78] dark:hover:text-[#F5F5DC] rounded-lg border border-[#BDC3C7] dark:border-[#2C3E50]"
              >
                Next
              </button>
            </div>

            {/* Leitner Grading Buttons */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => handleGrade(false)}
                className="flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900/60 hover:bg-rose-100 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <X className="w-4 h-4" />
                <span>Needs Review (Demote to Box 1)</span>
              </button>

              <button
                onClick={() => handleGrade(true)}
                className="flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-900/60 hover:bg-emerald-100 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Got It Right (Promote Box)</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl border border-dashed border-[#BDC3C7] dark:border-[#2C3E50] text-[#5D6D7E] space-y-2">
          <BookOpen className="w-8 h-8 mx-auto text-[#BDC3C7]" />
          <p className="font-semibold text-sm">No flashcards found for current filter.</p>
          <button
            onClick={() => {
              setActiveBoxFilter('all');
              setActiveSectionFilter('all');
            }}
            className="text-xs text-[#1E3A78] dark:text-[#BDC3C7] underline"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Add Custom Flashcard Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#FAF9F5] dark:bg-[#1A2634] rounded-2xl border border-[#BDC3C7] dark:border-[#2C3E50] p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#BDC3C7]/80 dark:border-[#2C3E50] pb-3">
              <h3 className="font-bold text-base text-[#1E3A78] dark:text-[#F5F5DC]">
                Add Custom Syntax Flashcard
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#7F8C8D] hover:text-[#2C3E50] dark:hover:text-[#F5F5DC]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCard} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#2C3E50] dark:text-[#BDC3C7] font-semibold mb-1">
                    PCEP Section
                  </label>
                  <select
                    value={newSection}
                    onChange={(e) => setNewSection(parseInt(e.target.value, 10) as any)}
                    className="w-full p-2 rounded-lg border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FFFFFF] dark:bg-[#243342] text-[#2C3E50] dark:text-[#F5F5DC]"
                  >
                    <option value={1}>Section 01: Fundamentals & I/O</option>
                    <option value={2}>Section 02: Control Flow & Loops</option>
                    <option value={3}>Section 03: Collections & Strings</option>
                    <option value={4}>Section 04: Functions & Exceptions</option>
                    <option value={5}>Section 05: Files & Modules</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#2C3E50] dark:text-[#BDC3C7] font-semibold mb-1">
                    Objective (e.g. 1.4, 3.2)
                  </label>
                  <input
                    type="text"
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    className="w-full p-2 rounded-lg border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FFFFFF] dark:bg-[#243342] text-[#2C3E50] dark:text-[#F5F5DC]"
                    placeholder="1.4"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#2C3E50] dark:text-[#BDC3C7] font-semibold mb-1">
                  Front Prompt / Question *
                </label>
                <input
                  type="text"
                  required
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  className="w-full p-2 rounded-lg border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FFFFFF] dark:bg-[#243342] text-[#2C3E50] dark:text-[#F5F5DC]"
                  placeholder="e.g. What does 'abc'.split(',') return if there are no commas?"
                />
              </div>

              <div>
                <label className="block text-[#2C3E50] dark:text-[#BDC3C7] font-semibold mb-1">
                  Optional Code Snippet
                </label>
                <textarea
                  rows={2}
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full p-2 font-mono rounded-lg border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#141C24] text-[#F5F5DC] resize-none"
                  placeholder="s = 'abc'\nprint(s.split(','))"
                />
              </div>

              <div>
                <label className="block text-[#2C3E50] dark:text-[#BDC3C7] font-semibold mb-1">
                  Back Answer *
                </label>
                <input
                  type="text"
                  required
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  className="w-full p-2 rounded-lg border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FFFFFF] dark:bg-[#243342] text-[#2C3E50] dark:text-[#F5F5DC]"
                  placeholder="['abc'] - a list with the single original string"
                />
              </div>

              <div>
                <label className="block text-[#2C3E50] dark:text-[#BDC3C7] font-semibold mb-1">
                  Optional Gotcha / Rule Explanation
                </label>
                <input
                  type="text"
                  value={newGotcha}
                  onChange={(e) => setNewGotcha(e.target.value)}
                  className="w-full p-2 rounded-lg border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FFFFFF] dark:bg-[#243342] text-[#2C3E50] dark:text-[#F5F5DC]"
                  placeholder="split() never raises ValueError if delimiter is not found"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-[#5D6D7E] hover:text-[#2C3E50] dark:hover:text-[#F5F5DC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-[#F5F5DC] bg-[#1E3A78] hover:bg-[#152a57] border border-[#1E3A78] rounded-lg shadow-sm"
                >
                  Save Flashcard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
