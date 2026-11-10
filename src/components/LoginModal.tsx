import React, { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import {
  X,
  CheckCircle2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Code2,
  Terminal,
  BookOpen,
  Layers,
  GitBranch,
} from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, login, currentUser } = useProgress();

  const [email, setEmail] = useState<string>('devon.vance@student.edu');
  const [password, setPassword] = useState<string>('••••••••••••');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      login(email);
      setIsSubmitting(false);
    }, 400);
  };

  const handleQuickDemoLogin = () => {
    login('devon.vance@student.edu', 'Devon Vance');
  };

  const handleOAuthLogin = (provider: 'github' | 'google') => {
    setIsSubmitting(true);
    setTimeout(() => {
      if (provider === 'github') {
        login('devon.vance@github.com', 'Devon Vance');
      } else {
        login('devon.vance@gmail.com', 'Devon Vance');
      }
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#141C24]/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-3xl rounded-2xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-white dark:bg-[#1A2634] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-150 relative">
        {/* Close Button */}
        <button
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute top-4 right-4 z-20 p-1.5 rounded-lg text-[#2C3E50]/60 dark:text-[#BDC3C7] hover:text-[#2C3E50] dark:hover:text-[#F5F5DC] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          title="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Maroon / Burgundy Sidebar matching mockup screen_463c6856.png */}
        <div className="md:w-[42%] bg-[#5A1827] text-[#F5F5DC] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shrink-0">
          <div className="space-y-6 z-10">
            {/* Logo */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white text-[#5A1827] flex items-center justify-center font-bold text-base shadow-xs font-mono">
                  §
                </div>
                <div>
                  <h3 className="font-extrabold text-base tracking-tight leading-none text-white">
                    PyCert
                  </h3>
                  <span className="font-mono text-[9px] tracking-wider uppercase opacity-80 text-amber-200">
                    PCEP-30-03
                  </span>
                </div>
              </div>

              {/* Syllabus Companion Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/20 border border-white/10 text-xs font-mono font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Official Syllabus Companion</span>
              </div>
            </div>

            <p className="text-xs text-[#F5F5DC]/80 leading-relaxed font-sans">
              Academic precision environment tailored for Python Institute entry-level certification mastery.
            </p>

            {/* Feature Cards List */}
            <div className="space-y-2.5 pt-2">
              <div className="p-2.5 rounded-xl bg-black/20 border border-white/10 space-y-0.5">
                <div className="flex items-center gap-2 text-xs font-bold text-white font-mono">
                  <BookOpen className="w-3.5 h-3.5 text-sky-300" />
                  <span>5 Core Modules</span>
                </div>
                <div className="text-[11px] text-[#F5F5DC]/70 pl-5.5">
                  Syntax, Data Types, Control, Functions, I/O...
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-black/20 border border-white/10 space-y-0.5">
                <div className="flex items-center gap-2 text-xs font-bold text-white font-mono">
                  <Code2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>32 Mini-Projects</span>
                </div>
                <div className="text-[11px] text-[#F5F5DC]/70 pl-5.5">
                  Real-world sandbox micro-assignments
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-black/20 border border-white/10 space-y-0.5">
                <div className="flex items-center gap-2 text-xs font-bold text-white font-mono">
                  <Layers className="w-3.5 h-3.5 text-amber-300" />
                  <span>120 Curated Flashcards</span>
                </div>
                <div className="text-[11px] text-[#F5F5DC]/70 pl-5.5">
                  Spaced repetition Leitner box algorithm
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-black/20 border border-white/10 space-y-0.5">
                <div className="flex items-center gap-2 text-xs font-bold text-white font-mono">
                  <GitBranch className="w-3.5 h-3.5 text-purple-300" />
                  <span>Direct GitHub Repo Sync</span>
                </div>
                <div className="text-[11px] text-[#F5F5DC]/70 pl-5.5">
                  One-click commit & recruiter portfolio export
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Watermark Terminal Prompt */}
          <div className="pt-6 font-mono font-black text-6xl text-white/5 select-none pointer-events-none -mb-4 -ml-2">
            &gt;_
          </div>
        </div>

        {/* Right Authentication Pane */}
        <div className="md:w-[58%] p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#2C3E50]/70 dark:text-[#BDC3C7]">
                STUDENT LOGIN
              </span>
              <h2 className="text-2xl font-extrabold text-[#2C3E50] dark:text-[#F5F5DC] tracking-tight">
                Start Your Python Journey
              </h2>
              <p className="text-xs text-[#2C3E50]/70 dark:text-[#BDC3C7] leading-relaxed">
                Authenticate to synchronize progress, flashcard deck states, and laboratory scripts.
              </p>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleOAuthLogin('github')}
                disabled={isSubmitting}
                className="py-2.5 px-3 rounded-xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-white dark:bg-[#141C24] hover:bg-[#FAF9F5] dark:hover:bg-[#1E2936] text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>GitHub</span>
              </button>

              <button
                type="button"
                onClick={() => handleOAuthLogin('google')}
                disabled={isSubmitting}
                className="py-2.5 px-3 rounded-xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-white dark:bg-[#141C24] hover:bg-[#FAF9F5] dark:hover:bg-[#1E2936] text-xs font-semibold text-[#2C3E50] dark:text-[#F5F5DC] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-[#BDC3C7]/60 dark:border-[#2C3E50] w-full" />
              <span className="bg-white dark:bg-[#1A2634] px-3 font-mono text-[9px] font-bold uppercase tracking-wider text-[#2C3E50]/60 dark:text-[#BDC3C7]/60 absolute">
                OR SIGN IN WITH STUDENT EMAIL
              </span>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-[#2C3E50] dark:text-[#F5F5DC] mb-1">
                  Student Email
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-[#2C3E50]/50 dark:text-[#BDC3C7] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-white dark:bg-[#141C24] text-[#2C3E50] dark:text-[#F5F5DC] focus:outline-hidden focus:border-[#1E3A78]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-[#2C3E50] dark:text-[#F5F5DC]">
                    Password
                  </label>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Password reset instructions sent to student email.');
                    }}
                    className="text-[10px] text-[#1E3A78] dark:text-[#BDC3C7] hover:underline font-medium"
                  >
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-[#2C3E50]/50 dark:text-[#BDC3C7] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 text-xs font-mono rounded-xl border border-[#BDC3C7] dark:border-[#2C3E50] bg-white dark:bg-[#141C24] text-[#2C3E50] dark:text-[#F5F5DC] focus:outline-hidden focus:border-[#1E3A78]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2C3E50]/50 dark:text-[#BDC3C7] hover:text-[#2C3E50] dark:hover:text-[#F5F5DC] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-[#2C3E50]/80 dark:text-[#BDC3C7] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#BDC3C7] dark:border-[#2C3E50] text-[#5A1827] focus:ring-[#5A1827]"
                  />
                  <span>Remember Password</span>
                </label>

                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="text-[10px] font-mono text-[#5A1827] dark:text-amber-400 hover:underline font-bold"
                >
                  Quick Demo: Devon Vance
                </button>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-[#F5F5DC] bg-[#5A1827] hover:bg-[#48121E] dark:bg-[#6B1D2F] dark:hover:bg-[#541624] shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Authenticating...' : 'Enter Study Workspace'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Footer Note */}
          <div className="pt-2 text-center border-t border-[#BDC3C7]/40 dark:border-[#2C3E50]">
            <p className="text-[11px] text-[#2C3E50]/70 dark:text-[#BDC3C7] font-mono">
              New student?{' '}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  login('student.candidate@pcep.org', 'Candidate Student');
                }}
                className="text-[#1E3A78] dark:text-[#F5F5DC] underline font-semibold hover:opacity-80 inline-flex items-center gap-1"
              >
                <span>Create study profile & take diagnostic assessment</span>
                <ExternalLink className="w-3 h-3 inline" />
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
