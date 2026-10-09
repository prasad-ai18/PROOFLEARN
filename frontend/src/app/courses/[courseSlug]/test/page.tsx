"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { COURSES } from "@/lib/data/courses";
import {
  getCourseFinalExam,
  type GeneratedFinalExam,
} from "@/lib/data/course-exam-generator";
import {
  recordCourseExamAttempt,
  getCourseCertificate,
  getCourseExamAttempt,
} from "@/lib/progress/tracker";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Award,
  ChevronRight,
  RotateCcw,
  Clock,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  User,
  GraduationCap,
} from "lucide-react";

export default function CourseExamPage() {
  const params = useParams();
  const courseSlug = params?.courseSlug as string;

  const course = COURSES.find((c) => c.slug === courseSlug);
  const [exam, setExam] = useState<GeneratedFinalExam | null>(null);
  const [studentName, setStudentName] = useState<string>("Jane Doe");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [taskResponse, setTaskResponse] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [scoreResult, setScoreResult] = useState<{
    score: number;
    total: number;
    percent: number;
    passed: boolean;
  } | null>(null);

  useEffect(() => {
    if (!course) return;
    const generated = getCourseFinalExam(course);
    setExam(generated);

    // Check existing certificate / attempt
    const existingAttempt = getCourseExamAttempt(course.slug);
    const existingCert = getCourseCertificate(course.slug);

    if (existingCert?.studentName) {
      setStudentName(existingCert.studentName);
    } else if (existingAttempt?.studentName) {
      setStudentName(existingAttempt.studentName);
    } else {
      // Try profile from local storage or default
      const storedName = localStorage.getItem("prooflearn_student_name");
      if (storedName) setStudentName(storedName);
    }

    if (existingAttempt) {
      setScoreResult({
        score: existingAttempt.score,
        total: existingAttempt.total,
        percent: existingAttempt.percentage,
        passed: existingAttempt.passed,
      });
      if (existingAttempt.practicalTaskResponse) {
        setTaskResponse(existingAttempt.practicalTaskResponse);
      }
    }
  }, [course]);

  if (!course || !exam) {
    return (
      <AppShell>
        <div className="py-20 text-center space-y-4 max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Course Not Found</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            The requested course certification exam does not exist.
          </p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/courses">Back to All Courses</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  const handleOptionSelect = (questionId: string, optionIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const totalQuestions = exam.questions.length;

  const handleSubmitExam = () => {
    let correctCount = 0;
    exam.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const percent = Math.round((correctCount / totalQuestions) * 100);
    const passed = percent >= exam.passingScorePercent;

    const result = {
      score: correctCount,
      total: totalQuestions,
      percent,
      passed,
    };

    setScoreResult(result);
    setIsSubmitted(true);

    // Save student name to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("prooflearn_student_name", studentName);
    }

    // Persist to tracker
    recordCourseExamAttempt({
      courseSlug: course.slug,
      score: correctCount,
      total: totalQuestions,
      percentage: percent,
      passed,
      timestamp: new Date().toISOString(),
      studentName: studentName.trim() || "Certified Scholar",
      practicalTaskResponse: taskResponse,
    });
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScoreResult(null);
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto py-8 space-y-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Link href="/courses" className="hover:text-blue-600 transition-colors">Courses</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/courses/${course.slug}`} className="hover:text-blue-600 transition-colors">{course.title}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 dark:text-white font-medium">Certification Exam & Task</span>
        </nav>

        {/* Exam Header */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40">
                {course.category}
              </Badge>
              <Badge variant="outline" className="text-xs border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40">
                Official Certification Exam
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Passing Grade: {exam.passingScorePercent}%</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {course.title}: Comprehensive Mastery Exam
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Conduct this comprehensive assessment to test your understanding of core concepts, architecture patterns, and practical implementation. Passing unlocks the official <strong className="text-blue-600 dark:text-blue-400">PROOFLEARN Certified Candidate Badge & Certificate</strong>.
          </p>

          {/* Student Name Input */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div>
                <label htmlFor="student-name-input" className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Candidate Name for Official Certificate:
                </label>
                <input
                  id="student-name-input"
                  type="text"
                  value={studentName}
                  disabled={isSubmitted}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-1 px-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden max-w-xs"
                />
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Questions Answered</div>
              <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                {answeredCount} of {totalQuestions}
              </div>
            </div>
          </div>
        </div>

        {/* Result Banner if Submitted */}
        {scoreResult && (
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-md space-y-4 ${
            scoreResult.passed
              ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-100"
              : "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800 text-red-950 dark:text-red-100"
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {scoreResult.passed ? (
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shrink-0">
                    <Award className="w-8 h-8" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-red-500 text-white flex items-center justify-center shadow-md shrink-0">
                    <XCircle className="w-8 h-8" />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-black">
                    {scoreResult.passed ? "Certification Exam Passed!" : "Exam Not Passed (Score Below 70%)"}
                  </h2>
                  <p className="text-sm opacity-90 mt-0.5">
                    Score: <strong>{scoreResult.score} / {scoreResult.total} ({scoreResult.percent}%)</strong>
                    {scoreResult.passed && " • Verified by PROOFLEARN Proof Engine"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {scoreResult.passed ? (
                  <Button
                    size="lg"
                    asChild
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 shadow-md"
                  >
                    <Link href={`/courses/${course.slug}/certificate`}>
                      <GraduationCap className="w-4 h-4" />
                      <span>View & Download Certificate</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button
                    onClick={handleRetake}
                    variant="outline"
                    className="gap-2 border-red-300 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-950/50"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Retake Exam</span>
                  </Button>
                )}
              </div>
            </div>

            {scoreResult.passed && (
              <div className="pt-4 border-t border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Congratulations {studentName}! Your official verifiable certificate and badge have been generated and recorded.</span>
              </div>
            )}
          </div>
        )}

        {/* 10 Certification Questions */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Section 1: Multiple-Choice Conceptual & Proof Questions ({totalQuestions} Questions)</span>
            </h2>
            <span className="text-xs text-slate-500">Each question carries equal weight</span>
          </div>

          {exam.questions.map((q, idx) => {
            const chosen = selectedAnswers[q.id];
            const isCorrect = isSubmitted && chosen === q.correctAnswer;

            return (
              <Card
                key={q.id}
                className={`border transition-all ${
                  isSubmitted
                    ? isCorrect
                      ? "border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/30 dark:bg-emerald-950/10"
                      : "border-red-300 dark:border-red-800/80 bg-red-50/30 dark:bg-red-950/10"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                }`}
              >
                <CardHeader className="py-4 px-6 border-b border-slate-100 dark:border-slate-800/60 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                      Question {idx + 1}
                    </CardTitle>
                  </div>
                  {q.topic && (
                    <Badge variant="outline" className="text-[10px] text-slate-500 border-slate-200 dark:border-slate-800">
                      {q.topic}
                    </Badge>
                  )}
                </CardHeader>

                <CardContent className="p-6 space-y-4">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                    {q.prompt}
                  </p>

                  <div className="space-y-2 pt-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = chosen === optIdx;
                      const isOptionCorrect = isSubmitted && optIdx === q.correctAnswer;

                      return (
                        <button
                          key={optIdx}
                          disabled={isSubmitted}
                          onClick={() => handleOptionSelect(q.id, optIdx)}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 ${
                            isSubmitted
                              ? isOptionCorrect
                                ? "border-emerald-500 bg-emerald-100/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 font-semibold"
                                : isSelected
                                ? "border-red-500 bg-red-100/60 dark:bg-red-950/40 text-red-900 dark:text-red-100 line-through"
                                : "border-slate-200 dark:border-slate-800 opacity-60 text-slate-500"
                              : isSelected
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 font-semibold ring-2 ring-blue-500/20"
                              : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-full border text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-slate-300 dark:border-slate-600 text-slate-500"
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="leading-relaxed">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation when submitted */}
                  {isSubmitted && (
                    <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-slate-900 dark:text-white">
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        )}
                        <span>Explanation:</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        {q.explanation}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Section 2: Practical Capstone Task */}
        <div className="space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Section 2: Engineering Capstone Practical Task</span>
            </h2>
            <span className="text-xs text-slate-500">Real-world scenario problem statement</span>
          </div>

          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader className="py-4 px-6 border-b border-slate-100 dark:border-slate-800/80">
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                {exam.task.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <strong className="text-blue-900 dark:text-blue-300 block mb-1">Scenario Brief:</strong>
                {exam.task.scenario}
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Technical Requirements:
                </h3>
                <ul className="space-y-1.5 list-disc list-inside text-xs text-slate-600 dark:text-slate-300">
                  {exam.task.requirements.map((req, rIdx) => (
                    <li key={rIdx}>{req}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 pt-2">
                <label htmlFor="task-response" className="text-xs font-bold text-slate-900 dark:text-white block">
                  Your Solution & Architectural Deliverable:
                </label>
                <textarea
                  id="task-response"
                  disabled={isSubmitted}
                  value={taskResponse}
                  onChange={(e) => setTaskResponse(e.target.value)}
                  placeholder="Outline your technical solution, code snippet, design principles, and how you verify correctness under load..."
                  rows={6}
                  className="w-full p-4 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-hidden leading-relaxed"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Button variant="outline" asChild className="border-slate-300 dark:border-slate-700">
            <Link href={`/courses/${course.slug}`}>
              Back to Course Modules
            </Link>
          </Button>

          {!isSubmitted ? (
            <Button
              size="lg"
              onClick={handleSubmitExam}
              disabled={answeredCount < totalQuestions}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 px-8 shadow-sm"
            >
              <span>Submit Exam & Evaluate</span>
              <CheckCircle2 className="w-4 h-4" />
            </Button>
          ) : (
            scoreResult?.passed && (
              <Button
                size="lg"
                asChild
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 px-8 shadow-md"
              >
                <Link href={`/courses/${course.slug}/certificate`}>
                  <GraduationCap className="w-5 h-5" />
                  <span>Claim PROOFLEARN Certificate</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            )
          )}
        </div>
      </div>
    </AppShell>
  );
}
