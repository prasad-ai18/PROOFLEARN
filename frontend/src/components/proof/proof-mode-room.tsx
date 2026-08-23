"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Subject, Concept } from "@/types/database.types";
import { ProofSessionResponse, ProofSubmissionResponse } from "@/types/api";
import { api, ApiError } from "@/lib/api/client";
import { createClient } from "@/lib/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  ShieldAlert,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Send,
  AlertCircle,
  BrainCircuit,
  Lock,
  RotateCcw,
  Sparkles,
} from "lucide-react";

interface ProofModeRoomProps {
  subject: Subject;
  concept: Concept;
  onReturnToLearn?: () => void;
}

export function ProofModeRoom({ subject, concept, onReturnToLearn }: ProofModeRoomProps) {
  const [phase, setPhase] = useState<"intro" | "active" | "completed">("intro");
  const [session, setSession] = useState<ProofSessionResponse | null>(null);
  const [studentAnswer, setStudentAnswer] = useState("");
  const [explanation, setExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<ProofSubmissionResponse | null>(null);

  // 1. Start Proof Mode
  const handleStartProof = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const supabase = createClient();
      const {
        data: { session: authSession },
      } = await supabase.auth.getSession();

      const token = authSession?.access_token || "";

      const res = await api.createProofSession(
        {
          subject_slug: subject.slug,
          concept_slug: concept.slug,
        },
        token
      );

      setSession(res);
      setPhase("active");
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Unable to initialize Proof Mode. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Submit Independent Proof
  const handleSubmitProof = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!session || isSubmitting || studentAnswer.trim().length < 10) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const supabase = createClient();
      const {
        data: { session: authSession },
      } = await supabase.auth.getSession();

      const token = authSession?.access_token || "";

      const res = await api.submitProof(
        session.session_id,
        {
          student_answer: studentAnswer.trim(),
          explanation: explanation.trim() || null,
        },
        token
      );

      setSubmissionResult(res);
      setPhase("completed");
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Failed to submit proof. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // =====================================================================
  // PHASE 1: PROOF MODE INTRODUCTION
  // =====================================================================
  if (phase === "intro") {
    return (
      <div className="max-w-2xl mx-auto space-y-6 py-6 animate-in fade-in duration-300">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {onReturnToLearn ? (
            <button
              type="button"
              onClick={onReturnToLearn}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Learning Room
            </button>
          ) : (
            <Link href="/learn" className="hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              Catalog
            </Link>
          )}
          <span>/</span>
          <span className="text-zinc-300">{subject.name}</span>
          <span>/</span>
          <span className="text-amber-400 font-medium">{concept.name}</span>
        </div>

        <Card className="border-amber-500/30 bg-zinc-900/80 shadow-2xl overflow-hidden">
          <div className="bg-amber-950/40 border-b border-amber-500/20 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Independent Verification Boundary</span>
            </div>
            <Badge variant="outline" className="text-[11px] border-amber-500/40 bg-amber-950/60 text-amber-300">
              Server-Enforced Lockdown
            </Badge>
          </div>

          <CardHeader className="py-6 space-y-2 text-center">
            <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Lock className="w-7 h-7" />
            </div>
            <CardTitle className="text-2xl font-bold text-white tracking-tight">
              Enter Proof Mode: {concept.name}
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400 max-w-lg mx-auto">
              This is where you demonstrate your understanding independently without AI assistance.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 text-xs text-zinc-300 px-6">
            <div className="rounded-xl border border-border/70 bg-zinc-950/60 p-4 space-y-2.5">
              <div className="font-semibold text-zinc-200">During Proof Mode:</div>
              <ul className="space-y-2 text-zinc-400 list-disc list-inside">
                <li><strong className="text-zinc-200">AI Assistance is Disabled:</strong> All AI chat and hints are locked out server-side.</li>
                <li><strong className="text-zinc-200">Independent Solution:</strong> You will solve a conceptual challenge in your own words.</li>
                <li><strong className="text-zinc-200">Server-Recorded Attempt:</strong> Your response will be recorded for evaluation.</li>
                <li><strong className="text-zinc-200">Safe Environment:</strong> This is formative evidence of your genuine mental models.</li>
              </ul>
            </div>

            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertTitle>Notice</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter className="p-6 border-t border-border/60 bg-zinc-950/40 flex items-center justify-between">
            {onReturnToLearn && (
              <Button
                variant="outline"
                size="sm"
                onClick={onReturnToLearn}
                className="gap-1.5 text-xs text-zinc-400"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Tutor
              </Button>
            )}

            <Button
              onClick={handleStartProof}
              disabled={isLoading}
              className="gap-2 text-xs bg-amber-600 hover:bg-amber-500 text-white font-medium shadow-md ml-auto"
            >
              <span>{isLoading ? "Locking Session..." : "Start Independent Proof"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // =====================================================================
  // PHASE 3: COMPLETED SCREEN
  // =====================================================================
  if (phase === "completed") {
    return (
      <div className="max-w-2xl mx-auto space-y-6 py-8 animate-in fade-in duration-300 text-center">
        <Card className="border-border/80 bg-zinc-900/90 shadow-2xl">
          <CardHeader className="py-8 space-y-3">
            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-500/40 bg-emerald-950/20">
                Proof Mode Completed
              </Badge>
              <CardTitle className="text-2xl sm:text-3xl font-bold text-white pt-1">
                Proof Attempt Recorded
              </CardTitle>
              <CardDescription className="text-xs text-zinc-400 max-w-md mx-auto">
                {submissionResult?.message || "Your independent response has been recorded on the authoritative server."}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pb-8">
            <div className="rounded-2xl border border-border/80 bg-zinc-950/60 p-5 text-left text-xs text-zinc-300 space-y-2">
              <div className="flex items-center justify-between text-zinc-400">
                <span>Subject: <strong className="text-white">{subject.name}</strong></span>
                <span>Concept: <strong className="text-emerald-400">{concept.name}</strong></span>
              </div>
              <div className="text-zinc-500 text-[11px]">
                Submission ID: {submissionResult?.session_id}
              </div>
            </div>

            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Your response provides verifiable evidence of independent comprehension. AI tutoring has now been unlocked.
            </p>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/60 p-6 bg-zinc-950/40">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Link href="/learn" className="w-full sm:w-auto">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs w-full">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Curriculum Catalog
                </Button>
              </Link>
              {onReturnToLearn && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onReturnToLearn}
                  className="gap-1.5 text-xs w-full sm:w-auto"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Resume AI Tutor
                </Button>
              )}
            </div>

            {/* Transfer Challenge preview (Locked for Task 11) */}
            <div className="flex flex-col items-end w-full sm:w-auto">
              <Button
                disabled
                size="sm"
                className="gap-2 text-xs bg-zinc-800 text-zinc-400 border border-dashed border-zinc-700 cursor-not-allowed w-full sm:w-auto"
                title="Transfer Challenge will be implemented in Task 12"
              >
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Transfer Challenge</span>
              </Button>
              <span className="text-[10px] text-muted-foreground mt-1">Unlocks in Task 12</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // =====================================================================
  // PHASE 2: ACTIVE PROOF CHALLENGE SCREEN
  // =====================================================================
  if (!session) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4 animate-in fade-in duration-200">
      {/* Top Security Banner */}
      <div className="rounded-xl border border-amber-500/40 bg-amber-950/30 p-3.5 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-amber-300 font-semibold">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>PROOF MODE ACTIVE: AI ASSISTANCE STRICTLY DISABLED</span>
        </div>
        <Badge variant="outline" className="text-[10px] border-amber-500/50 bg-amber-900/40 text-amber-300 uppercase">
          Independent Mode
        </Badge>
      </div>

      {/* Challenge Card */}
      <Card className="border-border/80 bg-zinc-900/80 shadow-xl">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <BrainCircuit className="w-3.5 h-3.5" />
              Independent Concept Challenge
            </span>
            <Badge variant="outline" className="text-[10px] text-zinc-400 capitalize border-zinc-800">
              {session.challenge.difficulty}
            </Badge>
          </div>
          <CardTitle className="text-xl font-bold text-white leading-relaxed">
            {session.challenge.title}
          </CardTitle>
          <div className="rounded-xl border border-border/60 bg-zinc-950/70 p-4 text-xs sm:text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">
            {session.challenge.prompt}
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-1">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 block">
              Your Independent Response (Explain in your own words):
            </label>
            <Textarea
              value={studentAnswer}
              onChange={(e) => setStudentAnswer(e.target.value.slice(0, 10000))}
              disabled={isSubmitting}
              placeholder="Explain your approach, design decisions, parameters, and rationale thoroughly..."
              rows={8}
              className="bg-zinc-950/80 border-border/80 text-sm resize-none focus-visible:ring-amber-500 text-white"
            />
            <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
              <span>Minimum 10 characters required</span>
              <span>{studentAnswer.length} / 10000 characters</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 block">
              Additional Conceptual Notes (Optional):
            </label>
            <Textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value.slice(0, 5000))}
              disabled={isSubmitting}
              placeholder="Any additional architectural or domain nuances you considered..."
              rows={3}
              className="bg-zinc-950/60 border-border/70 text-xs resize-none text-zinc-300"
            />
          </div>

          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertTitle>Submission Error</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>{errorMessage}</p>
                <Button size="sm" variant="outline" onClick={() => setErrorMessage(null)} className="text-xs h-7">
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Dismiss
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="p-4 border-t border-border/70 bg-zinc-950/40 flex items-center justify-between">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            <span>AI assistance disabled on server • Zero client-evaluated grading</span>
          </div>

          <Button
            type="button"
            onClick={() => handleSubmitProof()}
            disabled={studentAnswer.trim().length < 10 || isSubmitting}
            className="gap-2 text-xs bg-amber-600 hover:bg-amber-500 text-white font-medium shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? "Submitting Proof..." : "Submit Proof"}</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
