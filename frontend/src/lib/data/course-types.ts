// ============================================================
// PROOFLEARN — Core Course Type Definitions
// ============================================================

export interface Resource {
  id: string;
  title: string;
  provider: string;
  type: "documentation" | "tutorial" | "video" | "platform" | "book" | "tool" | "github" | "course";
  url: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  isFree: boolean;
  embedUrl?: string;
  badge?: "Google Skills" | "Roadmap.sh" | "MindLuster" | "YouTube" | "Official Docs" | string;
}

export interface PracticeQuestion {
  id: string;
  prompt: string;
  codeSnippet?: string;
  type: "multiple-choice" | "short-answer" | "code-prediction";
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  hints?: string[];
}

export interface ProofQuestion {
  id: string;
  prompt: string;
  scenario?: string;
  codeSnippet?: string;
  type?: "multiple-choice" | "code-prediction" | "scenario-analysis";
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface ProofChallenge {
  id: string;
  title: string;
  scenario: string;
  prompt?: string;
  type?: "multiple-choice" | "code-prediction" | "scenario-analysis" | "implementation-design";
  options?: string[];
  correctAnswer?: string | number;
  rubricGuidelines: string[];
  explanation?: string;
  passingScorePercent?: number; // default 70
  questions?: ProofQuestion[]; // multi-question proof challenge quiz
}

export interface LessonLearningLink {
  title: string;
  provider: string;
  url: string;
  description?: string;
  badge?: string;
}

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  summary: string;
  durationMinutes: number;
  order: number;
  content: string;
  keyTakeaways: string[];
  practiceQuestions: PracticeQuestion[];
  proofChallenge: ProofChallenge;
  videoUrl?: string;
  videoEmbedId?: string;
  videoTitle?: string;
  learningLinks?: LessonLearningLink[];
}

export interface Module {
  id: string;
  slug: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

export type CourseCategory =
  | "Programming"
  | "Development"
  | "Database"
  | "AI & ML"
  | "Data Science"
  | "Computer Science (CSE)"
  | "Electronics & Embedded (ECE)"
  | "Cloud Computing"
  | "Cybersecurity"
  | "Tools & DevOps"
  | "Mobile Development"
  | "Web3 & Blockchain"
  | "Software Architecture"
  | "Data Visualization"
  | "UI/UX & Design"
  | "Quality Assurance"
  | "Mathematics"
  | "Career";

export interface FinalExamQuestion {
  id: string;
  prompt: string;
  codeSnippet?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface FinalExamTask {
  id: string;
  title: string;
  scenario: string;
  requirements: string[];
  deliverable: string;
}

export interface FinalExam {
  id: string;
  title: string;
  description: string;
  timeLimitMinutes?: number;
  passingScorePercent: number; // default 70
  questions: FinalExamQuestion[];
  tasks?: FinalExamTask[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: CourseCategory;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedHours: number;
  iconName: string;
  badgeColor: string;
  prerequisites: string[];
  learningOutcomes: string[];
  resources: Resource[];
  modules: Module[];
  roadmapUrl?: string;
  googleSkillsUrl?: string;
  mindlusterUrl?: string;
  featuredVideoUrl?: string;
  featuredVideoEmbedId?: string;
  featuredVideoTitle?: string;
  finalExam?: FinalExam;
}

