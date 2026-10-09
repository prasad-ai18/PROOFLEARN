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
import { COURSES, type Course } from "@/lib/data/courses";
import {
  ShieldCheck,
  Brain,
  BookOpen,
  ArrowRight,
  Lock,
  Code,
  Database,
  BarChart3,
  Terminal,
  Clock,
  Layers,
  FileText,
  Sparkles,
  Play,
} from "lucide-react";

export default function LandingPage() {
  const iconMap: Record<string, React.ReactNode> = {
    Terminal: <Terminal className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    Code: <Code className="w-5 h-5 text-blue-500 dark:text-blue-400" />,
    Database: <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    Brain: <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
    BarChart3: <BarChart3 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
  };

  return (
    <AppShell>
      <div className="space-y-20 py-6 sm:py-12">
        {/* ================================================================= */}
        {/* HERO SECTION                                                      */}
        {/* ================================================================= */}
        <section className="text-center space-y-6 max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-800/80 bg-blue-50 dark:bg-blue-950/40 px-3.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Proof-Driven Technical Education
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight sm:leading-none">
            Don&apos;t just get the answer.{" "}
            <span className="text-blue-600 dark:text-blue-400">
              Prove you learned it.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            AI should help you understand concepts, not replace your ability to
            think. Learn through structured lessons, practice formative
            problems, and enter <strong>PROOF MODE</strong> to demonstrate true
            independent mastery.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button
              size="lg"
              className="w-full sm:w-auto h-12 px-8 text-base font-bold bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-sm"
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
              className="w-full sm:w-auto h-12 px-8 text-base font-semibold border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
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
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              The 4-Step Mastery Protocol
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              A proven pedagogical structure designed to turn surface-level
              reading into verified engineering skill.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-3 relative overflow-hidden shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/80 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">1. Learn</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Study comprehensive, modular concepts structured from beginner
                foundations to enterprise patterns with clear code examples.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-3 relative overflow-hidden shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 font-black">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">2. Practice</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Test formative understanding with instant-feedback questions,
                identifying misconceptions before progressing.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl border border-blue-300 dark:border-blue-700/60 bg-blue-50/50 dark:bg-blue-950/30 p-6 space-y-3 relative overflow-hidden shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-xs">
                3
              </div>
              <h3 className="text-lg font-bold text-blue-700 dark:text-blue-300">
                3. PROOF MODE
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                AI assistance is disabled. You independently solve multi-question
                challenges ($\ge 70\%$ score required) to prove real comprehension.
              </p>
            </div>

            {/* Step 4 */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-3 relative overflow-hidden shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 font-black">
                4
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">4. Master</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
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
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Core Engineering Tracks
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Production-grade curriculums designed for deep, progressive mastery.
              </p>
            </div>
            <Button variant="ghost" className="gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300" asChild>
              <Link href="/courses">
                <span>View All 22 Tracks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COURSES.slice(0, 6).map((course) => {
              const totalLessons = course.modules.reduce(
                (acc: number, m: Course["modules"][number]) => acc + m.lessons.length,
                0
              );
              return (
                <Card
                  key={course.id}
                  className="flex flex-col justify-between border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md transition-all group"
                >
                  <CardHeader className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700">
                        {iconMap[course.iconName] || (
                          <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                      <Badge variant="outline" className="text-[11px] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                        {course.difficulty}
                      </Badge>
                    </div>
                    <div>
                      <CardTitle className="text-xl text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {course.title}
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                        {course.description}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-0">
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        <span>{course.modules.length} Modules</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        <span>{totalLessons} Lessons</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        <span>~{course.estimatedHours}h</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 font-medium">
                        Google Skills
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium">
                        roadmap.sh
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/40 font-medium">
                        YouTube
                      </span>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                    <Button
                      size="sm"
                      className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-800 dark:text-slate-200 font-semibold transition-colors"
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
        {/* PLAYGROUND & RESUME BUILDER SHOWCASE                              */}
        {/* ================================================================= */}
        <section className="space-y-8 max-w-6xl mx-auto px-4">
          <div className="text-center space-y-2">
            <Badge className="bg-sky-600 text-white text-xs">
              Career & Practice Ecosystem
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              From Hands-On Code Execution to Industry Placement
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Run and test code across all course languages with real-time sandbox execution, then craft an ATS-optimized resume embedded with your verified ProofLearn credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Multi-Language Playground */}
            <Card className="flex flex-col justify-between border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 rounded-2xl hover:border-emerald-500/50 hover:shadow-lg transition-all group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                    <Terminal className="w-6 h-6" />
                  </div>
                  <Badge className="bg-emerald-600 text-white text-[11px]">
                    11 Languages Supported
                  </Badge>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Multi-Language Code Playground
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    Write, compile, and execute code directly in your browser. Practice Python, C, C++, Java, Rust, Go, SQL, JavaScript, TypeScript, Bash, and Verilog with live stdin, terminal outputs, and automated test cases.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["Python", "C/C++", "Java", "Rust", "Go", "SQL", "Verilog"].map((tech) => (
                    <span key={tech} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 mt-6">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 text-xs" asChild>
                  <Link href="/code-playground">
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Launch Code Playground</span>
                  </Link>
                </Button>
              </div>
            </Card>

            {/* Card 2: Resume Builder & ATS Score Analyzer */}
            <Card className="flex flex-col justify-between border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 rounded-2xl hover:border-sky-500/50 hover:shadow-lg transition-all group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800/60">
                    <FileText className="w-6 h-6" />
                  </div>
                  <Badge className="bg-sky-600 text-white text-[11px]">
                    FAANG ATS Verified
                  </Badge>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    Resume Builder & ATS Score Analyzer
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    Build professional recruiter-grade resumes with 4 modern templates. Analyze your ATS score in real time, compare against target job descriptions, and 1-click import earned PROOFLEARN credentials.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["FAANG Minimalist", "Modern Executive", "Classic Ivy", "Developer Mono"].map((tpl) => (
                    <span key={tpl} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                      {tpl}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 mt-6">
                <Button className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold gap-2 text-xs" asChild>
                  <Link href="/resume-builder">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Open Resume Builder & ATS</span>
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </section>

        {/* ================================================================= */}
        {/* PROOF MODE HIGHLIGHT BANNER                                       */}
        {/* ================================================================= */}
        <section className="max-w-5xl mx-auto px-4">
          <div className="rounded-3xl border border-blue-200 dark:border-blue-800/60 bg-blue-50/40 dark:bg-slate-900/80 p-8 sm:p-12 text-center space-y-6 shadow-xs">
            <div className="inline-flex p-3 rounded-2xl bg-blue-600 text-white mx-auto shadow-sm">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                The PROOF MODE Difference
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                When you enter Proof Mode, AI assistance is locked out. You
                solve independent challenges requiring $\ge 70\%$ to pass.
                Your solutions generate a verified mastery record in your
                immutable ledger.
              </p>
            </div>

            <div className="pt-2">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 h-12 shadow-sm"
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
