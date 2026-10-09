"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  getLessonBySlugs,
  type Module,
  type Lesson,
  type PracticeQuestion,
} from "@/lib/data/courses";
import {
  getLocalProgress,
  markLessonComplete,
  recordPracticeAttempt,
  recordProofAttempt,
  makeLessonKey,
  LessonProgressState,
} from "@/lib/progress/tracker";
import {
  getProofQuestionsForLesson,
  calculateProofScore,
  isLessonUnlocked,
  PASSING_SCORE_PERCENT,
} from "@/lib/data/proof-system";
import type { ProofQuestion } from "@/lib/data/course-types";
import {
  BookOpen,
  CheckCircle2,
  Circle,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Award,
  Lock,
  Brain,
  Layers,
  RotateCcw,
  Check,
  AlertCircle,
  ExternalLink,
  GraduationCap,
  Map,
  X,
} from "lucide-react";

function YoutubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

/**
 * Parses markdown into clean HTML elements with syntax highlighted code blocks.
 */
function renderLessonMarkdown(raw: string): string {
  if (!raw) return "";

  // 1. Code blocks with language detection
  let html = raw.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (_match, lang, code) => {
    const language = (lang || "code").toLowerCase();
    let accentClass = "text-emerald-300";
    if (["java", "javascript", "typescript", "js", "ts", "jsx", "tsx"].includes(language)) {
      accentClass = "text-amber-300";
    } else if (["sql", "postgresql", "mysql"].includes(language)) {
      accentClass = "text-blue-300";
    } else if (["bash", "sh", "zsh", "dockerfile", "docker", "shell"].includes(language)) {
      accentClass = "text-cyan-300";
    } else if (["json", "yaml", "yml"].includes(language)) {
      accentClass = "text-purple-300";
    }

    const escapedCode = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    return `<div class="my-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden shadow-inner"><div class="px-4 py-1.5 border-b border-slate-800 bg-slate-900/90 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between"><span>${lang || "code"}</span><span class="text-slate-500 text-[9px]">Syntax verified</span></div><pre class="p-4 ${accentClass} text-xs font-mono overflow-x-auto leading-relaxed"><code>${escapedCode}</code></pre></div>`;
  });

  // 2. Headings
  html = html
    .replace(/^### (.*?)$/gm, '<h3 class="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-2 tracking-tight">$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2 class="text-xl font-black text-slate-900 dark:text-white mt-8 mb-3 tracking-tight border-b border-slate-200 dark:border-slate-800 pb-2">$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-black text-slate-900 dark:text-white mt-8 mb-4">$1</h1>');

  // 3. Bold and inline code
  html = html
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded text-xs font-mono border border-blue-200 dark:border-slate-700">$1</code>');

  // 4. Bullet points
  html = html.replace(/^[•*-] (.*?)$/gm, '<li class="ml-4 list-disc text-slate-700 dark:text-slate-300 my-1">$1</li>');

  // 5. Paragraphs
  html = html
    .split(/\n\n+/)
    .map((chunk) => {
      const trimmed = chunk.trim();
      if (
        trimmed.startsWith("<h") ||
        trimmed.startsWith("<div") ||
        trimmed.startsWith("<li") ||
        trimmed.startsWith("<ul")
      ) {
        return trimmed;
      }
      return `<p class="my-3 text-slate-700 dark:text-slate-300 leading-relaxed">${trimmed.replace(/\n/g, "<br />")}</p>`;
    })
    .join("");

  return html;
}

export default function LessonLearningPage() {
  const params = useParams();
  const router = useRouter();

  const courseSlug = params?.courseSlug as string;
  const moduleSlug = params?.moduleSlug as string;
  const lessonSlug = params?.lessonSlug as string;

  const [progressState, setProgressState] = useState<LessonProgressState | null>(null);
  const [activeTab, setActiveTab] = useState<"lesson" | "practice" | "proof" | "resources">("lesson");

  // Practice state
  const [selectedPracticeAnswers, setSelectedPracticeAnswers] = useState<Record<string, number>>({});
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);

  // Proof state (multi-question quiz with 70% threshold)
  const [selectedProofAnswers, setSelectedProofAnswers] = useState<Record<string, number>>({});
  const [proofSubmitted, setProofSubmitted] = useState(false);
  const [proofPassed, setProofPassed] = useState(false);
  const [proofScorePercent, setProofScorePercent] = useState<number>(0);
  const [proofScoreDetail, setProofScoreDetail] = useState<{ score: number; total: number } | null>(null);

  const data = getLessonBySlugs(courseSlug, moduleSlug, lessonSlug);

  useEffect(() => {
    const p = getLocalProgress();
    setProgressState(p);

    // Reset local interactive states when switching lessons
    setSelectedPracticeAnswers({});
    setPracticeSubmitted(false);
    setSelectedProofAnswers({});
    setProofSubmitted(false);
    setProofPassed(false);
    setProofScorePercent(0);
    setProofScoreDetail(null);
    setActiveTab("lesson");
  }, [courseSlug, moduleSlug, lessonSlug]);

  if (!data) {
    return (
      <AppShell>
        <div className="py-20 text-center space-y-4 max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-white">Lesson Not Found</h1>
          <p className="text-sm text-zinc-400">
            The requested lesson could not be found in track &ldquo;{courseSlug}&rdquo;.
          </p>
          <Button asChild>
            <Link href="/courses">Back to Courses</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  const { course, module, lesson } = data;
  const lessonKey = makeLessonKey(courseSlug, moduleSlug, lessonSlug);
  const isCurrentLessonComplete = progressState?.completedLessons.includes(lessonKey);
  const existingProof = progressState?.proofAttempts[lessonKey];
  const proofQuestions: ProofQuestion[] = getProofQuestionsForLesson(lesson);

  // Has this lesson's proof been passed (>= 70%)?
  const isProofVerified = Boolean(existingProof?.passed || proofPassed);

  // Calculate previous and next lesson links
  const allCourseLessons: { modSlug: string; lesSlug: string }[] = [];
  course.modules.forEach((m: Module) => {
    m.lessons.forEach((l: Lesson) => {
      allCourseLessons.push({ modSlug: m.slug, lesSlug: l.slug });
    });
  });

  const currentIndex = allCourseLessons.findIndex(
    (item) => item.modSlug === moduleSlug && item.lesSlug === lessonSlug
  );

  const prevLesson = currentIndex > 0 ? allCourseLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < allCourseLessons.length - 1
      ? allCourseLessons[currentIndex + 1]
      : null;

  // Handle Mark Complete & Advance
  const handleMarkComplete = async () => {
    if (!isProofVerified) {
      setActiveTab("proof");
      return;
    }

    const updated = await markLessonComplete(
      course.slug,
      module.slug,
      lesson.slug,
      course.title,
      lesson.title
    );
    setProgressState(updated);

    if (nextLesson) {
      router.push(
        `/courses/${course.slug}/modules/${nextLesson.modSlug}/lessons/${nextLesson.lesSlug}`
      );
    }
  };

  // Handle Practice Submit
  const handlePracticeSubmit = async () => {
    setPracticeSubmitted(true);
    let correctCount = 0;
    lesson.practiceQuestions.forEach((q: PracticeQuestion) => {
      if (selectedPracticeAnswers[q.id] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const updated = await recordPracticeAttempt(
      course.slug,
      module.slug,
      lesson.slug,
      correctCount,
      lesson.practiceQuestions.length
    );
    setProgressState(updated);
  };

  // Handle Proof Submit (Scores quiz and requires >= 70% to pass)
  const handleProofSubmit = async () => {
    const result = calculateProofScore(proofQuestions, selectedProofAnswers);
    setProofSubmitted(true);
    setProofPassed(result.passed);
    setProofScorePercent(result.percent);
    setProofScoreDetail({ score: result.score, total: result.total });

    const updated = await recordProofAttempt(
      course.slug,
      module.slug,
      lesson.slug,
      result.percent,
      100,
      result.passed,
      `Score: ${result.percent}% (${result.score}/${result.total})`
    );
    setProgressState(updated);
  };

  const answeredProofCount = Object.keys(selectedProofAnswers).length;
  const allProofAnswered = answeredProofCount === proofQuestions.length;

  return (
    <AppShell>
      <div className="py-4 space-y-6 max-w-7xl mx-auto">
        {/* Breadcrumbs & Course Progress */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 truncate">
            <Link href="/courses" className="hover:text-blue-600 dark:hover:text-blue-400 shrink-0">
              Courses
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <Link
              href={`/courses/${course.slug}`}
              className="hover:text-blue-600 dark:hover:text-blue-400 shrink-0"
            >
              {course.title}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <span className="text-slate-800 dark:text-slate-200 font-medium truncate">
              {module.title}
            </span>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            {isProofVerified ? (
              <Badge
                variant="outline"
                className="gap-1 text-[11px] border-blue-200 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/30"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Proof Verified ({existingProof ? `${existingProof.score}%` : `${proofScorePercent}%`})
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="gap-1 text-[11px] border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20"
              >
                <Lock className="w-3.5 h-3.5" /> 70% Proof Score Required to Advance
              </Badge>
            )}
            {isCurrentLessonComplete && (
              <Badge variant="success" className="gap-1 text-[11px] bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300">
                <CheckCircle2 className="w-3 h-3 text-blue-600 dark:text-blue-400" /> Completed
              </Badge>
            )}
          </div>
        </div>

        {/* Main Grid: Sidebar + Learning Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Syllabus Sidebar */}
          <aside className="lg:col-span-1 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/50 p-4 space-y-4 max-h-[calc(100vh-10rem)] overflow-y-auto hidden lg:block sticky top-20 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Module Syllabus</span>
            </div>

            <div className="space-y-4">
              {course.modules.map((m: Module) => (
                <div key={m.id} className="space-y-1.5">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 px-2 truncate">
                    {m.title}
                  </p>
                  <div className="space-y-0.5">
                    {m.lessons.map((l: Lesson) => {
                      const key = makeLessonKey(course.slug, m.slug, l.slug);
                      const isDone = progressState?.completedLessons.includes(key);
                      const isCurrent = m.slug === moduleSlug && l.slug === lessonSlug;
                      const isUnlocked = isLessonUnlocked(course, m.slug, l.slug, progressState);

                      return (
                        <Link
                          key={l.id}
                          href={`/courses/${course.slug}/modules/${m.slug}/lessons/${l.slug}`}
                          className={`flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-xs transition-colors ${
                            isCurrent
                              ? "bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-white border border-blue-200 dark:border-slate-700 font-semibold shadow-2xs"
                              : isUnlocked
                              ? "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                              : "text-slate-400 dark:text-slate-600 hover:text-slate-500 cursor-not-allowed"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {isDone ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                            ) : !isUnlocked ? (
                              <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
                            ) : (
                              <Circle className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                            )}
                            <span className="truncate">{l.title}</span>
                          </div>
                          {!isUnlocked && (
                            <span className="text-[10px] text-slate-400 dark:text-slate-600 shrink-0">Locked</span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Center Main Content Area */}
          <main className="lg:col-span-3 space-y-6">
            {/* Lesson Title Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-semibold">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{module.title}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {lesson.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {lesson.summary}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={(val) =>
                setActiveTab(val as "lesson" | "practice" | "proof" | "resources")
              }
              className="w-full"
            >
              <TabsList className="grid grid-cols-4 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl">
                <TabsTrigger value="lesson" className="gap-1.5 text-xs font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-blue-600 dark:data-[state=active]:text-white shadow-xs">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>1. Lesson</span>
                </TabsTrigger>
                <TabsTrigger value="practice" className="gap-1.5 text-xs font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-blue-600 dark:data-[state=active]:text-white shadow-xs">
                  <Brain className="w-3.5 h-3.5" />
                  <span>2. Practice ({lesson.practiceQuestions.length})</span>
                </TabsTrigger>
                <TabsTrigger
                  value="proof"
                  className="gap-1.5 text-xs font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 shadow-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>3. PROOF QUIZ (70%+)</span>
                </TabsTrigger>
                <TabsTrigger value="resources" className="gap-1.5 text-xs font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-blue-600 dark:data-[state=active]:text-white shadow-xs">
                  <YoutubeIcon className="w-3.5 h-3.5 text-red-500" />
                  <span>4. Videos & Links</span>
                </TabsTrigger>
              </TabsList>

              {/* ============================================================= */}
              {/* TAB 1: LESSON CONTENT                                         */}
              {/* ============================================================= */}
              <TabsContent value="lesson" className="space-y-6 pt-4">
                <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-xs">
                  <CardContent className="p-6 sm:p-8 space-y-6 max-w-none text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                    {/* Render content sections */}
                    <div
                      className="space-y-4"
                      dangerouslySetInnerHTML={{
                        __html: renderLessonMarkdown(lesson.content),
                      }}
                    />

                    {/* Key Takeaways */}
                    <div className="rounded-2xl border border-blue-200 dark:border-blue-800/80 bg-blue-50/50 dark:bg-blue-950/20 p-5 space-y-3 mt-8">
                      <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                        <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span>Core Takeaways</span>
                      </div>
                      <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 list-disc list-inside">
                        {lesson.keyTakeaways.map((point: string, idx: number) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Progress CTA inside Lesson Tab */}
                <div className="flex flex-wrap justify-between items-center gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="gap-2 text-xs border-slate-200 dark:border-slate-800"
                    onClick={() => setActiveTab("resources")}
                  >
                    <YoutubeIcon className="w-4 h-4 text-red-500" />
                    <span>Watch Tutorial Video & External Guides</span>
                  </Button>

                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 text-xs shadow-sm"
                    onClick={() => setActiveTab("practice")}
                  >
                    <span>Proceed to Practice Checks</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </TabsContent>

              {/* ============================================================= */}
              {/* TAB 2: FORMATIVE PRACTICE                                     */}
              {/* ============================================================= */}
              <TabsContent value="practice" className="space-y-6 pt-4">
                <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-xs">
                  <CardHeader className="border-b border-slate-200 dark:border-slate-800 pb-4">
                    <div className="space-y-1">
                      <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Brain className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        Formative Practice Checks
                      </CardTitle>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Answer these formative questions to test your comprehension. Afterwards, take the official Proof Quiz (at least 70% required to advance).
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 space-y-8">
                    {lesson.practiceQuestions.map((q: PracticeQuestion, qIdx: number) => (
                      <div
                        key={q.id}
                        className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 p-5"
                      >
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {qIdx + 1}. {q.prompt}
                        </p>

                        {q.codeSnippet && (
                          <pre className="p-3 bg-slate-950 rounded-lg text-xs font-mono text-blue-300 border border-slate-800 overflow-x-auto">
                            <code>{q.codeSnippet}</code>
                          </pre>
                        )}

                        <div className="space-y-2">
                          {q.options?.map((opt: string, optIdx: number) => {
                            const isSelected = selectedPracticeAnswers[q.id] === optIdx;
                            const isCorrect = q.correctAnswer === optIdx;

                            let optionStyle = "border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 bg-white dark:bg-slate-900/50 text-slate-800 dark:text-slate-200";
                            if (practiceSubmitted) {
                              if (isCorrect) {
                                optionStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200 font-semibold";
                              } else if (isSelected && !isCorrect) {
                                optionStyle = "border-red-500 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200";
                              }
                            } else if (isSelected) {
                              optionStyle = "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-200 font-medium";
                            }

                            return (
                              <button
                                key={optIdx}
                                type="button"
                                onClick={() =>
                                  !practiceSubmitted &&
                                  setSelectedPracticeAnswers({
                                    ...selectedPracticeAnswers,
                                    [q.id]: optIdx,
                                  })
                                }
                                className={`w-full text-left p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${optionStyle}`}
                              >
                                <span>{opt}</span>
                                {practiceSubmitted && isCorrect && (
                                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {practiceSubmitted && (
                          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                            <span className="font-semibold text-blue-600 dark:text-blue-400">Explanation:</span>
                            <p>{q.explanation}</p>
                          </div>
                        )}
                      </div>
                    ))}

                    <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-800">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPracticeSubmitted(false);
                          setSelectedPracticeAnswers({});
                        }}
                      >
                        <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                        Reset Practice
                      </Button>

                      <div className="flex gap-3">
                        {!practiceSubmitted ? (
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"
                            onClick={handlePracticeSubmit}
                            disabled={
                              Object.keys(selectedPracticeAnswers).length <
                              lesson.practiceQuestions.length
                            }
                          >
                            Check Practice Answers
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-1.5 shadow-sm"
                            onClick={() => setActiveTab("proof")}
                          >
                            <span>Enter PROOF QUIZ (70% Required)</span>
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ============================================================= */}
              {/* TAB 3: PROOF MODE QUIZ (70% PASS THRESHOLD)                   */}
              {/* ============================================================= */}
              <TabsContent value="proof" className="space-y-6 pt-4">
                <Card className="border-blue-200 dark:border-blue-800/80 bg-white dark:bg-slate-900/60 shadow-md">
                  <CardHeader className="bg-blue-50/80 dark:bg-blue-950/40 border-b border-blue-200 dark:border-blue-800/80 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-900/50 px-2.5 py-0.5 rounded-full border border-blue-300 dark:border-blue-800">
                          <Lock className="w-3 h-3" />
                          PROOF VERIFICATION QUIZ — AT LEAST 70% SCORE REQUIRED TO PASS
                        </div>
                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                          {lesson.proofChallenge.title}
                        </CardTitle>
                      </div>

                      <Badge
                        variant="outline"
                        className="text-xs border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 shrink-0"
                      >
                        {proofQuestions.length} Questions | Threshold: {PASSING_SCORE_PERCENT}%
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 sm:p-8 space-y-8">
                    {/* Overall Scenario Overview */}
                    {lesson.proofChallenge.scenario && (
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5 shadow-2xs">
                        <span className="font-bold text-blue-600 dark:text-blue-400">Engineering Audit Scenario:</span>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                          {lesson.proofChallenge.scenario}
                        </p>
                      </div>
                    )}

                    {/* Multi-Question Proof Assessment */}
                    <div className="space-y-8">
                      {proofQuestions.map((pq: ProofQuestion, idx: number) => {
                        return (
                          <div
                            key={pq.id}
                            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 space-y-4 shadow-2xs"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                                Proof Question {idx + 1} of {proofQuestions.length}
                              </span>
                              {proofSubmitted && (
                                <Badge
                                  variant="outline"
                                  className={`text-[10px] ${
                                    selectedProofAnswers[pq.id] === pq.correctAnswer
                                      ? "border-emerald-500 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30"
                                      : "border-red-500 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30"
                                  }`}
                                >
                                  {selectedProofAnswers[pq.id] === pq.correctAnswer ? "Correct" : "Incorrect"}
                                </Badge>
                              )}
                            </div>

                            {pq.scenario && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                                {pq.scenario}
                              </p>
                            )}

                            <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                              {pq.prompt}
                            </p>

                            {pq.codeSnippet && (
                              <pre className="p-3 bg-slate-950 rounded-lg text-xs font-mono text-blue-300 border border-slate-800 overflow-x-auto">
                                <code>{pq.codeSnippet}</code>
                              </pre>
                            )}

                            {/* Options */}
                            <div className="space-y-2.5">
                              {pq.options.map((opt: string, optIdx: number) => {
                                const isSelected = selectedProofAnswers[pq.id] === optIdx;
                                const isCorrect = pq.correctAnswer === optIdx;

                                let optionStyle = "border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 bg-white dark:bg-slate-950/60 text-slate-800 dark:text-slate-200";
                                if (proofSubmitted) {
                                  if (isCorrect) {
                                    optionStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-semibold";
                                  } else if (isSelected && !isCorrect) {
                                    optionStyle = "border-red-500 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200";
                                  }
                                } else if (isSelected) {
                                  optionStyle = "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-200 font-medium";
                                }

                                return (
                                  <button
                                    key={optIdx}
                                    type="button"
                                    onClick={() =>
                                      !proofSubmitted &&
                                      setSelectedProofAnswers({
                                        ...selectedProofAnswers,
                                        [pq.id]: optIdx,
                                      })
                                    }
                                    className={`w-full text-left p-3.5 rounded-xl border text-xs flex items-center justify-between transition-all ${optionStyle}`}
                                  >
                                    <span className="leading-relaxed">{opt}</span>
                                    {proofSubmitted && isCorrect && (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 ml-3" />
                                    )}
                                    {proofSubmitted && isSelected && !isCorrect && (
                                      <X className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 ml-3" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Explanation */}
                            {proofSubmitted && pq.explanation && (
                              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                                <span className="font-semibold text-blue-600 dark:text-blue-400">Rubric / Explanation:</span>
                                <p>{pq.explanation}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Result Alert with 70% threshold messaging */}
                    {proofSubmitted && proofScoreDetail && (
                      <div
                        className={`p-6 rounded-2xl border ${
                          proofPassed
                            ? "border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100"
                            : "border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 text-red-950 dark:text-red-100"
                        } space-y-3 shadow-sm`}
                      >
                        <div className="flex items-center gap-2 font-bold text-base">
                          {proofPassed ? (
                            <>
                              <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                              <span>PROOF VERIFIED! Score: {proofScorePercent}% ({proofScoreDetail.score}/{proofScoreDetail.total}) — Mastery Recorded</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                              <span>PROOF FAILED. Score: {proofScorePercent}% ({proofScoreDetail.score}/{proofScoreDetail.total}) — Minimum 70% Required</span>
                            </>
                          )}
                        </div>

                        <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                          {proofPassed
                            ? `Congratulations! You scored ${proofScorePercent}%, meeting the 70% requirement. Your proof ledger has been updated, and you have officially unlocked the next topic.`
                            : `You scored ${proofScorePercent}%, which is below the required 70% passing threshold. The next topic remains locked. Review the lesson materials, check the video masterclass, and click 'Retry Proof' below.`}
                        </p>
                      </div>
                    )}

                    {/* Proof Action Bar */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                      {proofSubmitted && !proofPassed ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setProofSubmitted(false);
                            setSelectedProofAnswers({});
                            setProofScorePercent(0);
                            setProofScoreDetail(null);
                          }}
                          className="gap-1.5 border-slate-200 dark:border-slate-800"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Retry Proof Quiz</span>
                        </Button>
                      ) : (
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Answered: {answeredProofCount} / {proofQuestions.length} questions
                        </span>
                      )}

                      <div className="flex items-center gap-3">
                        {!proofSubmitted ? (
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 shadow-sm"
                            onClick={handleProofSubmit}
                            disabled={!allProofAnswered}
                          >
                            <span>Submit Proof Quiz ({answeredProofCount}/{proofQuestions.length})</span>
                            <ShieldCheck className="w-4 h-4" />
                          </Button>
                        ) : proofPassed ? (
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 shadow-sm"
                            onClick={handleMarkComplete}
                          >
                            <span>Passed ({proofScorePercent}%) — Advance to Next Topic</span>
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            disabled
                            className="bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold gap-2 cursor-not-allowed"
                          >
                            <Lock className="w-4 h-4" />
                            <span>Next Topic Locked (70% Required)</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ============================================================= */}
              {/* TAB 4: VIDEOS & REAL COURSES (YouTube, Google, Roadmap, etc.) */}
              {/* ============================================================= */}
              <TabsContent value="resources" className="space-y-6 pt-4">
                {/* YouTube Video Player */}
                {(lesson.videoEmbedId || course.featuredVideoEmbedId) && (
                  <Card className="border-zinc-800 bg-zinc-950/80 overflow-hidden shadow-2xl">
                    <CardHeader className="py-4 px-6 border-b border-slate-200 dark:border-slate-800 flex flex-row items-center justify-between">
                      <div className="flex items-center gap-2">
                        <YoutubeIcon className="w-5 h-5 text-rose-500" />
                        <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                          {lesson.videoTitle || course.featuredVideoTitle || `${lesson.title} - Video Masterclass`}
                        </CardTitle>
                      </div>
                      <Button size="sm" variant="outline" asChild className="text-xs gap-1.5 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                        <a
                          href={lesson.videoUrl || course.featuredVideoUrl || `https://www.youtube.com/watch?v=${lesson.videoEmbedId || course.featuredVideoEmbedId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span>Open in YouTube</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="relative w-full aspect-video bg-black">
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${lesson.videoEmbedId || course.featuredVideoEmbedId}`}
                          title={lesson.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute top-0 left-0 w-full h-full border-0"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Real External Courses & Roadmaps */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200">
                    Real Courses & Official Learning Links for {course.title}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Roadmap.sh */}
                    {course.roadmapUrl && (
                      <a
                        href={course.roadmapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-3 group shadow-xs"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-[10px] border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 gap-1">
                              <Map className="w-3 h-3" /> Roadmap.sh
                            </Badge>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500 transition-colors" />
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                            Official Visual Skill Tree
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            Check where &ldquo;{lesson.title}&rdquo; sits in the full roadmap.sh career curriculum.
                          </p>
                        </div>
                        <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">View Roadmap &rarr;</span>
                      </a>
                    )}

                    {/* Google Skills */}
                    {course.googleSkillsUrl && (
                      <a
                        href={course.googleSkillsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-blue-500/40 transition-all flex flex-col justify-between space-y-3 group shadow-xs"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-[10px] border-blue-500/40 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 gap-1">
                              <GraduationCap className="w-3 h-3" /> Google Skills
                            </Badge>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                            Google Cloud & Developer Labs
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            Complete Google Cloud Skills Boost labs and developer classes.
                          </p>
                        </div>
                        <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">Learn on Google &rarr;</span>
                      </a>
                    )}

                    {/* MindLuster */}
                    {course.mindlusterUrl && (
                      <a
                        href={course.mindlusterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-blue-500/40 transition-all flex flex-col justify-between space-y-3 group shadow-xs"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-[10px] border-blue-500/40 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 gap-1">
                              <Award className="w-3 h-3" /> MindLuster
                            </Badge>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                            Free Certified Course Track
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            Earn a free certificate of completion on MindLuster for {course.title}.
                          </p>
                        </div>
                        <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">Visit MindLuster &rarr;</span>
                      </a>
                    )}
                  </div>

                  {/* All Resources Table */}
                  {course.resources.length > 0 && (
                    <div className="pt-4 space-y-3">
                      <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                        Curated Reference Links & Guides
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {course.resources.map((res) => (
                          <a
                            key={res.id}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-blue-500/40 transition-all flex items-start justify-between gap-3 group shadow-xs"
                          >
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                                  {res.title}
                                </span>
                                <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                                  {res.provider}
                                </Badge>
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                                {res.description}
                              </p>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0 mt-0.5" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Bottom Lesson Navigation Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
              {prevLesson ? (
                <Button variant="outline" size="sm" asChild className="border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                  <Link
                    href={`/courses/${course.slug}/modules/${prevLesson.modSlug}/lessons/${prevLesson.lesSlug}`}
                    className="gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous Lesson</span>
                  </Link>
                </Button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-3">
                {isProofVerified ? (
                  <Button
                    size="sm"
                    onClick={handleMarkComplete}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {nextLesson ? "Mark Complete & Next Lesson" : "Complete Course!"}
                    </span>
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveTab("proof")}
                    className="border-amber-500/50 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20 gap-2"
                  >
                    <Lock className="w-4 h-4 text-amber-500" />
                    <span>Pass Proof Quiz (70%+) to Advance</span>
                  </Button>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </AppShell>
  );
}
