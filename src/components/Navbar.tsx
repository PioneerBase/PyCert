import React, { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import {
  Code2,
  Sun,
  Moon,
  Sparkles,
  BookOpen,
  Layers,
  Award,
  GitBranch,
  Search,
  CheckCircle2,
  Home,
  FolderGit2,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeView, setActiveView, darkMode, toggleDarkMode, checklistItems, flashcards, currentUser, setIsLoginModalOpen } = useProgress();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const checkedCount = checklistItems.filter((i) => i.checked).length;
  const cardsDueCount = flashcards.filter(
    (c) => c.nextReviewDate <= new Date().toISOString().split('T')[0]
  ).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setActiveView('curriculum');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#BDC3C7]/80 dark:border-[#2C3E50] bg-[#FAF9F5]/95 dark:bg-[#1A2634]/95 backdrop-blur-md transition-colors">
      {/* Top Banner Row: Wordmark, Search, Readiness Badge, User Profile */}
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 py-2.5 border-b border-[#BDC3C7]/40 dark:border-[#2C3E50]">
        {/* Wordmark */}
        <button
          onClick={() => setActiveView('home')}
          className="flex items-center gap-2.5 text-left text-lg font-bold tracking-tight text-[#1E3A78] dark:text-[#F5F5DC] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 focus-visible:outline-hidden"
        >
          <div className="w-8 h-8 rounded-lg bg-[#5A1827] text-[#F5F5DC] flex items-center justify-center shadow-xs">
            <span className="font-mono font-black text-sm">Py</span>
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-black text-base tracking-tight text-[#1E3A78] dark:text-[#F5F5DC] leading-none">
              PyCert 30-03
            </span>
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#5A1827] dark:text-amber-400 font-bold">
              PCEP PREP STUDIO
            </span>
          </div>
        </button>

        {/* Search Bar for PCEP Topics */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-[#2C3E50]/60 dark:text-[#BDC3C7] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search PCEP topics ('try...except', 'slices', 'bitwise op')..."
              className="w-full pl-9 pr-3 py-1.5 text-xs font-mono rounded-lg border border-[#BDC3C7] dark:border-[#2C3E50] bg-white dark:bg-[#141C24] text-[#2C3E50] dark:text-[#F5F5DC] placeholder-[#2C3E50]/50 dark:placeholder-[#BDC3C7]/50 focus:outline-hidden focus:border-[#1E3A78]"
            />
          </div>
        </form>

        {/* Right Status Badges & Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {/* PCEP-30-03 Readiness Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg border border-[#BDC3C7]/80 dark:border-[#2C3E50] bg-white dark:bg-[#141C24] text-xs font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-[#2C3E50]/70 dark:text-[#BDC3C7] font-semibold">
                PCEP-30-03 READINESS:
              </span>
              <span className="font-bold text-[#1E3A78] dark:text-[#F5F5DC]">
                78% Exam Standard
              </span>
            </div>
          </div>

          {/* Student Profile Avatar / Login Trigger */}
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="flex items-center gap-2 pl-1 border-l border-[#BDC3C7]/50 dark:border-[#2C3E50] hover:opacity-85 transition-opacity cursor-pointer text-left"
            title="Click to sign in or switch student profile"
          >
            <div className="w-7 h-7 rounded-full bg-[#1E3A78] text-[#F5F5DC] flex items-center justify-center font-bold text-xs shadow-xs">
              {currentUser.avatar}
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold text-[#2C3E50] dark:text-[#F5F5DC] leading-none">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-[#2C3E50]/70 dark:text-[#BDC3C7] font-mono leading-none mt-0.5">
                {currentUser.isAuthenticated ? currentUser.role : 'Sign In'}
              </span>
            </div>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle theme"
            className="p-1.5 text-[#2C3E50] dark:text-[#BDC3C7] hover:text-[#1E3A78] dark:hover:text-[#F5F5DC] rounded-lg border border-[#BDC3C7] dark:border-[#2C3E50] hover:bg-white dark:hover:bg-[#243342] transition-colors cursor-pointer"
          >
            {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Navigation Sub-Bar */}
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-2 overflow-x-auto text-xs font-medium">
        <nav className="flex items-center gap-2 sm:gap-4 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveView('home')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeView === 'home'
                ? 'bg-[#5A1827] text-[#F5F5DC] font-semibold shadow-xs'
                : 'text-[#2C3E50]/80 dark:text-[#BDC3C7] hover:bg-white/60 dark:hover:bg-[#243342]/60'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home Dashboard</span>
          </button>

          <button
            onClick={() => setActiveView('curriculum')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeView === 'curriculum'
                ? 'bg-[#1E3A78] text-[#F5F5DC] font-semibold shadow-xs'
                : 'text-[#2C3E50]/80 dark:text-[#BDC3C7] hover:bg-white/60 dark:hover:bg-[#243342]/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Curriculum & Roadmap</span>
          </button>

          <button
            onClick={() => setActiveView('workspace')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeView === 'workspace'
                ? 'bg-[#1E3A78] text-[#F5F5DC] font-semibold shadow-xs'
                : 'text-[#2C3E50]/80 dark:text-[#BDC3C7] hover:bg-white/60 dark:hover:bg-[#243342]/60'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Syllabus Labs (IDE)</span>
          </button>

          <button
            onClick={() => setActiveView('portfolio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeView === 'portfolio'
                ? 'bg-[#1E3A78] text-[#F5F5DC] font-semibold shadow-xs'
                : 'text-[#2C3E50]/80 dark:text-[#BDC3C7] hover:bg-white/60 dark:hover:bg-[#243342]/60'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Projects & Portfolio</span>
            <span className="text-[10px] font-mono opacity-80">
              ({checkedCount}/8)
            </span>
          </button>

          <button
            onClick={() => setActiveView('flashcards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeView === 'flashcards'
                ? 'bg-[#1E3A78] text-[#F5F5DC] font-semibold shadow-xs'
                : 'text-[#2C3E50]/80 dark:text-[#BDC3C7] hover:bg-white/60 dark:hover:bg-[#243342]/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Flashcards & Tasks</span>
            {cardsDueCount > 0 && (
              <span className="text-[10px] font-mono text-amber-500 font-bold">
                ({cardsDueCount})
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveView('exam')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeView === 'exam'
                ? 'bg-[#1E3A78] text-[#F5F5DC] font-semibold shadow-xs'
                : 'text-[#2C3E50]/80 dark:text-[#BDC3C7] hover:bg-white/60 dark:hover:bg-[#243342]/60'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Mock Exam</span>
          </button>
        </nav>

        <div className="hidden sm:flex items-center gap-2 pl-4 shrink-0 font-mono text-[11px] text-[#2C3E50]/70 dark:text-[#BDC3C7]">
          <span>v30-03 Target</span>
          <span>·</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
            STUDENT READY
          </span>
        </div>
      </div>
    </header>
  );
};
