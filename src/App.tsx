import React from 'react';
import { ProgressProvider, useProgress } from './context/ProgressContext';
import { Navbar } from './components/Navbar';
import { HomeDashboard } from './components/HomeDashboard';
import { CurriculumView } from './components/CurriculumView';
import { Workspace } from './components/Workspace';
import { ProjectGuide } from './components/ProjectGuide';
import { FlashcardsView } from './components/FlashcardsView';
import { ExamSimulator } from './components/ExamSimulator';
import { PortfolioManager } from './components/PortfolioManager';
import { LoginModal } from './components/LoginModal';
import { AccountModal } from './components/AccountModal';
import { DiagnosticExamModal } from './components/DiagnosticExamModal';
import { HowToGuideModal } from './components/HowToGuideModal';
import { ErrorBoundary } from './components/ErrorBoundary';

const MainContent: React.FC = () => {
  const { activeView } = useProgress();

  return (
    <main className="flex-1 pb-16">
      {activeView === 'home' && <HomeDashboard />}
      {activeView === 'curriculum' && <CurriculumView />}
      {activeView === 'workspace' && <Workspace />}
      {activeView === 'guide' && <ProjectGuide />}
      {activeView === 'portfolio' && <PortfolioManager />}
      {activeView === 'flashcards' && <FlashcardsView />}
      {activeView === 'exam' && <ExamSimulator />}
    </main>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <ProgressProvider>
        <div className="min-h-screen flex flex-col bg-[#F5F5DC] dark:bg-[#1A2634] text-[#2C3E50] dark:text-[#F5F5DC] font-sans transition-colors selection:bg-[#1E3A78]/30 selection:text-[#1E3A78] dark:selection:bg-[#1E3A78]/60 dark:selection:text-[#F5F5DC]">
          <Navbar />
          <MainContent />
          <LoginModal />
          <AccountModal />
          <DiagnosticExamModal />
          <HowToGuideModal />

          {/* Quiet, clean Footer adhering to Constitution */}
          <footer className="border-t border-[#BDC3C7]/70 dark:border-[#2C3E50] bg-[#FAF9F5] dark:bg-[#151D26] py-6 text-xs text-[#5D6D7E] dark:text-[#BDC3C7] transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#1E3A78] dark:text-[#F5F5DC]">PyCert 30-03</span>
                  <span>·</span>
                  <span>Python Institute PCEP-30-03 & PCAD Aligned</span>
                  <span>·</span>
                  <span>5 Core Exam Sections</span>
                </div>

                <div className="flex items-center gap-4 text-[#7F8C8D] dark:text-[#BDC3C7]/70 font-mono text-[11px]">
                  <span>Standard PEP 8</span>
                  <span>·</span>
                  <span>WebAssembly Pyodide Runtime</span>
                  <span>·</span>
                  <span>Leitner Spaced Repetition</span>
                </div>
              </div>

              <div className="pt-2.5 border-t border-[#BDC3C7]/40 dark:border-[#2C3E50]/60 text-center sm:text-left text-[11px] text-[#7F8C8D] dark:text-[#BDC3C7]/70 leading-relaxed">
                <p>
                  <strong className="text-[#5D6D7E] dark:text-[#BDC3C7] font-semibold">Disclaimer:</strong> PyCert is an independent learning platform. We are not affiliated with, endorsed by, or associated with the Python Institute or JetBrains, and do not represent their interests.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </ProgressProvider>
    </ErrorBoundary>
  );
}
