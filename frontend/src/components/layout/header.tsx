import React from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/shared/brand-logo";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";

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
            <span>Task 03 — Design System</span>
          </Badge>
        </div>

        <nav aria-label="Main Navigation" className="flex items-center gap-4 text-sm font-medium">
          <span className="text-xs text-muted-foreground hidden md:inline-block">
            &ldquo;Don&apos;t just get the answer. Prove you learned it.&rdquo;
          </span>
          <div className="h-4 w-[1px] bg-border hidden md:block" />
          <Badge variant="success" className="text-xs">
            Foundation Ready
          </Badge>
        </nav>
      </div>
    </header>
  );
}
