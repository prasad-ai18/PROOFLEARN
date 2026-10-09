"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  getLocalProgress,
  LessonProgressState,
} from "@/lib/progress/tracker";
import { COURSES, type Module, type Lesson } from "@/lib/data/courses";
import {
  ShieldCheck,
  Trophy,
  XCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen,
  Target,
} from "lucide-react";

// ─── Type for a displayed proof entry ───────────────────────────────────────
interface ProofEntry {
  lessonKey: string;
  courseSlug: string;
  moduleSlug: string;
  lessonSlug: string;
  courseTitle: string;
  moduleTitle: string;
  lessonTitle: string;
  score: number;
  total: number;
  passed: boolean;
  timestamp: string;
}

function buildProofEntries(state: LessonProgressState): ProofEntry[] {
  const entries: ProofEntry[] = [];

  for (const [key, attempt] of Object.entries(state.proofAttempts)) {
    const parts = key.split("/");
    if (parts.length !== 3) continue;
    const [courseSlug, moduleSlug, lessonSlug] = parts;

    const course = COURSES.find((c) => c.slug === courseSlug);
    if (!course) continue;
    const mod = course.modules.find((m: Module) => m.slug === moduleSlug);
    if (!mod) continue;
    const lesson = mod.lessons.find((l: Lesson) => l.slug === lessonSlug);
    if (!lesson) continue;

    entries.push({
      lessonKey: key,
      courseSlug,
      moduleSlug,
      lessonSlug,
      courseTitle: course.title,
      moduleTitle: mod.title,
      lessonTitle: lesson.title,
      score: attempt.score,
      total: attempt.total,
      passed: attempt.passed,
      timestamp: attempt.timestamp,
    });
  }

  // Sort newest first
  return entries.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export default function ProofsPage() {
  const [progress, setProgress] = useState<LessonProgressState | null>(null);
  const [filter, setFilter] = useState<"all" | "passed" | "failed">("all");

  useEffect(() => {
    setProgress(getLocalProgress());
  }, []);

  const allEntries = progress ? buildProofEntries(progress) : [];

  const filtered = allEntries.filter((e) => {
    if (filter === "passed") return e.passed;
    if (filter === "failed") return !e.passed;
    return true;
  });

  const totalProofs = allEntries.length;
  const passedProofs = allEntries.filter((e) => e.passed).length;
  const failedProofs = totalProofs - passedProofs;
  const passRate =
    totalProofs > 0 ? Math.round((passedProofs / totalProofs) * 100) : 0;

  const avgScore =
    allEntries.length > 0
      ? Math.round(
          allEntries.reduce(
            (sum, e) => sum + (e.total > 0 ? (e.score / e.total) * 100 : 0),
            0
          ) / allEntries.length
        )
      : 0;

  return (
    <AppShell>
      <div className="space-y-10 py-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verifiable Proof Record
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Proof Ledger
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl">
            Every Proof Challenge you&apos;ve attempted is recorded here.
            Passing a proof verifies your mastery of the concept — not just that
            you read through it.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Total Proofs",
              value: totalProofs,
              icon: Target,
              color: "text-slate-800 dark:text-slate-200",
            },
            {
              label: "Verified Passed",
              value: passedProofs,
              icon: CheckCircle2,
              color: "text-emerald-600 dark:text-emerald-400",
            },
            {
              label: "Need Retry",
              value: failedProofs,
              icon: XCircle,
              color: "text-rose-600 dark:text-rose-400",
            },
            {
              label: "Pass Rate",
              value: `${passRate}%`,
              icon: Trophy,
              color: "text-amber-500 dark:text-amber-400",
            },
          ].map((stat) => (
            <Card
              key={stat.label}
              className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4 text-center space-y-1 shadow-xs"
            >
              <stat.icon className={`w-5 h-5 mx-auto ${stat.color}`} />
              <div className={`text-2xl font-black ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</div>
            </Card>
          ))}
        </div>

        {totalProofs === 0 ? (
          /* Empty State */
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-xs">
            <CardContent className="py-16 text-center space-y-4">
              <ShieldCheck className="w-12 h-12 mx-auto text-slate-400 dark:text-slate-600" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                No Proof Attempts Yet
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                Complete a lesson in any course and attempt the Proof Challenge
                to start building your verifiable learning record.
              </p>
              <Button asChild className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm">
                <Link href="/courses">
                  Browse Courses <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Average Score Banner */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 px-6 py-4 flex items-center justify-between shadow-xs">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest font-semibold">
                  Average Proof Score
                </p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{avgScore}%</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400">Mastery Threshold</p>
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  ≥ 70% to pass
                </p>
              </div>
              <div className="hidden sm:block w-48 bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div
                  className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(avgScore, 100)}%` }}
                />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Filter:</span>
              {(["all", "passed", "failed"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    filter === f
                      ? f === "passed"
                        ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40"
                        : f === "failed"
                        ? "bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/40"
                        : "bg-blue-600 text-white border border-blue-600"
                      : "text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  {f === "all"
                    ? `All (${totalProofs})`
                    : f === "passed"
                    ? `Passed (${passedProofs})`
                    : `Failed (${failedProofs})`}
                </button>
              ))}
            </div>

            {/* Proof Cards */}
            <div className="space-y-4">
              {filtered.length === 0 ? (
                <div className="text-center py-10 text-slate-500 dark:text-slate-400 text-sm">
                  No {filter} proofs found.
                </div>
              ) : (
                filtered.map((entry) => {
                  const scorePercent =
                    entry.total > 0
                      ? Math.round((entry.score / entry.total) * 100)
                      : 0;
                  const lessonPath = `/courses/${entry.courseSlug}/modules/${entry.moduleSlug}/lessons/${entry.lessonSlug}`;
                  const date = new Date(entry.timestamp);
                  const dateStr = date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  return (
                    <Card
                      key={entry.lessonKey}
                      className={`border transition-all shadow-xs ${
                        entry.passed
                          ? "border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-500/5"
                          : "border-rose-200 dark:border-rose-500/20 bg-rose-50/40 dark:bg-rose-500/5"
                      }`}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              {entry.passed ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              ) : (
                                <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                              )}
                              <span className="text-sm font-bold text-slate-900 dark:text-white">
                                {entry.lessonTitle}
                              </span>
                              <Badge
                                variant={
                                  entry.passed ? "default" : "destructive"
                                }
                                className={`text-xs ${
                                  entry.passed
                                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30"
                                    : ""
                                }`}
                              >
                                {entry.passed ? "VERIFIED" : "FAILED"}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {entry.courseTitle} &rsaquo; {entry.moduleTitle}
                            </p>
                            <div className="flex items-center gap-4 pt-1">
                              <span className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                <Target className="w-3.5 h-3.5" />
                                Score:{" "}
                                <span
                                  className={`font-semibold ml-1 ${
                                    entry.passed
                                      ? "text-emerald-600 dark:text-emerald-400"
                                      : "text-rose-600 dark:text-rose-400"
                                  }`}
                                >
                                  {scorePercent}%
                                </span>
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {dateStr}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="text-right">
                              <div
                                className={`text-2xl font-black ${
                                  entry.passed
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-rose-600 dark:text-rose-400"
                                }`}
                              >
                                {scorePercent}%
                              </div>
                            </div>
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                            >
                              <Link href={lessonPath}>
                                {entry.passed ? "Review" : "Retry"}
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* CTA */}
        {totalProofs > 0 && (
          <div className="text-center pt-4 space-y-2">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Keep proving your knowledge to build a verifiable learning record.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button asChild variant="outline" className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                <Link href="/progress">
                  <BookOpen className="mr-2 w-4 h-4" />
                  View Full Progress
                </Link>
              </Button>
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm">
                <Link href="/courses">
                  Continue Learning <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
