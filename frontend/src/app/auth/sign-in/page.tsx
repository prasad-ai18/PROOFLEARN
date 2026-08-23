"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { BrandLogo } from "@/components/shared/brand-logo";
import { createClient } from "@/lib/supabase/client";
import { AlertCircle, Lock, ShieldCheck } from "lucide-react";

function SignInContent() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const errorDescParam = searchParams.get("error_description");
  const redirectTo = searchParams.get("redirectTo") || "/learn";

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(() => {
    if (errorDescParam) return errorDescParam;
    if (errorParam === "oauth_callback_failed") return "Google authentication was cancelled or failed.";
    if (errorParam === "code_exchange_failed") return "Failed to exchange authentication code with Supabase.";
    if (errorParam === "missing_oauth_code") return "Authentication code was not provided.";
    if (errorParam) return `Authentication error: ${errorParam}`;
    return null;
  });

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl.includes("your-project")) {
        setErrorMessage(
          "Supabase environment variables are missing. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in frontend/.env.local."
        );
        setIsLoading(false);
        return;
      }

      const supabase = createClient();
      const origin = window.location.origin;
      const callbackUrl = `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        setErrorMessage(error.message || "Unable to sign in with Google. Please try again.");
        setIsLoading(false);
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "A network or configuration error occurred. Please try again."
      );
      setIsLoading(false);
    }
  };


  return (
    <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center py-8">
      <Card className="w-full max-w-md border-border/80 bg-card/90 shadow-2xl backdrop-blur-sm">
        <CardHeader className="space-y-3 text-center items-center pb-6">
          <BrandLogo size="lg" showTagline />

          <div className="space-y-1.5 pt-2">
            <CardTitle className="text-xl font-bold tracking-tight">
              Sign In to PROOFLEARN
            </CardTitle>
            <CardDescription className="text-sm">
              &ldquo;Don&apos;t just get the answer. Prove you learned it.&rdquo;
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertTitle>Authentication Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <div className="rounded-lg border border-border/60 bg-zinc-900/50 p-3.5 text-xs text-zinc-400 space-y-2">
            <div className="flex items-center gap-1.5 text-zinc-200 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verified Learning Protocol:
            </div>
            <p>
              Sign in with your Google account to track learning sessions, take solo challenges in <strong>PROOF MODE</strong>, and earn cryptographic Learning Evidence.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full h-12 gap-3 text-sm font-semibold border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-white hover:text-white"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            aria-label="Continue with Google"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
                Connecting to Google...
              </span>
            ) : (
              <>
                {/* Official Google Vector Icon */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col items-center justify-center pt-2 pb-6 border-t border-border/50 text-center">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Secure Supabase Auth & Google OAuth 2.0</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function SignInPage() {
  return (
    <AppShell>
      <Suspense
        fallback={
          <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center">
            <div className="h-8 w-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
          </div>
        }
      >
        <SignInContent />
      </Suspense>
    </AppShell>
  );
}
