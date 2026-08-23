-- =====================================================================
-- PROOFLEARN: Complete SaaS Relational Schema & Seed Data (Migration 000006)
-- =====================================================================
-- Description: Creates structured tables for courses, modules, lessons,
--              practice questions, proof challenges, and user progress tracking.
-- =====================================================================

-- 1. COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    tagline TEXT,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    estimated_hours INTEGER NOT NULL DEFAULT 20,
    icon_name TEXT NOT NULL DEFAULT 'BookOpen',
    badge_color TEXT NOT NULL DEFAULT 'emerald',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. MODULES TABLE
CREATE TABLE IF NOT EXISTS public.modules (
    id TEXT PRIMARY KEY,
    course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(course_id, slug)
);

-- 3. LESSONS TABLE
CREATE TABLE IF NOT EXISTS public.lessons (
    id TEXT PRIMARY KEY,
    module_id TEXT NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    summary TEXT,
    content TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 20,
    order_index INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(module_id, slug)
);

-- 4. USER LESSON PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.user_lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_slug TEXT NOT NULL,
    module_slug TEXT NOT NULL,
    lesson_slug TEXT NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, course_slug, module_slug, lesson_slug)
);

-- 5. USER PROOF ATTEMPTS TABLE
CREATE TABLE IF NOT EXISTS public.user_proof_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_slug TEXT NOT NULL,
    module_slug TEXT NOT NULL,
    lesson_slug TEXT NOT NULL,
    score NUMERIC(5, 2) NOT NULL DEFAULT 100.0,
    passed BOOLEAN NOT NULL DEFAULT TRUE,
    response TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_proof_attempts ENABLE ROW LEVEL SECURITY;

-- Public read on courses, modules, lessons
CREATE POLICY "Public read on courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Public read on modules" ON public.modules FOR SELECT USING (true);
CREATE POLICY "Public read on lessons" ON public.lessons FOR SELECT USING (true);

-- User isolated progress policies
CREATE POLICY "Users read own progress" ON public.user_lesson_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own progress" ON public.user_lesson_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own progress" ON public.user_lesson_progress FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users read own proofs" ON public.user_proof_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own proofs" ON public.user_proof_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
