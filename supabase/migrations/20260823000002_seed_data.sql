-- =====================================================================
-- PROOFLEARN: Initial Seed Data (Migration 000002)
-- =====================================================================
-- Description: Clean, high-quality MVP starter curriculum subjects and concepts.
-- =====================================================================

DO $$
DECLARE
    v_python_id UUID;
    v_java_id UUID;
    v_sql_id UUID;
    v_aiml_id UUID;
    v_ds_id UUID;
BEGIN
    -- 1. SEED SUBJECTS
    INSERT INTO public.subjects (name, slug, description, is_active)
    VALUES
        ('Python', 'python', 'Modern Python programming fundamentals, data structures, and practical application.', TRUE)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description
    RETURNING id INTO v_python_id;

    INSERT INTO public.subjects (name, slug, description, is_active)
    VALUES
        ('Java', 'java', 'Core Java programming, object-oriented concepts, and typed software development.', TRUE)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description
    RETURNING id INTO v_java_id;

    INSERT INTO public.subjects (name, slug, description, is_active)
    VALUES
        ('SQL', 'sql', 'Relational database queries, filtering, data transformations, and relational algebra.', TRUE)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description
    RETURNING id INTO v_sql_id;

    INSERT INTO public.subjects (name, slug, description, is_active)
    VALUES
        ('AI & Machine Learning', 'ai-ml', 'Machine learning foundations, supervised modeling, and verification workflows.', TRUE)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description
    RETURNING id INTO v_aiml_id;

    INSERT INTO public.subjects (name, slug, description, is_active)
    VALUES
        ('Data Science', 'data-science', 'Data analytics, exploratory inspection, feature analysis, and data quality pipelines.', TRUE)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description
    RETURNING id INTO v_ds_id;

    -- 2. SEED CONCEPTS FOR PYTHON
    INSERT INTO public.concepts (subject_id, name, slug, description, difficulty, is_active)
    VALUES
        (v_python_id, 'Variables & Data Types', 'variables-data-types', 'Primitive types, dynamic typing, variable assignment, and type conversions in Python.', 'beginner', TRUE),
        (v_python_id, 'Functions', 'functions', 'Function definitions, parameters, return values, and variable scope in Python.', 'beginner', TRUE),
        (v_python_id, 'Lists & Dictionaries', 'lists-dictionaries', 'Sequence manipulation, hash map dictionary lookups, and nested data structure iteration.', 'intermediate', TRUE)
    ON CONFLICT (subject_id, slug) DO NOTHING;

    -- 3. SEED CONCEPTS FOR JAVA
    INSERT INTO public.concepts (subject_id, name, slug, description, difficulty, is_active)
    VALUES
        (v_java_id, 'Variables & Data Types', 'variables-data-types', 'Strong static typing, primitives vs reference types, and memory layout in Java.', 'beginner', TRUE),
        (v_java_id, 'Methods', 'methods', 'Method signatures, return types, pass-by-value semantics, and overloading in Java.', 'beginner', TRUE),
        (v_java_id, 'Object-Oriented Programming Basics', 'oop-basics', 'Classes, instances, encapsulation, constructors, and access modifiers.', 'intermediate', TRUE)
    ON CONFLICT (subject_id, slug) DO NOTHING;

    -- 4. SEED CONCEPTS FOR SQL
    INSERT INTO public.concepts (subject_id, name, slug, description, difficulty, is_active)
    VALUES
        (v_sql_id, 'SELECT & Filtering', 'select-filtering', 'Basic querying, WHERE clauses, boolean operators, and pattern matching with LIKE.', 'beginner', TRUE),
        (v_sql_id, 'JOINs', 'joins', 'INNER, LEFT, RIGHT, and FULL OUTER joins across related relational tables.', 'intermediate', TRUE),
        (v_sql_id, 'Aggregations & GROUP BY', 'aggregations-group-by', 'Aggregate functions (COUNT, SUM, AVG) combined with GROUP BY and HAVING clauses.', 'intermediate', TRUE)
    ON CONFLICT (subject_id, slug) DO NOTHING;

    -- 5. SEED CONCEPTS FOR AI & MACHINE LEARNING
    INSERT INTO public.concepts (subject_id, name, slug, description, difficulty, is_active)
    VALUES
        (v_aiml_id, 'Supervised Learning', 'supervised-learning', 'Labeled datasets, training paradigms, mapping inputs to targets, and regression vs classification.', 'beginner', TRUE),
        (v_aiml_id, 'Train/Test Split', 'train-test-split', 'Dataset partitioning, overfitting prevention, evaluation integrity, and validation sets.', 'beginner', TRUE),
        (v_aiml_id, 'Classification Basics', 'classification-basics', 'Decision boundaries, accuracy, precision, recall, and binary classification models.', 'intermediate', TRUE)
    ON CONFLICT (subject_id, slug) DO NOTHING;

    -- 6. SEED CONCEPTS FOR DATA SCIENCE
    INSERT INTO public.concepts (subject_id, name, slug, description, difficulty, is_active)
    VALUES
        (v_ds_id, 'Data Cleaning', 'data-cleaning', 'Handling missing values, deduplication, outlier detection, and data type sanitization.', 'beginner', TRUE),
        (v_ds_id, 'Exploratory Data Analysis', 'exploratory-data-analysis', 'Statistical summaries, distribution analysis, correlation matrices, and anomaly identification.', 'intermediate', TRUE),
        (v_ds_id, 'Feature Understanding', 'feature-understanding', 'Numerical vs categorical features, encoding techniques, and domain attribute interpretation.', 'intermediate', TRUE)
    ON CONFLICT (subject_id, slug) DO NOTHING;

END $$;
