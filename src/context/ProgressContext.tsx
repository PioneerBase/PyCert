import React, { createContext, useContext, useState, useEffect } from 'react';
import { MicroProject, Flashcard, ChecklistItem, UserProgressState, UserProfile } from '../types';
import { MICRO_PROJECTS, INITIAL_FLASHCARDS, INITIAL_CHECKLIST_ITEMS } from '../data/pcepCurriculum';

export type AppView = 'home' | 'curriculum' | 'workspace' | 'flashcards' | 'exam' | 'portfolio';

interface ProgressContextType {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  selectedProjectId: string;
  selectProject: (projectId: string) => void;
  currentProject: MicroProject;
  currentCode: string;
  setCurrentCode: (code: string) => void;
  resetProjectCode: () => void;
  currentStepIndex: number;
  setCurrentStepIndex: (stepIdx: number) => void;
  markStepComplete: (stepNumber: number) => void;
  completedSteps: number[];
  flashcards: Flashcard[];
  reviewFlashcard: (cardId: string, gotRight: boolean) => void;
  addCustomFlashcard: (card: Omit<Flashcard, 'id' | 'boxLevel' | 'intervalDays' | 'nextReviewDate' | 'timesReviewed' | 'timesCorrect'>) => void;
  checklistItems: ChecklistItem[];
  toggleChecklistItem: (id: string) => void;
  resetChecklist: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  quizHistory: UserProgressState['quizHistory'];
  recordQuizResult: (section: number | 'all', score: number, total: number) => void;
  currentUser: UserProfile;
  login: (email: string, name?: string) => void;
  logout: () => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
}

const STORAGE_KEY = 'pycert_user_progress_v1';

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<AppView>('home');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(MICRO_PROJECTS[0].id);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Initialize state with localStorage or defaults
  const [completedStepsMap, setCompletedStepsMap] = useState<Record<string, number[]>>({});
  const [codeSnapshots, setCodeSnapshots] = useState<Record<string, string>>({});
  const [flashcards, setFlashcards] = useState<Flashcard[]>(INITIAL_FLASHCARDS);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(INITIAL_CHECKLIST_ITEMS);
  const [quizHistory, setQuizHistory] = useState<UserProgressState['quizHistory']>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    name: 'Devon Vance',
    email: 'devon.vance@student.edu',
    role: 'Junior Python Dev',
    avatar: 'DV',
    githubHandle: 'devonvance',
    isAuthenticated: true,
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Load from local storage once on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.completedStepsMap) setCompletedStepsMap(parsed.completedStepsMap);
        if (parsed.codeSnapshots) setCodeSnapshots(parsed.codeSnapshots);
        if (parsed.flashcards) {
          const mergedFlashcards = parsed.flashcards.map((f: Flashcard) => {
            const initial = INITIAL_FLASHCARDS.find((ic) => ic.id === f.id);
            return initial ? { ...f, frontPrompt: initial.frontPrompt, backAnswer: initial.backAnswer, syntaxGotcha: initial.syntaxGotcha } : f;
          });
          setFlashcards(mergedFlashcards);
        }
        if (parsed.checklistItems) setChecklistItems(parsed.checklistItems);
        if (parsed.quizHistory) setQuizHistory(parsed.quizHistory);
        if (typeof parsed.darkMode === 'boolean') setDarkMode(parsed.darkMode);
      }
    } catch (e) {
      console.warn('Could not parse saved PyCert progress:', e);
    }
  }, []);

  // Save to local storage on changes
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          completedStepsMap,
          codeSnapshots,
          flashcards,
          checklistItems,
          quizHistory,
          darkMode,
        })
      );
    } catch (e) {
      console.warn('Failed to save progress to localStorage', e);
    }
  }, [completedStepsMap, codeSnapshots, flashcards, checklistItems, quizHistory, darkMode]);

  // Keep dark class on documentElement
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const currentProject =
    MICRO_PROJECTS.find((p) => p.id === selectedProjectId) || MICRO_PROJECTS[0];

  const currentCode = codeSnapshots[selectedProjectId] ?? currentProject.starterCode;
  const completedSteps = completedStepsMap[selectedProjectId] ?? [];

  const setCurrentCode = (code: string) => {
    setCodeSnapshots((prev) => ({
      ...prev,
      [selectedProjectId]: code,
    }));
  };

  const resetProjectCode = () => {
    setCodeSnapshots((prev) => ({
      ...prev,
      [selectedProjectId]: currentProject.starterCode,
    }));
  };

  const selectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentStepIndex(0);
    setActiveView('workspace');
  };

  const markStepComplete = (stepNumber: number) => {
    setCompletedStepsMap((prev) => {
      const existing = prev[selectedProjectId] || [];
      if (!existing.includes(stepNumber)) {
        return {
          ...prev,
          [selectedProjectId]: [...existing, stepNumber],
        };
      }
      return prev;
    });
  };

  // Leitner Spaced-Repetition Algorithm: Box 1 (1d), Box 2 (3d), Box 3 (7d), Box 4 (14d), Box 5 (30d)
  const intervalMap: Record<number, number> = {
    1: 1,
    2: 3,
    3: 7,
    4: 14,
    5: 30,
  };

  const reviewFlashcard = (cardId: string, gotRight: boolean) => {
    setFlashcards((prev) =>
      prev.map((card) => {
        if (card.id !== cardId) return card;

        let newBox = card.boxLevel;
        if (gotRight) {
          newBox = Math.min(5, card.boxLevel + 1) as 1 | 2 | 3 | 4 | 5;
        } else {
          newBox = 1; // Leitner rule: reset to box 1 on failure
        }

        const interval = intervalMap[newBox] || 1;
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + interval);

        return {
          ...card,
          boxLevel: newBox,
          intervalDays: interval,
          nextReviewDate: nextDate.toISOString().split('T')[0],
          timesReviewed: card.timesReviewed + 1,
          timesCorrect: card.timesCorrect + (gotRight ? 1 : 0),
        };
      })
    );
  };

  const addCustomFlashcard = (
    cardData: Omit<
      Flashcard,
      'id' | 'boxLevel' | 'intervalDays' | 'nextReviewDate' | 'timesReviewed' | 'timesCorrect'
    >
  ) => {
    const newCard: Flashcard = {
      ...cardData,
      id: `fc-custom-${Date.now()}`,
      boxLevel: 1,
      intervalDays: 1,
      nextReviewDate: new Date().toISOString().split('T')[0],
      timesReviewed: 0,
      timesCorrect: 0,
    };
    setFlashcards((prev) => [newCard, ...prev]);
  };

  const toggleChecklistItem = (id: string) => {
    setChecklistItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const resetChecklist = () => {
    setChecklistItems(INITIAL_CHECKLIST_ITEMS);
  };

  const recordQuizResult = (section: number | 'all', score: number, total: number) => {
    const newResult = {
      id: `quiz-${Date.now()}`,
      date: new Date().toISOString(),
      section,
      score,
      total,
      percentage: Math.round((score / total) * 100),
    };
    setQuizHistory((prev) => [newResult, ...prev]);
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const login = (email: string, name?: string) => {
    const rawName = name?.trim() || (email.split('@')[0] ? email.split('@')[0].replace(/[._]/g, ' ') : 'Student Developer');
    const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    const initials = displayName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'DV';
    const profile: UserProfile = {
      name: displayName,
      email,
      role: 'PCEP Candidate',
      avatar: initials,
      githubHandle: email.split('@')[0] || 'student-dev',
      isAuthenticated: true,
    };
    setCurrentUser(profile);
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    setCurrentUser({
      name: 'Guest Student',
      email: '',
      role: 'Unauthenticated',
      avatar: 'GS',
      githubHandle: '',
      isAuthenticated: false,
    });
    setIsLoginModalOpen(true);
  };

  return (
    <ProgressContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedProjectId,
        selectProject,
        currentProject,
        currentCode,
        setCurrentCode,
        resetProjectCode,
        currentStepIndex,
        setCurrentStepIndex,
        markStepComplete,
        completedSteps,
        flashcards,
        reviewFlashcard,
        addCustomFlashcard,
        checklistItems,
        toggleChecklistItem,
        resetChecklist,
        darkMode,
        toggleDarkMode,
        quizHistory,
        recordQuizResult,
        currentUser,
        login,
        logout,
        isLoginModalOpen,
        setIsLoginModalOpen,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
