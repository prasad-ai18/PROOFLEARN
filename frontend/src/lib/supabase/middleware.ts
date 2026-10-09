import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { Database } from "@/types/database.types";

/**
 * Refreshes user auth sessions and handles cookie synchronization in Next.js Middleware.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const rawKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  const isSupabaseConfigured =
    Boolean(rawUrl && rawKey) &&
    rawUrl !== "" &&
    !rawUrl?.includes("your-project") &&
    !rawUrl?.includes("placeholder");

  const pathname = request.nextUrl.pathname;
  const isGuest = request.cookies.get("prooflearn_guest")?.value === "true";

  // Protected route checking in middleware
  const isProtectedPath =
    pathname.startsWith("/learn") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/progress") ||
    pathname.startsWith("/proofs") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/history") ||
    /^\/courses\/[^/]+\/modules\/[^/]+\/lessons\//.test(pathname);
  const isAuthPath =
    pathname.startsWith("/auth/sign-in") || pathname.startsWith("/auth/sign-up");

  // If Supabase is not configured, or user has an active guest session, allow access
  if (!isSupabaseConfigured || isGuest) {
    if (isGuest && isAuthPath) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  const supabaseUrl = rawUrl || "https://your-project.supabase.co";
  const supabaseAnonKey = rawKey || "public-anon-key-placeholder";

  try {
    const supabase = createServerClient<Database>(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && isProtectedPath) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/sign-in";
      url.searchParams.set("redirectTo", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    if (user && isAuthPath) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  } catch (err) {
    console.debug("Middleware Supabase auth check notice:", err);
    // On unexpected client error, allow request through
    return supabaseResponse;
  }

  return supabaseResponse;
}

