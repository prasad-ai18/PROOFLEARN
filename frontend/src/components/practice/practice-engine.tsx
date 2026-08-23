"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Subject, Concept } from "@/types/database.types";
import {
  PracticeSessionResponse,
  AnswerEvaluationResponse,
} from "@/types/api";
import { api, ApiError } from "@/lib/api/client";
import { createClient } from "@/lib/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Lock,
  BrainCircuit,
  Trophy,
  AlertCircle,
} from "lucide-react";

interface PracticeEngineProps {
  subject: Subject;
  concept: Concept;
  onReturnToLearn?: () => void;
}

export function PracticeEngine({ subject, concept, onReturnToLearn }: PracticeEngineProps) {
  const [session, setSession] = useState<PracticeSessionResponse | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [shortAnswer, setShortAnswer] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<AnswerEvaluationResponse | null>(null);
  const [completedResult, setCompletedResult] = useState<{
    correctCount: number;
    total: number;
    percentage: number;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize practice session via effect
  useEffect(() => {
    let isMounted = true;

    async function loadPracticeSession() {
      try {
        const supabase = createClient();
        const {
          data: { session: authSession },
        } = await supabase.auth.getSession();

        const token = authSession?.access_token || "";

        const res = await api.createPracticeSession(
          {
            subject_slug: subject.slug,
            concept_slug: concept.slug,
          },
          token
        );

        if (isMounted) {
          setSession(res);
          setIsInitializing(false);
        }
      } catch (err: unknown) {
        if (isMounted) {
          if (err instanceof ApiError) {
            setErrorMessage(err.message);
          } else {
            setErrorMessage("Failed to load practice questions. Please try again.");
          }
          setIsInitializing(false);
        }
      }
    }

    loadPracticeSession();

    return () => {
      isMounted = false;
    };
  }, [subject.slug, concept.slug]);

  const handleRetake = async () => {
    setIsInitializing(true);
    setErrorMessage(null);
    setCompletedResult(null);
    setEvaluation(null);
    setSelectedOption("");
    setShortAnswer("");
    setCurrentIndex(0);

    try {
      const supabase = createClient();
      const {
        data: { session: authSession },
      } = await supabase.auth.getSession();

      const token = authSession?.access_token || "";

      const res = await api.createPracticeSession(
        {
          subject_slug: subject.slug,
          concept_slug: concept.slug,
        },
        token
      );

      setSession(res);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Failed to load practice questions. Please try again.");
      }
    } finally {
      setIsInitializing(false);
    }
  };

  const currentQuestion = session?.questions[currentIndex];

  const handleSubmitAnswer = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!session || !currentQuestion || isSubmitting || evaluation) return;

    const answer =
      currentQuestion.question_type === "multiple_choice"
        ? selectedOption
        : shortAnswer.trim();

    if (!answer) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const supabase = createClient();
      const {
        data: { session: authSession },
      } = await supabase.auth.getSession();

      const token = authSession?.access_token || "";

      const evalRes = await api.submitPracticeAnswer(
        session.session_id,
        {
          question_id: currentQuestion.id,
          answer,
        },
        token
      );

      setEvaluation(evalRes);

      if (evalRes.is_session_completed) {
        setCompletedResult({
          correctCount: evalRes.correct_count,
          total: evalRes.total_questions,
          percentage: evalRes.percentage,
        });
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Unable to submit your answer. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (!session) return;
    setEvaluation(null);
    setSelectedOption("");
    setShortAnswer("");
    setCurrentIndex((prev) => prev + 1);
  };

  if (isInitializing) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center space-y-4">
        <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <BrainCircuit className="w-6 h-6 animate-pulse" />
        </div>
        <h3 className="text-lg font-semibold text-white">Loading Practice Challenge...</h3>
        <p className="text-xs text-muted-foreground">Preparing formative concept questions for {concept.name}.</p>
      </div>
    );
  }

  if (errorMessage && !session) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertTitle>Practice Engine Notice</AlertTitle>
          <AlertDescription className="space-y-4 pt-2">
            <p>{errorMessage}</p>
            <Button size="sm" variant="outline" onClick={handleRetake} className="gap-2 text-xs">
              <RotateCcw className="w-3.5 h-3.5" />
              Retry Practice
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // =====================================================================
  // RESULT SCREEN UPON COMPLETION
  // =====================================================================
  if (completedResult) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 py-6 animate-in fade-in duration-300">
        <Card className="border-border/80 bg-zinc-900/80 shadow-2xl text-center">
          <CardHeader className="py-8 space-y-3">
            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Trophy className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-500/40 bg-emerald-950/20">
                Practice Complete
              </Badge>
              <CardTitle className="text-2xl sm:text-3xl font-bold text-white pt-1">
                Formative Practice Results
              </CardTitle>
              <CardDescription className="text-xs text-zinc-400 max-w-md mx-auto">
                You have completed all formative challenge questions for {concept.name}.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pb-8">
            <div className="rounded-2xl border border-border/80 bg-zinc-950/60 p-6 flex items-center justify-around">
              <div>
                <div className="text-3xl font-extrabold text-white">
                  {completedResult.correctCount} / {completedResult.total}
                </div>
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider mt-1">Questions Correct</div>
              </div>
              <div className="h-10 w-px bg-zinc-800" />
              <div>
                <div className="text-3xl font-extrabold text-emerald-400">
                  {completedResult.percentage}%
                </div>
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider mt-1">Accuracy Score</div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Formative practice reinforces mental models. When you feel confident in your independent comprehension, proceed to Proof Mode to verify mastery.
            </p>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/60 p-6 bg-zinc-950/40">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetake}
                className="gap-1.5 text-xs flex-1 sm:flex-none"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Retake Practice
              </Button>
              {onReturnToLearn && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onReturnToLearn}
                  className="gap-1.5 text-xs flex-1 sm:flex-none"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Return to Tutor
                </Button>
              )}
            </div>

            {/* Proof Mode Future Transition Point (Disabled for Task 10) */}
            <div className="flex flex-col items-end w-full sm:w-auto">
              <Button
                disabled
                size="sm"
                className="gap-2 text-xs bg-zinc-800 text-zinc-400 border border-dashed border-zinc-700 cursor-not-allowed w-full sm:w-auto"
                title="Proof Mode will be implemented in Task 11"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Prove I Learned It</span>
              </Button>
              <span className="text-[10px] text-muted-foreground mt-1">Proof Mode unlocks in Task 11</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // =====================================================================
  // ACTIVE QUESTION SCREEN
  // =====================================================================
  if (!currentQuestion || !session) return null;

  const progressPercent = Math.round(((currentIndex + 1) / session.total_questions) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4 animate-in fade-in duration-200">
      {/* Top Header & Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
          <span className="text-emerald-400 font-medium">{concept.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs border-amber-500/40 text-amber-400 bg-amber-950/20">
            Practice Challenge
          </Badge>
          <Badge variant="outline" className="text-xs border-zinc-700 bg-zinc-900 text-zinc-300">
            Question {currentIndex + 1} of {session.total_questions}
          </Badge>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden border border-zinc-800">
        <div
          className="bg-emerald-500 h-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Question Card */}
      <Card className="border-border/80 bg-zinc-900/70 shadow-xl">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              Question {currentIndex + 1}
            </span>
            <Badge variant="outline" className="text-[10px] text-zinc-400 capitalize border-zinc-800">
              {currentQuestion.difficulty}
            </Badge>
          </div>
          <CardTitle className="text-lg sm:text-xl font-semibold text-white leading-relaxed">
            {currentQuestion.question_text}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 pt-2">
          {/* Multiple Choice Options */}
          {currentQuestion.question_type === "multiple_choice" && currentQuestion.options && (
            <div className="space-y-2.5">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                const isAnswered = !!evaluation;

                let optionStyles =
                  "border-zinc-800 bg-zinc-900/90 text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800/60";

                if (isSelected && !isAnswered) {
                  optionStyles = "border-emerald-500 bg-emerald-950/30 text-white font-medium ring-1 ring-emerald-500/50";
                } else if (isAnswered) {
                  if (isSelected && evaluation.is_correct) {
                    optionStyles = "border-emerald-500 bg-emerald-950/40 text-emerald-300 font-medium";
                  } else if (isSelected && !evaluation.is_correct) {
                    optionStyles = "border-rose-500 bg-rose-950/40 text-rose-300";
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isAnswered || isSubmitting}
                    onClick={() => setSelectedOption(option)}
                    className={`w-full text-left p-3.5 rounded-xl border text-sm leading-relaxed transition-all flex items-start gap-3 ${optionStyles}`}
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-zinc-800 text-[11px] font-bold text-zinc-300 border border-zinc-700 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1">{option}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Short Answer Input */}
          {currentQuestion.question_type === "short_answer" && (
            <div className="space-y-2">
              <Input
                value={shortAnswer}
                onChange={(e) => setShortAnswer(e.target.value)}
                disabled={!!evaluation || isSubmitting}
                placeholder="Type your concise answer here..."
                className="bg-zinc-950/70 border-border/80 text-sm h-11 text-white"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !evaluation) {
                    e.preventDefault();
                    handleSubmitAnswer();
                  }
                }}
              />
              <span className="text-[11px] text-muted-foreground">
                Enter precise keyword or concept name.
              </span>
            </div>
          )}

          {/* Formative Feedback Alert */}
          {evaluation && (
            <div
              className={`rounded-xl border p-4 space-y-2 animate-in fade-in duration-200 ${
                evaluation.is_correct
                  ? "bg-emerald-950/30 border-emerald-500/50 text-emerald-200"
                  : "bg-rose-950/30 border-rose-500/50 text-rose-200"
              }`}
            >
              <div className="flex items-center gap-2 text-sm font-semibold">
                {evaluation.is_correct ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Correct</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-400" />
                    <span>Incorrect</span>
                  </>
                )}
              </div>
              <p className="text-xs leading-relaxed text-zinc-300">
                {evaluation.explanation}
              </p>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertTitle>Notice</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="p-4 border-t border-border/70 bg-zinc-950/40 flex items-center justify-between">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
            <span>Server-evaluated practice • Answers validated independently</span>
          </div>

          <div>
            {!evaluation ? (
              <Button
                type="button"
                onClick={() => handleSubmitAnswer()}
                disabled={
                  (currentQuestion.question_type === "multiple_choice"
                    ? !selectedOption
                    : !shortAnswer.trim()) || isSubmitting
                }
                className="gap-2 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
              >
                <span>{isSubmitting ? "Evaluating..." : "Submit Answer"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleNextQuestion}
                className="gap-2 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
              >
                <span>
                  {currentIndex + 1 < session.total_questions
                    ? "Next Question"
                    : "View Results"}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
