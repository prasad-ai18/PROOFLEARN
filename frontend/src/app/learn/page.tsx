import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getActiveSubjects } from "@/lib/data/subjects";
import { getAllActiveConcepts } from "@/lib/data/concepts";
import { AppShell } from "@/components/layout/app-shell";
import { LearningSelector } from "@/components/learning/learning-selector";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, BookOpen } from "lucide-react";

export default async function LearnPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in?redirectTo=/learn");
  }

  // Fetch subjects and concepts using our data access layer
  const subjects = await getActiveSubjects(supabase);
  const allConcepts = await getAllActiveConcepts(supabase);

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-8 py-4 sm:py-6">
        {/* Top Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="success" className="gap-1.5 py-0.5 px-2.5 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Learning Protocol
            </Badge>
            <div className="h-3 w-[1px] bg-border" />
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
              Interactive Curriculum
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              What do you want to learn today?
            </h1>
            <p className="text-sm text-muted-foreground">
              Choose a subject and concept to begin your learning session.
            </p>
          </div>
        </div>

        {/* Learning Selector */}
        <LearningSelector subjects={subjects} allConcepts={allConcepts} />
      </div>
    </AppShell>
  );
}
