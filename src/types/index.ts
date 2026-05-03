export type PatientStatus =
  | "not_triaged"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "discharged"
  | "ghost"
  | "sleeping"
  | "review_due";

export type Patient = {
  id: string;
  name: string;
  subject: string;
  description?: string;
  status: PatientStatus;
  cureIndex: number;
  hearts: number;
  attempts: number;
  consecutiveGreen: number;
  nextReviewAt?: string;
  lastReviewAt?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  dischargeReviewStep?: number;
  missedReviewPenaltyAt?: string;
  avatarUrl?: string;
  avatarAlt?: string;
  avatarStyle?: string;
};

export type QuestionDifficulty = "easy" | "medium" | "hard";

export type QuestionImage = {
  id: string;
  src: string;
  alt?: string;
  caption?: string;
};

export type Question = {
  id: string;
  subject: string;
  topic: string;
  difficulty: QuestionDifficulty;
  statement: string;
  alternatives: string[];
  correctAnswer: string;
  explanation: string;
  hint?: string;
  relatedFormula?: string;
  tags?: string[];
  image?: QuestionImage;
  explanationImage?: QuestionImage;
  createdAt: string;
  updatedAt: string;
};

export type Flashcard = {
  front: string;
  back: string;
};

export type TheoryMedication = {
  id: string;
  subject: string;
  topic: string;
  title: string;
  summary: string;
  formulas: string[];
  whenToUse: string[];
  commonMistakes: string[];
  solvedExample: string;
  flashcards: Flashcard[];
  image?: QuestionImage;
  studiedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TriageResponse = {
  questionId: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  confidence: 1 | 2 | 3 | 4;
  timeSpentSeconds?: number;
};

export type PatientAttempt = {
  id: string;
  patientId: string;
  date: string;
  responses: TriageResponse[];
  cureIndex: number;
  previousStatus: PatientStatus;
  newStatus: PatientStatus;
  notes?: string;
};

export type PatientRecord = {
  patientId: string;
  attempts: PatientAttempt[];
  recommendedMedications: string[];
};

export type AppSettings = {
  studentName?: string;
  darkMode: boolean;
  examMode: boolean;
  appName: string;
};

export type ExamPriority = "low" | "medium" | "high" | "urgent";

export type ExamTopic = {
  patientId: string;
  topicName: string;
  subject: string;
  weight: 1 | 2 | 3 | 4 | 5;
};

export type Exam = {
  id: string;
  title: string;
  subject: string;
  date: string;
  description?: string;
  priority: ExamPriority;
  topics: ExamTopic[];
  createdAt: string;
  updatedAt: string;
};

export type DailyStudyPlanItem = {
  id: string;
  date: string;
  examId: string;
  patientId: string;
  topicName: string;
  subject: string;
  actionType: "triage" | "study_theory" | "review" | "questions" | "final_review";
  reason: string;
  priorityScore: number;
  completed: boolean;
};

export type AppData = {
  patients: Patient[];
  questions: Question[];
  medications: TheoryMedication[];
  records: PatientRecord[];
  settings: AppSettings;
  exams: Exam[];
  dailyStudyPlan: DailyStudyPlanItem[];
};

export type ImportConflictMode = "replace" | "ignore" | "duplicate";
