"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { COURSES, type Module, type Lesson } from "@/lib/data/courses";
import {
  getLocalProgress,
  calculateCourseProgress,
  getOverallStatistics,
  makeLessonKey,
  LessonProgressState,
} from "@/lib/progress/tracker";
import {
  Trophy,
  CheckCircle2,
  Circle,
  ChevronRight,
} from "lucide-react";

export default function ProgressPage() {
  const [progressState, setProgressState] =
    useState<LessonProgressState | null>(null);

  useEffect(() => {
    setProgressState(getLocalProgress());
  }, []);

  const stats = progressState
    ? getOverallStatistics(progressState)
    : {
        totalCompletedLessons: 0,
        totalLessonsAllCourses: 7,
        totalPassedProofs: 0,
        totalProofsAllCourses: 7,
        enrolledCoursesCount: 0,
        overallMastery: 0,
        overallCompletion: 0,
      };

  return (
    <AppShell>
      <div className="space-y-10 py-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-500/20">
            <Trophy className="w-3.5 h-3.5" />
            Verifiable Learning Ledger
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Progress & Proof Ledger
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Every completed lesson and verified proof challenge is permanently
            recorded in your private ledger.
          </p>
        </div>

        {/* Global Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6 space-y-2 text-center shadow-xs">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Overall Track Completion
            </span>
            <p className="text-3xl font-black text-slate-900 dark:text-white">
              {stats.overallCompletion}%
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {stats.totalCompletedLessons} of {stats.totalLessonsAllCourses} lessons
            </p>
          </Card>

          <Card className="border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 p-6 space-y-2 text-center shadow-xs">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              Verified Proof Demonstrations
            </span>
            <p className="text-3xl font-black text-blue-600 dark:text-blue-400">
              {stats.totalPassedProofs}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Independent solo proofs passed
            </p>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6 space-y-2 text-center shadow-xs">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Mastery Index
            </span>
            <p className="text-3xl font-black text-slate-900 dark:text-white">
              {stats.overallMastery}%
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Weighted proof proficiency
            </p>
          </Card>
        </div>

        {/* Track Breakdown */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Engineering Tracks Breakdown
          </h2>

          <div className="space-y-6">
            {COURSES.map((course) => {
              const cStats = progressState
                ? calculateCourseProgress(course, progressState)
                : {
                    percent: 0,
                    completedLessonsCount: 0,
                    totalLessons: 0,
                    passedProofCount: 0,
                    totalProofChallenges: 0,
                  };

              return (
                <Card
                  key={course.id}
                  className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6 space-y-6 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                          {course.category}
                        </Badge>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          {course.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {course.tagline}
                      </p>
                    </div>

                    <Button size="sm" variant="outline" asChild className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                      <Link href={`/courses/${course.slug}`}>
                        <span>View Syllabus</span>
                        <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    </Button>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-600 dark:text-slate-400">Lesson Progress</span>
                      <span className="text-blue-600 dark:text-blue-400 font-bold">
                        {cStats.percent}% ({cStats.completedLessonsCount}/
                        {cStats.totalLessons})
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all"
                        style={{ width: `${cStats.percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Lessons & Proof Records Checklist */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {course.modules.flatMap((m: Module) =>
                      m.lessons.map((l: Lesson) => {
                        const key = makeLessonKey(course.slug, m.slug, l.slug);
                        const isDone =
                          progressState?.completedLessons.includes(key);
                        const proof = progressState?.proofAttempts[key];

                        return (
                          <Link
                            key={l.id}
                            href={`/courses/${course.slug}/modules/${m.slug}/lessons/${l.slug}`}
                            className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors shadow-2xs"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                              ) : (
                                <Circle className="w-4 h-4 text-slate-400 dark:text-slate-600 shrink-0" />
                              )}
                              <span className="text-xs text-slate-800 dark:text-slate-300 truncate font-medium">
                                {l.title}
                              </span>
                            </div>

                            {proof?.passed ? (
                              <Badge
                                variant="outline"
                                className="text-[10px] border-blue-200 dark:border-blue-500/40 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 shrink-0"
                              >
                                Proof Verified
                              </Badge>
                            ) : isDone ? (
                              <Badge
                                variant="outline"
                                className="text-[10px] border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 shrink-0"
                              >
                                Completed
                              </Badge>
                            ) : (
                              <span className="text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
                                Not Started
                              </span>
                            )}
                          </Link>
                        );
                      })
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
