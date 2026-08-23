import { SupabaseClient } from "@supabase/supabase-js";
import { Database, Concept, Subject } from "@/types/database.types";
import { getSubjectBySlug } from "./subjects";

// Standard starter fallback concepts in case of local offline / development DB mock
const FALLBACK_CONCEPTS: Concept[] = [
  // Python Concepts
  {
    id: "c1111111-1111-1111-1111-111111111111",
    subject_id: "11111111-1111-1111-1111-111111111111",
    name: "Variables & Data Types",
    slug: "variables-data-types",
    description: "Primitive types, dynamic typing, variable assignment, and type conversions in Python.",
    difficulty: "beginner",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c1111111-1111-1111-1111-111111111112",
    subject_id: "11111111-1111-1111-1111-111111111111",
    name: "Functions",
    slug: "functions",
    description: "Function definitions, parameters, return values, and variable scope in Python.",
    difficulty: "beginner",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c1111111-1111-1111-1111-111111111113",
    subject_id: "11111111-1111-1111-1111-111111111111",
    name: "Lists & Dictionaries",
    slug: "lists-dictionaries",
    description: "Sequence manipulation, hash map dictionary lookups, and nested data structure iteration.",
    difficulty: "intermediate",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Java Concepts
  {
    id: "c2222222-2222-2222-2222-222222222221",
    subject_id: "22222222-2222-2222-2222-222222222222",
    name: "Variables & Data Types",
    slug: "variables-data-types",
    description: "Strong static typing, primitives vs reference types, and memory layout in Java.",
    difficulty: "beginner",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c2222222-2222-2222-2222-222222222222",
    subject_id: "22222222-2222-2222-2222-222222222222",
    name: "Methods",
    slug: "methods",
    description: "Method signatures, return types, pass-by-value semantics, and overloading in Java.",
    difficulty: "beginner",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c2222222-2222-2222-2222-222222222223",
    subject_id: "22222222-2222-2222-2222-222222222222",
    name: "Object-Oriented Programming Basics",
    slug: "oop-basics",
    description: "Classes, instances, encapsulation, constructors, and access modifiers.",
    difficulty: "intermediate",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // SQL Concepts
  {
    id: "c3333333-3333-3333-3333-333333333331",
    subject_id: "33333333-3333-3333-3333-333333333333",
    name: "SELECT & Filtering",
    slug: "select-filtering",
    description: "Basic querying, WHERE clauses, boolean operators, and pattern matching with LIKE.",
    difficulty: "beginner",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c3333333-3333-3333-3333-333333333332",
    subject_id: "33333333-3333-3333-3333-333333333333",
    name: "JOINs",
    slug: "joins",
    description: "INNER, LEFT, RIGHT, and FULL OUTER joins across related relational tables.",
    difficulty: "intermediate",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c3333333-3333-3333-3333-333333333333",
    subject_id: "33333333-3333-3333-3333-333333333333",
    name: "Aggregations & GROUP BY",
    slug: "aggregations-group-by",
    description: "Aggregate functions (COUNT, SUM, AVG) combined with GROUP BY and HAVING clauses.",
    difficulty: "intermediate",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // AI & ML Concepts
  {
    id: "c4444444-4444-4444-4444-444444444441",
    subject_id: "44444444-4444-4444-4444-444444444444",
    name: "Supervised Learning",
    slug: "supervised-learning",
    description: "Labeled datasets, training paradigms, mapping inputs to targets, and regression vs classification.",
    difficulty: "beginner",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c4444444-4444-4444-4444-444444444442",
    subject_id: "44444444-4444-4444-4444-444444444444",
    name: "Train/Test Split",
    slug: "train-test-split",
    description: "Dataset partitioning, overfitting prevention, evaluation integrity, and validation sets.",
    difficulty: "beginner",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c4444444-4444-4444-4444-444444444443",
    subject_id: "44444444-4444-4444-4444-444444444444",
    name: "Classification Basics",
    slug: "classification-basics",
    description: "Decision boundaries, accuracy, precision, recall, and binary classification models.",
    difficulty: "intermediate",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Data Science Concepts
  {
    id: "c5555555-5555-5555-5555-555555555551",
    subject_id: "55555555-5555-5555-5555-555555555555",
    name: "Data Cleaning",
    slug: "data-cleaning",
    description: "Handling missing values, deduplication, outlier detection, and data type sanitization.",
    difficulty: "beginner",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c5555555-5555-5555-5555-555555555552",
    subject_id: "55555555-5555-5555-5555-555555555555",
    name: "Exploratory Data Analysis",
    slug: "exploratory-data-analysis",
    description: "Statistical summaries, distribution analysis, correlation matrices, and anomaly identification.",
    difficulty: "intermediate",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c5555555-5555-5555-5555-555555555553",
    subject_id: "55555555-5555-5555-5555-555555555555",
    name: "Feature Understanding",
    slug: "feature-understanding",
    description: "Numerical vs categorical features, encoding techniques, and domain attribute interpretation.",
    difficulty: "intermediate",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

/**
 * Fetches all active concepts for a given subject ID from Supabase.
 */
export async function getActiveConceptsBySubjectId(
  supabase: SupabaseClient<Database>,
  subjectId: string
): Promise<Concept[]> {
  try {
    const { data, error } = await supabase
      .from("concepts")
      .select("*")
      .eq("subject_id", subjectId)
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error || !data || data.length === 0) {
      return FALLBACK_CONCEPTS.filter((c) => c.subject_id === subjectId);
    }

    return data;
  } catch {
    return FALLBACK_CONCEPTS.filter((c) => c.subject_id === subjectId);
  }
}

/**
 * Fetches all active concepts across all subjects (or fallback).
 */
export async function getAllActiveConcepts(
  supabase: SupabaseClient<Database>
): Promise<Concept[]> {
  try {
    const { data, error } = await supabase
      .from("concepts")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error || !data || data.length === 0) {
      return FALLBACK_CONCEPTS;
    }

    return data;
  } catch {
    return FALLBACK_CONCEPTS;
  }
}

/**
 * Validates that both subject and concept exist, are active,
 * and the concept belongs to the specified subject.
 */
export async function getSubjectAndConceptBySlugs(
  supabase: SupabaseClient<Database>,
  subjectSlug: string,
  conceptSlug: string
): Promise<{ subject: Subject; concept: Concept } | null> {
  const subject = await getSubjectBySlug(supabase, subjectSlug);
  if (!subject) return null;

  try {
    const { data, error } = await supabase
      .from("concepts")
      .select("*")
      .eq("subject_id", subject.id)
      .eq("slug", conceptSlug)
      .eq("is_active", true)
      .single();

    if (error || !data) {
      const fallbackConcept = FALLBACK_CONCEPTS.find(
        (c) => c.subject_id === subject.id && c.slug === conceptSlug
      );
      if (fallbackConcept) {
        return { subject, concept: fallbackConcept };
      }
      return null;
    }

    return { subject, concept: data };
  } catch {
    const fallbackConcept = FALLBACK_CONCEPTS.find(
      (c) => c.subject_id === subject.id && c.slug === conceptSlug
    );
    if (fallbackConcept) {
      return { subject, concept: fallbackConcept };
    }
    return null;
  }
}
