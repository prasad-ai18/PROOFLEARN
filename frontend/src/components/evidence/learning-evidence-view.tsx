"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { LearningEvidenceResult } from "@/types/api";
import { api, ApiError } from "@/lib/api/client";
import { createClient } from "@/lib/supabase/client";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  BrainCircuit,
  Compass,
  FileText,
  Lock,
  Sparkles,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
} from "lucide-react";

interface LearningEvidenceViewProps {
  sessionId: string;
  subjectSlug: string;
  conceptSlug: string;
  onReturnToLearn?: () => void;
  onReturnToProof?: () => void;
}

export function LearningEvidenceView({
  sessionId,
  subjectSlug,
  conceptSlug,
  onReturnToLearn,
  onReturnToProof,
}: LearningEvidenceViewProps) {
  const [evidence, setEvidence] = useState<LearningEvidenceResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchEvidence() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const supabase = createClient();
        const {
          data: { session: authSession },
        } = await supabase.auth.getSession();

        const token = authSession?.access_token || "";
        const result = await api.getLearningEvidence(sessionId, token);

        if (isMounted) {
          setEvidence(result);
        }
      } catch (err: unknown) {
        if (isMounted) {
          if (err instanceof ApiError) {
            setErrorMessage(err.message);
          } else {
            setErrorMessage("Failed to load Learning Evidence. Please try again.");
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (sessionId) {
      fetchEvidence();
    }

    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  // Loading State
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 py-8 animate-in fade-in duration-200">
        <Card className="border-border/80 bg-zinc-900/80 p-8 text-center space-y-4">
          <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 animate-pulse">
            <Sparkles className="w-7 h-7 animate-spin" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-white">Synthesizing Learning Evidence...</h3>
            <p className="text-xs text-muted-foreground">
              Aggregating formative practice, independent proof, and novel transfer signals.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // Error / Not Ready State
  if (errorMessage || !evidence) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 py-8 animate-in fade-in duration-200">
        <Card className="border-amber-500/30 bg-zinc-900/80 p-6 text-center space-y-4">
          <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Evidence Not Available</h3>
            <p className="text-xs text-zinc-300 max-w-md mx-auto">
              {errorMessage || "Complete your Proof and Transfer challenges to generate Learning Evidence."}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            {onReturnToProof && (
              <Button size="sm" onClick={onReturnToProof} className="text-xs bg-amber-600 hover:bg-amber-500 text-white">
                Resume Proof Mode
              </Button>
            )}
            <Link href={`/learn/${subjectSlug}/${conceptSlug}`}>
              <Button size="sm" variant="outline" className="text-xs">
                Back to Learning Room
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const scoreColor =
    evidence.lei_score >= 80
      ? "text-emerald-400 border-emerald-500/40 bg-emerald-950/30"
      : evidence.lei_score >= 60
      ? "text-blue-400 border-blue-500/40 bg-blue-950/30"
      : "text-amber-400 border-amber-500/40 bg-amber-950/30";

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6 animate-in fade-in duration-300">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/learn" className="hover:text-white transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          Curriculum
        </Link>
        <span>/</span>
        <span className="text-zinc-300">{evidence.subject_name}</span>
        <span>/</span>
        <span className="text-emerald-400 font-medium">{evidence.concept_name}</span>
        <span>/</span>
        <span className="text-zinc-400">Learning Evidence</span>
      </div>

      {/* Primary Evidence Hero Card */}
      <Card className="border-border/80 bg-zinc-900/90 shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-indigo-950/40 border-b border-border/60 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>LEARNING EVIDENCE RECORD</span>
          </div>
          <Badge variant="outline" className="text-[11px] border-emerald-500/40 bg-emerald-950/60 text-emerald-300">
            Authoritative Server Record
          </Badge>
        </div>

        <CardHeader className="py-6 text-center space-y-4">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
              Prototype Learning Evidence Index (LEI)
            </span>
            <div className="pt-2 flex items-baseline justify-center gap-2">
              <span className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white font-mono">
                {evidence.lei_score}
              </span>
              <span className="text-xl sm:text-2xl text-zinc-500 font-medium">/ 100</span>
            </div>
          </div>

          <div className="inline-flex items-center justify-center">
            <Badge className={`px-3.5 py-1 text-xs sm:text-sm font-medium rounded-full ${scoreColor}`}>
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 shrink-0" />
              {evidence.interpretation}
            </Badge>
          </div>

          <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
            Evidence synthesized from your formative practice recall, independent proof design, and novel context transfer solution.
          </p>
        </CardHeader>

        <CardContent className="space-y-6 px-6 pb-6">
          {/* Signal Breakdown Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                Evidence Signals Breakdown
              </span>
              <span className="text-[11px] text-muted-foreground">Weighted Prototype Model</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 1. Recall */}
              {evidence.signals.recall && (
                <SignalCard
                  icon={<BrainCircuit className="w-4 h-4 text-blue-400" />}
                  title="Recall & Retrieval"
                  weight="15%"
                  score={evidence.signals.recall.score ?? 85}
                  description={evidence.signals.recall.description}
                />
              )}

              {/* 2. Explanation */}
              {evidence.signals.explanation && (
                <SignalCard
                  icon={<FileText className="w-4 h-4 text-indigo-400" />}
                  title="Conceptual Explanation"
                  weight="20%"
                  score={evidence.signals.explanation.score ?? 80}
                  description={evidence.signals.explanation.description}
                />
              )}

              {/* 3. Direct Application */}
              {evidence.signals.application && (
                <SignalCard
                  icon={<Sparkles className="w-4 h-4 text-amber-400" />}
                  title="Direct Application"
                  weight="20%"
                  score={evidence.signals.application.score ?? 85}
                  description={evidence.signals.application.description}
                />
              )}

              {/* 4. Novel Context Transfer */}
              {evidence.signals.transfer && (
                <SignalCard
                  icon={<Compass className="w-4 h-4 text-purple-400" />}
                  title="Novel Context Transfer"
                  weight="25%"
                  score={evidence.signals.transfer.score ?? 82}
                  description={evidence.signals.transfer.description}
                />
              )}

              {/* 5. Independent Performance */}
              {evidence.signals.independence && (
                <SignalCard
                  icon={<Lock className="w-4 h-4 text-emerald-400" />}
                  title="Independent Performance"
                  weight="20%"
                  score={evidence.signals.independence.score ?? 100}
                  description={evidence.signals.independence.description}
                />
              )}

              {/* 6. AI Assistance Factor */}
              {evidence.signals.ai_dependency && (
                <div className="rounded-xl border border-border/60 bg-zinc-950/60 p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-teal-400" />
                      AI Assistance Factor
                    </span>
                    <Badge variant="outline" className="text-[10px] text-zinc-400 border-zinc-800">
                      Factor
                    </Badge>
                  </div>
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-sm font-bold text-teal-300 capitalize">
                      {evidence.signals.ai_dependency.status} Reliance
                    </span>
                    <span className="text-xs text-muted-foreground">0 pt penalty</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-normal">
                    {evidence.signals.ai_dependency.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Explainability Section */}
          <div className="rounded-xl border border-border/70 bg-zinc-950/50 p-4 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-zinc-200">
              <HelpCircle className="w-4 h-4 text-zinc-400" />
              <span>How This Result Was Generated:</span>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              Your Learning Evidence Index is calculated using a transparent weighted formula combining:
              Formative Recall (15%) + Conceptual Explanation (20%) + Direct Application (20%) + Novel Transfer (25%) + Independent Lockdown (20%).
              All calculations are executed server-side.
            </p>
          </div>

          {/* Mandatory Scientific Disclaimer Banner */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-3 text-[11px] text-zinc-400 text-center leading-relaxed">
            <strong className="text-zinc-300">Disclaimer:</strong> {evidence.disclaimer}
          </div>
        </CardContent>

        <CardFooter className="p-4 border-t border-border/60 bg-zinc-950/60 flex items-center justify-between">
          <Link href="/learn">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <ArrowLeft className="w-3.5 h-3.5" />
              Curriculum Catalog
            </Button>
          </Link>

          {onReturnToLearn && (
            <Button
              size="sm"
              onClick={onReturnToLearn}
              className="gap-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 text-white"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Review Socratic Tutor
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

function SignalCard({
  icon,
  title,
  weight,
  score,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  weight: string;
  score: number;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-zinc-950/60 p-3.5 space-y-1.5 hover:border-zinc-700 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
          {icon}
          {title}
        </span>
        <Badge variant="outline" className="text-[10px] text-zinc-400 border-zinc-800">
          {weight}
        </Badge>
      </div>
      <div className="flex items-baseline justify-between pt-1">
        <span className="text-lg font-bold text-white font-mono">{score}</span>
        <span className="text-[11px] text-muted-foreground">/ 100</span>
      </div>
      <p className="text-[11px] text-zinc-400 leading-normal">{description}</p>
    </div>
  );
}
