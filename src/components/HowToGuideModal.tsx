import React, { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  Compass,
  Code2,
  Layers,
  FolderGit2,
  Sparkles,
  BookOpen,
  Award,
  Terminal,
  UserCheck,
} from 'lucide-react';

interface GuideStep {
  title: string;
  tagline: string;
  description: string;
  bulletPoints: string[];
  icon: React.ReactNode;
  navHighlightView?: 'home' | 'curriculum' | 'workspace' | 'portfolio' | 'flashcards' | 'exam';
}

export const HowToGuideModal: React.FC = () => {
  const { isTourModalOpen, setIsTourModalOpen, updateUserProfile, setActiveView } = useProgress();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(true);

  if (!isTourModalOpen) return null;

  const steps: GuideStep[] = [
    {
      title: 'Welcome to PyCert 30-03',
      tagline: 'Your Project-First Python Certification Prep Studio',
      description:
        'PyCert is designed around all 36 syllabus objectives of the Python Institute PCEP-30-03 exam. Rather than passive video lectures, you learn by building verified Python code and real project repositories.',
      bulletPoints: [
        'Organized across 5 foundational syllabus domains.',
        'Starts you at 0% so every line of code and test passed is your genuine work.',
        'Quick navigation bar at the top lets you move between workspace, portfolio, and review drills anytime.',
      ],
      icon: <Compass className="w-6 h-6 text-sky-400" />,
      navHighlightView: 'home',
    },
    {
      title: 'In-Browser IDE & Automated PyTest Matrix',
      tagline: 'Instant Feedback Without Local Machine Configuration',
      description:
        'The Syllabus Labs IDE executes real Python in your browser via WebAssembly. Every exercise features standard PyTest unit tests with boundary corner cases.',
      bulletPoints: [
        'Click "Run Tests (Cmd+Enter)" to execute your solution against acceptance criteria.',
        'View live execution outputs in the Terminal console and Inspect Variables tab.',
        'Green checkmarks appear as your code satisfies each syllabus specification.',
      ],
      icon: <Code2 className="w-6 h-6 text-emerald-400" />,
      navHighlightView: 'workspace',
    },
    {
      title: '3-Tier Progressive Code Breadcrumbs',
      tagline: 'Pedagogical Guidance Without Giving Away Solutions',
      description:
        'When you hit a syntax block or logic puzzle, click "Need Hint" to reveal tiered clues crafted to build problem-solving intuition rather than spoiling answers.',
      bulletPoints: [
        'Level 1 (Concept Primer): Explains the mathematical or algorithmic rule.',
        'Level 2 (Syntax Pattern): Demonstrates parameter forms, slicing indices, or exception hierarchies.',
        'Level 3 (Scaffold Skeleton): Provides a fill-in-the-blank code framework.',
      ],
      icon: <Sparkles className="w-6 h-6 text-amber-400" />,
      navHighlightView: 'workspace',
    },
    {
      title: 'Certified Portfolio & Git Sync Manager',
      tagline: 'Transform Labs into Recruiter-Ready GitHub Repositories',
      description:
        'Head over to Projects & Portfolio to turn your completed labs into audited open-source repositories ready for technical recruiters.',
      bulletPoints: [
        'Generates markdown README badges, requirements.txt, and unit suites.',
        'Live Git sync telemetry simulates production commits and tag releases.',
        'Export portfolio JSON snapshots to showcase your Python competency.',
      ],
      icon: <FolderGit2 className="w-6 h-6 text-purple-400" />,
      navHighlightView: 'portfolio',
    },
    {
      title: 'Account Settings & Readiness Diagnostic',
      tagline: 'Customize Your Pace, Starting Domain & Exam Target',
      description:
        'You can update your profile, adjust your starting domain, take the quick diagnostic exam, or reset your workspace anytime using the Account button in the top bar.',
      bulletPoints: [
        'Click your user avatar or the "Account" button in the top bar anytime.',
        'Switch starting domains (Domain 1 through 5) based on your evolving experience.',
        'Track countdown days to your scheduled PCEP-30-03 exam date.',
      ],
      icon: <UserCheck className="w-6 h-6 text-[#F5F5DC]" />,
      navHighlightView: 'home',
    },
  ];

  const activeStepData = steps[currentStep];

  const handleFinish = () => {
    updateUserProfile({
      hasSeenTour: true,
    });
    setIsTourModalOpen(false);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handlePreviewSection = (view?: GuideStep['navHighlightView']) => {
    if (view) {
      setActiveView(view);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#141C24]/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-2xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-white dark:bg-[#1A2634] shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-150">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#BDC3C7]/60 dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#141C24]">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#5A1827] text-[#F5F5DC]">
              HOW-TO GUIDE
            </span>
            <span className="text-xs font-mono font-semibold text-[#1E3A78] dark:text-[#BDC3C7]">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>

          <button
            onClick={handleFinish}
            className="p-1.5 rounded-lg text-[#2C3E50]/60 dark:text-[#BDC3C7] hover:text-[#2C3E50] dark:hover:text-[#F5F5DC] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            title="Skip guide"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Step Icon & Title Banner */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#5A1827] text-[#F5F5DC] flex items-center justify-center shadow-xs shrink-0 mt-0.5">
              {activeStepData.icon}
            </div>
            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-extrabold text-[#2C3E50] dark:text-[#F5F5DC] tracking-tight">
                {activeStepData.title}
              </h3>
              <p className="text-xs font-mono font-semibold text-[#1E3A78] dark:text-amber-400">
                {activeStepData.tagline}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#2C3E50]/80 dark:text-[#BDC3C7] leading-relaxed">
            {activeStepData.description}
          </p>

          {/* Bullet Highlights */}
          <div className="p-4 rounded-xl border border-[#BDC3C7]/60 dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#141C24] space-y-2">
            {activeStepData.bulletPoints.map((point, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-[#2C3E50] dark:text-[#F5F5DC]">
                <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <span>{point}</span>
              </div>
            ))}
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-center gap-1.5 pt-1">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentStep === idx
                    ? 'w-6 bg-[#5A1827]'
                    : 'w-2 bg-[#BDC3C7]/60 dark:bg-[#2C3E50] hover:bg-[#1E3A78]/50'
                }`}
                title={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Bottom Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[#BDC3C7]/40 dark:border-[#2C3E50]">
            <label className="flex items-center gap-2 text-xs text-[#2C3E50]/80 dark:text-[#BDC3C7] cursor-pointer">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="rounded border-[#BDC3C7] dark:border-[#2C3E50] text-[#5A1827] focus:ring-[#5A1827]"
              />
              <span>Don't show automatically on next login</span>
            </label>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC] bg-[#EBE9DF] dark:bg-[#243342] hover:bg-[#DDD9CE] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#F5F5DC] bg-[#5A1827] hover:bg-[#48121E] shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>{currentStep < steps.length - 1 ? 'Next' : 'Finish & Start Building'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
