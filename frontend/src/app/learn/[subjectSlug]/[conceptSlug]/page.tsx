import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSubjectAndConceptBySlugs } from "@/lib/data/concepts";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import {
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  Lock,
  BrainCircuit,
  FileCheck,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";

interface ConceptPageProps {
  params: Promise<{
    subjectSlug: string;
    conceptSlug: string;
  }>;
}

export default async function ConceptLearningPage({ params }: ConceptPageProps) {
  const { subjectSlug, conceptSlug } = await params;

  const supabase = await createClient();

  // 1. Verify authenticated session server-side
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/sign-in?redirectTo=/learn/${subjectSlug}/${conceptSlug}`);
  }

  // 2. Validate Subject and Concept in database
  const result = await getSubjectAndConceptBySlugs(supabase, subjectSlug, conceptSlug);

  if (!result) {
    return (
      <AppShell>
        <div className="max-w-xl mx-auto py-16 text-center space-y-6">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400">
            <Lightbulb className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">Topic Not Found</h1>
            <p className="text-sm text-muted-foreground">
              The requested learning concept (<code className="text-zinc-300">{conceptSlug}</code>) could not be found under the subject (<code className="text-zinc-300">{subjectSlug}</code>).
            </p>
          </div>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/learn">
              <ArrowLeft className="w-4 h-4" />
              Return to Learning Selection
            </Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  const { subject, concept } = result;

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-8 py-4 sm:py-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/learn" className="hover:text-white transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Learning Catalog
          </Link>
          <span>/</span>
          <span className="text-zinc-300">{subject.name}</span>
          <span>/</span>
          <span className="text-emerald-400 font-medium">{concept.name}</span>
        </div>

        {/* Header Information */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-xs border-zinc-700 bg-zinc-900 text-zinc-300">
              {subject.name}
            </Badge>
            <Badge variant="outline" className="text-xs border-emerald-500/40 text-emerald-400 bg-emerald-950/20 capitalize">
              {concept.difficulty} Level
            </Badge>
            <Badge variant="success" className="text-xs gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verification Ready
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            {concept.name}
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
            {concept.description || "Master core principles, internalize mental models, and prove independent comprehension."}
          </p>
        </div>

        {/* Readiness Architecture Card */}
        <Card className="border-border/80 bg-card/90 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              <Sparkles className="w-4 h-4" />
              Learning Session Pipeline
            </div>
            <CardTitle className="text-xl">Verification Protocol Architecture</CardTitle>
            <CardDescription>
              Your learning session for this concept will progress through the four core PROOFLEARN phases:
            </CardDescription>
          </CardHeader>

          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="rounded-lg border border-border/70 bg-zinc-900/50 p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
                <BrainCircuit className="w-4 h-4 text-emerald-400" />
                1. AI Learning Room
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Interactive Socratic dialogue with Gemini AI to explore concepts, ask questions, and build mental models.
              </p>
            </div>

            <div className="rounded-lg border border-border/70 bg-zinc-900/50 p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                2. Practice Engine
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Low-stakes guided problems with dynamic hints and immediate formative feedback.
              </p>
            </div>

            <div className="rounded-lg border border-border/70 bg-zinc-900/50 p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
                <Lock className="w-4 h-4 text-rose-400" />
                3. PROOF MODE
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Zero AI assistance. Server-locked independent assessment where you solve and explain without AI assistance.
              </p>
            </div>

            <div className="rounded-lg border border-border/70 bg-zinc-900/50 p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
                <FileCheck className="w-4 h-4 text-cyan-400" />
                4. Transfer & LEI
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Novel context transfer problem and cryptographic Learning Evidence Index calculation.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/50 pt-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Catalog & Navigation Foundation established (Task 06).</span>
            </div>
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link href="/learn">
                <ArrowLeft className="w-3.5 h-3.5" />
                Choose Another Topic
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppShell>
  );
}
