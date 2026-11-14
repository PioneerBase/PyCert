import React, { createContext, useContext, useState, useEffect } from 'react';
import { MicroProject, Flashcard, ChecklistItem, UserProgressState, UserProfile, StreakData } from '../types';
import { MICRO_PROJECTS, INITIAL_FLASHCARDS, INITIAL_CHECKLIST_ITEMS } from '../data/pcepCurriculum';
import { BONUS_PROJECTS } from '../data/bonusProjects';

export type AppView = 'home' | 'curriculum' | 'workspace' | 'flashcards' | 'exam' | 'portfolio' | 'bonus';

interface ProgressContextType {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  selectedProjectId: string;
  selectProject: (projectId: string) => void;
  currentProject: MicroProject;
  currentCode: string;
  setCurrentCode: (code: string) => void;
  getCellCode: (cellId: string) => string;
  getProjectCellCode: (projectId: string, cellId: string) => string;
  setCellCode: (cellId: string, code: string) => void;
  resetCellCode: (cellId: string) => void;
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
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  login: (email: string, name?: string, startingDomain?: number, experienceLevel?: string) => void;
  logout: () => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isAccountModalOpen: boolean;
  setIsAccountModalOpen: (open: boolean) => void;
  isDiagnosticModalOpen: boolean;
  setIsDiagnosticModalOpen: (open: boolean) => void;
  isTourModalOpen: boolean;
  setIsTourModalOpen: (open: boolean) => void;
  resetAllProgress: () => void;
  completedStepsMap: Record<string, number[]>;
  readinessPercentage: number;
  streakData: StreakData;
  recordActivity: (type?: 'lab' | 'flashcards' | 'quiz' | 'checkin') => void;
  currentStreak: number;
  longestStreak: number;
  hasPracticedToday: boolean;
  selectedBonusProjectIds: string[];
  toggleBonusProjectSelection: (projectId: string) => void;
}

const STORAGE_KEY = 'pycert_user_progress_v1';
const CURRICULUM_VERSION = 4;

function computeStreak(activityHistory: string[]): { currentStreak: number; hasPracticedToday: boolean } {
  if (!activityHistory || activityHistory.length === 0) {
    return { currentStreak: 0, hasPracticedToday: false };
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const hasPracticedToday = activityHistory.includes(todayStr);

  const parseLocalDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  };

  const today = parseLocalDate(todayStr);
  const yesterday = new Date(today.getTime() - 86400000);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const uniqueDates = new Set(activityHistory);

  let streak = 0;
  let checkDate = hasPracticedToday ? today : uniqueDates.has(yesterdayStr) ? yesterday : null;

  if (!checkDate) {
    return { currentStreak: 0, hasPracticedToday: false };
  }

  while (true) {
    const dateStr = checkDate.toISOString().split('T')[0];
    if (uniqueDates.has(dateStr)) {
      streak++;
      checkDate = new Date(checkDate.getTime() - 86400000);
    } else {
      break;
    }
  }

  return { currentStreak: streak, hasPracticedToday };
}

const INITIAL_STREAK: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: '',
  activityHistory: [],
  todaysTasksCompleted: {
    lab: false,
    flashcards: false,
    quiz: false,
  },
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<AppView>('home');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(MICRO_PROJECTS[0].id);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Initialize state with localStorage or defaults
  const [completedStepsMap, setCompletedStepsMap] = useState<Record<string, number[]>>({});
  const [codeSnapshots, setCodeSnapshots] = useState<Record<string, string>>({});
  const [cellSnapshots, setCellSnapshots] = useState<Record<string, Record<string, string>>>({});
  const [selectedBonusProjectIds, setSelectedBonusProjectIds] = useState<string[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>(INITIAL_FLASHCARDS);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(INITIAL_CHECKLIST_ITEMS);
  const [quizHistory, setQuizHistory] = useState<UserProgressState['quizHistory']>([]);
  const [streakData, setStreakData] = useState<StreakData>(INITIAL_STREAK);
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    name: '',
    email: '',
    role: 'PCEP Candidate',
    avatar: 'ST',
    githubHandle: '',
    isAuthenticated: false,
    startingDomain: 1,
    experienceLevel: 'Beginner',
    hasSeenTour: false,
    hasDismissedWelcome: false,
    studyPace: 'standard',
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(true);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState<boolean>(false);
  const [isDiagnosticModalOpen, setIsDiagnosticModalOpen] = useState<boolean>(false);
  const [isTourModalOpen, setIsTourModalOpen] = useState<boolean>(false);

  // Load from local storage once on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.completedStepsMap) {
          const validIds = new Set([
            ...MICRO_PROJECTS.map((p) => p.id),
            ...BONUS_PROJECTS.map((p) => p.id),
          ]);
          const cleanedStepsMap: Record<string, number[]> = {};
          Object.entries(parsed.completedStepsMap).forEach(([k, v]) => {
            if (validIds.has(k) && Array.isArray(v)) {
              cleanedStepsMap[k] = v;
            }
          });
          setCompletedStepsMap(cleanedStepsMap);
        }
        if (Array.isArray(parsed.selectedBonusProjectIds)) {
          const validBonusIds = new Set(BONUS_PROJECTS.map((p) => p.id));
          setSelectedBonusProjectIds(
            parsed.selectedBonusProjectIds.filter((id: string) => validBonusIds.has(id))
          );
        }
        if (parsed.codeSnapshots && parsed.curriculumVersion === CURRICULUM_VERSION) {
          setCodeSnapshots(parsed.codeSnapshots);
        } else {
          setCodeSnapshots({});
        }
        if (parsed.cellSnapshots && parsed.curriculumVersion === CURRICULUM_VERSION) {
          setCellSnapshots(parsed.cellSnapshots);
        } else {
          setCellSnapshots({});
        }
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
        if (parsed.streakData) {
          const { currentStreak } = computeStreak(parsed.streakData.activityHistory || []);
          const todayStr = new Date().toISOString().split('T')[0];
          const isToday = parsed.streakData.lastActiveDate === todayStr;
          setStreakData({
            ...parsed.streakData,
            currentStreak,
            todaysTasksCompleted: isToday
              ? parsed.streakData.todaysTasksCompleted || INITIAL_STREAK.todaysTasksCompleted
              : INITIAL_STREAK.todaysTasksCompleted,
          });
        }
        if (parsed.userProfile && parsed.userProfile.isAuthenticated) {
          setCurrentUser(parsed.userProfile);
          setIsLoginModalOpen(false);
        } else {
          setIsLoginModalOpen(true);
        }
      }
    } catch {
      // Ignore corrupted localStorage payloads
    }
  }, []);

  // Save to local storage on changes
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          curriculumVersion: CURRICULUM_VERSION,
          completedStepsMap,
          codeSnapshots,
          cellSnapshots,
          selectedBonusProjectIds,
          flashcards,
          checklistItems,
          quizHistory,
          darkMode,
          userProfile: currentUser,
          streakData,
        })
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [completedStepsMap, codeSnapshots, cellSnapshots, selectedBonusProjectIds, flashcards, checklistItems, quizHistory, darkMode, currentUser, streakData]);

  // Keep dark class on documentElement
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const allProjects = [...MICRO_PROJECTS, ...BONUS_PROJECTS];
  const currentProject =
    allProjects.find((p) => p.id === selectedProjectId) || MICRO_PROJECTS[0];

  const getProjectCellCode = (projectId: string, cellId: string): string => {
    const saved = cellSnapshots[projectId]?.[cellId];
    if (typeof saved === 'string') return saved;
    const proj = allProjects.find((p) => p.id === projectId);
    const cellDef = proj?.notebookCells?.find((c) => c.id === cellId);
    return cellDef ? cellDef.starterCode : '';
  };

  const getCellCode = (cellId: string): string => {
    return getProjectCellCode(selectedProjectId, cellId);
  };

  const setCellCode = (cellId: string, code: string) => {
    setCellSnapshots((prev) => ({
      ...prev,
      [selectedProjectId]: {
        ...(prev[selectedProjectId] || {}),
        [cellId]: code,
      },
    }));
  };

  const resetCellCode = (cellId: string) => {
    const cellDef = currentProject.notebookCells?.find((c) => c.id === cellId);
    if (!cellDef) return;
    setCellSnapshots((prev) => ({
      ...prev,
      [selectedProjectId]: {
        ...(prev[selectedProjectId] || {}),
        [cellId]: cellDef.starterCode,
      },
    }));
  };

  const currentCode =
    currentProject.notebookCells && currentProject.notebookCells.length > 0
      ? currentProject.notebookCells.map((c) => getCellCode(c.id)).join('\n\n')
      : (codeSnapshots[selectedProjectId] ?? currentProject.starterCode);

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
    setCellSnapshots((prev) => {
      const next = { ...prev };
      delete next[selectedProjectId];
      return next;
    });
  };

  const selectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentStepIndex(0);
    setActiveView('workspace');
  };

  const recordActivity = (type: 'lab' | 'flashcards' | 'quiz' | 'checkin' = 'checkin') => {
    const todayStr = new Date().toISOString().split('T')[0];
    setStreakData((prev) => {
      const historySet = new Set(prev.activityHistory || []);
      historySet.add(todayStr);
      const newHistory = Array.from(historySet).sort();

      const { currentStreak } = computeStreak(newHistory);
      const newLongest = Math.max(prev.longestStreak || 0, currentStreak);

      const isToday = prev.lastActiveDate === todayStr;
      const baseTasks = isToday
        ? prev.todaysTasksCompleted || INITIAL_STREAK.todaysTasksCompleted
        : INITIAL_STREAK.todaysTasksCompleted;

      const updatedTasks = {
        lab: baseTasks.lab || type === 'lab',
        flashcards: baseTasks.flashcards || type === 'flashcards',
        quiz: baseTasks.quiz || type === 'quiz',
      };

      return {
        currentStreak,
        longestStreak: newLongest,
        lastActiveDate: todayStr,
        activityHistory: newHistory,
        todaysTasksCompleted: updatedTasks,
      };
    });
  };

  const markStepComplete = (stepNumber: number) => {
    recordActivity('lab');
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
    recordActivity('flashcards');
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
    recordActivity('quiz');
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

  // Dynamic readiness score calculation: starts at 0% for new users!
  const totalPossibleSteps = MICRO_PROJECTS.reduce((acc, p) => acc + p.steps.length, 0);
  const totalCompletedSteps = MICRO_PROJECTS.reduce(
    (acc, p) => acc + (completedStepsMap[p.id]?.length || 0),
    0
  );
  const labReadiness = totalPossibleSteps > 0 ? (totalCompletedSteps / totalPossibleSteps) * 60 : 0;
  const quizReadiness = quizHistory.length > 0
    ? (quizHistory.reduce((acc, q) => acc + q.percentage, 0) / (quizHistory.length * 100)) * 40
    : 0;
  const readinessPercentage = Math.min(100, Math.round(labReadiness + quizReadiness));

  const toggleBonusProjectSelection = (projectId: string) => {
    setSelectedBonusProjectIds((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId]
    );
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...updates };
      if (updates.name) {
        const rawName = updates.name.trim();
        const initials = rawName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2) || prev.avatar;
        updated.avatar = initials;
      }
      return updated;
    });
  };

  const resetAllProgress = () => {
    setCompletedStepsMap({});
    setCodeSnapshots({});
    setCellSnapshots({});
    setSelectedBonusProjectIds([]);
    setFlashcards(INITIAL_FLASHCARDS);
    setChecklistItems(INITIAL_CHECKLIST_ITEMS);
    setQuizHistory([]);
    setStreakData(INITIAL_STREAK);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          curriculumVersion: CURRICULUM_VERSION,
          completedStepsMap: {},
          codeSnapshots: {},
          cellSnapshots: {},
          selectedBonusProjectIds: [],
          flashcards: INITIAL_FLASHCARDS,
          checklistItems: INITIAL_CHECKLIST_ITEMS,
          quizHistory: [],
          darkMode,
          userProfile: currentUser,
          streakData: INITIAL_STREAK,
        })
      );
    } catch {
      // Ignore storage quota errors
    }
  };

  const login = (
    email: string,
    name?: string,
    startingDomain: number = 1,
    experienceLevel: string = 'Beginner'
  ) => {
    const rawName = name?.trim() || (email.split('@')[0] ? email.split('@')[0].replace(/[._]/g, ' ') : 'Student Candidate');
    const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    const initials = displayName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'SC';

    const defaultExamDate = new Date();
    defaultExamDate.setDate(defaultExamDate.getDate() + 30);

    const profile: UserProfile = {
      name: displayName,
      email: email || 'candidate@student.pcep',
      role: `Domain 0${startingDomain} Candidate · ${experienceLevel}`,
      avatar: initials,
      githubHandle: email.split('@')[0] || 'pcep-student',
      isAuthenticated: true,
      startingDomain,
      experienceLevel,
      targetExamDate: currentUser.targetExamDate || defaultExamDate.toISOString().split('T')[0],
      studyPace: currentUser.studyPace || 'standard',
      hasSeenTour: currentUser.hasSeenTour || false,
      hasDismissedWelcome: currentUser.hasDismissedWelcome || false,
      diagnosticResult: currentUser.diagnosticResult,
    };

    setCurrentUser(profile);
    setIsLoginModalOpen(false);

    // Pre-select the matching syllabus lab for their chosen starting domain
    const targetProj = MICRO_PROJECTS.find((p) => p.sectionNumber === startingDomain) || MICRO_PROJECTS[0];
    setSelectedProjectId(targetProj.id);
    setCurrentStepIndex(0);
    setActiveView('home');
  };

  const logout = () => {
    setCurrentUser({
      name: '',
      email: '',
      role: 'Candidate Student',
      avatar: 'CS',
      githubHandle: '',
      isAuthenticated: false,
      startingDomain: 1,
      experienceLevel: 'Beginner',
      hasSeenTour: false,
      hasDismissedWelcome: false,
      studyPace: 'standard',
    });
    setIsLoginModalOpen(true);
    setActiveView('home');
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
        getCellCode,
        getProjectCellCode,
        setCellCode,
        resetCellCode,
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
        updateUserProfile,
        login,
        logout,
        isLoginModalOpen,
        setIsLoginModalOpen,
        isAccountModalOpen,
        setIsAccountModalOpen,
        isDiagnosticModalOpen,
        setIsDiagnosticModalOpen,
        isTourModalOpen,
        setIsTourModalOpen,
        resetAllProgress,
        completedStepsMap,
        readinessPercentage,
        streakData: {
          ...streakData,
          currentStreak: computeStreak(streakData.activityHistory).currentStreak,
        },
        recordActivity,
        currentStreak: computeStreak(streakData.activityHistory).currentStreak,
        longestStreak: Math.max(
          streakData.longestStreak || 0,
          computeStreak(streakData.activityHistory).currentStreak
        ),
        hasPracticedToday: computeStreak(streakData.activityHistory).hasPracticedToday,
        selectedBonusProjectIds,
        toggleBonusProjectSelection,
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
