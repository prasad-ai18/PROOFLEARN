"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getLessonBySlugs } from "@/lib/data/courses";
import {
  getLocalProgress,
  markLessonComplete,
  recordPracticeAttempt,
  recordProofAttempt,
  makeLessonKey,
  LessonProgressState,
} from "@/lib/progress/tracker";
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
} from "lucide-react";

export default function LessonLearningPage() {
  const params = useParams();
  const router = useRouter();

  const courseSlug = params?.courseSlug as string;
  const moduleSlug = params?.moduleSlug as string;
  const lessonSlug = params?.lessonSlug as string;

  const [progressState, setProgressState] = useState<LessonProgressState | null>(null);
  const [activeTab, setActiveTab] = useState<"lesson" | "practice" | "proof">("lesson");

  // Practice state
  const [selectedPracticeAnswers, setSelectedPracticeAnswers] = useState<Record<string, number>>({});
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);

  // Proof state
  const [selectedProofAnswer, setSelectedProofAnswer] = useState<number | null>(null);
  const [proofSubmitted, setProofSubmitted] = useState(false);
  const [proofPassed, setProofPassed] = useState(false);

  const data = getLessonBySlugs(courseSlug, moduleSlug, lessonSlug);

  useEffect(() => {
    const p = getLocalProgress();
    setProgressState(p);

    // Reset local interactive states when switching lessons
    setSelectedPracticeAnswers({});
    setPracticeSubmitted(false);
    setSelectedProofAnswer(null);
    setProofSubmitted(false);
    setProofPassed(false);
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

  // Calculate previous and next lesson links
  const allCourseLessons: { modSlug: string; lesSlug: string }[] = [];
  course.modules.forEach((m) => {
    m.lessons.forEach((l) => {
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

  // Handle Mark Complete
  const handleMarkComplete = async () => {
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
    lesson.practiceQuestions.forEach((q) => {
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

  // Handle Proof Submit
  const handleProofSubmit = async () => {
    if (selectedProofAnswer === null) return;
    const isCorrect = selectedProofAnswer === lesson.proofChallenge.correctAnswer;
    setProofSubmitted(true);
    setProofPassed(isCorrect);

    const updated = await recordProofAttempt(
      course.slug,
      module.slug,
      lesson.slug,
      isCorrect ? 100 : 0,
      100,
      isCorrect,
      `Option ${selectedProofAnswer}`
    );
    setProgressState(updated);
  };

  return (
    <AppShell>
      <div className="py-4 space-y-6 max-w-7xl mx-auto">
        {/* Breadcrumbs & Course Progress */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-zinc-400 truncate">
            <Link href="/courses" className="hover:text-zinc-200 shrink-0">
              Courses
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <Link
              href={`/courses/${course.slug}`}
              className="hover:text-zinc-200 shrink-0"
            >
              {course.title}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <span className="text-zinc-300 font-medium truncate">
              {module.title}
            </span>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            {isCurrentLessonComplete && (
              <Badge variant="success" className="gap-1 text-[11px]">
                <CheckCircle2 className="w-3 h-3" /> Completed
              </Badge>
            )}
            {existingProof?.passed && (
              <Badge
                variant="outline"
                className="gap-1 text-[11px] border-emerald-500/40 text-emerald-400 bg-emerald-950/20"
              >
                <ShieldCheck className="w-3 h-3" /> Proof Verified
              </Badge>
            )}
          </div>
        </div>

        {/* Main Grid: Sidebar + Learning Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Syllabus Sidebar */}
          <aside className="lg:col-span-1 border border-zinc-800 rounded-2xl bg-zinc-900/40 p-4 space-y-4 max-h-[calc(100vh-10rem)] overflow-y-auto hidden lg:block sticky top-20">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Module Syllabus</span>
            </div>

            <div className="space-y-4">
              {course.modules.map((m) => (
                <div key={m.id} className="space-y-1.5">
                  <p className="text-xs font-semibold text-zinc-300 px-2 truncate">
                    {m.title}
                  </p>
                  <div className="space-y-0.5">
                    {m.lessons.map((l) => {
                      const key = makeLessonKey(course.slug, m.slug, l.slug);
                      const isDone = progressState?.completedLessons.includes(key);
                      const isCurrent =
                        m.slug === moduleSlug && l.slug === lessonSlug;

                      return (
                        <Link
                          key={l.id}
                          href={`/courses/${course.slug}/modules/${m.slug}/lessons/${l.slug}`}
                          className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-colors ${
                            isCurrent
                              ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold"
                              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                          )}
                          <span className="truncate">{l.title}</span>
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
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{module.title}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {lesson.title}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400">
                {lesson.summary}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as "lesson" | "practice" | "proof")}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
                <TabsTrigger value="lesson" className="gap-2 text-xs font-semibold">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>1. Lesson</span>
                </TabsTrigger>
                <TabsTrigger value="practice" className="gap-2 text-xs font-semibold">
                  <Brain className="w-3.5 h-3.5" />
                  <span>2. Practice ({lesson.practiceQuestions.length})</span>
                </TabsTrigger>
                <TabsTrigger
                  value="proof"
                  className="gap-2 text-xs font-semibold data-[state=active]:text-emerald-300 data-[state=active]:bg-emerald-950/40"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>3. PROOF MODE</span>
                </TabsTrigger>
              </TabsList>

              {/* ============================================================= */}
              {/* TAB 1: LESSON CONTENT                                         */}
              {/* ============================================================= */}
              <TabsContent value="lesson" className="space-y-6 pt-4">
                <Card className="border-zinc-800 bg-zinc-900/40">
                  <CardContent className="p-6 sm:p-8 space-y-6 prose prose-invert max-w-none text-zinc-300 text-sm leading-relaxed">
                    {/* Render content sections */}
                    <div
                      className="space-y-4"
                      dangerouslySetInnerHTML={{
                        __html: lesson.content
                          .replace(/### (.*?)\n/g, '<h3 class="text-lg font-bold text-white mt-6 mb-2">$1</h3>')
                          .replace(/```python\n([\s\S]*?)```/g, '<pre class="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-emerald-300 text-xs font-mono overflow-x-auto my-3"><code>$1</code></pre>')
                          .replace(/```java\n([\s\S]*?)```/g, '<pre class="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-amber-300 text-xs font-mono overflow-x-auto my-3"><code>$1</code></pre>')
                          .replace(/```sql\n([\s\S]*?)```/g, '<pre class="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-blue-300 text-xs font-mono overflow-x-auto my-3"><code>$1</code></pre>')
                          .replace(/`([^`]+)`/g, '<code class="bg-zinc-800 px-1.5 py-0.5 rounded text-emerald-300 text-xs font-mono">$1</code>')
                          .replace(/\n\n/g, '<p class="my-3 text-zinc-300">')
                      }}
                    />

                    {/* Key Takeaways */}
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 space-y-3 mt-8">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                        <Award className="w-4 h-4" />
                        <span>Core Takeaways</span>
                      </div>
                      <ul className="space-y-2 text-xs text-zinc-300 list-disc list-inside">
                        {lesson.keyTakeaways.map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Mark Complete CTA inside Lesson Tab */}
                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => setActiveTab("practice")}
                  >
                    <span>Proceed to Practice</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </TabsContent>

              {/* ============================================================= */}
              {/* TAB 2: FORMATIVE PRACTICE                                     */}
              {/* ============================================================= */}
              <TabsContent value="practice" className="space-y-6 pt-4">
                <Card className="border-zinc-800 bg-zinc-900/40">
                  <CardHeader className="border-b border-border/50 pb-4">
                    <div className="space-y-1">
                      <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                        <Brain className="w-4 h-4 text-amber-400" />
                        Formative Practice Checks
                      </CardTitle>
                      <p className="text-xs text-zinc-400">
                        Answer these questions to reinforce your conceptual understanding before taking the Proof Challenge.
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 space-y-8">
                    {lesson.practiceQuestions.map((q, qIdx) => (
                      <div
                        key={q.id}
                        className="space-y-4 rounded-2xl border border-zinc-800/80 bg-zinc-950/40 p-5"
                      >
                        <p className="text-sm font-semibold text-white">
                          {qIdx + 1}. {q.prompt}
                        </p>

                        {q.codeSnippet && (
                          <pre className="p-3 bg-zinc-900 rounded-lg text-xs font-mono text-emerald-300 border border-zinc-800 overflow-x-auto">
                            <code>{q.codeSnippet}</code>
                          </pre>
                        )}

                        <div className="space-y-2">
                          {q.options?.map((opt, optIdx) => {
                            const isSelected = selectedPracticeAnswers[q.id] === optIdx;
                            const isCorrect = q.correctAnswer === optIdx;

                            let optionStyle = "border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 text-zinc-300";
                            if (practiceSubmitted) {
                              if (isCorrect) {
                                optionStyle = "border-emerald-500 bg-emerald-950/30 text-emerald-300 font-semibold";
                              } else if (isSelected && !isCorrect) {
                                optionStyle = "border-red-500 bg-red-950/30 text-red-300";
                              }
                            } else if (isSelected) {
                              optionStyle = "border-emerald-500/80 bg-emerald-500/10 text-white";
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
                                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {practiceSubmitted && (
                          <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 space-y-1">
                            <span className="font-semibold text-emerald-400">Explanation:</span>
                            <p>{q.explanation}</p>
                          </div>
                        )}
                      </div>
                    ))}

                    <div className="flex justify-between items-center pt-4 border-t border-border/50">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPracticeSubmitted(false);
                          setSelectedPracticeAnswers({});
                        }}
                      >
                        <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                        Reset
                      </Button>

                      <div className="flex gap-3">
                        {!practiceSubmitted ? (
                          <Button
                            size="sm"
                            className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold"
                            onClick={handlePracticeSubmit}
                            disabled={
                              Object.keys(selectedPracticeAnswers).length <
                              lesson.practiceQuestions.length
                            }
                          >
                            Check Answers
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold gap-1.5"
                            onClick={() => setActiveTab("proof")}
                          >
                            <span>Enter PROOF MODE</span>
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ============================================================= */}
              {/* TAB 3: PROOF MODE                                             */}
              {/* ============================================================= */}
              <TabsContent value="proof" className="space-y-6 pt-4">
                <Card className="border-emerald-500/40 bg-zinc-900/60 shadow-xl shadow-emerald-950/20">
                  <CardHeader className="bg-emerald-950/30 border-b border-emerald-500/20 p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                          <Lock className="w-3 h-3" />
                          PROOF MODE ACTIVE — ZERO AI ASSISTANCE
                        </div>
                        <CardTitle className="text-xl font-bold text-white">
                          {lesson.proofChallenge.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 sm:p-8 space-y-6">
                    {/* Scenario */}
                    <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-2">
                      <span className="font-bold text-zinc-300">Engineering Scenario:</span>
                      <p className="text-zinc-400 leading-relaxed">
                        {lesson.proofChallenge.scenario}
                      </p>
                    </div>

                    {/* Prompt */}
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-white leading-relaxed">
                        {lesson.proofChallenge.prompt}
                      </p>

                      <div className="space-y-2.5">
                        {lesson.proofChallenge.options?.map((opt, optIdx) => {
                          const isSelected = selectedProofAnswer === optIdx;
                          const isCorrect = lesson.proofChallenge.correctAnswer === optIdx;

                          let optionStyle = "border-zinc-800 hover:border-zinc-700 bg-zinc-950/60 text-zinc-300";
                          if (proofSubmitted) {
                            if (isCorrect) {
                              optionStyle = "border-emerald-500 bg-emerald-950/40 text-emerald-300 font-semibold";
                            } else if (isSelected && !isCorrect) {
                              optionStyle = "border-red-500 bg-red-950/40 text-red-300";
                            }
                          } else if (isSelected) {
                            optionStyle = "border-emerald-500 bg-emerald-500/10 text-white font-medium";
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => !proofSubmitted && setSelectedProofAnswer(optIdx)}
                              className={`w-full text-left p-4 rounded-xl border text-xs flex items-center justify-between transition-all ${optionStyle}`}
                            >
                              <span className="leading-relaxed">{opt}</span>
                              {proofSubmitted && isCorrect && (
                                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-3" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Result Alert */}
                    {proofSubmitted && (
                      <div
                        className={`p-5 rounded-2xl border ${
                          proofPassed
                            ? "border-emerald-500/50 bg-emerald-950/30 text-emerald-300"
                            : "border-red-500/50 bg-red-950/30 text-red-300"
                        } space-y-2`}
                      >
                        <div className="flex items-center gap-2 font-bold text-sm">
                          {proofPassed ? (
                            <>
                              <ShieldCheck className="w-5 h-5 text-emerald-400" />
                              <span>Proof Verified! Mastery Recorded.</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-5 h-5 text-red-400" />
                              <span>Proof Verification Failed. Review the rubric below and retry.</span>
                            </>
                          )}
                        </div>
                        <p className="text-xs leading-relaxed text-zinc-300">
                          {lesson.proofChallenge.explanation}
                        </p>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex justify-between items-center pt-4 border-t border-border/50">
                      {proofSubmitted && !proofPassed ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setProofSubmitted(false);
                            setSelectedProofAnswer(null);
                          }}
                        >
                          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                          Retry Proof
                        </Button>
                      ) : <div />}

                      {!proofSubmitted ? (
                        <Button
                          size="sm"
                          className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold gap-2"
                          onClick={handleProofSubmit}
                          disabled={selectedProofAnswer === null}
                        >
                          <span>Submit Verification</span>
                          <ShieldCheck className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold gap-2"
                          onClick={handleMarkComplete}
                        >
                          <span>Complete & Advance</span>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Bottom Lesson Navigation Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/70">
              {prevLesson ? (
                <Button variant="outline" size="sm" asChild>
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
                <Button
                  size="sm"
                  onClick={handleMarkComplete}
                  className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {nextLesson ? "Mark Complete & Next" : "Complete Course!"}
                  </span>
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AppShell>
  );
}
