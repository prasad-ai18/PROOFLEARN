-- =====================================================================
-- PROOFLEARN: Proof Mode Challenges & Seed Data (Migration 000004)
-- =====================================================================
-- Description: Creates proof_challenges repository table with RLS and seeds
--              high-quality conceptual challenges testing independent mastery.
-- =====================================================================

-- 1. CREATE PROOF CHALLENGES TABLE
CREATE TABLE IF NOT EXISTS public.proof_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    concept_id UUID NOT NULL REFERENCES public.concepts(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    prompt TEXT NOT NULL,
    rubric_guidelines JSONB, -- Evaluation criteria for independent response
    difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_proof_challenges_updated_at
    BEFORE UPDATE ON public.proof_challenges
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_proof_challenges_concept_id ON public.proof_challenges(concept_id);
CREATE INDEX IF NOT EXISTS idx_proof_challenges_is_active ON public.proof_challenges(is_active);

-- Enable RLS
ALTER TABLE public.proof_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access on active proof challenges"
    ON public.proof_challenges FOR SELECT
    USING (is_active = TRUE);

-- 2. SEED PROOF CHALLENGES
DO $$
DECLARE
    v_python_func_id UUID;
    v_python_var_id UUID;
    v_sql_joins_id UUID;
    v_aiml_split_id UUID;
BEGIN
    SELECT id INTO v_python_func_id FROM public.concepts WHERE slug = 'functions' LIMIT 1;
    SELECT id INTO v_python_var_id FROM public.concepts WHERE slug = 'variables-data-types' LIMIT 1;
    SELECT id INTO v_sql_joins_id FROM public.concepts WHERE slug = 'joins' LIMIT 1;
    SELECT id INTO v_aiml_split_id FROM public.concepts WHERE slug = 'train-test-split' LIMIT 1;

    -- Challenge for Python -> Functions
    IF v_python_func_id IS NOT NULL THEN
        INSERT INTO public.proof_challenges (concept_id, title, prompt, rubric_guidelines, difficulty)
        VALUES (
            v_python_func_id,
            'Modular Discount Calculator Design',
            'You are building an e-commerce checkout pipeline where cart item subtotals, promotional percentages, and shipping surcharges must be computed across multiple invoice templates. Explain in detail how you would design a dedicated Python function to encapsulate this logic. In your response: (1) specify the parameters and return value, (2) explain how function scope prevents accidental mutation of other variables, and (3) explain why using a function here is superior to writing duplicate inline arithmetic in every template.',
            '{"required_elements": ["parameters and return signature", "local variable scope isolation", "reusability and single source of truth benefits"]}'::jsonb,
            'beginner'
        );
    END IF;

    -- Challenge for Python -> Variables & Data Types
    IF v_python_var_id IS NOT NULL THEN
        INSERT INTO public.proof_challenges (concept_id, title, prompt, rubric_guidelines, difficulty)
        VALUES (
            v_python_var_id,
            'Immutable State & Cache Integrity',
            'Explain the architectural difference between mutable (e.g. list) and immutable (e.g. tuple) data structures in Python. Describe a scenario where using an immutable tuple as a dictionary key or cache token is required for program correctness, and what runtime failure would occur if a mutable list were used instead.',
            '{"required_elements": ["mutability definition", "hashability requirements for dict keys", "TypeError unhashable type explanation"]}'::jsonb,
            'beginner'
        );
    END IF;

    -- Challenge for SQL -> JOINs
    IF v_sql_joins_id IS NOT NULL THEN
        INSERT INTO public.proof_challenges (concept_id, title, prompt, rubric_guidelines, difficulty)
        VALUES (
            v_sql_joins_id,
            'Auditing Incomplete Customer Orders',
            'You have two tables: "customers" and "orders". The accounting team needs a list of ALL registered customers, including those who have never placed an order, showing their order totals or NULL. Explain whether an INNER JOIN or a LEFT JOIN must be used, why the alternative would produce incomplete or erroneous business data, and how NULL values in the right table should be interpreted.',
            '{"required_elements": ["LEFT JOIN selection justification", "why INNER JOIN omits non-ordering customers", "NULL interpretation in outer records"]}'::jsonb,
            'intermediate'
        );
    END IF;

    -- Challenge for AI & ML -> Train/Test Split
    IF v_aiml_split_id IS NOT NULL THEN
        INSERT INTO public.proof_challenges (concept_id, title, prompt, rubric_guidelines, difficulty)
        VALUES (
            v_aiml_split_id,
            'Data Leakage Prevention in Production ML',
            'Explain what data leakage is in machine learning and why evaluating a model on the same data it was trained on produces deceptive metrics. Describe the exact protocol you must follow when splitting a dataset into training and testing partitions, specifically regarding feature scaling and imputation.',
            '{"required_elements": ["data leakage definition", "overfitting and optimistic bias", "fit on train only, transform on test"]}'::jsonb,
            'beginner'
        );
    END IF;

END $$;
