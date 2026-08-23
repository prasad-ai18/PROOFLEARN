"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/shared/brand-logo";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/layout/user-nav";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Menu,
  X,
  ArrowRight,
  ShieldCheck,
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
      href: "/progress",
      label: "Progress & Proofs",
      icon: Trophy,
      active: pathname.startsWith("/progress") || pathname.startsWith("/history"),
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link
            href={currentUser ? "/dashboard" : "/"}
            className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
            aria-label="PROOFLEARN Home"
          >
            <BrandLogo size="md" />
          </Link>

          <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Learning
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-1 text-sm font-medium"
        >
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  link.active
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${link.active ? "text-emerald-400" : "text-zinc-500"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop Auth Controls */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <UserNav user={currentUser} />
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/sign-in">Sign In</Link>
              </Button>
              <Button size="sm" className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold" asChild>
                <Link href="/courses">
                  <span>Start Learning</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          {currentUser && <UserNav user={currentUser} />}
          <Button
            variant="ghost"
            size="sm"
            className="p-2 text-zinc-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 py-4 space-y-3">
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
                      ? "bg-zinc-800 text-white font-semibold"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${link.active ? "text-emerald-400" : "text-zinc-500"}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {!currentUser && (
            <div className="pt-3 border-t border-border/60 flex flex-col gap-2">
              <Button
                variant="outline"
                className="w-full justify-center"
                onClick={() => setMobileMenuOpen(false)}
                asChild
              >
                <Link href="/auth/sign-in">Sign In</Link>
              </Button>
              <Button
                className="w-full justify-center bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold"
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
