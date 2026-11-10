import React, { useState, useEffect } from 'react';
import { useProgress } from '../context/ProgressContext';
import { PRACTICE_EXAM_QUESTIONS, PCEP_SECTIONS } from '../data/pcepCurriculum';
import { CheckCircle2, XCircle, RotateCcw, Clock, ChevronRight } from 'lucide-react';

export const ExamSimulator: React.FC = () => {
  const { recordQuizResult } = useProgress();

  const [selectedSection, setSelectedSection] = useState<number | 'all'>('all');
  const [examStarted, setExamStarted] = useState<boolean>(false);
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(45 * 60);

  const questions =
    selectedSection === 'all'
      ? PRACTICE_EXAM_QUESTIONS
      : PRACTICE_EXAM_QUESTIONS.filter((q) => q.pcepSection === selectedSection);

  // Timer countdown
  useEffect(() => {
    let timer: any;
    if (examStarted && !examSubmitted && timeRemainingSeconds > 0) {
      timer = setInterval(() => {
        setTimeRemainingSeconds((prev) => {
          if (prev <= 1) {
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examStarted, examSubmitted, timeRemainingSeconds]);

  const handleStartExam = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setTimeRemainingSeconds(selectedSection === 'all' ? 45 * 60 : 15 * 60);
    setExamSubmitted(false);
    setExamStarted(true);
  };

  const handleSelectOption = (optionIndex: number) => {
    if (examSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  const handleSubmitExam = () => {
    setExamSubmitted(true);
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        score++;
      }
    });
    recordQuizResult(selectedSection, score, questions.length);
  };

  const totalCorrect = questions.reduce((acc, q, idx) => {
    return acc + (selectedAnswers[idx] === q.correctIndex ? 1 : 0);
  }, 0);
  const scorePercent = Math.round((totalCorrect / questions.length) * 100);
  const isPassing = scorePercent >= 70;

  const currentQ = questions[currentQuestionIndex];

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#1E3A78] dark:text-[#BDC3C7] font-semibold mb-1">
          <span>Python Institute PCEP-30-03 Simulator</span>
          <span>·</span>
          <span>70% Passing Threshold</span>
        </div>
        <h1 className="text-2xl font-bold text-[#2C3E50] dark:text-[#F5F5DC]">
          Certification Practice Exam
        </h1>
        <p className="text-xs text-[#2C3E50]/70 dark:text-[#BDC3C7]">
          Timed single-choice and code-tracing exam questions matching the real exam weighting
        </p>
      </div>

      {!examStarted ? (
        /* Exam Configuration & Start Screen */
        <div className="p-8 rounded-2xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#243342] shadow-xs space-y-6">
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-[#2C3E50] dark:text-[#F5F5DC]">
              Configure Practice Session
            </h2>
            <p className="text-xs text-[#2C3E50]/70 dark:text-[#BDC3C7]">
              Select whether you want a full 5-domain diagnostic exam or focused practice on a single section.
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC]">
              Exam Scope:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedSection('all')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedSection === 'all'
                    ? 'border-[#1E3A78] bg-[#1E3A78]/10 dark:bg-[#1E3A78]/30 dark:border-[#BDC3C7] shadow-xs'
                    : 'border-[#BDC3C7]/80 dark:border-[#2C3E50] bg-white/70 dark:bg-[#1A2634] hover:border-[#1E3A78]/60'
                }`}
              >
                <div className="font-bold text-xs text-[#2C3E50] dark:text-[#F5F5DC]">
                  Full Diagnostic Simulation (All 5 Domains)
                </div>
                <div className="text-[11px] text-[#2C3E50]/70 dark:text-[#BDC3C7] mt-1">
                  Covers all sections with official weight distribution · 45 mins
                </div>
              </button>

              {[1, 2, 3, 4, 5].map((sNum) => {
                const sec = PCEP_SECTIONS.find((s) => s.sectionNumber === sNum);
                return (
                  <button
                    key={sNum}
                    onClick={() => setSelectedSection(sNum as any)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedSection === sNum
                        ? 'border-[#1E3A78] bg-[#1E3A78]/10 dark:bg-[#1E3A78]/30 dark:border-[#BDC3C7] shadow-xs'
                        : 'border-[#BDC3C7]/80 dark:border-[#2C3E50] bg-white/70 dark:bg-[#1A2634] hover:border-[#1E3A78]/60'
                    }`}
                  >
                    <div className="font-bold text-xs text-[#2C3E50] dark:text-[#F5F5DC]">
                      Section 0{sNum}: {sec?.shortTitle}
                    </div>
                    <div className="text-[11px] text-[#2C3E50]/70 dark:text-[#BDC3C7] mt-1">
                      {sec?.weightPercentage}% Exam Weight · Targeted questions
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[#BDC3C7]/60 dark:border-[#2C3E50] flex items-center justify-between">
            <div className="text-xs text-[#2C3E50]/70 dark:text-[#BDC3C7] font-mono">
              Ready with {questions.length} questions
            </div>

            <button
              onClick={handleStartExam}
              className="px-6 py-2.5 text-xs font-semibold text-[#F5F5DC] bg-[#1E3A78] hover:bg-[#162C5C] rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Begin Exam</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : !examSubmitted ? (
        /* Active Exam View */
        <div className="space-y-6">
          {/* Top Timer & Progress Bar */}
          <div className="p-4 rounded-xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#243342] shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-[#2C3E50]/70 dark:text-[#BDC3C7]">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span>·</span>
              <span className="text-xs font-mono text-[#1E3A78] dark:text-[#F5F5DC] font-semibold">
                Obj {currentQ?.pcepObjective} (Sec 0{currentQ?.pcepSection})
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-[#2C3E50] dark:text-[#F5F5DC]">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>{formatTimer(timeRemainingSeconds)}</span>
              </div>

              <button
                onClick={handleSubmitExam}
                className="px-3 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-900/50 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
              >
                Submit Exam
              </button>
            </div>
          </div>

          {/* Question Navigator Dots */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {questions.map((_, idx) => {
              const isAnswered = selectedAnswers[idx] !== undefined;
              const isCurrent = idx === currentQuestionIndex;

              return (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-[#1E3A78] text-[#F5F5DC] ring-2 ring-[#1E3A78]/50'
                      : isAnswered
                      ? 'bg-[#2C3E50] text-[#F5F5DC] border border-[#BDC3C7]/40'
                      : 'bg-[#FAF9F5] dark:bg-[#243342] text-[#2C3E50]/70 dark:text-[#BDC3C7] border border-[#BDC3C7] dark:border-[#2C3E50]'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Question Card */}
          {currentQ && (
            <div className="p-6 sm:p-8 rounded-2xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#243342] shadow-xs space-y-6">
              <div className="space-y-3">
                <h2 className="text-base sm:text-lg font-bold text-[#2C3E50] dark:text-[#F5F5DC] leading-relaxed">
                  {currentQ.question}
                </h2>

                {currentQ.codeSnippet && (
                  <pre className="p-4 rounded-xl bg-[#141C24] text-[#F5F5DC] font-mono text-xs overflow-x-auto border border-[#2C3E50] leading-relaxed">
                    <code>{currentQ.codeSnippet}</code>
                  </pre>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((option, optIdx) => {
                  const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-4 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-[#1E3A78] bg-[#1E3A78]/15 dark:bg-[#1E3A78]/35 text-[#1E3A78] dark:text-[#F5F5DC] font-semibold shadow-xs'
                          : 'border-[#BDC3C7]/80 dark:border-[#2C3E50] bg-white/70 dark:bg-[#1A2634]/70 text-[#2C3E50] dark:text-[#BDC3C7] hover:border-[#1E3A78]/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-full border border-[#BDC3C7] flex items-center justify-center font-mono text-[11px] shrink-0 text-[#2C3E50] dark:text-[#BDC3C7]">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Question Footer Navigation */}
              <div className="pt-4 border-t border-[#BDC3C7]/60 dark:border-[#2C3E50] flex items-center justify-between">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                  className="px-3 py-1.5 text-xs text-[#2C3E50]/70 dark:text-[#BDC3C7] hover:text-[#2C3E50] dark:hover:text-[#F5F5DC] disabled:opacity-30 cursor-pointer"
                >
                  Previous
                </button>

                {currentQuestionIndex + 1 < questions.length ? (
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    className="px-4 py-2 text-xs font-semibold text-[#F5F5DC] bg-[#1E3A78] hover:bg-[#162C5C] rounded-lg shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitExam}
                    className="px-4 py-2 text-xs font-semibold text-[#F5F5DC] bg-emerald-700 hover:bg-emerald-600 rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    Finish & View Score
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Results & Diagnostics Breakdown Screen */
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Score Header Card */}
          <div className="p-8 rounded-2xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#243342] shadow-xs text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-white dark:bg-[#1A2634] border border-[#BDC3C7] dark:border-[#2C3E50]">
              {isPassing ? (
                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <XCircle className="w-10 h-10 text-amber-600 dark:text-amber-400" />
              )}
            </div>

            <div className="space-y-1">
              <div className="text-3xl font-extrabold text-[#2C3E50] dark:text-[#F5F5DC] font-mono">
                {scorePercent}%
              </div>
              <div className="text-sm font-semibold">
                {isPassing ? (
                  <span className="text-emerald-700 dark:text-emerald-400">
                    PASSED — Above the 70% Python Institute Threshold
                  </span>
                ) : (
                  <span className="text-amber-700 dark:text-amber-400">
                    NOT YET PASSING — Review weak domains below
                  </span>
                )}
              </div>
              <p className="text-xs text-[#2C3E50]/70 dark:text-[#BDC3C7]">
                You answered {totalCorrect} out of {questions.length} questions correctly.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={handleStartExam}
                className="px-4 py-2 text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC] bg-[#E5E5D8] dark:bg-[#1A2634] hover:bg-[#DCDCCF] dark:hover:bg-[#1E2936] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border border-[#BDC3C7] dark:border-[#2C3E50]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Exam</span>
              </button>
            </div>
          </div>

          {/* Detailed Question Explanations */}
          <div className="space-y-4">
            <h3 className="font-bold text-base text-[#2C3E50] dark:text-[#F5F5DC]">
              Syllabus Objectives Question Review
            </h3>

            {questions.map((q, idx) => {
              const userAns = selectedAnswers[idx];
              const isCorrect = userAns === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-xl border ${
                    isCorrect
                      ? 'border-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-950/20'
                      : 'border-rose-500/30 bg-rose-50/30 dark:bg-rose-950/20'
                  } space-y-3`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#2C3E50] dark:text-[#F5F5DC]">
                        Question {idx + 1}
                      </span>
                      <span>·</span>
                      <span className="font-mono text-[#1E3A78] dark:text-[#BDC3C7]">
                        Objective {q.pcepObjective} (Section 0{q.pcepSection})
                      </span>
                    </div>

                    <div className="flex items-center gap-1 font-semibold text-xs">
                      {isCorrect ? (
                        <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                        </span>
                      ) : (
                        <span className="text-rose-700 dark:text-rose-400 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Incorrect
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC]">
                    {q.question}
                  </p>

                  {q.codeSnippet && (
                    <pre className="p-3 rounded-lg bg-[#141C24] text-[#F5F5DC] font-mono text-xs overflow-x-auto border border-[#2C3E50]">
                      <code>{q.codeSnippet}</code>
                    </pre>
                  )}

                  <div className="text-xs space-y-1">
                    <div className="text-[#2C3E50]/70 dark:text-[#BDC3C7]">
                      <span className="font-semibold text-[#2C3E50] dark:text-[#F5F5DC]">Your Answer: </span>
                      <span className={isCorrect ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400 font-semibold'}>
                        {userAns !== undefined ? q.options[userAns] : 'None selected'}
                      </span>
                    </div>

                    {!isCorrect && (
                      <div className="text-emerald-700 dark:text-emerald-400">
                        <span className="font-semibold">Correct Answer: </span>
                        <span>{q.options[q.correctIndex]}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-3 rounded-lg bg-[#FAF9F5] dark:bg-[#1A2634] border border-[#BDC3C7] dark:border-[#2C3E50] text-xs text-[#2C3E50] dark:text-[#BDC3C7] leading-relaxed">
                    <span className="font-bold text-[#2C3E50] dark:text-[#F5F5DC]">Explanation: </span>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
