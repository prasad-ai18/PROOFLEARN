"use client";

import React, { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { COURSES, Course } from "@/lib/data/courses";
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
  Sparkles,
  Terminal,
  Code,
  Database,
  Brain,
  BarChart3,
  CheckCircle2,
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
    "Programming",
    "Database",
    "AI & ML",
    "Data Science",
  ];

  const filteredCourses = COURSES.filter((course) => {
    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const iconMap: Record<string, React.ReactNode> = {
    Terminal: <Terminal className="w-5 h-5 text-emerald-400" />,
    Code: <Code className="w-5 h-5 text-amber-400" />,
    Database: <Database className="w-5 h-5 text-blue-400" />,
    Brain: <Brain className="w-5 h-5 text-purple-400" />,
    BarChart3: <BarChart3 className="w-5 h-5 text-indigo-400" />,
  };

  return (
    <AppShell>
      <div className="space-y-8 py-4 sm:py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <BookOpen className="w-3.5 h-3.5" />
            Curriculum Catalog
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Engineering Tracks
          </h1>
          <p className="text-sm text-zinc-400 max-w-2xl">
            Choose a track to build deep technical comprehension. Every course
            is structured with interactive concepts, formative practice, and
            proof challenges.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border/80 pb-6">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-zinc-800 text-white border border-zinc-700 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search topics or concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-zinc-900/60 border-zinc-800 text-xs h-9"
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
              (acc, m) => acc + m.lessons.length,
              0
            );

            return (
              <Card
                key={course.id}
                className="flex flex-col justify-between border-zinc-800 bg-zinc-900/40 hover:border-emerald-500/50 hover:bg-zinc-900/80 transition-all group"
              >
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700">
                      {iconMap[course.iconName] || (
                        <BookOpen className="w-5 h-5 text-emerald-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[11px] border-zinc-700">
                        {course.difficulty}
                      </Badge>
                      {stats.percent === 100 && (
                        <Badge variant="success" className="gap-1 text-[11px]">
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </Badge>
                      )}
                    </div>
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

                <CardContent className="space-y-4 pt-0">
                  {/* Progress bar if started */}
                  {stats.percent > 0 ? (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] text-zinc-400 font-medium">
                        <span>Course Progress</span>
                        <span className="text-emerald-400 font-bold">
                          {stats.percent}% ({stats.completedLessonsCount}/
                          {stats.totalLessons})
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all"
                          style={{ width: `${stats.percent}%` }}
                        />
                      </div>
                    </div>
                  ) : null}

                  <div className="flex items-center gap-4 text-xs text-zinc-400 pt-1">
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
                    className="w-full bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 font-semibold gap-2 transition-all"
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
      </div>
    </AppShell>
  );
}
