import React from "react";
import { BrandLogo } from "@/components/shared/brand-logo";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/70 bg-card/40 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <BrandLogo size="sm" />
          <p className="text-xs text-muted-foreground text-center md:text-left">
            AI should help students learn, not replace their ability to think.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 text-xs text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} PROOFLEARN. All rights reserved.</span>
          <span className="hidden md:inline">•</span>
          <span>Verified Mastery Platform</span>
        </div>
      </div>
    </footer>
  );
}
