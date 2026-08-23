"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/shared/brand-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/layout/user-nav";
import { createClient } from "@/lib/supabase/client";
import { ShieldCheck, LogIn, Compass, History } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    email?: string;
    displayName?: string;
    avatarUrl?: string | null;
  } | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // Check initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const metadata = user.user_metadata || {};
        setCurrentUser({
          id: user.id,
          email: user.email,
          displayName: metadata.full_name || metadata.name || (user.email ? user.email.split("@")[0] : "Learner"),
          avatarUrl: metadata.avatar_url || metadata.picture || null,
        });
      } else {
        setCurrentUser(null);
      }
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const user = session.user;
        const metadata = user.user_metadata || {};
        setCurrentUser({
          id: user.id,
          email: user.email,
          displayName: metadata.full_name || metadata.name || (user.email ? user.email.split("@")[0] : "Learner"),
          avatarUrl: metadata.avatar_url || metadata.picture || null,
        });
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const isLearnActive = pathname.startsWith("/learn");
  const isHistoryActive = pathname.startsWith("/history");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
          >
            <BrandLogo size="md" />
          </Link>
          <Badge
            variant="outline"
            className="hidden md:inline-flex gap-1.5 text-zinc-400 border-zinc-800 bg-zinc-900/50 text-[11px]"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Proof of Learning Verification</span>
          </Badge>
        </div>

        <nav aria-label="Main Navigation" className="flex items-center gap-2 sm:gap-4 text-sm font-medium">
          <Link
            href="/learn"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
              isLearnActive
                ? "bg-zinc-800/80 text-white font-semibold"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Learn</span>
          </Link>

          <Link
            href="/history"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
              isHistoryActive
                ? "bg-zinc-800/80 text-white font-semibold"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
            }`}
          >
            <History className="w-3.5 h-3.5 text-indigo-400" />
            <span>History</span>
          </Link>

          <div className="h-4 w-[1px] bg-border mx-1" />

          {currentUser ? (
            <UserNav user={currentUser} />
          ) : (
            <Button
              asChild
              size="sm"
              variant="outline"
              className="gap-2 text-xs border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-white"
            >
              <Link href="/auth/sign-in">
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
