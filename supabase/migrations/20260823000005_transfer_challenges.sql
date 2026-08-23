-- =====================================================================
-- PROOFLEARN: Transfer Challenges Schema & Seed Data (Migration 000005)
-- =====================================================================
-- Description: Creates transfer_challenges repository table with RLS and seeds
--              high-quality transfer scenarios testing concept application
--              in novel, realistic contexts (Same Concept + New Context).
-- =====================================================================

-- 1. CREATE TRANSFER CHALLENGES TABLE
CREATE TABLE IF NOT EXISTS public.transfer_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    concept_id UUID NOT NULL REFERENCES public.concepts(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    scenario TEXT NOT NULL,
    prompt TEXT NOT NULL,
    rubric_guidelines JSONB,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_transfer_challenges_updated_at
    BEFORE UPDATE ON public.transfer_challenges
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_transfer_challenges_concept_id ON public.transfer_challenges(concept_id);
CREATE INDEX IF NOT EXISTS idx_transfer_challenges_is_active ON public.transfer_challenges(is_active);

-- Enable RLS
ALTER TABLE public.transfer_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access on active transfer challenges"
    ON public.transfer_challenges FOR SELECT
    USING (is_active = TRUE);

-- 2. SEED TRANSFER CHALLENGES (SAME CONCEPT + NEW CONTEXT)
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

    -- Transfer Challenge for Python -> Functions
    -- New Context: Automated IoT Sensor Telemetry Pipeline (Alert Filtering & Normalization)
    IF v_python_func_id IS NOT NULL THEN
        INSERT INTO public.transfer_challenges (concept_id, title, scenario, prompt, rubric_guidelines, difficulty)
        VALUES (
            v_python_func_id,
            'IoT Sensor Telemetry Normalization & Alert Dispatcher',
            'You are designing a data ingestion service for agricultural IoT sensors deployed across multiple greenhouses. Each sensor sends raw voltage readings that must be converted to temperature (Celsius), validated against safe crop threshold ranges, and flagged if anomalous. Different sensor vendors produce different raw voltage calibrations.',
            'Explain how you would design modular Python functions to handle sensor conversion, calibration offsets, and anomaly detection. In your explanation:\n1. Specify the function signatures (names, parameters with types, and return values).\n2. Explain how decomposing this into multiple single-responsibility functions is superior to one large script.\n3. Describe how you would compose or pass functions if a new sensor manufacturer with a custom calibration formula is added.',
            '{"required_signals": ["parameter and return specifications", "single-responsibility decomposition", "extensibility / higher-order composition"]}'::jsonb,
            'beginner'
        );
    END IF;

    -- Transfer Challenge for Python -> Variables & Data Types
    -- New Context: Thread-Safe Microservice Configuration & Route Routing
    IF v_python_var_id IS NOT NULL THEN
        INSERT INTO public.transfer_challenges (concept_id, title, scenario, prompt, rubric_guidelines, difficulty)
        VALUES (
            v_python_var_id,
            'High-Concurrency API Gateway Route Routing & Immutability',
            'You are architecting an API gateway that routes incoming HTTP requests based on HTTP Method and Path pairs (e.g. ("POST", "/api/v1/checkout")). Hundreds of asynchronous worker threads query this routing table simultaneously.',
            'Explain how you would structure the routing map using Python data types. In your response:\n1. Why must the (Method, Path) composite key be an immutable tuple rather than a list?\n2. What memory or runtime concurrency risks would arise if mutable state were shared across worker lookups?\n3. How does Python''s hash table implementation use immutability to achieve O(1) route lookups?',
            '{"required_signals": ["immutable tuple as hashable dict key", "thread safety and mutation prevention", "hash function collision and O(1) lookup"]}'::jsonb,
            'intermediate'
        );
    END IF;

    -- Transfer Challenge for SQL -> JOINs
    -- New Context: Healthcare Clinical Trial Patient Compliance & Adverse Event Tracking
    IF v_sql_joins_id IS NOT NULL THEN
        INSERT INTO public.transfer_challenges (concept_id, title, scenario, prompt, rubric_guidelines, difficulty)
        VALUES (
            v_sql_joins_id,
            'Clinical Trial Drug Adherence & Safety Auditing',
            'A pharmaceutical research lab manages two relational tables: "trial_participants" (enrolled patient records) and "adverse_events" (reported medical incidents). Regulators require a compliance audit report that: (a) lists EVERY enrolled participant regardless of whether they experienced side effects, (b) flags participants with zero reported adverse events, and (c) aggregates the severity count for patients who did report incidents.',
            'Explain how to structure the SQL query to generate this regulatory report. Specifically:\n1. Explain why a LEFT JOIN from trial_participants to adverse_events is required instead of an INNER JOIN or FULL OUTER JOIN.\n2. How should you filter or aggregate columns from the right table (e.g. using COUNT(adverse_events.id) vs COUNT(*)) to avoid miscounting patients with zero incidents?\n3. What critical clinical conclusion would be corrupted if an INNER JOIN were mistakenly executed?',
            '{"required_signals": ["LEFT JOIN justification for complete cohort audit", "COUNT(column) vs COUNT(*) handling of NULLs", "impact of dropping healthy patients from safety audit"]}'::jsonb,
            'intermediate'
        );
    END IF;

    -- Transfer Challenge for AI & ML -> Train/Test Split
    -- New Context: Financial Time-Series Fraud Detection & Temporal Split
    IF v_aiml_split_id IS NOT NULL THEN
        INSERT INTO public.transfer_challenges (concept_id, title, scenario, prompt, rubric_guidelines, difficulty)
        VALUES (
            v_aiml_split_id,
            'Financial Fraud Detection & Temporal Cross-Validation',
            'A fintech payment platform is training a gradient boosted tree to detect credit card fraud across 5 million sequential transactions recorded over the last 12 months. Fraud patterns evolve as attackers change tactics.',
            'Explain why standard random train/test split (e.g. train_test_split(shuffle=True)) creates severe data leakage and lookahead bias in this scenario. In your response:\n1. Explain why a temporal (time-based) split must be used instead of random shuffling.\n2. Describe the exact ordering protocol for data preprocessing (scaling, target encoding, frequency encodings).\n3. How would evaluating on a randomly shuffled split yield misleadingly high metrics that fail catastrophically in production?',
            '{"required_signals": ["temporal data leakage / lookahead bias", "chronological partition order", "fit transformers strictly on historical train partition"]}'::jsonb,
            'intermediate'
        );
    END IF;

END $$;
