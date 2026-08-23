-- =====================================================================
-- PROOFLEARN: Practice Questions & Seed Data (Migration 000003)
-- =====================================================================
-- Description: Creates practice_questions table with RLS and seeds
--              high-quality MVP practice questions for core concepts.
-- =====================================================================

-- 1. CREATE PRACTICE QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS public.practice_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    concept_id UUID NOT NULL REFERENCES public.concepts(id) ON DELETE CASCADE,
    question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'short_answer')),
    question_text TEXT NOT NULL,
    options JSONB, -- Array of string options for MCQ
    correct_answer TEXT NOT NULL, -- Server-side evaluated answer
    accepted_variants JSONB, -- Optional array of string variants for short-answer
    explanation TEXT NOT NULL, -- Pedagogical feedback
    difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    order_index INT NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_practice_questions_updated_at
    BEFORE UPDATE ON public.practice_questions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_practice_questions_concept_id ON public.practice_questions(concept_id);
CREATE INDEX IF NOT EXISTS idx_practice_questions_is_active ON public.practice_questions(is_active);

-- Enable RLS
ALTER TABLE public.practice_questions ENABLE ROW LEVEL SECURITY;

-- Note: We intentionally only allow authenticated/public reads for question text and options
-- The correct_answer is evaluated strictly on the authoritative FastAPI backend.
CREATE POLICY "Allow read access on active practice questions"
    ON public.practice_questions FOR SELECT
    USING (is_active = TRUE);

-- 2. SEED PRACTICE QUESTIONS FOR PYTHON -> FUNCTIONS
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

    IF v_python_func_id IS NOT NULL THEN
        -- Q1: Conceptual role of parameters vs arguments (MCQ)
        INSERT INTO public.practice_questions (concept_id, question_type, question_text, options, correct_answer, explanation, difficulty, order_index)
        VALUES (
            v_python_func_id,
            'multiple_choice',
            'In Python, what is the precise distinction between a "parameter" and an "argument"?',
            '["A parameter is the variable defined in the function signature, while an argument is the actual value passed during invocation.", "A parameter is the return value of a function, while an argument is the function name.", "A parameter can only be an integer, while an argument can be any data type.", "Parameters and arguments are completely identical and have no semantic difference in Python."]'::jsonb,
            'A parameter is the variable defined in the function signature, while an argument is the actual value passed during invocation.',
            'Parameters act as placeholders in the function definition (def greet(name):), whereas arguments are the concrete data values passed when calling the function (greet("Alex")).',
            'beginner',
            1
        );

        -- Q2: Scope and local variable lifecycle (MCQ)
        INSERT INTO public.practice_questions (concept_id, question_type, question_text, options, correct_answer, explanation, difficulty, order_index)
        VALUES (
            v_python_func_id,
            'multiple_choice',
            'Consider a variable "x = 10" defined inside a Python function body without the "global" keyword. What happens if you try to print "x" outside the function after calling it?',
            '["It prints 10 because variables defined in functions automatically become global.", "It raises a NameError because "x" exists only within the local function scope.", "It prints None.", "It prints 0."]'::jsonb,
            'It raises a NameError because "x" exists only within the local function scope.',
            'Variables created inside a function are allocated in that function''s local scope frame and are deallocated once execution finishes, making them inaccessible from outer scopes.',
            'beginner',
            2
        );

        -- Q3: Return value behavior (MCQ)
        INSERT INTO public.practice_questions (concept_id, question_type, question_text, options, correct_answer, explanation, difficulty, order_index)
        VALUES (
            v_python_func_id,
            'multiple_choice',
            'If a Python function completes execution without encountering an explicit "return" statement, what value is returned to the caller?',
            '["0", "False", "None", "An empty string \"\""]'::jsonb,
            'None',
            'In Python, all functions implicitly return the singleton object "None" if no explicit return expression is evaluated.',
            'beginner',
            3
        );

        -- Q4: Default parameter evaluation (MCQ)
        INSERT INTO public.practice_questions (concept_id, question_type, question_text, options, correct_answer, explanation, difficulty, order_index)
        VALUES (
            v_python_func_id,
            'multiple_choice',
            'Why is using a mutable object (like a list "[]" or dictionary "{}") as a default parameter value generally discouraged in Python?',
            '["Python does not allow mutable objects in function signatures and will raise a SyntaxError.", "The default mutable object is instantiated only once when the function is defined, causing state to persist across multiple function calls.", "Mutable default parameters cause functions to execute significantly slower.", "Mutable default arguments cannot accept positional values."]'::jsonb,
            'The default mutable object is instantiated only once when the function is defined, causing state to persist across multiple function calls.',
            'Default parameter values are evaluated once at function definition time, not every time the function is called. Hence, mutating the list mutates the shared default object for all future calls.',
            'intermediate',
            4
        );

        -- Q5: Keyword arguments and invocation (Short Answer)
        INSERT INTO public.practice_questions (concept_id, question_type, question_text, options, correct_answer, accepted_variants, explanation, difficulty, order_index)
        VALUES (
            v_python_func_id,
            'short_answer',
            'What keyword in Python is used to define an anonymous, single-expression function inline?',
            NULL,
            'lambda',
            '["lambda", "lambda keyword", "def lambda"]'::jsonb,
            'The "lambda" keyword creates anonymous inline functions with the syntax: lambda arguments: expression.',
            'beginner',
            5
        );
    END IF;

    -- Seed for Variables & Data Types
    IF v_python_var_id IS NOT NULL THEN
        INSERT INTO public.practice_questions (concept_id, question_type, question_text, options, correct_answer, explanation, difficulty, order_index)
        VALUES (
            v_python_var_id,
            'multiple_choice',
            'Which of the following data types in Python is immutable?',
            '["list", "dict", "set", "tuple"]'::jsonb,
            'tuple',
            'Tuples and strings are immutable in Python, meaning their elements cannot be modified or reassigned in-place after creation.',
            'beginner',
            1
        );
    END IF;

    -- Seed for SQL JOINs
    IF v_sql_joins_id IS NOT NULL THEN
        INSERT INTO public.practice_questions (concept_id, question_type, question_text, options, correct_answer, explanation, difficulty, order_index)
        VALUES (
            v_sql_joins_id,
            'multiple_choice',
            'Which type of JOIN returns all rows from the left table, and matching rows from the right table, filling with NULL where there is no match?',
            '["INNER JOIN", "LEFT JOIN (or LEFT OUTER JOIN)", "CROSS JOIN", "RIGHT JOIN"]'::jsonb,
            'LEFT JOIN (or LEFT OUTER JOIN)',
            'A LEFT JOIN guarantees that every row from the left-hand table is preserved in the output result set, with NULL columns substituted when no related right-hand record satisfies the ON condition.',
            'intermediate',
            1
        );
    END IF;

    -- Seed for Train/Test Split
    IF v_aiml_split_id IS NOT NULL THEN
        INSERT INTO public.practice_questions (concept_id, question_type, question_text, options, correct_answer, explanation, difficulty, order_index)
        VALUES (
            v_aiml_split_id,
            'multiple_choice',
            'Why is it critical to perform data preprocessing transformations (e.g. scaling, mean imputation) by fitting ONLY on the training split rather than the full dataset?',
            '["To save CPU compute time during model compilation.", "To avoid data leakage, ensuring test data information does not contaminate the training process.", "Because scikit-learn models crash if test data is scaled.", "To force the test set to have zero variance."]'::jsonb,
            'To avoid data leakage, ensuring test data information does not contaminate the training process.',
            'Fitting transformers on the test split leaks statistical parameters (like mean and standard deviation) from the unseen evaluation set into the training regime, leading to overly optimistic and invalid performance estimates.',
            'beginner',
            1
        );
    END IF;

END $$;
