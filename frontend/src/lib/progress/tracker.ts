import { COURSES, Course } from "@/lib/data/courses";
import { createClient } from "@/lib/supabase/client";

export interface LessonProgressState {
  completedLessons: string[]; // ["python/python-fundamentals/introduction-to-python", ...]
  completedModules: string[]; // ["python/python-fundamentals", ...]
  practiceAttempts: Record<
    string,
    { score: number; total: number; timestamp: string }
  >;
  proofAttempts: Record<
    string,
    {
      score: number;
      total: number;
      passed: boolean;
      timestamp: string;
      response?: string;
    }
  >;
  lastPosition: {
    courseSlug: string;
    moduleSlug: string;
    lessonSlug: string;
    courseTitle: string;
    lessonTitle: string;
    updatedAt: string;
  } | null;
}

const STORAGE_KEY = "prooflearn_user_progress_v2";

/**
 * Loads the current progress state from local cache.
 */
export function getLocalProgress(): LessonProgressState {
  if (typeof window === "undefined") {
    return {
      completedLessons: [],
      completedModules: [],
      practiceAttempts: {},
      proofAttempts: {},
      lastPosition: null,
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        completedLessons: [],
        completedModules: [],
        practiceAttempts: {},
        proofAttempts: {},
        lastPosition: null,
      };
    }
    return JSON.parse(raw);
  } catch {
    return {
      completedLessons: [],
      completedModules: [],
      practiceAttempts: {},
      proofAttempts: {},
      lastPosition: null,
    };
  }
}

/**
 * Saves updated progress to local storage and syncs to Supabase if authenticated.
 */
export function saveLocalProgress(state: LessonProgressState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error("Failed to save progress locally:", err);
  }
}

/**
 * Helper to build a unique lesson key.
 */
export function makeLessonKey(
  courseSlug: string,
  moduleSlug: string,
  lessonSlug: string
): string {
  return `${courseSlug}/${moduleSlug}/${lessonSlug}`;
}

/**
 * Mark a lesson as completed, calculate module completion, and update last position.
 */
export async function markLessonComplete(
  courseSlug: string,
  moduleSlug: string,
  lessonSlug: string,
  courseTitle: string,
  lessonTitle: string
): Promise<LessonProgressState> {
  const state = getLocalProgress();
  const lessonKey = makeLessonKey(courseSlug, moduleSlug, lessonSlug);

  if (!state.completedLessons.includes(lessonKey)) {
    state.completedLessons.push(lessonKey);
  }

  // Check if all lessons in the module are now complete
  const course = COURSES.find((c) => c.slug === courseSlug);
  if (course) {
    const mod = course.modules.find((m) => m.slug === moduleSlug);
    if (mod) {
      const allLessonsDone = mod.lessons.every((l) =>
        state.completedLessons.includes(
          makeLessonKey(courseSlug, moduleSlug, l.slug)
        )
      );
      const moduleKey = `${courseSlug}/${moduleSlug}`;
      if (allLessonsDone && !state.completedModules.includes(moduleKey)) {
        state.completedModules.push(moduleKey);
      }
    }
  }

  // Update last active position
  state.lastPosition = {
    courseSlug,
    moduleSlug,
    lessonSlug,
    courseTitle,
    lessonTitle,
    updatedAt: new Date().toISOString(),
  };

  saveLocalProgress(state);

  // Sync with Supabase in background if user is authenticated
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).from("user_lesson_progress").upsert(
        {
          user_id: user.id,
          course_slug: courseSlug,
          module_slug: moduleSlug,
          lesson_slug: lessonSlug,
          is_completed: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,course_slug,module_slug,lesson_slug" }
      );
    }
  } catch (syncErr) {
    console.debug("Supabase progress sync notice (offline/local):", syncErr);
  }

  return state;
}

/**
 * Save a formative practice attempt result.
 */
export async function recordPracticeAttempt(
  courseSlug: string,
  moduleSlug: string,
  lessonSlug: string,
  score: number,
  total: number
): Promise<LessonProgressState> {
  const state = getLocalProgress();
  const lessonKey = makeLessonKey(courseSlug, moduleSlug, lessonSlug);

  state.practiceAttempts[lessonKey] = {
    score,
    total,
    timestamp: new Date().toISOString(),
  };

  saveLocalProgress(state);
  return state;
}

/**
 * Save an authoritative Proof Mode challenge result.
 */
export async function recordProofAttempt(
  courseSlug: string,
  moduleSlug: string,
  lessonSlug: string,
  score: number,
  total: number,
  passed: boolean,
  response?: string
): Promise<LessonProgressState> {
  const state = getLocalProgress();
  const lessonKey = makeLessonKey(courseSlug, moduleSlug, lessonSlug);

  state.proofAttempts[lessonKey] = {
    score,
    total,
    passed,
    timestamp: new Date().toISOString(),
    response,
  };

  // Passing proof automatically verifies the lesson completion
  if (passed && !state.completedLessons.includes(lessonKey)) {
    state.completedLessons.push(lessonKey);
  }

  saveLocalProgress(state);
  return state;
}

/**
 * Calculate detailed progress stats for a specific course.
 */
export function calculateCourseProgress(
  course: Course,
  state: LessonProgressState
) {
  let totalLessons = 0;
  let completedLessonsCount = 0;
  let totalProofChallenges = 0;
  let passedProofCount = 0;

  course.modules.forEach((mod) => {
    mod.lessons.forEach((les) => {
      totalLessons += 1;
      totalProofChallenges += 1;
      const key = makeLessonKey(course.slug, mod.slug, les.slug);
      if (state.completedLessons.includes(key)) {
        completedLessonsCount += 1;
      }
      if (state.proofAttempts[key]?.passed) {
        passedProofCount += 1;
      }
    });
  });

  const percent =
    totalLessons > 0
      ? Math.round((completedLessonsCount / totalLessons) * 100)
      : 0;

  const masteryPercent =
    totalProofChallenges > 0
      ? Math.round((passedProofCount / totalProofChallenges) * 100)
      : 0;

  return {
    totalLessons,
    completedLessonsCount,
    percent,
    totalProofChallenges,
    passedProofCount,
    masteryPercent,
    isComplete: completedLessonsCount === totalLessons && totalLessons > 0,
  };
}

/**
 * Calculate aggregate statistics across all 5 courses.
 */
export function getOverallStatistics(state: LessonProgressState) {
  let totalLessonsAllCourses = 0;
  let totalCompletedLessons = 0;
  let totalProofsAllCourses = 0;
  let totalPassedProofs = 0;
  let enrolledCoursesCount = 0;

  COURSES.forEach((course) => {
    const stats = calculateCourseProgress(course, state);
    totalLessonsAllCourses += stats.totalLessons;
    totalCompletedLessons += stats.completedLessonsCount;
    totalProofsAllCourses += stats.totalProofChallenges;
    totalPassedProofs += stats.passedProofCount;

    if (stats.completedLessonsCount > 0) {
      enrolledCoursesCount += 1;
    }
  });

  const overallMastery =
    totalProofsAllCourses > 0
      ? Math.round((totalPassedProofs / totalProofsAllCourses) * 100)
      : 0;

  const overallCompletion =
    totalLessonsAllCourses > 0
      ? Math.round((totalCompletedLessons / totalLessonsAllCourses) * 100)
      : 0;

  return {
    totalCompletedLessons,
    totalLessonsAllCourses,
    totalPassedProofs,
    totalProofsAllCourses,
    enrolledCoursesCount,
    overallMastery,
    overallCompletion,
  };
}
