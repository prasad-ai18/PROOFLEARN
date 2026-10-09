"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/shared/brand-logo";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/layout/user-nav";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Menu,
  X,
  ArrowRight,
  ShieldCheck,
  Code2,
  FileText,
} from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    email?: string;
    displayName?: string;
    avatarUrl?: string | null;
  } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    // Check initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const metadata = user.user_metadata || {};
        setCurrentUser({
          id: user.id,
          email: user.email,
          displayName:
            metadata.full_name ||
            metadata.name ||
            (user.email ? user.email.split("@")[0] : "Learner"),
          avatarUrl: metadata.avatar_url || metadata.picture || null,
        });
      } else {
        setCurrentUser(null);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const user = session.user;
        const metadata = user.user_metadata || {};
        setCurrentUser({
          id: user.id,
          email: user.email,
          displayName:
            metadata.full_name ||
            metadata.name ||
            (user.email ? user.email.split("@")[0] : "Learner"),
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

  const navLinks = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      href: "/courses",
      label: "Courses",
      icon: BookOpen,
      active: pathname.startsWith("/courses") || pathname.startsWith("/learn"),
    },
    {
      href: "/code-playground",
      label: "Playground",
      icon: Code2,
      active: pathname.startsWith("/code-playground"),
    },
    {
      href: "/resume-builder",
      label: "Resume & ATS",
      icon: FileText,
      active: pathname.startsWith("/resume-builder"),
    },
    {
      href: "/progress",
      label: "Progress",
      icon: Trophy,
      active: pathname === "/progress" || pathname.startsWith("/history"),
    },
    {
      href: "/proofs",
      label: "Proof Ledger",
      icon: ShieldCheck,
      active: pathname.startsWith("/proofs"),
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-sky-200/80 dark:border-amber-500/20 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link
            href={currentUser ? "/dashboard" : "/"}
            className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:focus-visible:ring-amber-400 rounded-md"
            aria-label="PROOFLEARN Home"
          >
            <BrandLogo size="md" />
          </Link>

          <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 dark:bg-amber-950/40 text-sky-800 dark:text-amber-300 border border-sky-200 dark:border-amber-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600 dark:text-amber-400" />
            Verified Learning
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-1.5 text-sm font-medium"
        >
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  link.active
                    ? "bg-sky-100 dark:bg-amber-500/15 text-sky-800 dark:text-amber-300 border border-sky-300/80 dark:border-amber-500/40 shadow-xs"
                    : "text-slate-600 dark:text-zinc-400 hover:text-sky-700 dark:hover:text-amber-300 hover:bg-sky-50 dark:hover:bg-amber-950/25"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    link.active
                      ? "text-sky-600 dark:text-amber-400"
                      : "text-slate-400 dark:text-zinc-500"
                  }`}
                />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop Auth Controls */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {currentUser ? (
            <UserNav user={currentUser} />
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-700 dark:text-zinc-300 hover:text-sky-700 dark:hover:text-amber-300 hover:bg-sky-50 dark:hover:bg-amber-950/20"
                asChild
              >
                <Link href="/auth/sign-in">Sign In</Link>
              </Button>
              <Button
                size="sm"
                className="gap-2 bg-sky-600 hover:bg-sky-700 text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-zinc-950 font-bold shadow-xs dark:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all"
                asChild
              >
                <Link href="/courses">
                  <span>Start Learning</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle & Theme Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          {currentUser && <UserNav user={currentUser} />}
          <Button
            variant="ghost"
            size="sm"
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-3">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    link.active
                      ? "bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-white font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      link.active
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {!currentUser && (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              <Button
                variant="outline"
                className="w-full justify-center text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800"
                onClick={() => setMobileMenuOpen(false)}
                asChild
              >
                <Link href="/auth/sign-in">Sign In</Link>
              </Button>
              <Button
                className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                onClick={() => setMobileMenuOpen(false)}
                asChild
              >
                <Link href="/courses">Start Learning Free</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
