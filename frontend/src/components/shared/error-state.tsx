import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  retryLabel = "Try again",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-10 rounded-xl border border-destructive/30 bg-destructive/5 max-w-lg mx-auto",
        className
      )}
      role="alert"
    >
      <div className="rounded-full bg-destructive/10 p-3 mb-4 text-destructive">
        <AlertCircle className="w-6 h-6" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="destructive" size="sm">
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
