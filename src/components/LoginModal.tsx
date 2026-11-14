import React, { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import {
  X,
  CheckCircle2,
  Mail,
  User,
  ArrowRight,
  BookOpen,
  Code2,
  Layers,
  Rocket,
  Compass,
} from 'lucide-react';

interface DomainOption {
  num: number;
  level: string;
  title: string;
  weight: number;
  skills: string;
  badgeColor: string;
}

export const LoginModal: React.FC = () => {
  const {
    isLoginModalOpen,
    setIsLoginModalOpen,
    login,
    currentUser,
    setIsDiagnosticModalOpen,
  } = useProgress();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [selectedDomain, setSelectedDomain] = useState<number>(currentUser.startingDomain || 1);
  const [logoLoadError, setLogoLoadError] = useState<boolean>(false);

  React.useEffect(() => {
    if (currentUser.startingDomain) {
      setSelectedDomain(currentUser.startingDomain);
    }
  }, [currentUser.startingDomain]);

  if (!isLoginModalOpen) return null;

  const domainOptions: DomainOption[] = [
    {
      num: 1,
      level: 'Absolute Beginner',
      title: 'Fundamentals & Console I/O',
      weight: 17,
      skills: 'Literals, operators, casting, print(sep, end), lexis',
      badgeColor: 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300',
    },
    {
      num: 2,
      level: 'Elementary',
      title: 'Control Flow & Loops',
      weight: 23,
      skills: 'if-elif-else, while loops, sentinels, walrus operator (:=), for strides',
      badgeColor: 'border-amber-400 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300',
    },
    {
      num: 3,
      level: 'Intermediate',
      title: 'Collections & Slicing',
      weight: 26,
      skills: 'Lists, immutable tuples, unique sets, dicts, string methods',
      badgeColor: 'border-[#1E3A78] bg-[#1E3A78]/10 dark:bg-[#1E3A78]/30 text-[#1E3A78] dark:text-[#F5F5DC]',
    },
    {
      num: 4,
      level: 'Upper-Intermediate',
      title: 'Functions & Exceptions',
      weight: 20,
      skills: 'def, *args, **kwargs, namespaces, scope shadowing, try-except',
      badgeColor: 'border-[#5A1827] bg-[#5A1827]/10 dark:bg-[#5A1827]/30 text-[#5A1827] dark:text-[#F5F5DC]',
    },
    {
      num: 5,
      level: 'Advanced / Capstone',
      title: 'File Streams & Modules',
      weight: 14,
      skills: 'with open(), csv.reader, math, random, module namespaces',
      badgeColor: 'border-purple-400 bg-purple-50 dark:bg-purple-950/30 text-purple-800 dark:text-purple-300',
    },
  ];

  const selectedDomainData = domainOptions.find((d) => d.num === selectedDomain) || domainOptions[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(
      email.trim() || 'student@pcep-prep.local',
      name.trim() || 'Student',
      selectedDomain,
      selectedDomainData.level
    );
  };

  const handleGuestEntry = () => {
    login(
      'guest@pcep-prep.local',
      'Guest Student',
      selectedDomain,
      selectedDomainData.level
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#141C24]/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150">
      <div className="w-full max-w-4xl max-h-[92vh] rounded-2xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-white dark:bg-[#1A2634] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-150 relative">
        {currentUser?.isAuthenticated && (
          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="absolute top-4 right-4 z-20 p-1.5 rounded-lg text-[#2C3E50]/60 dark:text-[#BDC3C7] hover:text-[#2C3E50] dark:hover:text-[#F5F5DC] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Left Welcome & Feature Overview Sidebar */}
        <div className="md:w-[40%] bg-[#5A1827] text-[#F5F5DC] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shrink-0">
          <div className="space-y-4 z-10">
            {!logoLoadError ? (
              <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/15 bg-[#0F1B2B] shadow-sm">
                <img
                  src="/assets/aistudio/pycert_efd0a0c9.jpg"
                  alt="PyCert PCEP 30-03 Certification Assistant"
                  referrerPolicy="no-referrer"
                  onError={() => setLogoLoadError(true)}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#1E3A78] text-white flex items-center justify-center shadow-xs">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base tracking-tight leading-none text-white">
                    PyCert 30-03
                  </h3>
                  <span className="font-mono text-[9px] tracking-wider uppercase opacity-85 text-amber-200">
                    Python Learning &amp; Exam Studio
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <h4 className="text-sm font-bold text-white">
                What This App Does
              </h4>
              <p className="text-xs text-[#F5F5DC]/85 leading-relaxed font-sans">
                Learn Python step by step in your browser for the PCEP-30-03 certification—through interactive notebooks, guided portfolio projects, flashcards, and timed practice exams.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <div className="p-2.5 rounded-xl bg-black/20 border border-white/10 space-y-0.5">
                <div className="flex items-center gap-2 text-xs font-bold text-white font-mono">
                  <Code2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Jupyter-Style Syllabus Labs</span>
                </div>
                <div className="text-[11px] text-[#F5F5DC]/75 pl-5.5">
                  Run Python cell by cell with Worked Patterns, hints, and .ipynb export
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-black/20 border border-white/10 space-y-0.5">
                <div className="flex items-center gap-2 text-xs font-bold text-white font-mono">
                  <Rocket className="w-3.5 h-3.5 text-amber-300" />
                  <span>51 Bonus Portfolio Projects</span>
                </div>
                <div className="text-[11px] text-[#F5F5DC]/75 pl-5.5">
                  Challenges across Easy, Intermediate, Advanced, and Hard Mode
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-black/20 border border-white/10 space-y-0.5">
                <div className="flex items-center gap-2 text-xs font-bold text-white font-mono">
                  <Layers className="w-3.5 h-3.5 text-sky-300" />
                  <span>Flashcards &amp; Mock Exams</span>
                </div>
                <div className="text-[11px] text-[#F5F5DC]/75 pl-5.5">
                  Spaced-repetition study deck + 45-minute PCEP practice exams
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-black/20 border border-white/10 space-y-0.5">
                <div className="flex items-center gap-2 text-xs font-bold text-white font-mono">
                  <BookOpen className="w-3.5 h-3.5 text-purple-300" />
                  <span>Where to Start</span>
                </div>
                <div className="text-[11px] text-[#F5F5DC]/75 pl-5.5">
                  Pick your starting domain on the right (or run the 5-question diagnostic), then open your Home Dashboard.
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 text-[11px] text-[#F5F5DC]/70 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Progress saves locally in your browser</span>
          </div>
        </div>

        {/* Right Study Profile & Starting Point Pane */}
        <div className="md:w-[60%] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[85vh] space-y-5">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#2C3E50]/70 dark:text-[#BDC3C7]">
                WELCOME TO PYCERT 30-03
              </span>
              <h2 className="text-2xl font-extrabold text-[#2C3E50] dark:text-[#F5F5DC] tracking-tight">
                Set Up Your Study Profile
              </h2>
              <p className="text-xs text-[#2C3E50]/75 dark:text-[#BDC3C7] leading-relaxed">
                Enter your name and pick where you want to start. You can switch domains or explore any feature anytime.
              </p>
            </div>

            {/* Quick Diagnostic Assessment Prompt */}
            <div className="p-3.5 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                  Not Sure Where To Start?
                </span>
                <p className="text-xs text-[#2C3E50]/80 dark:text-[#BDC3C7]">
                  Take a 5-question diagnostic to get a personalized domain recommendation.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDiagnosticModalOpen(true)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#F5F5DC] bg-[#5A1827] hover:bg-[#48121E] shadow-xs whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Take Diagnostic</span>
              </button>
            </div>

            {/* Starting Domain Selection Cards */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#2C3E50] dark:text-[#F5F5DC] flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#1E3A78] dark:text-[#BDC3C7]" />
                  <span>Select Your Starting Domain</span>
                </label>
                <span className="text-[11px] font-mono font-semibold text-[#1E3A78] dark:text-[#BDC3C7] tabular-nums">
                  {selectedDomainData.weight}% Exam Weight
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {domainOptions.map((domain) => (
                  <button
                    type="button"
                    key={domain.num}
                    onClick={() => setSelectedDomain(domain.num)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedDomain === domain.num
                        ? 'border-[#1E3A78] dark:border-[#BDC3C7] bg-[#1E3A78]/10 dark:bg-[#1E3A78]/30 shadow-xs ring-1 ring-[#1E3A78]'
                        : 'border-[#BDC3C7]/70 dark:border-[#2C3E50] bg-white dark:bg-[#141C24] hover:border-[#1E3A78]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono text-xs font-bold text-[#2C3E50] dark:text-[#F5F5DC]">
                        Domain 0{domain.num}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border ${domain.badgeColor}`}
                      >
                        {domain.level}
                      </span>
                    </div>

                    <div className="font-semibold text-xs text-[#1E3A78] dark:text-[#F5F5DC] mt-1 leading-snug">
                      {domain.title}
                    </div>

                    <p className="text-[10px] text-[#2C3E50]/70 dark:text-[#BDC3C7] mt-1 line-clamp-1">
                      {domain.skills}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Name & Optional Email Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#2C3E50] dark:text-[#F5F5DC] mb-1">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-[#2C3E50]/50 dark:text-[#BDC3C7] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-white dark:bg-[#141C24] text-[#2C3E50] dark:text-[#F5F5DC] focus:outline-hidden focus:border-[#1E3A78]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#2C3E50] dark:text-[#F5F5DC] mb-1">
                    Email (optional)
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-[#2C3E50]/50 dark:text-[#BDC3C7] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-white dark:bg-[#141C24] text-[#2C3E50] dark:text-[#F5F5DC] focus:outline-hidden focus:border-[#1E3A78]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                <button
                  type="submit"
                  className="w-full sm:flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-[#F5F5DC] bg-[#5A1827] hover:bg-[#48121E] dark:bg-[#6B1D2F] dark:hover:bg-[#541624] shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Start in Domain 0{selectedDomain} ({selectedDomainData.level})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleGuestEntry}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-xl text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC] bg-[#EBE9DF] dark:bg-[#243342] hover:bg-[#DFDDD0] dark:hover:bg-[#2C3E50] transition-colors cursor-pointer whitespace-nowrap"
                >
                  Continue as Guest
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
