"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { COURSES } from "@/lib/data/courses";
import {
  getCourseCertificate,
  getCourseExamAttempt,
  recordCourseExamAttempt,
  updateCourseCertificate,
  type CourseCertificate,
} from "@/lib/progress/tracker";
import {
  Award,
  ShieldCheck,
  Printer,
  ChevronRight,
  Sparkles,
  Edit3,
  Check,
  CheckCircle2,
  GraduationCap,
  Calendar,
  Hash,
} from "lucide-react";

export default function CourseCertificatePage() {
  const params = useParams();
  const courseSlug = params?.courseSlug as string;

  const course = COURSES.find((c) => c.slug === courseSlug);
  const [cert, setCert] = useState<CourseCertificate | null>(null);
  const [studentName, setStudentName] = useState<string>("Jane Doe");
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!course) return;

    // Check existing certificate
    let existing = getCourseCertificate(course.slug);
    const attempt = getCourseExamAttempt(course.slug);

    // If no existing cert but user visited, auto-create a provisional or earned certificate
    if (!existing) {
      const storedName =
        (typeof window !== "undefined" &&
          localStorage.getItem("prooflearn_student_name")) ||
        "Jane Doe";

      // Register certificate
      recordCourseExamAttempt({
        courseSlug: course.slug,
        score: attempt ? attempt.score : 10,
        total: 10,
        percentage: attempt ? attempt.percentage : 100,
        passed: true,
        timestamp: new Date().toISOString(),
        studentName: storedName,
      });

      existing = getCourseCertificate(course.slug);
    }

    if (existing) {
      setCert(existing);
      setStudentName(existing.studentName);
    }
  }, [course]);

  if (!course) {
    return (
      <AppShell>
        <div className="py-20 text-center space-y-4 max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Course Not Found
          </h1>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/courses">Back to Courses</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  const handleSaveName = () => {
    if (!studentName.trim()) return;
    setIsEditingName(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("prooflearn_student_name", studentName.trim());
    }
    updateCourseCertificate(course.slug, studentName.trim());
    const updated = getCourseCertificate(course.slug);
    if (updated) setCert(updated);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyHash = () => {
    if (cert?.certificateId) {
      navigator.clipboard.writeText(cert.certificateId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const issueDateFormatted = cert?.issuedAt
    ? new Date(cert.issuedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto py-8 space-y-8 print:p-0 print:m-0">
        {/* Navigation & Controls Bar (Hidden during print) */}
        <div className="print:hidden space-y-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Link href="/courses" className="hover:text-blue-600 transition-colors">Courses</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/courses/${course.slug}`} className="hover:text-blue-600 transition-colors">{course.title}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-900 dark:text-white font-medium">Official Certificate</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>PROOFLEARN Certified Candidate Credential</span>
                  <Badge variant="outline" className="text-[10px] border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verifiable
                  </Badge>
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Issued to <strong>{studentName}</strong> for mastering {course.title}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Edit Name Button */}
              {isEditingName ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Candidate Name"
                    className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                  <Button size="sm" onClick={handleSaveName} className="text-xs bg-blue-600 hover:bg-blue-700 text-white h-7 px-2.5">
                    Save
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditingName(true)}
                  className="text-xs gap-1.5 border-slate-300 dark:border-slate-700"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Name</span>
                </Button>
              )}

              {/* Copy Credential Hash */}
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyHash}
                className="text-xs gap-1.5 border-slate-300 dark:border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Hash className="w-3.5 h-3.5" />}
                <span>{copied ? "ID Copied!" : "Copy Credential ID"}</span>
              </Button>

              {/* Print / Save PDF Button */}
              <Button
                size="sm"
                onClick={handlePrint}
                className="text-xs gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </Button>
            </div>
          </div>
        </div>

        {/* ============================================================= */}
        {/* OFFICIAL PROOFLEARN CERTIFICATE COMPONENT */}
        {/* ============================================================= */}
        <div
          ref={certificateRef}
          id="prooflearn-certificate"
          className="relative w-full rounded-3xl border-8 border-double border-amber-600/40 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-8 sm:p-14 shadow-2xl overflow-hidden print:border-8 print:p-8 print:shadow-none print:bg-white print:text-black print:rounded-none"
        >
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-400/60 pointer-events-none" />
          <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-400/60 pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-400/60 pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-400/60 pointer-events-none" />

          {/* Background Watermark Crest */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
            <GraduationCap className="w-96 h-96 text-amber-300" />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center space-y-6">
            {/* Header: Project Logo & Name */}
            <div className="space-y-2 flex flex-col items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-amber-400 flex items-center justify-center text-white shadow-lg p-2.5">
                  <ShieldCheck className="w-full h-full text-white" />
                </div>
                <div className="text-left">
                  <span className="text-2xl sm:text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-amber-300">
                    PROOFLEARN
                  </span>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400/90">
                    Proof of Mastery & Verifiable Learning Platform
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-semibold uppercase tracking-widest mt-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>PROOFLEARN Certified Candidate</span>
              </div>
            </div>

            {/* Certificate Title */}
            <div className="space-y-1 pt-2">
              <h2 className="text-xl sm:text-2xl font-serif tracking-widest uppercase text-slate-300 font-light">
                Certificate of Competence & Proof
              </h2>
              <p className="text-xs uppercase tracking-widest text-amber-400/80 font-mono">
                Official Verifiable Engineering Credential
              </p>
            </div>

            {/* Proclamation */}
            <p className="text-xs sm:text-sm text-slate-400 italic font-serif">
              This document officially certifies that
            </p>

            {/* Student Name */}
            <div className="py-2 border-b-2 border-amber-400/50 w-full max-w-lg">
              <h3 className="text-3xl sm:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-300 tracking-wide capitalize">
                {studentName}
              </h3>
            </div>

            {/* Course Information */}
            <div className="max-w-2xl space-y-2 text-center">
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                has successfully passed the comprehensive curriculum, satisfied all authoritative conceptual proofs, and completed the engineering capstone tasks in:
              </p>
              <div className="text-xl sm:text-3xl font-black text-white tracking-tight text-amber-300">
                {course.title}
              </div>
              <div className="flex items-center justify-center gap-2 pt-1">
                <Badge variant="outline" className="text-xs border-amber-400/40 text-amber-300 bg-amber-950/20">
                  Domain: {course.category}
                </Badge>
                <Badge variant="outline" className="text-xs border-blue-400/40 text-blue-300 bg-blue-950/20">
                  Grade: {cert?.grade || 100}% • Distinction
                </Badge>
              </div>
            </div>

            {/* Seal & Signatures Grid */}
            <div className="w-full pt-8 mt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 items-center gap-6 text-center">
              {/* Date & Credential ID */}
              <div className="space-y-1 text-left sm:text-left text-xs text-slate-400">
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Issued: {issueDateFormatted}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400 truncate">
                  <Hash className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="truncate">ID: {cert?.certificateId || "PLF-2026-VERIFIED"}</span>
                </div>
              </div>

              {/* Official Gold Seal Badge */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full border-4 border-amber-400/70 bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex flex-col items-center justify-center shadow-lg text-slate-950 font-bold p-1">
                  <Award className="w-7 h-7 text-amber-100" />
                  <span className="text-[7px] uppercase tracking-tighter text-amber-100 font-black mt-0.5">
                    PROOFLEARN
                  </span>
                  <span className="text-[6px] uppercase tracking-tighter text-amber-200">
                    CERTIFIED
                  </span>
                </div>
              </div>

              {/* Signature */}
              <div className="space-y-1 text-right sm:text-right">
                <div className="font-serif italic text-base sm:text-lg text-amber-300 font-bold">
                  Prasad Vara
                </div>
                <div className="h-0.5 w-32 bg-amber-400/40 ml-auto" />
                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                  Academic Director, PROOFLEARN
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Return Link */}
        <div className="print:hidden text-center pt-4">
          <Button variant="ghost" asChild className="text-xs text-slate-500 hover:text-blue-600">
            <Link href={`/courses/${course.slug}`}>
              ← Return to {course.title} Course Overview
            </Link>
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
