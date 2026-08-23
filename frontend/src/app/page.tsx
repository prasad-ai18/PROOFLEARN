"use client";

import React from "react";
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
import { COURSES } from "@/lib/data/courses";
import {
  ShieldCheck,
  Brain,
  BookOpen,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  Code,
  Database,
  BarChart3,
  Terminal,
  Clock,
  Layers,
  Award,
} from "lucide-react";

export default function LandingPage() {
  const iconMap: Record<string, React.ReactNode> = {
    Terminal: <Terminal className="w-5 h-5 text-emerald-400" />,
    Code: <Code className="w-5 h-5 text-amber-400" />,
    Database: <Database className="w-5 h-5 text-blue-400" />,
    Brain: <Brain className="w-5 h-5 text-purple-400" />,
    BarChart3: <BarChart3 className="w-5 h-5 text-indigo-400" />,
  };

  return (
    <AppShell>
      <div className="space-y-20 py-6 sm:py-12">
        {/* ================================================================= */}
        {/* HERO SECTION                                                      */}
        {/* ================================================================= */}
        <section className="text-center space-y-6 max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            Proof-Driven Technical Education
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight sm:leading-none">
            Don&apos;t just get the answer.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
              Prove you learned it.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            AI should help you understand concepts, not replace your ability to
            think. Learn through structured lessons, practice formative
            problems, and enter <strong>PROOF MODE</strong> to demonstrate true
            independent mastery.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button
              size="lg"
              className="w-full sm:w-auto h-13 px-8 text-base font-bold bg-emerald-500 hover:bg-emerald-600 text-zinc-950 gap-2 shadow-lg shadow-emerald-500/20"
              asChild
            >
              <Link href="/courses">
                <span>Start Learning Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-13 px-8 text-base font-semibold border-zinc-700 hover:bg-zinc-800"
              asChild
            >
              <Link href="/auth/sign-in">Sign In to Dashboard</Link>
            </Button>
          </div>
        </section>

        {/* ================================================================= */}
        {/* HOW IT WORKS (PEDAGOGICAL LOOP)                                   */}
        {/* ================================================================= */}
        <section className="space-y-10 max-w-6xl mx-auto px-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              The 4-Step Mastery Protocol
            </h2>
            <p className="text-sm text-zinc-400">
              A proven pedagogical structure designed to turn surface-level
              reading into verified engineering skill.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-3 relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-black">
                1
              </div>
              <h3 className="text-lg font-bold text-white">1. Learn</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Study comprehensive, modular concepts structured from beginner
                foundations to enterprise patterns with clear code examples.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-3 relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-black">
                2
              </div>
              <h3 className="text-lg font-bold text-white">2. Practice</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Test formative understanding with instant-feedback questions,
                identifying misconceptions before progressing.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-6 space-y-3 relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black">
                3
              </div>
              <h3 className="text-lg font-bold text-emerald-300">
                3. PROOF MODE
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                AI assistance is disabled. You independently solve scenario
                challenges, proving genuine conceptual comprehension.
              </p>
            </div>

            {/* Step 4 */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-3 relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-black">
                4
              </div>
              <h3 className="text-lg font-bold text-white">4. Master</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Earn verifiable proof records in your immutable learning ledger,
                tracked across every lesson, module, and course.
              </p>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* COURSES CATALOG PREVIEW                                           */}
        {/* ================================================================= */}
        <section className="space-y-8 max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/80 pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Core Engineering Tracks
              </h2>
              <p className="text-sm text-zinc-400 mt-1">
                Five production-grade curriculums designed for deep, progressive
                mastery.
              </p>
            </div>
            <Button variant="ghost" className="gap-1.5 text-xs text-emerald-400 hover:text-emerald-300" asChild>
              <Link href="/courses">
                <span>View All Tracks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COURSES.map((course) => {
              const totalLessons = course.modules.reduce(
                (acc, m) => acc + m.lessons.length,
                0
              );
              return (
                <Card
                  key={course.id}
                  className="flex flex-col justify-between border-zinc-800/80 bg-zinc-900/40 hover:border-emerald-500/50 hover:bg-zinc-900/80 transition-all group"
                >
                  <CardHeader className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700">
                        {iconMap[course.iconName] || (
                          <BookOpen className="w-5 h-5 text-emerald-400" />
                        )}
                      </div>
                      <Badge variant="outline" className="text-[11px] border-zinc-700">
                        {course.difficulty}
                      </Badge>
                    </div>
                    <div>
                      <CardTitle className="text-xl group-hover:text-emerald-400 transition-colors">
                        {course.title}
                      </CardTitle>
                      <CardDescription className="text-xs text-zinc-400 mt-1 line-clamp-2">
                        {course.description}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-2 pt-0">
                    <div className="flex items-center gap-4 text-xs text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{course.modules.length} Modules</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{totalLessons} Lessons</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        <span>~{course.estimatedHours}h</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-4 border-t border-border/40">
                    <Button
                      size="sm"
                      className="w-full bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 font-semibold transition-colors"
                      asChild
                    >
                      <Link href={`/courses/${course.slug}`}>
                        <span>Explore Curriculum</span>
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>

        {/* ================================================================= */}
        {/* PROOF MODE HIGHLIGHT BANNER                                       */}
        {/* ================================================================= */}
        <section className="max-w-5xl mx-auto px-4">
          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/40 to-zinc-950 p-8 sm:p-12 text-center space-y-6">
            <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                The PROOF MODE Difference
              </h2>
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                When you enter Proof Mode, AI assistance is locked out. You
                solve independent challenges and novel transfer scenarios.
                Your solutions generate a verified mastery record you can truly
                stand behind.
              </p>
            </div>

            <div className="pt-2">
              <Button
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold px-8 h-12"
                asChild
              >
                <Link href="/courses/python">Try Python Proof Mode</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
