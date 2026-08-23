"use client";

import React, { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
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
import { AlertCircle, CheckCircle2 } from "lucide-react";

function SignUpContent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please provide an email and password.");
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
        // Local sandbox fallback
        router.push("/dashboard");
        return;
      }

      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
      } else {
        if (data.session) {
          router.push("/dashboard");
        } else {
          setSuccessMessage(
            "Account created! Check your email inbox to confirm your address, or sign in."
          );
          setIsLoading(false);
        }
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to create account."
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center py-8 px-4">
      <Card className="w-full max-w-md border-border/80 bg-card/90 shadow-2xl backdrop-blur-sm">
        <CardHeader className="space-y-3 text-center items-center pb-4">
          <BrandLogo size="lg" showTagline />
          <div className="space-y-1 pt-1">
            <CardTitle className="text-xl font-bold text-white tracking-tight">
              Create Your Account
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Start building and verifying your technical engineering skills.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertTitle>Registration Notice</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {successMessage && (
            <Alert variant="default" className="border-emerald-500/40 bg-emerald-950/30 text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSignUp} className="space-y-3.5">
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-300">Full Name</Label>
              <Input
                type="text"
                placeholder="Ada Lovelace"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="bg-zinc-900/60 border-zinc-800 text-xs h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-300">Email Address</Label>
              <Input
                type="email"
                placeholder="ada@example.com"
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
                minLength={6}
                className="bg-zinc-900/60 border-zinc-800 text-xs h-10"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-xs h-10"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-center justify-center gap-2 pt-2 pb-6 border-t border-border/50 text-center">
          <p className="text-xs text-zinc-400">
            Already have an account?{" "}
            <Link
              href="/auth/sign-in"
              className="text-emerald-400 hover:underline font-semibold"
            >
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <AppShell>
      <Suspense
        fallback={
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="h-6 w-6 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
          </div>
        }
      >
        <SignUpContent />
      </Suspense>
    </AppShell>
  );
}
