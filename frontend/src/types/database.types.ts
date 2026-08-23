/**
 * PROOFLEARN Database Type Definitions
 * Represents the public PostgreSQL database schema managed via Supabase.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      subjects: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      concepts: {
        Row: {
          id: string;
          subject_id: string;
          name: string;
          slug: string;
          description: string | null;
          difficulty: "beginner" | "intermediate" | "advanced";
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          subject_id: string;
          name: string;
          slug: string;
          description?: string | null;
          difficulty: "beginner" | "intermediate" | "advanced";
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          subject_id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          difficulty?: "beginner" | "intermediate" | "advanced";
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      learning_sessions: {
        Row: {
          id: string;
          user_id: string;
          concept_id: string;
          started_at: string;
          ended_at: string | null;
          status: "active" | "completed" | "abandoned";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          concept_id: string;
          started_at?: string;
          ended_at?: string | null;
          status?: "active" | "completed" | "abandoned";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          concept_id?: string;
          started_at?: string;
          ended_at?: string | null;
          status?: "active" | "completed" | "abandoned";
          created_at?: string;
          updated_at?: string;
        };
      };
      practice_attempts: {
        Row: {
          id: string;
          user_id: string;
          session_id: string;
          concept_id: string;
          question_type: string;
          question_text: string;
          student_answer: string | null;
          is_correct: boolean | null;
          score: number | null;
          feedback: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_id: string;
          concept_id: string;
          question_type: string;
          question_text: string;
          student_answer?: string | null;
          is_correct?: boolean | null;
          score?: number | null;
          feedback?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          session_id?: string;
          concept_id?: string;
          question_type?: string;
          question_text?: string;
          student_answer?: string | null;
          is_correct?: boolean | null;
          score?: number | null;
          feedback?: string | null;
          created_at?: string;
        };
      };
      proof_attempts: {
        Row: {
          id: string;
          user_id: string;
          session_id: string;
          concept_id: string;
          prompt: string;
          student_answer: string | null;
          explanation: string | null;
          started_at: string;
          submitted_at: string | null;
          status: "started" | "submitted" | "evaluated";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_id: string;
          concept_id: string;
          prompt: string;
          student_answer?: string | null;
          explanation?: string | null;
          started_at?: string;
          submitted_at?: string | null;
          status?: "started" | "submitted" | "evaluated";
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          session_id?: string;
          concept_id?: string;
          prompt?: string;
          student_answer?: string | null;
          explanation?: string | null;
          started_at?: string;
          submitted_at?: string | null;
          status?: "started" | "submitted" | "evaluated";
          created_at?: string;
        };
      };
      transfer_attempts: {
        Row: {
          id: string;
          user_id: string;
          proof_attempt_id: string;
          concept_id: string;
          challenge_prompt: string;
          student_answer: string | null;
          score: number | null;
          evaluation_notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          proof_attempt_id: string;
          concept_id: string;
          challenge_prompt: string;
          student_answer?: string | null;
          score?: number | null;
          evaluation_notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          proof_attempt_id?: string;
          concept_id?: string;
          challenge_prompt?: string;
          student_answer?: string | null;
          score?: number | null;
          evaluation_notes?: string | null;
          created_at?: string;
        };
      };
      ai_interactions: {
        Row: {
          id: string;
          user_id: string;
          session_id: string;
          concept_id: string;
          provider: "gemini" | "fallback";
          model: string;
          request_type: string;
          user_message: string;
          assistant_response: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_id: string;
          concept_id: string;
          provider: "gemini" | "fallback";
          model: string;
          request_type: string;
          user_message: string;
          assistant_response: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          session_id?: string;
          concept_id?: string;
          provider?: "gemini" | "fallback";
          model?: string;
          request_type?: string;
          user_message?: string;
          assistant_response?: string;
          created_at?: string;
        };
      };
      learning_evidence_results: {
        Row: {
          id: string;
          user_id: string;
          session_id: string;
          proof_attempt_id: string;
          transfer_attempt_id: string | null;
          recall_score: number | null;
          explanation_score: number | null;
          application_score: number | null;
          transfer_score: number | null;
          independence_score: number | null;
          ai_dependency_score: number | null;
          lei_score: number | null;
          interpretation: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_id: string;
          proof_attempt_id: string;
          transfer_attempt_id?: string | null;
          recall_score?: number | null;
          explanation_score?: number | null;
          application_score?: number | null;
          transfer_score?: number | null;
          independence_score?: number | null;
          ai_dependency_score?: number | null;
          lei_score?: number | null;
          interpretation?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          session_id?: string;
          proof_attempt_id?: string;
          transfer_attempt_id?: string | null;
          recall_score?: number | null;
          explanation_score?: number | null;
          application_score?: number | null;
          transfer_score?: number | null;
          independence_score?: number | null;
          ai_dependency_score?: number | null;
          lei_score?: number | null;
          interpretation?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
