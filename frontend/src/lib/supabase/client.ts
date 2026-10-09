import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/database.types";

/**
 * Checks whether Supabase is configured with real cloud project credentials.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return Boolean(
    url &&
    url.trim() !== "" &&
    !url.includes("placeholder") &&
    !url.includes("your-project") &&
    key &&
    key.trim() !== "" &&
    !key.includes("placeholder")
  );
}

/**
 * Creates a browser-side Supabase client for client components.
 */
export function createClient() {
  const supabaseUrl =
    (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL.trim() !== "")
      ? process.env.NEXT_PUBLIC_SUPABASE_URL
      : "https://mock-supabase.prooflearn.local";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    "public-anon-key-placeholder";

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}

