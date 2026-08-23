"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { getCourseBySlug } from "@/lib/data/courses";
import {
  getLocalProgress,
  calculateCourseProgress,
  makeLessonKey,
  LessonProgressState,
} from "@/lib/progress/tracker";
import {
  Clock,
  CheckCircle2,
  Circle,
  Play,
  ShieldCheck,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

export default function CourseOverviewPage() {
  const params = useParams();
  const courseSlug = params?.courseSlug as string;

  const [progressState, setProgressState] =
    useState<LessonProgressState | null>(null);

  const course = getCourseBySlug(courseSlug);

  useEffect(() => {
    setProgressState(getLocalProgress());
  }, []);

  if (!course) {
    return (
      <AppShell>
        <div className="py-20 text-center space-y-4 max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-white">Course Not Found</h1>
          <p className="text-sm text-zinc-400">
            The course &ldquo;{courseSlug}&rdquo; could not be located in the curriculum catalog.
          </p>
          <Button asChild>
            <Link href="/courses">Browse All Courses</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  const stats = progressState
    ? calculateCourseProgress(course, progressState)
    : { percent: 0, completedLessonsCount: 0, totalLessons: 0, masteryPercent: 0 };

  // Find the first uncompleted lesson to "Continue"
  let continueLesson = course.modules[0]?.lessons[0];
  let continueModule = course.modules[0];

  if (progressState) {
    for (const mod of course.modules) {
      for (const les of mod.lessons) {
        const key = makeLessonKey(course.slug, mod.slug, les.slug);
        if (!progressState.completedLessons.includes(key)) {
          continueLesson = les;
          continueModule = mod;
          break;
        }
      }
      if (continueLesson && !progressState.completedLessons.includes(makeLessonKey(course.slug, continueModule.slug, continueLesson.slug))) {
        break;
      }
    }
  }

  const firstLesson = course.modules[0]?.lessons[0];
  const firstModule = course.modules[0];

  return (
    <AppShell>
      <div className="space-y-10 py-6 max-w-5xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-zinc-400">
          <Link href="/courses" className="hover:text-zinc-200 transition-colors">
            Courses
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-zinc-200 font-medium">{course.title}</span>
        </nav>

        {/* Hero Banner */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-10 space-y-6 relative overflow-hidden">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
              {course.category}
            </Badge>
            <Badge variant="outline" className="text-xs border-zinc-700">
              {course.difficulty}
            </Badge>
            <span className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Clock className="w-3.5 h-3.5" />
              ~{course.estimatedHours} Hours
            </span>
          </div>

          <div className="space-y-3 max-w-3xl">
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {course.title}
            </h1>
            <p className="text-base text-zinc-300 leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Progress Bar & Actions */}
          <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2 min-w-[240px]">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-zinc-400">Completion</span>
                <span className="text-emerald-400 font-bold">
                  {stats.percent}% ({stats.completedLessonsCount}/{stats.totalLessons} Lessons)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${stats.percent}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {continueLesson && continueModule && (
                <Button
                  size="lg"
                  className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold gap-2 shadow-lg shadow-emerald-500/20"
                  asChild
                >
                  <Link
                    href={`/courses/${course.slug}/modules/${continueModule.slug}/lessons/${continueLesson.slug}`}
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>
                      {stats.percent > 0 ? "Continue Learning" : "Start Course"}
                    </span>
                  </Link>
                </Button>
              )}

              {firstLesson && firstModule && stats.percent > 0 && (
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 border-zinc-700 hover:bg-zinc-800 text-xs font-semibold"
                  asChild
                >
                  <Link
                    href={`/courses/${course.slug}/modules/${firstModule.slug}/lessons/${firstLesson.slug}`}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Start From Beginning</span>
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Syllabus / Module & Lesson Tree */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Course Syllabus
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                {course.modules.length} comprehensive modules covering progressive concepts.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {course.modules.map((mod, modIdx) => {
              const isModuleComplete =
                progressState?.completedModules.includes(
                  `${course.slug}/${mod.slug}`
                );

              return (
                <Card
                  key={mod.id}
                  className="border-zinc-800 bg-zinc-900/40 overflow-hidden"
                >
                  <CardHeader className="bg-zinc-900/80 border-b border-border/50 py-4 px-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                            Module {modIdx + 1}
                          </span>
                          {isModuleComplete && (
                            <Badge variant="success" className="text-[10px] py-0 px-2">
                              Module Completed
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg font-bold text-white">
                          {mod.title}
                        </CardTitle>
                      </div>
                      <span className="text-xs text-zinc-400">
                        {mod.lessons.length} Lessons
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0 divide-y divide-border/40">
                    {mod.lessons.map((lesson, lesIdx) => {
                      const lessonKey = makeLessonKey(
                        course.slug,
                        mod.slug,
                        lesson.slug
                      );
                      const isLessonDone =
                        progressState?.completedLessons.includes(lessonKey);
                      const proofAttempt =
                        progressState?.proofAttempts[lessonKey];

                      return (
                        <Link
                          key={lesson.id}
                          href={`/courses/${course.slug}/modules/${mod.slug}/lessons/${lesson.slug}`}
                          className="flex items-center justify-between p-4 sm:px-6 hover:bg-zinc-800/50 transition-colors group"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            {isLessonDone ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                            ) : (
                              <Circle className="w-5 h-5 text-zinc-600 shrink-0 group-hover:text-zinc-400 transition-colors" />
                            )}

                            <div className="space-y-0.5 truncate">
                              <p className="text-sm font-semibold text-zinc-200 group-hover:text-emerald-400 transition-colors truncate">
                                {lesIdx + 1}. {lesson.title}
                              </p>
                              <p className="text-xs text-zinc-400 truncate">
                                {lesson.summary}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 ml-4">
                            {proofAttempt?.passed && (
                              <Badge
                                variant="outline"
                                className="hidden sm:inline-flex gap-1 text-[10px] border-emerald-500/40 text-emerald-400 bg-emerald-950/20"
                              >
                                <ShieldCheck className="w-3 h-3" /> Proof Verified
                              </Badge>
                            )}
                            <span className="text-xs text-zinc-500">
                              {lesson.durationMinutes} min
                            </span>
                            <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                          </div>
                        </Link>
                      );
                    })}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
