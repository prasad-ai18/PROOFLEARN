"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  COURSES,
  type Module,
  type Lesson,
} from "@/lib/data/courses";
import {
  getLocalProgress,
  calculateCourseProgress,
  makeLessonKey,
  getCourseCertificate,
  getCourseExamAttempt,
  type CourseCertificate,
  type CourseExamAttempt,
  LessonProgressState,
} from "@/lib/progress/tracker";
import {
  CheckCircle2,
  Clock,
  ChevronRight,
  Circle,
  Play,
  ShieldCheck,
  RotateCcw,
  Lock,
  ExternalLink,
  GraduationCap,
  Map,
  Award,
  BookOpen,
} from "lucide-react";
import { isLessonUnlocked } from "@/lib/data/proof-system";

function YoutubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export default function CourseDetailPage() {
  const params = useParams();
  const courseSlug = params.courseSlug as string;

  const [progressState, setProgressState] =
    useState<LessonProgressState | null>(null);
  const [cert, setCert] = useState<CourseCertificate | null>(null);
  const [examAttempt, setExamAttempt] = useState<CourseExamAttempt | null>(null);

  const course = COURSES.find((c) => c.slug === courseSlug);

  useEffect(() => {
    setProgressState(getLocalProgress());
    if (course) {
      setCert(getCourseCertificate(course.slug));
      setExamAttempt(getCourseExamAttempt(course.slug));
    }
  }, [course]);

  if (!course) {
    return (
      <AppShell>
        <div className="py-20 text-center space-y-4 max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Track Not Found</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            The engineering curriculum you are searching for does not exist.
          </p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/courses">Back to All Tracks</Link>
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
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Link href="/courses" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Courses
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 dark:text-white font-medium">{course.title}</span>
        </nav>

        {/* Hero Banner */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 sm:p-10 space-y-6 relative overflow-hidden shadow-xs">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="text-xs border-blue-200 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40">
              {course.category}
            </Badge>
            <Badge variant="outline" className="text-xs border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
              {course.difficulty}
            </Badge>
            <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              ~{course.estimatedHours} Hours
            </span>
          </div>

          <div className="space-y-3 max-w-3xl">
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              {course.title}
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Progress Bar & Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2 min-w-[240px]">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-500 dark:text-slate-400">Completion</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  {stats.percent}% ({stats.completedLessonsCount}/{stats.totalLessons} Lessons)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${stats.percent}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {continueLesson && continueModule && (
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 shadow-sm"
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
                  className="gap-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold"
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

        {/* ============================================================= */}
        {/* EXTERNAL LEARNING HUB: Google Skills, Roadmap.sh, MindLuster & YouTube */}
        {/* ============================================================= */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>Verified External Courses & Official Roadmaps</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
                Real Learning Links & Video Masterclasses
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Curated from Google Skills, MindLuster, Roadmap.sh & YouTube
            </span>
          </div>

          {/* Quick Hub Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Roadmap.sh Card */}
            {course.roadmapUrl && (
              <a
                href={course.roadmapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-amber-400 dark:hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-3 shadow-2xs"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[10px] border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 gap-1">
                      <Map className="w-3 h-3" /> roadmap.sh
                    </Badge>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 transition-colors" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                    Official Skill Tree Roadmap
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Interactive community visual roadmap and learning path for {course.title}.
                  </p>
                </div>
                <div className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                  <span>Explore on roadmap.sh</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </a>
            )}

            {/* Google Skills Card */}
            {course.googleSkillsUrl && (
              <a
                href={course.googleSkillsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-blue-400 dark:hover:border-blue-500/40 transition-all flex flex-col justify-between space-y-3 shadow-2xs"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[10px] border-blue-300 dark:border-blue-500/40 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 gap-1">
                      <GraduationCap className="w-3 h-3" /> Google Skills
                    </Badge>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                    Google Certified Curriculum
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Official Google Cloud Skills Boost labs, certificates & developer classes.
                  </p>
                </div>
                <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                  <span>Learn with Google</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </a>
            )}

            {/* MindLuster Card */}
            {course.mindlusterUrl && (
              <a
                href={course.mindlusterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-cyan-400 dark:hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-3 shadow-2xs"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[10px] border-cyan-300 dark:border-cyan-500/40 text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/20 gap-1">
                      <Award className="w-3 h-3" /> MindLuster
                    </Badge>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-600 transition-colors" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                    Free Certified Course
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Free self-paced training track with verifiable digital certificate on MindLuster.
                  </p>
                </div>
                <div className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                  <span>Certify on MindLuster</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </a>
            )}

            {/* YouTube Masterclass Card */}
            {course.featuredVideoUrl && (
              <a
                href={course.featuredVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-red-400 dark:hover:border-red-500/40 transition-all flex flex-col justify-between space-y-3 shadow-2xs"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[10px] border-red-300 dark:border-red-500/40 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/20 gap-1">
                      <YoutubeIcon className="w-3 h-3" /> YouTube
                    </Badge>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-600 transition-colors" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-300 transition-colors">
                    Complete Video Masterclass
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Full-length video lectures, coding demonstrations & real projects.
                  </p>
                </div>
                <div className="text-[11px] font-semibold text-red-600 dark:text-red-400 flex items-center gap-1 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                  <span>Watch on YouTube</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </a>
            )}
          </div>

          {/* Embedded YouTube Player */}
          {course.featuredVideoEmbedId && (
            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 overflow-hidden shadow-md">
              <CardHeader className="py-4 px-6 border-b border-slate-200 dark:border-slate-800 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <YoutubeIcon className="w-5 h-5 text-red-600" />
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                    Featured YouTube Masterclass Video Tutorial
                  </CardTitle>
                </div>
                <Button size="sm" variant="outline" asChild className="text-xs gap-1.5 border-slate-200 dark:border-slate-700">
                  <a href={course.featuredVideoUrl} target="_blank" rel="noopener noreferrer">
                    <span>Open on YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative w-full aspect-video bg-black">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${course.featuredVideoEmbedId}`}
                    title={course.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full border-0"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Curated Resource Table */}
          {course.resources.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                All Recommended Learning Platforms & Guides ({course.resources.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {course.resources.map((res) => (
                  <a
                    key={res.id}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-start justify-between gap-3 group shadow-2xs"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                          {res.title}
                        </span>
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                          {res.provider}
                        </Badge>
                        {res.badge && (
                          <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-blue-200 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/30">
                            {res.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                        {res.description}
                      </p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white shrink-0 mt-0.5" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================================= */}
        {/* PROOFLEARN CERTIFIED CANDIDATE & FINAL EXAM SECTION */}
        {/* ============================================================= */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white via-slate-50 to-blue-50/40 dark:from-slate-900/90 dark:via-slate-900/60 dark:to-blue-950/20 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] uppercase tracking-wider gap-1">
                  <Award className="w-3.5 h-3.5" /> PROOFLEARN Certified Candidate
                </Badge>
                {cert && (
                  <Badge variant="outline" className="text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 text-[10px] bg-emerald-50 dark:bg-emerald-950/30 gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Credential Earned
                  </Badge>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Course Certification Exam, Tasks & Official Credential
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <Button
                size="sm"
                asChild
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-1.5 shadow-sm"
              >
                <Link href={`/courses/${course.slug}/test`}>
                  <span>{examAttempt?.passed ? "Retake Exam" : "Take Final Exam & Tasks"}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </Button>

              <Button
                size="sm"
                variant="outline"
                asChild
                className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold gap-1.5"
              >
                <Link href={`/courses/${course.slug}/certificate`}>
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>{cert ? "View Certificate" : "Preview Certificate"}</span>
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Left: Badge Display */}
            <div className="p-5 rounded-2xl border border-amber-300/60 dark:border-amber-700/40 bg-gradient-to-b from-amber-50/50 via-white to-amber-100/30 dark:from-amber-950/20 dark:via-slate-900/60 dark:to-slate-900 flex flex-col items-center text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-600 to-yellow-400 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Award className="w-9 h-9" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 block">
                  Official Skill Badge
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {course.title} Certified
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {cert ? `Awarded to ${cert.studentName} with Distinction` : "Unlocked upon passing the 10-question final exam (70%+)"}
                </p>
              </div>
            </div>

            {/* Center & Right: Certificate Status & Overview */}
            <div className="md:col-span-2 space-y-3">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {cert
                    ? `Certificate Issued: ${cert.certificateId}`
                    : "Complete Coursework & Pass the Final Exam to Earn Your Certificate"}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  The <strong className="text-slate-900 dark:text-white">PROOFLEARN Certified Candidate</strong> credential is a tamper-evident, verifiable proof of engineering mastery. It features your student name, official project logo, issue timestamp, verification ID, and grade percentage.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs">
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px] font-semibold uppercase">Final Exam Format</span>
                  <span className="font-bold text-slate-900 dark:text-white">10 Questions + 1 Task</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs">
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px] font-semibold uppercase">Passing Threshold</span>
                  <span className="font-bold text-slate-900 dark:text-white">70% Minimum</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs col-span-2 sm:col-span-1">
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px] font-semibold uppercase">Current Status</span>
                  <span className={`font-bold ${cert ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                    {cert ? `Passed (${cert.grade}%)` : examAttempt ? `Attempted (${examAttempt.percentage}%)` : "Ready to Take"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Syllabus / Module & Lesson Tree */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Curriculum Syllabus & Proof Milestones
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Pass each lesson&apos;s Proof Challenge with at least 70% to verify mastery and unlock subsequent topics.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {course.modules.map((mod: Module, modIdx: number) => {
              const isModuleComplete =
                progressState?.completedModules.includes(
                  `${course.slug}/${mod.slug}`
                );

              return (
                <Card
                  key={mod.id}
                  className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 overflow-hidden shadow-xs"
                >
                  <CardHeader className="bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 py-4 px-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                            Module {modIdx + 1}
                          </span>
                          {isModuleComplete && (
                            <Badge variant="success" className="text-[10px] py-0 px-2 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300">
                              Module Completed
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                          {mod.title}
                        </CardTitle>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {mod.lessons.length} Lessons
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
                    {mod.lessons.map((lesson: Lesson, lesIdx: number) => {
                      const lessonKey = makeLessonKey(
                        course.slug,
                        mod.slug,
                        lesson.slug
                      );
                      const isLessonDone =
                        progressState?.completedLessons.includes(lessonKey);
                      const proofAttempt =
                        progressState?.proofAttempts[lessonKey];
                      const isUnlocked = isLessonUnlocked(
                        course,
                        mod.slug,
                        lesson.slug,
                        progressState
                      );

                      return (
                        <Link
                          key={lesson.id}
                          href={`/courses/${course.slug}/modules/${mod.slug}/lessons/${lesson.slug}`}
                          className={`flex items-center justify-between p-4 sm:px-6 transition-colors group ${
                            isUnlocked
                              ? "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                              : "opacity-75 hover:bg-slate-50/50 dark:hover:bg-slate-900/40"
                          }`}
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            {isLessonDone ? (
                              <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                            ) : !isUnlocked ? (
                              <Lock className="w-5 h-5 text-slate-400 dark:text-slate-600 shrink-0" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                            )}

                            <div className="space-y-0.5 truncate">
                              <p className={`text-sm font-semibold truncate transition-colors ${
                                isUnlocked
                                  ? "text-slate-900 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                  : "text-slate-500 dark:text-slate-400"
                              }`}>
                                {lesIdx + 1}. {lesson.title}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {lesson.summary}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 ml-4">
                            {proofAttempt?.passed ? (
                              <Badge
                                variant="outline"
                                className="hidden sm:inline-flex gap-1 text-[10px] border-blue-200 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/30"
                              >
                                <ShieldCheck className="w-3 h-3 text-blue-600 dark:text-blue-400" /> Proof Verified ({proofAttempt.score}%)
                              </Badge>
                            ) : proofAttempt && !proofAttempt.passed ? (
                              <Badge
                                variant="outline"
                                className="hidden sm:inline-flex gap-1 text-[10px] border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20"
                              >
                                Retry Proof ({proofAttempt.score}%)
                              </Badge>
                            ) : !isUnlocked ? (
                              <Badge
                                variant="outline"
                                className="hidden sm:inline-flex gap-1 text-[10px] border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500"
                              >
                                <Lock className="w-3 h-3" /> Locked
                              </Badge>
                            ) : null}

                            <span className="text-xs text-slate-400 dark:text-slate-500">
                              {lesson.durationMinutes} min
                            </span>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-white transition-colors" />
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
