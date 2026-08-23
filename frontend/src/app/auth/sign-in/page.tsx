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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BrandLogo } from "@/components/shared/brand-logo";
import { createClient } from "@/lib/supabase/client";
import {
  AlertCircle,
  Lock,
  ShieldCheck,
  Mail,
  ArrowRight,
  Sparkles,
  UserCheck,
} from "lucide-react";

function SignInContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const errorParam = searchParams.get("error");
  const errorDescParam = searchParams.get("error_description");
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState<string | null>(() => {
    if (errorDescParam) return errorDescParam;
    if (errorParam === "oauth_callback_failed")
      return "Google authentication was cancelled or failed.";
    if (errorParam === "code_exchange_failed")
      return "Failed to exchange authentication code with Supabase.";
    if (errorParam === "missing_oauth_code")
      return "Authentication code was not provided.";
    if (errorParam) return `Authentication error: ${errorParam}`;
    return null;
  });

  // Google OAuth Handler
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
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
          "Supabase environment variables are missing. Please enter your actual NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in frontend/.env.local."
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
        err instanceof Error
          ? err.message
          : "A network or configuration error occurred. Please try again."
      );
      setIsLoading(false);
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
      setErrorMessage(null);

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (
        !supabaseUrl ||
        supabaseUrl.trim() === "" ||
        supabaseUrl.includes("your-project")
      ) {
        // Fallback for local sandbox / quick start without remote Supabase
        router.push(redirectTo);
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
      } else {
        router.push(redirectTo);
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Authentication failed."
      );
      setIsLoading(false);
    }
  };

  // Guest / Demo Mode Handler
  const handleGuestSignIn = () => {
    router.push(redirectTo);
  };

  return (
    <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center py-8 px-4">
      <Card className="w-full max-w-md border-border/80 bg-card/90 shadow-2xl backdrop-blur-sm">
        <CardHeader className="space-y-3 text-center items-center pb-4">
          <BrandLogo size="lg" showTagline />
          <div className="space-y-1 pt-1">
            <CardTitle className="text-xl font-bold text-white tracking-tight">
              Sign In to PROOFLEARN
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Access your dashboard, progress ledger, and verified proof records.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertTitle>Authentication Notice</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="oauth" className="w-full">
            <TabsList className="grid grid-cols-2 bg-zinc-900 border border-zinc-800 p-1 mb-4">
              <TabsTrigger value="oauth" className="text-xs font-semibold">
                Google SSO
              </TabsTrigger>
              <TabsTrigger value="email" className="text-xs font-semibold">
                Email / Password
              </TabsTrigger>
            </TabsList>

            {/* Google OAuth Tab */}
            <TabsContent value="oauth" className="space-y-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full h-12 gap-3 text-xs font-semibold border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-white"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
                    Connecting to Google...
                  </span>
                ) : (
                  <>
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
                    <span>Continue with Google</span>
                  </>
                )}
              </Button>
            </TabsContent>

            {/* Email / Password Tab */}
            <TabsContent value="email">
              <form onSubmit={handleEmailSignIn} className="space-y-3.5">
                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-300">Email Address</Label>
                  <Input
                    type="email"
                    placeholder="learner@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-zinc-900/60 border-zinc-800 text-xs h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-300">Password</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-zinc-900/60 border-zinc-800 text-xs h-10"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-xs h-10"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In with Email"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Guest Direct Access Button */}
          <div className="pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleGuestSignIn}
              className="w-full text-xs text-zinc-400 hover:text-emerald-400 hover:bg-zinc-900 border border-zinc-800/60"
            >
              <UserCheck className="w-3.5 h-3.5 mr-1.5" />
              <span>Explore as Guest / Local Sandbox</span>
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-center justify-center gap-2 pt-2 pb-6 border-t border-border/50 text-center">
          <p className="text-xs text-zinc-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/sign-up"
              className="text-emerald-400 hover:underline font-semibold"
            >
              Create Account
            </Link>
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Secure Supabase Auth with RLS Encryption</span>
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
