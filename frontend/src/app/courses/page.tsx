"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  LessonProgressState,
} from "@/lib/progress/tracker";
import {
  Search,
  BookOpen,
  Layers,
  Clock,
  ArrowRight,
  Terminal,
  Code,
  Database,
  Brain,
  BarChart3,
  CheckCircle2,
  Bot,
  Container,
  Cpu,
  FileSpreadsheet,
  FolderGit2,
  Globe,
  LayoutTemplate,
  Server,
  Workflow,
  Award,
  Radio,
  Activity,
  ShieldCheck,
  Binary,
  Wifi,
  Network,
} from "lucide-react";

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [progressState, setProgressState] =
    useState<LessonProgressState | null>(null);

  useEffect(() => {
    setProgressState(getLocalProgress());
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(COURSES.map((c) => c.category))),
  ];

  const filteredCourses = COURSES.filter((course) => {
    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === "" ||
      course.title.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query) ||
      course.tagline.toLowerCase().includes(query) ||
      course.difficulty.toLowerCase().includes(query) ||
      course.category.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const iconMap: Record<string, React.ReactNode> = {
    Terminal: <Terminal className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    Code: <Code className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    Database: <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    Brain: <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
    BarChart3: <BarChart3 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
    Layers: <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    Cpu: <Cpu className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    Globe: <Globe className="w-5 h-5 text-sky-600 dark:text-sky-400" />,
    Server: <Server className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    Workflow: <Workflow className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
    FileSpreadsheet: <FileSpreadsheet className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    FolderGit2: <FolderGit2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    Container: <Container className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    LayoutTemplate: <LayoutTemplate className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    Bot: <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    BookOpen: <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    Radio: <Radio className="w-5 h-5 text-sky-600 dark:text-sky-400" />,
    Activity: <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    ShieldCheck: <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    Binary: <Binary className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
    Wifi: <Wifi className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
    Network: <Network className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
  };

  return (
    <AppShell>
      <div className="space-y-8 py-4 sm:py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-300">
            <span className="bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800/60 shadow-xs inline-flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              {COURSES.length}+ Verified Tracks Across All Domains
            </span>
            <span className="bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800/60 shadow-xs inline-flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              PROOFLEARN Certified Candidate Credentials
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Engineering Tracks & Proof Certification
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            Over {COURSES.length}+ complete engineering tracks covering <strong className="text-slate-900 dark:text-white">AIML</strong>, <strong className="text-slate-900 dark:text-white">Computer Science (CSE)</strong>, <strong className="text-slate-900 dark:text-white">Data Science</strong>, <strong className="text-slate-900 dark:text-white">Electronics & Embedded (ECE)</strong>, Cloud, and Systems. Enriched with real external links from Roadmap.sh, Google Skills, MindLuster certifications, YouTube video masterclasses, tasks, tests, and official PROOFLEARN certificates.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search topics or concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs h-9 shadow-xs"
            />
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const stats = progressState
              ? calculateCourseProgress(course, progressState)
              : { percent: 0, completedLessonsCount: 0, totalLessons: 0 };

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
                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      {progressState?.certificates?.[course.slug] ? (
                        <Badge className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[10px] gap-1">
                          <Award className="w-3 h-3" /> Certified Candidate
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/20 gap-1 hidden sm:inline-flex">
                          <Award className="w-3 h-3" /> Certify
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-[11px] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                        {course.difficulty}
                      </Badge>
                      {stats.percent === 100 && (
                        <Badge variant="success" className="gap-1 text-[11px] bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300">
                          <CheckCircle2 className="w-3 h-3 text-blue-600 dark:text-blue-400" /> Completed
                        </Badge>
                      )}
                    </div>
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

                <CardContent className="space-y-4 pt-0">
                  {/* Progress bar if started */}
                  {stats.percent > 0 ? (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        <span>Course Progress</span>
                        <span className="text-blue-600 dark:text-blue-400 font-bold">
                          {stats.percent}% ({stats.completedLessonsCount}/
                          {stats.totalLessons})
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all"
                          style={{ width: `${stats.percent}%` }}
                        />
                      </div>
                    </div>
                  ) : null}

                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
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

                  {/* Resource Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 font-medium">
                      Google Skills
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium">
                      roadmap.sh
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800/60 font-medium">
                      MindLuster
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/40 font-medium">
                      YouTube Video
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <Button
                    size="sm"
                    className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-800 dark:text-slate-200 font-semibold gap-2 transition-all shadow-2xs"
                    asChild
                  >
                    <Link href={`/courses/${course.slug}`}>
                      <span>
                        {stats.percent > 0 ? "Continue Course" : "Start Course"}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {filteredCourses.length === 0 && (
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-12 text-center space-y-4 max-w-md mx-auto shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No tracks found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                No courses match &ldquo;{searchQuery}&rdquo; in category &ldquo;{selectedCategory}&rdquo;.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
