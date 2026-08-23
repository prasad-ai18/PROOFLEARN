-- =====================================================================
-- PROOFLEARN: Initial PostgreSQL Database Schema (Migration 000001)
-- =====================================================================
-- Description: Core tables, relational constraints, updated_at triggers,
--              performance indexes, and Row Level Security (RLS) policies.
-- =====================================================================

-- 1. EXTENSIONS & UTILITIES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Reusable timestamp trigger function for auto-updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. PROFILES TABLE (Associated with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 3. SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_subjects_updated_at
    BEFORE UPDATE ON public.subjects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4. CONCEPTS TABLE
CREATE TABLE IF NOT EXISTS public.concepts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_subject_concept_slug UNIQUE (subject_id, slug)
);

CREATE TRIGGER set_concepts_updated_at
    BEFORE UPDATE ON public.concepts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 5. LEARNING SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.learning_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    concept_id UUID NOT NULL REFERENCES public.concepts(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_learning_sessions_updated_at
    BEFORE UPDATE ON public.learning_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. PRACTICE ATTEMPTS TABLE
CREATE TABLE IF NOT EXISTS public.practice_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES public.learning_sessions(id) ON DELETE CASCADE,
    concept_id UUID NOT NULL REFERENCES public.concepts(id) ON DELETE CASCADE,
    question_type TEXT NOT NULL,
    question_text TEXT NOT NULL,
    student_answer TEXT,
    is_correct BOOLEAN,
    score NUMERIC(5, 2) CHECK (score IS NULL OR (score >= 0 AND score <= 100)),
    feedback TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. PROOF ATTEMPTS TABLE (Independent Proof Mode Challenge)
CREATE TABLE IF NOT EXISTS public.proof_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES public.learning_sessions(id) ON DELETE CASCADE,
    concept_id UUID NOT NULL REFERENCES public.concepts(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    student_answer TEXT,
    explanation TEXT,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    submitted_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'started' CHECK (status IN ('started', 'submitted', 'evaluated')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. TRANSFER ATTEMPTS TABLE (Cross-Domain Transfer Challenge)
CREATE TABLE IF NOT EXISTS public.transfer_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    proof_attempt_id UUID NOT NULL REFERENCES public.proof_attempts(id) ON DELETE CASCADE,
    concept_id UUID NOT NULL REFERENCES public.concepts(id) ON DELETE CASCADE,
    challenge_prompt TEXT NOT NULL,
    student_answer TEXT,
    score NUMERIC(5, 2) CHECK (score IS NULL OR (score >= 0 AND score <= 100)),
    evaluation_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. AI INTERACTIONS TABLE (Tutoring chat audit log during learning)
CREATE TABLE IF NOT EXISTS public.ai_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES public.learning_sessions(id) ON DELETE CASCADE,
    concept_id UUID NOT NULL REFERENCES public.concepts(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('gemini', 'fallback')),
    model TEXT NOT NULL,
    request_type TEXT NOT NULL,
    user_message TEXT NOT NULL,
    assistant_response TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. LEARNING EVIDENCE RESULTS TABLE (Verifiable Evidence Ledger)
CREATE TABLE IF NOT EXISTS public.learning_evidence_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES public.learning_sessions(id) ON DELETE CASCADE,
    proof_attempt_id UUID NOT NULL REFERENCES public.proof_attempts(id) ON DELETE CASCADE,
    transfer_attempt_id UUID REFERENCES public.transfer_attempts(id) ON DELETE SET NULL,
    recall_score NUMERIC(5, 2) CHECK (recall_score IS NULL OR (recall_score >= 0 AND recall_score <= 100)),
    explanation_score NUMERIC(5, 2) CHECK (explanation_score IS NULL OR (explanation_score >= 0 AND explanation_score <= 100)),
    application_score NUMERIC(5, 2) CHECK (application_score IS NULL OR (application_score >= 0 AND application_score <= 100)),
    transfer_score NUMERIC(5, 2) CHECK (transfer_score IS NULL OR (transfer_score >= 0 AND transfer_score <= 100)),
    independence_score NUMERIC(5, 2) CHECK (independence_score IS NULL OR (independence_score >= 0 AND independence_score <= 100)),
    ai_dependency_score NUMERIC(5, 2) CHECK (ai_dependency_score IS NULL OR (ai_dependency_score >= 0 AND ai_dependency_score <= 100)),
    lei_score NUMERIC(5, 2) CHECK (lei_score IS NULL OR (lei_score >= 0 AND lei_score <= 100)),
    interpretation TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================
-- INDEXES FOR QUERY OPTIMIZATION & FOREIGN KEY PERFORMANCE
-- =====================================================================

CREATE INDEX IF NOT EXISTS idx_concepts_subject_id ON public.concepts(subject_id);
CREATE INDEX IF NOT EXISTS idx_concepts_slug ON public.concepts(slug);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_user_id ON public.learning_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_concept_id ON public.learning_sessions(concept_id);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_status ON public.learning_sessions(status);
CREATE INDEX IF NOT EXISTS idx_practice_attempts_session_id ON public.practice_attempts(session_id);
CREATE INDEX IF NOT EXISTS idx_practice_attempts_user_id ON public.practice_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_proof_attempts_session_id ON public.proof_attempts(session_id);
CREATE INDEX IF NOT EXISTS idx_proof_attempts_user_id ON public.proof_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_transfer_attempts_proof_id ON public.transfer_attempts(proof_attempt_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_session_id ON public.ai_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_user_id ON public.ai_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_evidence_user_id ON public.learning_evidence_results(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_evidence_proof_id ON public.learning_evidence_results(proof_attempt_id);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proof_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transfer_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_evidence_results ENABLE ROW LEVEL SECURITY;

-- 1. Profiles: Users can view and update only their own profile
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- 2. Subjects: Read-only for authenticated & anonymous users
CREATE POLICY "Allow public read access on active subjects"
    ON public.subjects FOR SELECT
    USING (is_active = TRUE);

-- 3. Concepts: Read-only for active concepts
CREATE POLICY "Allow public read access on active concepts"
    ON public.concepts FOR SELECT
    USING (is_active = TRUE);

-- 4. Learning Sessions: Isolated to the owning user
CREATE POLICY "Users can view own learning sessions"
    ON public.learning_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own learning sessions"
    ON public.learning_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own learning sessions"
    ON public.learning_sessions FOR UPDATE
    USING (auth.uid() = user_id);

-- 5. Practice Attempts: Isolated to user
CREATE POLICY "Users can view own practice attempts"
    ON public.practice_attempts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own practice attempts"
    ON public.practice_attempts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 6. Proof Attempts: Isolated to user
CREATE POLICY "Users can view own proof attempts"
    ON public.proof_attempts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own proof attempts"
    ON public.proof_attempts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own proof attempts"
    ON public.proof_attempts FOR UPDATE
    USING (auth.uid() = user_id);

-- 7. Transfer Attempts: Isolated to user
CREATE POLICY "Users can view own transfer attempts"
    ON public.transfer_attempts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transfer attempts"
    ON public.transfer_attempts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 8. AI Interactions: Isolated to user
CREATE POLICY "Users can view own ai interactions"
    ON public.ai_interactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ai interactions"
    ON public.ai_interactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 9. Learning Evidence Results: Isolated to user (or publicly readable via unique token if shared)
CREATE POLICY "Users can view own learning evidence"
    ON public.learning_evidence_results FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own learning evidence"
    ON public.learning_evidence_results FOR INSERT
    WITH CHECK (auth.uid() = user_id);
