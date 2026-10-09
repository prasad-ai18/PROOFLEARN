"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { COURSES, type Course } from "@/lib/data/courses";
import {
  getLocalProgress,
  calculateCourseProgress,
  getOverallStatistics,
  syncStudentDataToDatabase,
  LessonProgressState,
} from "@/lib/progress/tracker";
import { createClient } from "@/lib/supabase/client";
import {
  Play,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Award,
  Terminal,
  Code,
  Database,
  Brain,
  BarChart3,
} from "lucide-react";

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<{
    displayName: string;
    email?: string;
  }>({ displayName: "Learner" });

  const [progressState, setProgressState] =
    useState<LessonProgressState | null>(null);

  useEffect(() => {
    // 1. Fetch user session or fallback to guest info
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const metadata = user.user_metadata || {};
        setCurrentUser({
          displayName:
            metadata.full_name ||
            metadata.name ||
            (user.email ? user.email.split("@")[0] : "Learner"),
          email: user.email,
        });
      } else if (typeof window !== "undefined") {
        const guestName = localStorage.getItem("prooflearn_guest_name");
        const guestEmail = localStorage.getItem("prooflearn_guest_email");
        if (guestName) {
          setCurrentUser({ displayName: guestName, email: guestEmail || undefined });
        } else if (guestEmail) {
          setCurrentUser({ displayName: guestEmail.split("@")[0], email: guestEmail });
        }
      }
    });

    // 2. Load progress & sync with cloud database
    syncStudentDataToDatabase().then((synced) => {
      setProgressState(synced);
    }).catch(() => {
      setProgressState(getLocalProgress());
    });
  }, []);

  const stats = progressState
    ? getOverallStatistics(progressState)
    : {
        totalCompletedLessons: 0,
        totalLessonsAllCourses: COURSES.reduce(
          (acc, c) => acc + c.modules.reduce((mAcc, m) => mAcc + m.lessons.length, 0),
          0
        ),
        totalPassedProofs: 0,
        totalProofsAllCourses: COURSES.reduce(
          (acc, c) => acc + c.modules.reduce((mAcc, m) => mAcc + m.lessons.length, 0),
          0
        ),
        enrolledCoursesCount: 0,
        overallMastery: 0,
        overallCompletion: 0,
      };

  const lastPosition = progressState?.lastPosition;

  const iconMap: Record<string, React.ReactNode> = {
    Terminal: <Terminal className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    Code: <Code className="w-5 h-5 text-amber-500 dark:text-amber-400" />,
    Database: <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    Brain: <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
    BarChart3: <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
    Layers: <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    BookOpen: <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
  };

  return (
    <AppShell>
      <div className="space-y-10 py-6 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Welcome back, {currentUser.displayName}!
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Track your verified learning journey, practice concepts, and prove your engineering mastery.
          </p>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-4 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span className="text-xs font-semibold">Lessons Completed</span>
              <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {stats.totalCompletedLessons}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Across all tracks
            </p>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-4 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span className="text-xs font-semibold">Proofs Verified</span>
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
              {stats.totalPassedProofs}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Independent demonstrations
            </p>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-4 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span className="text-xs font-semibold">Mastery Score</span>
              <Award className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {stats.overallMastery}%
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Weighted proof proficiency
            </p>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-4 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span className="text-xs font-semibold">Active Tracks</span>
              <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {stats.enrolledCoursesCount} / {COURSES.length}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              In progress
            </p>
          </Card>
        </div>

        {/* ================================================================= */}
        {/* CONTINUE LEARNING HERO BANNER                                     */}
        {/* ================================================================= */}
        {lastPosition ? (
          <div className="rounded-3xl border border-blue-200 dark:border-blue-900/50 bg-gradient-to-r from-blue-50/80 via-white to-blue-50/30 dark:from-blue-950/30 dark:via-slate-900/80 dark:to-slate-900/40 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-500/20">
                <Play className="w-3 h-3 fill-current" />
                Resume Learning
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {lastPosition.lessonTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {lastPosition.courseTitle}
              </p>
            </div>

            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 shrink-0 shadow-sm"
              asChild
            >
              <Link
                href={`/courses/${lastPosition.courseSlug}/modules/${lastPosition.moduleSlug}/lessons/${lastPosition.lessonSlug}`}
              >
                <span>Continue Lesson</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-8 text-center space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Ready to begin?</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Pick your first engineering track below to start learning, practicing, and proving your skills.
              </p>
            </div>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"
              asChild
            >
              <Link href="/courses">Browse All Tracks</Link>
            </Button>
          </div>
        )}

        {/* ================================================================= */}
        {/* MY COURSES & EXPLORE TRACKS                                       */}
        {/* ================================================================= */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Engineering Tracks</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/courses" className="gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold">
                <span>View All 5 Courses</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COURSES.map((course) => {
              const cStats = progressState
                ? calculateCourseProgress(course, progressState)
                : { percent: 0, completedLessonsCount: 0, totalLessons: 0 };

            const totalLessons = course.modules.reduce(
              (acc: number, m: Course["modules"][number]) =>
                acc + m.lessons.length,
              0
            );

              return (
                <Card
                  key={course.id}
                  className="flex flex-col justify-between border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-blue-500/50 transition-colors shadow-xs"
                >
                  <CardHeader className="space-y-3 pb-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        {iconMap[course.iconName] || (
                          <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                      <Badge variant="outline" className="text-[10px] border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                        {course.difficulty}
                      </Badge>
                    </div>

                    <div>
                      <CardTitle className="text-lg text-slate-900 dark:text-white">
                        {course.title}
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                        {course.tagline}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-0">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-semibold">
                        <span className="text-slate-600 dark:text-slate-400">Progress</span>
                        <span className="text-blue-600 dark:text-blue-400 font-bold">
                          {cStats.percent}% ({cStats.completedLessonsCount}/{totalLessons})
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all"
                          style={{ width: `${cStats.percent}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-3 border-t border-slate-100 dark:border-slate-800/60">
                    <Button
                      size="sm"
                      className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors"
                      asChild
                    >
                      <Link href={`/courses/${course.slug}`}>
                        <span>
                          {cStats.percent > 0 ? "Continue Track" : "Start Track"}
                        </span>
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
