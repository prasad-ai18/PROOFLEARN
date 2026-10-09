// ============================================================
// PROOFLEARN — Master Course Catalog Index
// Imports and exports all courses in category order.
// ============================================================

import type {
  Course,
  CourseCategory,
  Module,
  Lesson,
  PracticeQuestion,
  ProofChallenge,
  Resource,
} from "./course-types";

// Re-export all types
export type {
  Course,
  CourseCategory,
  Module,
  Lesson,
  PracticeQuestion,
  ProofChallenge,
  Resource,
};

// Individual course imports
import { PYTHON_COURSE } from "./courses/python";
import {
  JAVASCRIPT_COURSE,
  SQL_COURSE,
  GENERATIVE_AI_COURSE,
} from "./courses/web-database-ai";
import {
  DATA_SCIENCE_COURSE,
  MACHINE_LEARNING_COURSE,
  REACT_COURSE,
  POWER_BI_COURSE,
  GIT_DEVOPS_COURSE,
  DEEP_LEARNING_COURSE,
  STATISTICS_COURSE,
  NEXTJS_COURSE,
} from "./courses/more-courses";
import {
  JAVA_COURSE,
  TYPESCRIPT_COURSE,
  DOCKER_COURSE,
  PROMPT_ENGINEERING_COURSE,
  EXCEL_COURSE,
  LINUX_COURSE,
  NLP_COURSE,
  POSTGRESQL_COURSE,
  AI_AGENTS_COURSE,
  DATA_ANALYST_ROADMAP_COURSE,
} from "./courses/extended-courses";
import { AI_ML_COURSES } from "./courses/catalog-ai-ml";
import { BACKEND_SYSTEMS_COURSES } from "./courses/catalog-backend-systems";
import { CLOUD_DEVOPS_COURSES } from "./courses/catalog-cloud-devops";
import { DATABASES_DATA_COURSES } from "./courses/catalog-databases-data";
import { DESIGN_ARCHITECTURE_COURSES } from "./courses/catalog-design-architecture";
import { PROGRAMMING_COURSES } from "./courses/catalog-programming";
import { SECURITY_WEB3_COURSES } from "./courses/catalog-security-web3";
import { WEB_MOBILE_COURSES } from "./courses/catalog-web-mobile";
import { ECE_EMBEDDED_COURSES } from "./courses/catalog-ece-embedded";
import { CSE_CORE_COURSES } from "./courses/catalog-cse-core";
import { DATA_SCIENCE_ADVANCED_COURSES } from "./courses/catalog-data-science-advanced";
import { MORE_DOMAINS_COURSES } from "./courses/catalog-more-domains";
import { MORE_DOMAINS_EXTENDED_COURSES } from "./courses/catalog-more-domains-extended";
import { getCourseExternalData } from "./real-courses-catalog";

// ============================================================
// MASTER COURSE CATALOG — All 200+ courses in display order
// ============================================================
const RAW_COURSES = [
  // --- Programming & Computer Science (CSE) ---
  PYTHON_COURSE,
  JAVA_COURSE,
  JAVASCRIPT_COURSE,
  TYPESCRIPT_COURSE,
  ...PROGRAMMING_COURSES,
  ...CSE_CORE_COURSES,

  // --- Electronics & Communication (ECE) & Embedded Systems ---
  ...ECE_EMBEDDED_COURSES,

  // --- AI, Machine Learning & Deep Learning (AIML) ---
  MACHINE_LEARNING_COURSE,
  DEEP_LEARNING_COURSE,
  GENERATIVE_AI_COURSE,
  PROMPT_ENGINEERING_COURSE,
  NLP_COURSE,
  AI_AGENTS_COURSE,
  ...AI_ML_COURSES,

  // --- Data Science & Analytics ---
  DATA_SCIENCE_COURSE,
  EXCEL_COURSE,
  STATISTICS_COURSE,
  POWER_BI_COURSE,
  ...DATA_SCIENCE_ADVANCED_COURSES,
  ...DATABASES_DATA_COURSES,

  // --- Database Systems ---
  SQL_COURSE,
  POSTGRESQL_COURSE,

  // --- Web & Mobile Development ---
  REACT_COURSE,
  NEXTJS_COURSE,
  ...WEB_MOBILE_COURSES,

  // --- Backend & Distributed Systems ---
  ...BACKEND_SYSTEMS_COURSES,

  // --- Cloud Computing & DevOps ---
  GIT_DEVOPS_COURSE,
  DOCKER_COURSE,
  LINUX_COURSE,
  ...CLOUD_DEVOPS_COURSES,

  // --- Cybersecurity & Web3 ---
  ...SECURITY_WEB3_COURSES,

  // --- Software Architecture & Design ---
  ...DESIGN_ARCHITECTURE_COURSES,

  // --- Advanced & Emerging Engineering Domains ---
  ...MORE_DOMAINS_COURSES,
  ...MORE_DOMAINS_EXTENDED_COURSES,

  // --- Career Roadmaps ---
  DATA_ANALYST_ROADMAP_COURSE,
];

/**
 * Enriches courses with verified real courses & links from Google Skills, MindLuster, Roadmap.sh, and YouTube.
 */
export const COURSES: Course[] = RAW_COURSES.map((course) => {
  const ext = getCourseExternalData(course.slug);
  
  // Merge existing resources with external curated resources avoiding duplicates
  const existingUrls = new Set(course.resources.map((r) => r.url));
  const newResources = ext.resources.filter((r) => !existingUrls.has(r.url));
  const allResources = [...newResources, ...course.resources];

  // Enrich modules/lessons with video and learning links if missing
  const enrichedModules = course.modules.map((m) => ({
    ...m,
    lessons: m.lessons.map((l) => ({
      ...l,
      videoUrl: l.videoUrl || ext.featuredVideoUrl,
      videoEmbedId: l.videoEmbedId || ext.featuredVideoEmbedId,
      videoTitle: l.videoTitle || ext.featuredVideoTitle,
      learningLinks: l.learningLinks || [
        {
          title: `Roadmap.sh ${course.title} Path`,
          provider: "Roadmap.sh",
          url: ext.roadmapUrl,
          badge: "Roadmap.sh",
          description: `Interactive roadmap for ${l.title}`,
        },
        {
          title: `Google Skills Lab & Courses`,
          provider: "Google Skills",
          url: ext.googleSkillsUrl,
          badge: "Google Skills",
          description: `Google certified learning materials for ${course.title}`,
        },
        {
          title: `MindLuster Free Certification`,
          provider: "MindLuster",
          url: ext.mindlusterUrl,
          badge: "MindLuster",
          description: `Verifiable free course and certificate on MindLuster`,
        },
      ],
    })),
  }));

  return {
    ...course,
    roadmapUrl: course.roadmapUrl || ext.roadmapUrl,
    googleSkillsUrl: course.googleSkillsUrl || ext.googleSkillsUrl,
    mindlusterUrl: course.mindlusterUrl || ext.mindlusterUrl,
    featuredVideoUrl: course.featuredVideoUrl || ext.featuredVideoUrl,
    featuredVideoEmbedId: course.featuredVideoEmbedId || ext.featuredVideoEmbedId,
    featuredVideoTitle: course.featuredVideoTitle || ext.featuredVideoTitle,
    resources: allResources,
    modules: enrichedModules,
  };
});

// ============================================================
// HELPER UTILITIES
// ============================================================

/**
 * Find a course by its URL slug.
 */
export function getCourseBySlug(courseSlug: string): Course | null {
  return (COURSES.find((c: Course) => c.slug === courseSlug) as Course) || null;
}

/**
 * Find a module within a course by slug.
 */
export function getModuleBySlug(courseSlug: string, moduleSlug: string) {
  const course = getCourseBySlug(courseSlug);
  if (!course) return null;
  const mod = course.modules.find((m: Module) => m.slug === moduleSlug) || null;
  return { course, module: mod };
}

/**
 * Find a specific lesson within a course and module by slug.
 */
export function getLessonBySlugs(
  courseSlug: string,
  moduleSlug: string,
  lessonSlug: string
) {
  const course = getCourseBySlug(courseSlug);
  if (!course) return null;

  const mod = course.modules.find((m: Module) => m.slug === moduleSlug);
  if (!mod) return null;

  const lesson = mod.lessons.find((l: Lesson) => l.slug === lessonSlug);
  if (!lesson) return null;

  return { course, module: mod, lesson };
}

/**
 * Get all courses by category.
 */
export function getCoursesByCategory(category: string): Course[] {
  return COURSES.filter((c: Course) => c.category === category);
}

/**
 * Get course categories with counts.
 */
export function getCategoryCounts() {
  const counts: Record<string, number> = {};
  COURSES.forEach((course: Course) => {
    counts[course.category] = (counts[course.category] || 0) + 1;
  });
  return counts;
}
