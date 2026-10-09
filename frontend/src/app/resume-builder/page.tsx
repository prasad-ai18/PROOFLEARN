"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ResumePreview } from "@/components/resume/resume-preview";
import { SAMPLE_RESUME_DATA } from "@/lib/resume/sample-data";
import { analyzeResumeATS } from "@/lib/resume/ats-analyzer";
import { ResumeData, ResumeTemplate, CertificationItem } from "@/lib/resume/types";
import { getLocalProgress } from "@/lib/progress/tracker";
import {
  FileText,
  Sparkles,
  Download,
  Printer,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Copy,
  Layout,
  Sliders,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  User,
  ArrowRight,
  TrendingUp,
  Target,
} from "lucide-react";

export default function ResumeBuilderPage() {
  const [resume, setResume] = useState<ResumeData>(SAMPLE_RESUME_DATA);
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>("minimalist");
  const [targetJd, setTargetJd] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"edit" | "preview" | "ats">("preview");
  const [importedCertCount, setImportedCertCount] = useState<number | null>(null);

  // Compute live ATS score whenever resume or targetJd changes
  const atsResult = useMemo(() => {
    return analyzeResumeATS(resume, targetJd);
  }, [resume, targetJd]);

  // Load from local storage if available on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("prooflearn_resume_draft");
      if (saved) {
        setResume(JSON.parse(saved));
      }
    } catch {
      // Ignore local storage error
    }
  }, []);

  // Save to local storage on change
  const handleSaveDraft = (updated: ResumeData) => {
    setResume(updated);
    try {
      localStorage.setItem("prooflearn_resume_draft", JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  // Import PROOFLEARN earned certificates
  const handleImportProofLearnCerts = () => {
    const progress = getLocalProgress();
    const certsMap = progress.certificates || {};
    const earnedCerts = Object.values(certsMap);

    if (earnedCerts.length === 0) {
      alert("No completed ProofLearn course certificates found yet. Complete a course and pass its final exam to earn official credentials!");
      return;
    }

    const newCertItems: CertificationItem[] = earnedCerts.map((c) => ({
      id: `proof-${c.certificateId}`,
      title: `${c.courseTitle} Certification`,
      issuer: "PROOFLEARN Certified Candidate",
      issueDate: c.issuedAt.split("T")[0],
      credentialId: c.certificateId,
      verificationUrl: `https://${c.verificationHash}`,
      isProofLearnCert: true,
    }));

    // Merge existing non-prooflearn certs with imported ones
    const existingOther = resume.certifications.filter((c) => !c.isProofLearnCert);
    const updated = {
      ...resume,
      certifications: [...newCertItems, ...existingOther],
    };

    handleSaveDraft(updated);
    setImportedCertCount(newCertItems.length);
    setTimeout(() => setImportedCertCount(null), 4000);
  };

  // 1-Click add missing keyword to skills
  const handleAddKeywordToSkills = (keyword: string) => {
    const formatted = keyword.charAt(0).toUpperCase() + keyword.slice(1);
    if (!resume.skills.toolsAndCloud.includes(formatted) && !resume.skills.languages.includes(formatted)) {
      const updated = {
        ...resume,
        skills: {
          ...resume.skills,
          toolsAndCloud: [...resume.skills.toolsAndCloud, formatted],
        },
      };
      handleSaveDraft(updated);
    }
  };

  // Load sample data
  const handleLoadSample = () => {
    if (confirm("Replace current resume draft with comprehensive sample profile?")) {
      handleSaveDraft(SAMPLE_RESUME_DATA);
    }
  };

  // Clear / Reset
  const handleReset = () => {
    if (confirm("Reset resume to empty draft?")) {
      const empty: ResumeData = {
        personalInfo: {
          fullName: "",
          headline: "",
          email: "",
          phone: "",
          location: "",
          summary: "",
        },
        education: [],
        experience: [],
        projects: [],
        skills: { languages: [], frameworks: [], toolsAndCloud: [], coreConcepts: [] },
        certifications: [],
      };
      handleSaveDraft(empty);
    }
  };

  // Print PDF
  const handlePrint = () => {
    window.print();
  };

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-sky-100 dark:bg-amber-500/10 text-sky-700 dark:text-amber-400">
                <FileText className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Resume Builder & ATS Optimizer
              </h1>
              <Badge className="bg-sky-600 text-white text-xs">
                ATS Score: {atsResult.overallScore}% ({atsResult.grade})
              </Badge>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Build FAANG-ready resumes, verify keyword density against target job descriptions, and seamlessly embed official PROOFLEARN credentials.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleImportProofLearnCerts}
              className="text-xs font-semibold gap-1.5 border-sky-300 dark:border-sky-800 text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/30"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              {importedCertCount !== null
                ? `Imported ${importedCertCount} Certs!`
                : "Import ProofLearn Certs"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLoadSample}
              className="text-xs gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Load Sample
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="text-xs gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </Button>
            <Button
              onClick={handlePrint}
              className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-zinc-950 font-bold text-xs gap-2 shadow-sm px-4"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save as PDF
            </Button>
          </div>
        </div>

        {/* View Switcher & Template Picker */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
          {/* Main Navigation Tabs */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "preview"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Layout className="w-3.5 h-3.5 text-sky-500" />
              Live Preview & Split View
            </button>
            <button
              onClick={() => setActiveTab("edit")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "edit"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-500" />
              Edit Content Form
            </button>
            <button
              onClick={() => setActiveTab("ats")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "ats"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              ATS Score & JD Match ({atsResult.overallScore}%)
            </button>
          </div>

          {/* Template Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Template:
            </span>
            <div className="flex items-center gap-1">
              {[
                { id: "minimalist", label: "Minimalist (FAANG)" },
                { id: "modern", label: "Modern Executive" },
                { id: "classic", label: "Classic Ivy" },
                { id: "developer", label: "Developer Mono" },
              ].map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl.id as ResumeTemplate)}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-semibold border transition-all ${
                    selectedTemplate === tpl.id
                      ? "bg-slate-900 text-white border-slate-900 dark:bg-amber-500 dark:text-zinc-950 dark:border-amber-500"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400"
                  }`}
                >
                  {tpl.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ATS Score Floating Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <Card className="border-slate-200 dark:border-slate-800 p-3">
            <div className="text-[11px] font-semibold text-slate-500">Overall ATS Score</div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className={`text-2xl font-black ${
                atsResult.overallScore >= 80 ? "text-emerald-600" : atsResult.overallScore >= 60 ? "text-amber-500" : "text-rose-500"
              }`}>
                {atsResult.overallScore}
              </span>
              <span className="text-xs text-slate-400">/ 100 ({atsResult.grade})</span>
            </div>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800 p-3">
            <div className="text-[11px] font-semibold text-slate-500">Action Verbs</div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {atsResult.breakdown.actionVerbsScore}
              </span>
              <span className="text-xs text-slate-400">/ 25 pts</span>
            </div>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800 p-3">
            <div className="text-[11px] font-semibold text-slate-500">Quantifiable Metrics</div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {atsResult.breakdown.quantifiableMetricsScore}
              </span>
              <span className="text-xs text-slate-400">/ 25 pts</span>
            </div>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800 p-3">
            <div className="text-[11px] font-semibold text-slate-500">Completeness</div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {atsResult.breakdown.completenessScore}
              </span>
              <span className="text-xs text-slate-400">/ 25 pts</span>
            </div>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800 p-3">
            <div className="text-[11px] font-semibold text-slate-500">Skills & Tech Stack</div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {atsResult.breakdown.topSkillsCount}
              </span>
              <span className="text-xs text-slate-400">skills listed</span>
            </div>
          </Card>
        </div>

        {/* Tab 1: Live Preview (Split with mini-editor or full preview) */}
        {activeTab === "preview" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Quick Tweaks (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader className="py-3 px-4 border-b border-slate-100 dark:border-slate-800">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <User className="w-4 h-4 text-sky-500" />
                    Quick Profile Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={resume.personalInfo.fullName}
                      onChange={(e) =>
                        handleSaveDraft({
                          ...resume,
                          personalInfo: { ...resume.personalInfo, fullName: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Headline / Target Role</label>
                    <input
                      type="text"
                      value={resume.personalInfo.headline}
                      onChange={(e) =>
                        handleSaveDraft({
                          ...resume,
                          personalInfo: { ...resume.personalInfo, headline: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Email</label>
                    <input
                      type="email"
                      value={resume.personalInfo.email}
                      onChange={(e) =>
                        handleSaveDraft({
                          ...resume,
                          personalInfo: { ...resume.personalInfo, email: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Phone</label>
                    <input
                      type="text"
                      value={resume.personalInfo.phone}
                      onChange={(e) =>
                        handleSaveDraft({
                          ...resume,
                          personalInfo: { ...resume.personalInfo, phone: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Professional Summary</label>
                    <textarea
                      rows={4}
                      value={resume.personalInfo.summary}
                      onChange={(e) =>
                        handleSaveDraft({
                          ...resume,
                          personalInfo: { ...resume.personalInfo, summary: e.target.value },
                        })
                      }
                      className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveTab("edit")}
                    className="w-full text-xs font-semibold gap-1.5 mt-2"
                  >
                    Open Full Form Editor <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </CardContent>
              </Card>

              {/* Actionable Tips Card */}
              <Card className="border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20">
                <CardHeader className="py-2.5 px-3">
                  <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ATS Optimization Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                  {atsResult.actionableTips.slice(0, 3).map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[11px] leading-snug">
                      <span className="text-emerald-600 font-bold shrink-0">•</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setActiveTab("ats")}
                    className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 p-0 h-auto hover:bg-transparent hover:underline mt-1"
                  >
                    View deep ATS keyword analyzer &rarr;
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: High-Res Render (8 cols) */}
            <div className="lg:col-span-8 overflow-x-auto print:overflow-visible">
              <div className="shadow-2xl rounded-xl print:shadow-none">
                <ResumePreview resume={resume} template={selectedTemplate} />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Full Content Form Editor */}
        {activeTab === "edit" && (
          <div className="space-y-6">
            {/* Experience Section */}
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader className="py-3 px-5 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-500" />
                  Work Experience
                </CardTitle>
                <Button
                  size="sm"
                  onClick={() => {
                    const newItem = {
                      id: `exp-${Date.now()}`,
                      company: "Company Name",
                      role: "Software Engineer",
                      location: "Remote",
                      startDate: "2024",
                      endDate: "Present",
                      isCurrent: true,
                      bullets: [
                        "Architected scalable backend service with sub-50ms latency.",
                        "Optimized database queries, improving throughput by 30%.",
                      ],
                    };
                    handleSaveDraft({ ...resume, experience: [newItem, ...resume.experience] });
                  }}
                  className="text-xs font-semibold gap-1 bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Experience
                </Button>
              </CardHeader>
              <CardContent className="p-5 space-y-6">
                {resume.experience.map((exp, expIdx) => (
                  <div key={exp.id} className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs uppercase tracking-wider text-indigo-600">
                        Experience #{expIdx + 1}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const updated = resume.experience.filter((e) => e.id !== exp.id);
                          handleSaveDraft({ ...resume, experience: updated });
                        }}
                        className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 p-1 h-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div>
                        <label className="font-semibold block mb-1">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const updated = [...resume.experience];
                            updated[expIdx].company = e.target.value;
                            handleSaveDraft({ ...resume, experience: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-semibold block mb-1">Role</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => {
                            const updated = [...resume.experience];
                            updated[expIdx].role = e.target.value;
                            handleSaveDraft({ ...resume, experience: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-semibold block mb-1">Start Date</label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => {
                            const updated = [...resume.experience];
                            updated[expIdx].startDate = e.target.value;
                            handleSaveDraft({ ...resume, experience: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-semibold block mb-1">End Date</label>
                        <input
                          type="text"
                          value={exp.endDate}
                          onChange={(e) => {
                            const updated = [...resume.experience];
                            updated[expIdx].endDate = e.target.value;
                            handleSaveDraft({ ...resume, experience: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <label className="font-semibold block">Bullet Points (Action Verb + Metric)</label>
                      {exp.bullets.map((b, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={b}
                            onChange={(e) => {
                              const updated = [...resume.experience];
                              updated[expIdx].bullets[bIdx] = e.target.value;
                              handleSaveDraft({ ...resume, experience: updated });
                            }}
                            className="flex-1 px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              const updated = [...resume.experience];
                              updated[expIdx].bullets = updated[expIdx].bullets.filter((_, i) => i !== bIdx);
                              handleSaveDraft({ ...resume, experience: updated });
                            }}
                            className="text-slate-400 hover:text-rose-500 p-1 h-auto"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const updated = [...resume.experience];
                          updated[expIdx].bullets.push("Engineered high-throughput component improving performance by 25%.");
                          handleSaveDraft({ ...resume, experience: updated });
                        }}
                        className="text-[11px] gap-1 mt-1"
                      >
                        <Plus className="w-3 h-3" /> Add Bullet Point
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Technical Projects Section */}
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader className="py-3 px-5 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Code className="w-4 h-4 text-emerald-500" />
                  Engineering Projects
                </CardTitle>
                <Button
                  size="sm"
                  onClick={() => {
                    const newProj = {
                      id: `proj-${Date.now()}`,
                      name: "New System Project",
                      description: "High-performance distributed application.",
                      techStack: ["Next.js", "TypeScript", "PostgreSQL"],
                      liveUrl: "https://demo.io",
                      repoUrl: "https://github.com",
                      bullets: [
                        "Engineered microservices backend processing 50k events daily.",
                      ],
                    };
                    handleSaveDraft({ ...resume, projects: [newProj, ...resume.projects] });
                  }}
                  className="text-xs font-semibold gap-1 bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Project
                </Button>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                {resume.projects.map((proj, projIdx) => (
                  <div key={proj.id} className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs uppercase tracking-wider text-emerald-600">
                        Project #{projIdx + 1}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const updated = resume.projects.filter((p) => p.id !== proj.id);
                          handleSaveDraft({ ...resume, projects: updated });
                        }}
                        className="text-rose-500 hover:text-rose-700 p-1 h-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="font-semibold block mb-1">Project Name</label>
                        <input
                          type="text"
                          value={proj.name}
                          onChange={(e) => {
                            const updated = [...resume.projects];
                            updated[projIdx].name = e.target.value;
                            handleSaveDraft({ ...resume, projects: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-semibold block mb-1">Live URL / Repo</label>
                        <input
                          type="text"
                          value={proj.liveUrl || ""}
                          onChange={(e) => {
                            const updated = [...resume.projects];
                            updated[projIdx].liveUrl = e.target.value;
                            handleSaveDraft({ ...resume, projects: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-semibold block mb-1">Tech Stack (comma separated)</label>
                        <input
                          type="text"
                          value={proj.techStack.join(", ")}
                          onChange={(e) => {
                            const updated = [...resume.projects];
                            updated[projIdx].techStack = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                            handleSaveDraft({ ...resume, projects: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Skills & Categorization */}
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader className="py-3 px-5 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Code className="w-4 h-4 text-sky-500" />
                  Technical Skills & Domains
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Programming Languages (comma separated)</label>
                  <input
                    type="text"
                    value={resume.skills.languages.join(", ")}
                    onChange={(e) => {
                      const updated = {
                        ...resume,
                        skills: {
                          ...resume.skills,
                          languages: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        },
                      };
                      handleSaveDraft(updated);
                    }}
                    className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Frameworks & Libraries (comma separated)</label>
                  <input
                    type="text"
                    value={resume.skills.frameworks.join(", ")}
                    onChange={(e) => {
                      const updated = {
                        ...resume,
                        skills: {
                          ...resume.skills,
                          frameworks: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        },
                      };
                      handleSaveDraft(updated);
                    }}
                    className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Tools & Cloud Infrastructure (comma separated)</label>
                  <input
                    type="text"
                    value={resume.skills.toolsAndCloud.join(", ")}
                    onChange={(e) => {
                      const updated = {
                        ...resume,
                        skills: {
                          ...resume.skills,
                          toolsAndCloud: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        },
                      };
                      handleSaveDraft(updated);
                    }}
                    className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3 pt-2">
              <Button onClick={() => setActiveTab("preview")} className="bg-sky-600 text-white font-bold text-xs gap-1.5">
                Save and Preview &rarr;
              </Button>
            </div>
          </div>
        )}

        {/* Tab 3: ATS Score Analyzer & Target Job Description Matcher */}
        {activeTab === "ats" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Target JD Input & Matcher (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader className="py-3 px-4 border-b border-slate-100 dark:border-slate-800">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Target className="w-4 h-4 text-emerald-500" />
                    Target Job Description Matcher
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3 text-xs">
                  <p className="text-slate-600 dark:text-slate-400">
                    Paste the target job description (from LinkedIn, Indeed, Google, etc.) to calculate real-time keyword overlap and reveal missing keywords:
                  </p>
                  <textarea
                    rows={6}
                    value={targetJd}
                    onChange={(e) => setTargetJd(e.target.value)}
                    placeholder="Paste job description requirements here (e.g., 'Looking for a Senior Python & PyTorch Engineer with Docker, Kubernetes, AWS, SQL, and Microservices experience')..."
                    className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs focus:outline-none focus:border-emerald-500"
                  />

                  {atsResult.targetJobMatch && (
                    <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          Target JD Match Rate:
                        </span>
                        <Badge className={`font-bold text-xs ${
                          atsResult.targetJobMatch.matchPercentage >= 75
                            ? "bg-emerald-600 text-white"
                            : "bg-amber-500 text-zinc-950"
                        }`}>
                          {atsResult.targetJobMatch.matchPercentage}% Alignment
                        </Badge>
                      </div>

                      {/* Matched Keywords */}
                      <div>
                        <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 mb-1.5">
                          ✔ Matched Technical Keywords ({atsResult.targetJobMatch.matchedKeywords.length}):
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {atsResult.targetJobMatch.matchedKeywords.map((kw) => (
                            <span
                              key={kw}
                              className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px] font-mono"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Missing Keywords with 1-click add */}
                      {atsResult.targetJobMatch.missingKeywords.length > 0 && (
                        <div>
                          <div className="text-[11px] font-semibold text-rose-700 dark:text-rose-400 mb-1.5">
                            ⚠ Missing Critical Keywords ({atsResult.targetJobMatch.missingKeywords.length}) — Click to add:
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {atsResult.targetJobMatch.missingKeywords.map((kw) => (
                              <button
                                key={kw}
                                onClick={() => handleAddKeywordToSkills(kw)}
                                className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-[11px] font-mono hover:bg-rose-100 transition-colors flex items-center gap-1"
                                title="Click to add to your skills"
                              >
                                <Plus className="w-2.5 h-2.5" />
                                {kw}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Verbs Analysis */}
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader className="py-3 px-4 border-b border-slate-100 dark:border-slate-800">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-sky-500" />
                    Detected Strong Action Verbs ({atsResult.breakdown.detectedActionVerbs.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 text-xs space-y-2">
                  <p className="text-slate-600 dark:text-slate-400">
                    ATS scanners award high ranking to resumes that begin bullet points with decisive engineering actions:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {atsResult.breakdown.detectedActionVerbs.map((verb) => (
                      <span
                        key={verb}
                        className="px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-800 text-sky-800 dark:text-sky-300 text-[11px] font-mono"
                      >
                        {verb}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: ATS Score Breakdown & Full Tips (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader className="py-3 px-4 border-b border-slate-100 dark:border-slate-800">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    ATS Scoring Dimensions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3 text-xs">
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-semibold">
                      <span>Action Verbs & Impact</span>
                      <span>{atsResult.breakdown.actionVerbsScore} / 25 pts</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full"
                        style={{ width: `${(atsResult.breakdown.actionVerbsScore / 25) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between font-semibold">
                      <span>Quantifiable Metrics & Scale</span>
                      <span>{atsResult.breakdown.quantifiableMetricsScore} / 25 pts</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full"
                        style={{ width: `${(atsResult.breakdown.quantifiableMetricsScore / 25) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between font-semibold">
                      <span>Section Completeness</span>
                      <span>{atsResult.breakdown.completenessScore} / 25 pts</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-sky-600 h-full rounded-full"
                        style={{ width: `${(atsResult.breakdown.completenessScore / 25) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between font-semibold">
                      <span>Technical Skills Coverage</span>
                      <span>{atsResult.breakdown.skillsCoverageScore} / 15 pts</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full"
                        style={{ width: `${(atsResult.breakdown.skillsCoverageScore / 15) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between font-semibold">
                      <span>Formatting & Certifications</span>
                      <span>{atsResult.breakdown.formattingScore} / 10 pts</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-purple-600 h-full rounded-full"
                        style={{ width: `${(atsResult.breakdown.formattingScore / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* All Prioritized Actionable Recommendations */}
              <Card className="border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <CardHeader className="py-3 px-4 border-b border-slate-200 dark:border-slate-800">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    How to Push Your ATS Score to 95%+
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-2 text-xs">
                  {atsResult.actionableTips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2 rounded bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80">
                      <span className="font-bold text-emerald-600 text-xs shrink-0">{idx + 1}.</span>
                      <span className="text-slate-700 dark:text-slate-300">{tip}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
