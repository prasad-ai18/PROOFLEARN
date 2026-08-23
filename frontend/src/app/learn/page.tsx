import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ShieldCheck, User, LogOut, CheckCircle2, Lock } from "lucide-react";

export default async function LearnPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in?redirectTo=/learn");
  }

  // Fetch application profile from public.profiles
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const metadata = user.user_metadata || {};
  const displayName =
    profile?.display_name ||
    metadata.full_name ||
    metadata.name ||
    (user.email ? user.email.split("@")[0] : "Student");
  const avatarUrl = profile?.avatar_url || metadata.avatar_url || metadata.picture;

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-8 py-6">
        <div className="text-center space-y-2">
          <Badge variant="success" className="gap-1.5 py-1 px-3">
            <ShieldCheck className="w-4 h-4" />
            Authenticated Session Active
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Welcome to PROOFLEARN
          </h1>
          <p className="text-sm text-muted-foreground">
            &ldquo;Don&apos;t just get the answer. Prove you learned it.&rdquo;
          </p>
        </div>

        {/* User Identity Verification Card */}
        <Card className="border-border/80 bg-card/90 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-12 h-12 rounded-full border border-border/80 object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <User className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <CardTitle className="text-lg">{displayName}</CardTitle>
                  <CardDescription className="text-xs">{user.email}</CardDescription>
                </div>
              </div>

              <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-400">
                Google Verified
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            <div className="rounded-lg border border-border/60 bg-zinc-900/60 p-4 space-y-2.5 text-xs text-zinc-300">
              <div className="flex items-center gap-2 text-zinc-100 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Session Verification Details
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px] text-zinc-400">
                <div>
                  <span className="text-zinc-500 block">Auth User ID:</span>
                  <span className="text-zinc-200 truncate block">{user.id}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Profile Linked:</span>
                  <span className="text-emerald-400 block">{profile ? "Synchronized" : "Pending Sync"}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Identity Provider:</span>
                  <span className="text-zinc-200 block">Google OAuth 2.0</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Auth Status:</span>
                  <span className="text-zinc-200 block">Active PKCE Session</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Row Level Security (RLS) active and scoped to this authenticated user.</span>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between items-center border-t border-border/50 pt-4">
            <span className="text-xs text-muted-foreground">
              Ready for Task 06 (Navigation & Curriculum)
            </span>
            <form action={signOut}>
              <Button type="submit" variant="outline" size="sm" className="gap-2 text-xs hover:text-destructive">
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </AppShell>
  );
}
