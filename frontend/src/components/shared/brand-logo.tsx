import React from "react";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
}

export function BrandLogo({
  className,
  showTagline = false,
  size = "md",
}: BrandLogoProps) {
  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-7 h-7",
    lg: "w-9 h-9",
  };

  const textSizes = {
    sm: "text-base tracking-tight",
    md: "text-xl tracking-tight",
    lg: "text-2xl tracking-tight",
  };

  return (
    <div className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      <div className="relative flex items-center justify-center">
        {/* Modern Vector Proof Shield Mark in Skyblue / Gold */}
        <div
          className={cn(
            "rounded-lg bg-sky-500 dark:bg-amber-500 text-white dark:text-black p-1.5 shadow-sm flex items-center justify-center transition-colors",
            iconSizes[size]
          )}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full text-white dark:text-zinc-950"
            aria-hidden="true"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 font-bold leading-tight">
          <span className={cn("text-slate-900 dark:text-white font-black", textSizes[size])}>
            PROOF<span className="text-sky-600 dark:text-amber-400">LEARN</span>
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-medium">
            Verified Learning
          </span>
        )}
      </div>
    </div>
  );
}
