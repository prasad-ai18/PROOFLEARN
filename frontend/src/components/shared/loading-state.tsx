import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  className?: string;
  count?: number;
}

export function LoadingState({ className, count = 3 }: LoadingStateProps) {
  return (
    <div className={cn("space-y-4 w-full max-w-lg mx-auto", className)} aria-busy="true" aria-live="polite">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      <div className="space-y-2.5 pt-2">
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-md" />
        ))}
      </div>
    </div>
  );
}
