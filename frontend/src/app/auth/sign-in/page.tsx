"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  AlertCircle,
  Lock,
  UserCheck,
} from "lucide-react";

function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
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
  );
}

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function SignInContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const errorParam = searchParams.get("error");
  const errorDescParam = searchParams.get("error_description");
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState<string | null>(() => {
    if (errorDescParam) return errorDescParam;
    if (errorParam === "oauth_callback_failed")
      return "Social authentication was cancelled or failed.";
    if (errorParam === "code_exchange_failed")
      return "Failed to exchange authentication code with Supabase.";
    if (errorParam === "missing_oauth_code")
      return "Authentication code was not provided.";
    if (errorParam) return `Authentication error: ${errorParam}`;
    return null;
  });

  const enableGuestSession = (customEmail?: string) => {
    if (typeof document !== "undefined") {
      document.cookie = "prooflearn_guest=true; path=/; max-age=2592000; SameSite=Lax";
      if (customEmail) {
        try {
          localStorage.setItem("prooflearn_guest_email", customEmail);
        } catch {
          // ignore
        }
      }
    }
  };

  // Generic OAuth Handler (Google, GitHub)
  const handleOAuthSignIn = async (provider: "google" | "github") => {
    try {
      setIsLoading(true);
      setLoadingProvider(provider);
      setErrorMessage(null);

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey =
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

      if (
        !supabaseUrl ||
        !supabaseKey ||
        supabaseUrl.trim() === "" ||
        supabaseKey.trim() === "" ||
        supabaseUrl.includes("your-project")
      ) {
        setErrorMessage(
          "Supabase credentials are not configured in environment variables. You can click 'Explore as Guest / Local Sandbox' below to start using PROOFLEARN immediately!"
        );
        setIsLoading(false);
        setLoadingProvider(null);
        return;
      }

      const supabase = createClient();
      const origin = window.location.origin;
      const callbackUrl = `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: callbackUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        setErrorMessage(error.message || `Unable to sign in with ${provider}. Please try again.`);
        setIsLoading(false);
        setLoadingProvider(null);
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "A network or configuration error occurred. Please try again."
      );
      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  // Email & Password Handler
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    try {
      setIsLoading(true);
      setLoadingProvider("email");
      setErrorMessage(null);

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (
        !supabaseUrl ||
        supabaseUrl.trim() === "" ||
        supabaseUrl.includes("your-project")
      ) {
        enableGuestSession(email);
        router.push(redirectTo);
        router.refresh();
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
        setLoadingProvider(null);
      } else {
        router.push(redirectTo);
        router.refresh();
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Authentication failed."
      );
      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  const handleGuestSignIn = () => {
    enableGuestSession("student@prooflearn.dev");
    router.push(redirectTo);
    router.refresh();
  };

  return (
    <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center py-8 px-4">
      <Card className="w-full max-w-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/95 shadow-xl backdrop-blur-md rounded-3xl overflow-hidden">
        <CardHeader className="space-y-3 text-center items-center pb-4 pt-8">
          <BrandLogo size="lg" showTagline />
          <div className="space-y-1 pt-1">
            <CardTitle className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-xs text-slate-600 dark:text-slate-400">
              Sign in to record your verified proofs and sync course mastery.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 px-6 sm:px-8">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertTitle>Authentication Notice</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {/* Social SSO: Google & GitHub */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-11 gap-2.5 text-xs font-semibold border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-white transition-all shadow-xs"
              onClick={() => handleOAuthSignIn("google")}
              disabled={isLoading}
            >
              {loadingProvider === "google" ? (
                <span className="h-4 w-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
              ) : (
                <GoogleIcon className="w-4 h-4 shrink-0" />
              )}
              <span>Google</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-11 gap-2.5 text-xs font-semibold border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-white transition-all shadow-xs"
              onClick={() => handleOAuthSignIn("github")}
              disabled={isLoading}
            >
              {loadingProvider === "github" ? (
                <span className="h-4 w-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
              ) : (
                <GithubIcon className="w-4 h-4 shrink-0" />
              )}
              <span>GitHub</span>
            </Button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            <span className="bg-white dark:bg-slate-900 px-3 text-[10px] font-mono uppercase tracking-wider text-slate-400 absolute">
              or continue with email
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailSignIn} className="space-y-3.5 pt-1">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-700 dark:text-slate-300">Email Address</Label>
              <Input
                type="email"
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs h-10 focus-visible:ring-blue-500 shadow-2xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-700 dark:text-slate-300">Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs h-10 focus-visible:ring-blue-500 shadow-2xs"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-10 shadow-sm"
              disabled={isLoading}
            >
              {loadingProvider === "email" ? "Signing In..." : "Sign In with Email"}
            </Button>
          </form>

          {/* Guest Direct Access */}
          <div className="pt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleGuestSignIn}
              className="w-full text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl"
            >
              <UserCheck className="w-3.5 h-3.5 mr-1.5 text-blue-600 dark:text-blue-400" />
              <span>Explore as Guest / Local Sandbox</span>
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-center justify-center gap-2 pt-3 pb-8 border-t border-slate-100 dark:border-slate-800/60 text-center">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/sign-up"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Create Account
            </Link>
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
            <Lock className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            <span>Secure Student Data Storage with Supabase RLS</span>
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
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="h-6 w-6 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
          </div>
        }
      >
        <SignInContent />
      </Suspense>
    </AppShell>
  );
}
