import React, { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { MICRO_PROJECTS } from '../data/pcepCurriculum';
import {
  X,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Compass,
  Award,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface DiagnosticQuestion {
  domain: number;
  domainName: string;
  level: string;
  question: string;
  code?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    domain: 1,
    domainName: 'Computer Programming & Fundamentals',
    level: 'Absolute Beginner',
    question: 'What is the evaluated output and resulting data type of this expression in Python 3?',
    code: 'result = 11 // 4',
    options: [
      '2.75 (type float)',
      '2 (type int)',
      '3 (type int)',
      '2.0 (type float)',
    ],
    correctIndex: 1,
    explanation:
      'Integer floor division (`//`) truncates any fractional portion toward negative infinity and yields an integer when both operands are integers (11 // 4 evaluates to 2). Regular division (`/`) would yield float 2.75.',
  },
  {
    domain: 2,
    domainName: 'Control Flow: Decisions & Loops',
    level: 'Elementary',
    question: 'What gets printed to the console when the following code block executes?',
    code: `counter = 3
while counter > 0:
    counter -= 1
    if counter == 1:
        break
else:
    print("Loop Completed")`,
    options: [
      'Loop Completed',
      'Nothing is printed',
      '1 followed by Loop Completed',
      'IndentationError is raised',
    ],
    correctIndex: 1,
    explanation:
      'In Python, the `else` clause attached to a `while` or `for` loop executes ONLY if the loop finishes naturally without encountering a `break` statement. Because `break` triggered when counter reached 1, the `else` suite was skipped entirely.',
  },
  {
    domain: 3,
    domainName: 'Data Collections: Lists, Tuples & Slices',
    level: 'Intermediate',
    question: 'What does the slice expression return for the given list?',
    code: `sample = [10, 20, 30, 40, 50]
print(sample[3:1:-1])`,
    options: [
      '[40, 30]',
      '[40, 30, 20]',
      '[30, 20]',
      '[50, 40, 30]',
    ],
    correctIndex: 0,
    explanation:
      'With a negative step `-1`, slicing proceeds from right to left. It starts at start-index 3 (value 40) and steps backwards until stop-index 1 (value 20, non-inclusive). Therefore, the resulting slice is [40, 30].',
  },
  {
    domain: 4,
    domainName: 'Functions, Scopes & Namespaces',
    level: 'Upper-Intermediate',
    question: 'What happens when invoking `update_val()` in the following snippet?',
    code: `rate = 1.05

def update_val():
    print(rate)
    rate = 1.10

update_val()`,
    options: [
      'Prints 1.05, then creates a local variable rate with 1.10',
      'Raises UnboundLocalError at the print statement',
      'Permanently updates the global variable rate to 1.10',
      'Prints None without error',
    ],
    correctIndex: 1,
    explanation:
      'Because `rate = 1.10` appears anywhere inside `update_val()`, Python marks `rate` as a local variable for the entire scope of that function. Attempting to read `rate` before assigning it locally triggers `UnboundLocalError: local variable rate referenced before assignment`.',
  },
  {
    domain: 5,
    domainName: 'File Handling & Context Managers',
    level: 'Advanced / Capstone',
    question: 'Which syntax guarantees the file stream descriptor is closed even if an unexpected exception occurs?',
    code: `# Option A: with open('log.txt', 'r') as stream:
# Option B: try stream = open('log.txt')
# Option C: stream = open('log.txt', autoflush=True)
# Option D: using open('log.txt') as stream:`,
    options: [
      "with open('log.txt', 'r') as stream:",
      "try stream = open('log.txt')",
      "stream = open('log.txt', autoflush=True)",
      "using open('log.txt') as stream:",
    ],
    correctIndex: 0,
    explanation:
      'The Python `with` statement leverages context managers conforming to the `__enter__` and `__exit__` protocols. It guarantees that `stream.close()` is invoked automatically upon exiting the block, even if an unhandled exception or return occurs.',
  },
];

export const DiagnosticExamModal: React.FC = () => {
  const {
    isDiagnosticModalOpen,
    setIsDiagnosticModalOpen,
    updateUserProfile,
    selectProject,
    setActiveView,
    currentUser,
  } = useProgress();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [answersState, setAnswersState] = useState<Record<number, boolean>>({});
  const [isFinished, setIsFinished] = useState<boolean>(false);

  if (!isDiagnosticModalOpen) return null;

  const currentQ = DIAGNOSTIC_QUESTIONS[currentIndex];
  const totalQuestions = DIAGNOSTIC_QUESTIONS.length;

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    const isCorrect = selectedOption === currentQ.correctIndex;
    setAnswersState((prev) => ({
      ...prev,
      [currentIndex]: isCorrect,
    }));
    setIsAnswerSubmitted(true);
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsFinished(true);
    }
  };

  const calculateScore = () => {
    return Object.values(answersState).filter(Boolean).length;
  };

  const getRecommendation = (score: number) => {
    if (score <= 1) {
      return {
        domain: 1,
        name: 'Domain 1: Fundamentals & Console I/O',
        level: 'Absolute Beginner',
        reason:
          'Build strong foundational instincts in Python syntax, integer vs float math, literals, and variables.',
      };
    }
    if (score === 2) {
      return {
        domain: 2,
        name: 'Domain 2: Control Flow: Decisions & Loops',
        level: 'Elementary',
        reason:
          'Sharpen your understanding of loop else branches, conditionals, sentinel counters, and logical expressions.',
      };
    }
    if (score === 3) {
      return {
        domain: 3,
        name: 'Domain 3: Data Collections: Lists, Tuples & Slicing',
        level: 'Intermediate',
        reason:
          'Deep-dive into negative stride slicing, immutable tuples, dictionaries, and list algorithm mutations.',
      };
    }
    if (score === 4) {
      return {
        domain: 4,
        name: 'Domain 4: Functions, Scopes & Exceptions',
        level: 'Upper-Intermediate',
        reason:
          'Master local vs global variable shadowing, namespace resolution, and formal parameter patterns.',
      };
    }
    return {
      domain: 5,
      name: 'Domain 5: File Handling, Context Managers & Capstone',
      level: 'Advanced / Capstone',
      reason:
        'You have exceptional PCEP fundamentals! Jump straight into file streams, CSV parsing, and capstone repository engineering.',
    };
  };

  const score = calculateScore();
  const recommendation = getRecommendation(score);

  const handleApplyRecommendation = () => {
    // Save diagnostic result to user profile
    updateUserProfile({
      startingDomain: recommendation.domain,
      experienceLevel: recommendation.level,
      role: `Domain 0${recommendation.domain} Candidate · ${recommendation.level}`,
      diagnosticResult: {
        score,
        total: totalQuestions,
        recommendedDomain: recommendation.domain,
        recommendedLevel: recommendation.level,
        completedAt: new Date().toISOString(),
      },
    });

    // Auto-select corresponding micro-project
    const targetProj =
      MICRO_PROJECTS.find((p) => p.sectionNumber === recommendation.domain) ||
      MICRO_PROJECTS[0];
    selectProject(targetProj.id);
    setActiveView('workspace');
    setIsDiagnosticModalOpen(false);
  };

  const handleRetake = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setAnswersState({});
    setIsFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#141C24]/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-2xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-white dark:bg-[#1A2634] shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#BDC3C7]/60 dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#141C24]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#5A1827] text-[#F5F5DC] flex items-center justify-center font-bold text-sm shadow-xs font-mono">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#2C3E50] dark:text-[#F5F5DC] tracking-tight">
                Quick Readiness Diagnostic
              </h2>
              <span className="text-[10px] font-mono text-[#5A1827] dark:text-amber-400 font-semibold uppercase">
                5-Question PCEP-30-03 Placement Check
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsDiagnosticModalOpen(false)}
            className="p-1.5 rounded-lg text-[#2C3E50]/60 dark:text-[#BDC3C7] hover:text-[#2C3E50] dark:hover:text-[#F5F5DC] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            title="Close diagnostic"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        {!isFinished ? (
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[75vh]">
            {/* Step Indicator & Domain Badge */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#1E3A78] dark:text-[#F5F5DC]">
                Question {currentIndex + 1} of {totalQuestions}
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase bg-[#EBE9DF] dark:bg-[#243342] text-[#2C3E50] dark:text-[#BDC3C7] border border-[#BDC3C7]/50 dark:border-[#2C3E50]">
                {currentQ.domainName}
              </span>
            </div>

            {/* Question Text */}
            <div className="space-y-3">
              <h3 className="text-sm sm:text-base font-semibold text-[#2C3E50] dark:text-[#F5F5DC] leading-snug">
                {currentQ.question}
              </h3>

              {currentQ.code && (
                <pre className="p-3.5 rounded-xl bg-[#141C24] text-slate-100 font-mono text-xs overflow-x-auto border border-[#2C3E50] shadow-inner leading-relaxed">
                  <code>{currentQ.code}</code>
                </pre>
              )}
            </div>

            {/* Option Choices */}
            <div className="space-y-2">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctIndex;

                let optionStyles =
                  'border-[#BDC3C7]/70 dark:border-[#2C3E50] bg-white dark:bg-[#141C24] hover:border-[#1E3A78] text-[#2C3E50] dark:text-[#F5F5DC]';

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    optionStyles =
                      'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-500';
                  } else if (isSelected) {
                    optionStyles =
                      'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 ring-1 ring-red-500';
                  } else {
                    optionStyles =
                      'border-[#BDC3C7]/40 dark:border-[#2C3E50]/60 opacity-50 bg-white dark:bg-[#141C24]';
                  }
                } else if (isSelected) {
                  optionStyles =
                    'border-[#1E3A78] dark:border-[#BDC3C7] bg-[#1E3A78]/10 dark:bg-[#1E3A78]/30 text-[#1E3A78] dark:text-[#F5F5DC] ring-1 ring-[#1E3A78]';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswerSubmitted}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-sans flex items-center justify-between transition-all cursor-pointer ${optionStyles}`}
                  >
                    <span className="font-medium pr-2">{option}</span>
                    <span className="font-mono text-xs opacity-75 shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Educational Feedback Panel when submitted */}
            {isAnswerSubmitted && (
              <div
                className={`p-4 rounded-xl border text-xs leading-relaxed animate-in fade-in duration-200 ${
                  selectedOption === currentQ.correctIndex
                    ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300'
                    : 'border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-300'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  {selectedOption === currentQ.correctIndex ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Correct Concept!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span>Syllabus Insight:</span>
                    </>
                  )}
                </div>
                <p className="font-sans text-xs">{currentQ.explanation}</p>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              {!isAnswerSubmitted ? (
                <button
                  type="button"
                  onClick={handleCheckAnswer}
                  disabled={selectedOption === null}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#F5F5DC] bg-[#1E3A78] hover:bg-[#162C5C] shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  Verify Answer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#F5F5DC] bg-[#5A1827] hover:bg-[#48121E] shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{currentIndex < totalQuestions - 1 ? 'Next Question' : 'View Placement Result'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Finished Result View */
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#2C3E50] dark:text-[#F5F5DC] tracking-tight">
                Diagnostic Complete!
              </h3>
              <p className="text-xs text-[#2C3E50]/70 dark:text-[#BDC3C7]">
                You scored <strong className="font-bold text-[#1E3A78] dark:text-[#F5F5DC]">{score} out of {totalQuestions}</strong> ({Math.round((score / totalQuestions) * 100)}%).
              </p>
            </div>

            {/* Recommendation Box */}
            <div className="p-5 rounded-2xl border border-[#1E3A78]/30 dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#141C24] space-y-3 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#5A1827] text-[#F5F5DC]">
                  RECOMMENDED STARTING POINT
                </span>
                <span className="text-xs font-mono font-semibold text-[#1E3A78] dark:text-[#BDC3C7]">
                  {recommendation.level}
                </span>
              </div>

              <h4 className="text-base font-extrabold text-[#1E3A78] dark:text-[#F5F5DC]">
                {recommendation.name}
              </h4>

              <p className="text-xs text-[#2C3E50]/80 dark:text-[#BDC3C7] leading-relaxed">
                {recommendation.reason}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleApplyRecommendation}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl text-xs font-semibold text-[#F5F5DC] bg-[#5A1827] hover:bg-[#48121E] shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Start in Domain 0{recommendation.domain} ({recommendation.level})</span>
              </button>

              <button
                type="button"
                onClick={handleRetake}
                className="w-full sm:w-auto py-3 px-4 rounded-xl text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC] bg-[#EBE9DF] dark:bg-[#243342] hover:bg-[#DDD9CE] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
