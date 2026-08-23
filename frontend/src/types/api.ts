/**
 * TypeScript definitions for FastAPI backend responses and API client contracts.
 */

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
  environment: string;
}

export interface MeResponse {
  id: string;
  email: string | null;
  authenticated: boolean;
  display_name: string | null;
  avatar_url: string | null;
}

export interface ChatMessage {
  role: "user" | "model" | "assistant";
  content: string;
}

export interface AILearnRequest {
  subject_slug: string;
  concept_slug: string;
  message: string;
  history?: ChatMessage[];
}

export interface AILearnResponse {
  message: string;
  subject: string;
  concept: string;
  provider: string;
  model: string;
}

export interface SafeQuestion {
  id: string;
  question_type: "multiple_choice" | "short_answer";
  question_text: string;
  options?: string[] | null;
  difficulty: string;
  order_index: number;
}

export interface CreatePracticeSessionRequest {
  subject_slug: string;
  concept_slug: string;
}

export interface PracticeSessionResponse {
  session_id: string;
  subject_slug: string;
  concept_slug: string;
  subject_name: string;
  concept_name: string;
  total_questions: number;
  questions: SafeQuestion[];
  current_question_index: number;
  answered_question_ids: string[];
  is_completed: boolean;
  correct_count?: number | null;
  percentage?: number | null;
}

export interface SubmitAnswerRequest {
  question_id: string;
  answer: string;
}

export interface AnswerEvaluationResponse {
  question_id: string;
  is_correct: boolean;
  feedback: string;
  explanation: string;
  is_session_completed: boolean;
  correct_count: number;
  total_questions: number;
  percentage: number;
}

export interface ProofChallenge {
  id: string;
  title: string;
  prompt: string;
  difficulty: string;
}

export interface CreateProofSessionRequest {
  subject_slug: string;
  concept_slug: string;
}

export interface ProofSessionResponse {
  session_id: string;
  subject_slug: string;
  concept_slug: string;
  subject_name: string;
  concept_name: string;
  challenge: ProofChallenge;
  status: string;
  started_at: string;
  is_completed: boolean;
}

export interface SubmitProofRequest {
  student_answer: string;
  explanation?: string | null;
}

export interface ProofSubmissionResponse {
  session_id: string;
  status: string;
  message: string;
  submitted_at: string;
}

export interface ApiErrorDetail {
  code: string;
  message: string;
  details?: Record<string, unknown> | null;
}

export interface ApiErrorResponse {
  error: ApiErrorDetail;
}

export interface ApiClientOptions extends RequestInit {
  timeoutMs?: number;
  token?: string | null;
}
