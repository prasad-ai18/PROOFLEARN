import { SupabaseClient } from "@supabase/supabase-js";
import { Database, Subject } from "@/types/database.types";

// Standard starter fallback in case of local offline / development DB mock
const FALLBACK_SUBJECTS: Subject[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    name: "Python",
    slug: "python",
    description: "Modern Python programming fundamentals, data structures, and practical application.",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    name: "Java",
    slug: "java",
    description: "Core Java programming, object-oriented concepts, and typed software development.",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    name: "SQL",
    slug: "sql",
    description: "Relational database queries, filtering, data transformations, and relational algebra.",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "44444444-4444-4444-4444-444444444444",
    name: "AI & Machine Learning",
    slug: "ai-ml",
    description: "Machine learning foundations, supervised modeling, and verification workflows.",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "55555555-5555-5555-5555-555555555555",
    name: "Data Science",
    slug: "data-science",
    description: "Data analytics, exploratory inspection, feature analysis, and data quality pipelines.",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

/**
 * Fetches all active curriculum subjects from Supabase.
 */
export async function getActiveSubjects(
  supabase: SupabaseClient<Database>
): Promise<Subject[]> {
  try {
    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error || !data || data.length === 0) {
      return FALLBACK_SUBJECTS;
    }

    return data;
  } catch {
    return FALLBACK_SUBJECTS;
  }
}

/**
 * Fetches a single active subject by its URL slug.
 */
export async function getSubjectBySlug(
  supabase: SupabaseClient<Database>,
  slug: string
): Promise<Subject | null> {
  try {
    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error || !data) {
      const fallback = FALLBACK_SUBJECTS.find((s) => s.slug === slug);
      return fallback || null;
    }

    return data;
  } catch {
    const fallback = FALLBACK_SUBJECTS.find((s) => s.slug === slug);
    return fallback || null;
  }
}
