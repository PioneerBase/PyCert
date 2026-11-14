export interface PcepObjective {
  id: string; // e.g. "1.1", "3.4"
  sectionNumber: 1 | 2 | 3 | 4 | 5;
  title: string;
  description: string;
  syllabusKeywords: string[];
}

export interface PcepSection {
  sectionNumber: 1 | 2 | 3 | 4 | 5;
  title: string;
  shortTitle: string;
  weightPercentage: number;
  itemCount: number;
  description: string;
  objectives: PcepObjective[];
}

export interface ProjectStep {
  stepNumber: number;
  title: string;
  taskInstruction: string;
  targetObjectiveId: string;
  patternTitle?: string;
  patternCode?: string;
  patternExplanation?: string;
  diagnosticExpr?: string; // Python expression to evaluate and show actual return value on failure
  breadcrumbs: {
    level1Concept: string;
    level2Syntax: string;
    level3Scaffold: string;
  };
  validationSnippet: string; // Python code snippet or expected output test
  expectedExample?: string;
  starterSnippet?: string;
}

export interface NotebookCell {
  id: string;
  kind: 'setup' | 'step';
  stepNumber?: number;
  title: string;
  description?: string;
  starterCode: string;
  solutionCode: string;
  readOnly?: boolean;
}

export interface KernelVariable {
  name: string;
  typeName: string;
  reprValue: string;
}

export interface MicroProject {
  id: string;
  title: string;
  sectionNumber: 1 | 2 | 3 | 4 | 5;
  sectionName: string;
  examWeightPercentage: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedMinutes: number;
  specificObjectives: string[];
  description: string;
  learningOutcomes: string[];
  fileName?: string;
  testFileName?: string;
  keyTip?: string;
  pitfallWarning?: string;
  starterCode: string;
  solutionCode: string;
  notebookCells?: NotebookCell[];
  steps: ProjectStep[];
}

export type BonusTier = 'Easy' | 'Intermediate' | 'Advanced' | 'Cerebral Conquest (Hard Mode)';

export interface BonusProject extends MicroProject {
  tier: BonusTier;
  bonusNumber: number;
  movedFromLab?: string;
}

export interface Flashcard {
  id: string;
  pcepSection: 1 | 2 | 3 | 4 | 5;
  pcepObjective: string;
  category: string;
  frontPrompt: string;
  codeSnippet?: string;
  backAnswer: string;
  syntaxGotcha?: string;
  boxLevel: 1 | 2 | 3 | 4 | 5; // Leitner box 1..5
  intervalDays: number;
  nextReviewDate: string; // ISO date string YYYY-MM-DD
  timesReviewed: number;
  timesCorrect: number;
}

export interface QuizQuestion {
  id: string;
  pcepSection: 1 | 2 | 3 | 4 | 5;
  pcepObjective: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LabTestCase {
  id: string;
  name: string;
  codeCall: string;
  expectedOutput: string;
  actualOutput?: string;
  executionTimeMs?: number;
  passed?: boolean;
  syllabusDiagnostic?: string;
}

export interface LabSpecification {
  specId: string;
  domainLabel: string;
  objectivesText: string;
  algorithmTitle: string;
  algorithmTrajectory: {
    inputChar: string;
    inputOrd: number;
    shiftFormula: string;
    outputChar: string;
    outputOrd: number;
  };
  acceptanceCriteria: Array<{
    id: number;
    label: string;
    satisfied: boolean;
  }>;
  warningNote: string;
}

export interface CapstoneProject {
  id: string;
  title: string;
  subtitle: string;
  domain: string;
  status: 'synced' | 'ready' | 'draft';
  statusLabel: string;
  commitsCount: number;
  description: string;
  coveragePercent?: number;
  unitTestsPassing?: string;
  tags: string[];
  codePreviewSnippet: string;
  githubRepoUrl: string;
  syllabusGoal?: string;
  cornerCasesCount?: number;
}

export interface ChecklistItem {
  id: string;
  label: string;
  sublines: string[];
  category: 'Repository Setup' | 'Documentation (README)' | 'Deployment & Security' | 'Showcase & Resume';
  checked: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
  githubHandle: string;
  isAuthenticated: boolean;
  startingDomain?: number;
  experienceLevel?: string;
  targetExamDate?: string;
  studyPace?: 'relaxed' | 'standard' | 'intensive';
  hasSeenTour?: boolean;
  diagnosticResult?: {
    score: number;
    total: number;
    recommendedDomain: number;
    recommendedLevel: string;
    completedAt: string;
  };
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  activityHistory: string[];
  todaysTasksCompleted: {
    lab: boolean;
    flashcards: boolean;
    quiz: boolean;
  };
}

export interface UserProgressState {
  completedProjectIds: string[];
  projectSnapshots: Record<string, { code: string; currentStep: number; completedSteps: number[] }>;
  flashcards: Flashcard[];
  quizHistory: Array<{
    id: string;
    date: string;
    section: number | 'all';
    score: number;
    total: number;
    percentage: number;
  }>;
  checklistItems: ChecklistItem[];
  userProfile?: UserProfile;
  streakData?: StreakData;
}
