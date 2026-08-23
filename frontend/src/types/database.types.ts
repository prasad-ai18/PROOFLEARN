export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
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
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [
          {
            foreignKeyName: "concepts_subject_id_fkey";
            columns: ["subject_id"];
            isOneToOne: false;
            referencedRelation: "subjects";
            referencedColumns: ["id"];
          }
        ];
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
        Relationships: [
          {
            foreignKeyName: "learning_sessions_concept_id_fkey";
            columns: ["concept_id"];
            isOneToOne: false;
            referencedRelation: "concepts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "learning_sessions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
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
        Relationships: [
          {
            foreignKeyName: "practice_attempts_concept_id_fkey";
            columns: ["concept_id"];
            isOneToOne: false;
            referencedRelation: "concepts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "practice_attempts_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "learning_sessions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "practice_attempts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
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
        Relationships: [
          {
            foreignKeyName: "proof_attempts_concept_id_fkey";
            columns: ["concept_id"];
            isOneToOne: false;
            referencedRelation: "concepts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "proof_attempts_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "learning_sessions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "proof_attempts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
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
        Relationships: [
          {
            foreignKeyName: "transfer_attempts_concept_id_fkey";
            columns: ["concept_id"];
            isOneToOne: false;
            referencedRelation: "concepts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transfer_attempts_proof_attempt_id_fkey";
            columns: ["proof_attempt_id"];
            isOneToOne: false;
            referencedRelation: "proof_attempts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transfer_attempts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
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
        Relationships: [
          {
            foreignKeyName: "ai_interactions_concept_id_fkey";
            columns: ["concept_id"];
            isOneToOne: false;
            referencedRelation: "concepts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ai_interactions_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "learning_sessions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ai_interactions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
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
        Relationships: [
          {
            foreignKeyName: "learning_evidence_results_proof_attempt_id_fkey";
            columns: ["proof_attempt_id"];
            isOneToOne: false;
            referencedRelation: "proof_attempts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "learning_evidence_results_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "learning_sessions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "learning_evidence_results_transfer_attempt_id_fkey";
            columns: ["transfer_attempt_id"];
            isOneToOne: false;
            referencedRelation: "transfer_attempts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "learning_evidence_results_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Profile = Tables<"profiles">;
export type Subject = Tables<"subjects">;
export type Concept = Tables<"concepts">;
export type LearningSession = Tables<"learning_sessions">;
export type PracticeAttempt = Tables<"practice_attempts">;
export type ProofAttempt = Tables<"proof_attempts">;
export type TransferAttempt = Tables<"transfer_attempts">;
export type AIInteraction = Tables<"ai_interactions">;
export type LearningEvidenceResult = Tables<"learning_evidence_results">;
