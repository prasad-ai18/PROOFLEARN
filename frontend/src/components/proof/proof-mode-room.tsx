"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Subject, Concept } from "@/types/database.types";
import {
  ProofSessionResponse,
  TransferSubmissionResponse,
} from "@/types/api";
import { api, ApiError } from "@/lib/api/client";
import { createClient } from "@/lib/supabase/client";
import { LearningEvidenceView } from "@/components/evidence/learning-evidence-view";
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
  Compass,
} from "lucide-react";

interface ProofModeRoomProps {
  subject: Subject;
  concept: Concept;
  onReturnToLearn?: () => void;
}

export function ProofModeRoom({ subject, concept, onReturnToLearn }: ProofModeRoomProps) {
  const [phase, setPhase] = useState<"intro" | "independent" | "transfer" | "completed" | "evidence">("intro");
  const [session, setSession] = useState<ProofSessionResponse | null>(null);

  // Independent Challenge State
  const [independentAnswer, setIndependentAnswer] = useState("");
  const [independentExplanation, setIndependentExplanation] = useState("");

  // Transfer Challenge State
  const [transferAnswer, setTransferAnswer] = useState("");
  const [transferExplanation, setTransferExplanation] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transferResult, setTransferResult] = useState<TransferSubmissionResponse | null>(null);

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
      setPhase("independent");
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

  // 2. Submit Independent Proof -> Advance to Transfer
  const handleSubmitIndependent = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!session || isSubmitting || independentAnswer.trim().length < 10) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const supabase = createClient();
      const {
        data: { session: authSession },
      } = await supabase.auth.getSession();

      const token = authSession?.access_token || "";

      await api.submitProof(
        session.session_id,
        {
          student_answer: independentAnswer.trim(),
          explanation: independentExplanation.trim() || null,
        },
        token
      );

      // Successfully submitted independent challenge; advance to transfer challenge
      setPhase("transfer");
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Failed to submit independent solution. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Submit Transfer Challenge -> Complete Proof Session
  const handleSubmitTransfer = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!session || isSubmitting || transferAnswer.trim().length < 10) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const supabase = createClient();
      const {
        data: { session: authSession },
      } = await supabase.auth.getSession();

      const token = authSession?.access_token || "";

      const res = await api.submitTransferChallenge(
        session.session_id,
        {
          student_answer: transferAnswer.trim(),
          explanation: transferExplanation.trim() || null,
        },
        token
      );

      setTransferResult(res);
      setPhase("completed");
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Failed to submit transfer solution. Please try again.");
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
                <li><strong className="text-zinc-200">Two-Stage Verification:</strong> You will complete an <em>Independent Challenge</em> followed by a novel <em>Transfer Challenge</em>.</li>
                <li><strong className="text-zinc-200">Server-Recorded Attempt:</strong> Your responses provide genuine evidence of your mental models.</li>
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
  // PHASE 2: INDEPENDENT CHALLENGE SCREEN (STAGE 1)
  // =====================================================================
  if (phase === "independent" && session) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 py-4 animate-in fade-in duration-200">
        {/* Top Security Banner */}
        <div className="rounded-xl border border-amber-500/40 bg-amber-950/30 p-3.5 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-300 font-semibold">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>PROOF MODE ACTIVE: AI ASSISTANCE STRICTLY DISABLED</span>
          </div>
          <Badge variant="outline" className="text-[10px] border-amber-500/50 bg-amber-900/40 text-amber-300 uppercase">
            Stage 1 of 2: Independent
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
                value={independentAnswer}
                onChange={(e) => setIndependentAnswer(e.target.value.slice(0, 10000))}
                disabled={isSubmitting}
                placeholder="Explain your approach, design decisions, parameters, and rationale thoroughly..."
                rows={8}
                className="bg-zinc-950/80 border-border/80 text-sm resize-none focus-visible:ring-amber-500 text-white"
              />
              <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
                <span>Minimum 10 characters required</span>
                <span>{independentAnswer.length} / 10000 characters</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 block">
                Additional Conceptual Notes (Optional):
              </label>
              <Textarea
                value={independentExplanation}
                onChange={(e) => setIndependentExplanation(e.target.value.slice(0, 5000))}
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
              <span>AI assistance locked on server • Stage 1 of 2</span>
            </div>

            <Button
              type="button"
              onClick={() => handleSubmitIndependent()}
              disabled={independentAnswer.trim().length < 10 || isSubmitting}
              className="gap-2 text-xs bg-amber-600 hover:bg-amber-500 text-white font-medium shadow-md"
            >
              <span>{isSubmitting ? "Recording..." : "Submit & Proceed to Transfer"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // =====================================================================
  // PHASE 3: TRANSFER CHALLENGE SCREEN (STAGE 2)
  // =====================================================================
  if (phase === "transfer" && session && session.transfer_challenge) {
    const transfer = session.transfer_challenge;

    return (
      <div className="max-w-3xl mx-auto space-y-6 py-4 animate-in fade-in duration-200">
        {/* Top Security Banner */}
        <div className="rounded-xl border border-indigo-500/40 bg-indigo-950/30 p-3.5 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-indigo-300 font-semibold">
            <Compass className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>PROOF MODE: TRANSFER CHALLENGE (SAME CONCEPT, NOVEL CONTEXT)</span>
          </div>
          <Badge variant="outline" className="text-[10px] border-indigo-500/50 bg-indigo-900/40 text-indigo-300 uppercase">
            Stage 2 of 2: Transfer
          </Badge>
        </div>

        {/* Transfer Challenge Card */}
        <Card className="border-border/80 bg-zinc-900/80 shadow-xl">
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                Novel Application Scenario
              </span>
              <Badge variant="outline" className="text-[10px] text-zinc-400 capitalize border-zinc-800">
                {transfer.difficulty}
              </Badge>
            </div>

            <CardTitle className="text-xl font-bold text-white leading-relaxed">
              {transfer.title}
            </CardTitle>

            {/* Scenario Box */}
            <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-4 space-y-1.5">
              <div className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Context / Scenario:</div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {transfer.scenario}
              </p>
            </div>

            {/* Prompt Box */}
            <div className="rounded-xl border border-border/60 bg-zinc-950/70 p-4 text-xs sm:text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">
              {transfer.prompt}
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-1">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300 block">
                Your Transfer Application Solution:
              </label>
              <Textarea
                value={transferAnswer}
                onChange={(e) => setTransferAnswer(e.target.value.slice(0, 10000))}
                disabled={isSubmitting}
                placeholder="Explain how you adapt the concept to solve this novel scenario, specifying signatures, architecture, and tradeoffs..."
                rows={8}
                className="bg-zinc-950/80 border-border/80 text-sm resize-none focus-visible:ring-indigo-500 text-white"
              />
              <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
                <span>Minimum 10 characters required</span>
                <span>{transferAnswer.length} / 10000 characters</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 block">
                Additional Design Considerations (Optional):
              </label>
              <Textarea
                value={transferExplanation}
                onChange={(e) => setTransferExplanation(e.target.value.slice(0, 5000))}
                disabled={isSubmitting}
                placeholder="Any edge cases or failure modes considered..."
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
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI assistance locked on server • Stage 2 of 2</span>
            </div>

            <Button
              type="button"
              onClick={() => handleSubmitTransfer()}
              disabled={transferAnswer.trim().length < 10 || isSubmitting}
              className="gap-2 text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Submitting Proof..." : "Submit Transfer Challenge"}</span>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // =====================================================================
  // PHASE 4: COMPLETED SCREEN
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
                Proof & Transfer Completed
              </Badge>
              <CardTitle className="text-2xl sm:text-3xl font-bold text-white pt-1">
                Learning Evidence Recorded
              </CardTitle>
              <CardDescription className="text-xs text-zinc-400 max-w-md mx-auto">
                {transferResult?.message || "Your independent and transfer responses have been securely recorded on the authoritative server."}
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
                Session ID: {session?.session_id}
              </div>
              <div className="pt-2 flex items-center gap-2 text-emerald-400 text-xs">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Independent proof and novel context transfer attempts captured.</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Your responses provide verifiable proof of independent comprehension across multiple contexts. AI tutoring has now been unlocked.
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

            {/* View Learning Evidence & LEI Result */}
            <div className="flex flex-col items-end w-full sm:w-auto">
              <Button
                size="sm"
                onClick={() => setPhase("evidence")}
                className="gap-2 text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md w-full sm:w-auto font-medium"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>View Learning Evidence</span>
              </Button>
              <span className="text-[10px] text-muted-foreground mt-1">Authoritative LEI record ready</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // =====================================================================
  // PHASE 5: LEARNING EVIDENCE VIEW
  // =====================================================================
  if (phase === "evidence" && session) {
    return (
      <LearningEvidenceView
        sessionId={session.session_id}
        subjectSlug={subject.slug}
        conceptSlug={concept.slug}
        onReturnToLearn={onReturnToLearn}
        onReturnToProof={() => setPhase("completed")}
      />
    );
  }

  return null;
}
