import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const rawNext = searchParams.get("next") || searchParams.get("redirectTo") || "/learn";

  // Prevent open redirect vulnerabilities: Ensure next path is relative
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/learn";

  // 1. Handle OAuth Provider Errors (e.g. redirect_uri_mismatch, access_denied)
  if (error || errorDescription) {
    console.error("OAuth provider returned an error:", error, errorDescription);
    const redirectUrl = new URL(`${origin}/auth/sign-in`);
    redirectUrl.searchParams.set("error", error || "oauth_callback_failed");
    if (errorDescription) {
      redirectUrl.searchParams.set("error_description", errorDescription);
    }
    return NextResponse.redirect(redirectUrl.toString());
  }

  // 2. Exchange authorization code for Supabase session
  if (code) {
    const supabase = await createClient();
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError && data.user) {
      const user = data.user;
      const metadata = user.user_metadata || {};
      const displayName =
        metadata.full_name ||
        metadata.name ||
        (user.email ? user.email.split("@")[0] : "Learner");
      const avatarUrl = metadata.avatar_url || metadata.picture || null;

      // Upsert profile record matching auth.users(id)
      try {
        await supabase.from("profiles").upsert(
          {
            id: user.id,
            display_name: displayName,
            avatar_url: avatarUrl,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );
      } catch (profileErr) {
        console.error("Profile synchronization notice:", profileErr);
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    } else {
      console.error("OAuth code exchange error:", exchangeError?.message);
      const redirectUrl = new URL(`${origin}/auth/sign-in`);
      redirectUrl.searchParams.set("error", "code_exchange_failed");
      if (exchangeError?.message) {
        redirectUrl.searchParams.set("error_description", exchangeError.message);
      }
      return NextResponse.redirect(redirectUrl.toString());
    }
  }

  // 3. Missing code fallback
  return NextResponse.redirect(`${origin}/auth/sign-in?error=missing_oauth_code`);
}

