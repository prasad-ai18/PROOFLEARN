import React from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/shared/brand-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, LogIn } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
            <BrandLogo size="md" />
          </Link>
          <Badge variant="outline" className="hidden sm:inline-flex gap-1.5 text-zinc-400 border-zinc-800 bg-zinc-900/50">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Task 05 — Google Auth</span>
          </Badge>
        </div>

        <nav aria-label="Main Navigation" className="flex items-center gap-3 sm:gap-4 text-sm font-medium">
          <Link href="/learn" className="text-xs text-zinc-300 hover:text-white transition-colors hidden sm:inline-block">
            Dashboard / Learn
          </Link>
          <div className="h-4 w-[1px] bg-border hidden sm:block" />
          <Button asChild size="sm" variant="outline" className="gap-2 text-xs border-zinc-700 bg-zinc-900 hover:bg-zinc-800">
            <Link href="/auth/sign-in">
              <LogIn className="w-3.5 h-3.5 text-emerald-400" />
              Sign In
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
