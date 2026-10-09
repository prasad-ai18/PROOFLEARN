import { COURSES, type Course, type Module, type Lesson } from "@/lib/data/courses";
import { createClient } from "@/lib/supabase/client";

export interface CourseCertificate {
  certificateId: string;
  courseSlug: string;
  courseTitle: string;
  category: string;
  studentName: string;
  grade: number; // e.g. 90
  issuedAt: string;
  badgeName: string;
  badgeColor: string;
  verificationHash: string;
}

export interface CourseExamAttempt {
  courseSlug: string;
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  timestamp: string;
  studentName: string;
  practicalTaskResponse?: string;
}

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
  courseExamAttempts?: Record<string, CourseExamAttempt>;
  certificates?: Record<string, CourseCertificate>;
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
      courseExamAttempts: {},
      certificates: {},
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
        courseExamAttempts: {},
        certificates: {},
        lastPosition: null,
      };
    }
    const parsed = JSON.parse(raw);
    return {
      completedLessons: parsed.completedLessons || [],
      completedModules: parsed.completedModules || [],
      practiceAttempts: parsed.practiceAttempts || {},
      proofAttempts: parsed.proofAttempts || {},
      courseExamAttempts: parsed.courseExamAttempts || {},
      certificates: parsed.certificates || {},
      lastPosition: parsed.lastPosition || null,
    };
  } catch {
    return {
      completedLessons: [],
      completedModules: [],
      practiceAttempts: {},
      proofAttempts: {},
      courseExamAttempts: {},
      certificates: {},
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
  const course = COURSES.find((c: Course) => c.slug === courseSlug);
  if (course) {
    const mod = course.modules.find((m: Module) => m.slug === moduleSlug);
    if (mod) {
      const allLessonsDone = mod.lessons.every((l: Lesson) =>
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
 * Save a formative practice attempt result and sync to database.
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

  // Background sync to Supabase database
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).from("user_proof_attempts").insert({
        user_id: user.id,
        course_slug: courseSlug,
        module_slug: moduleSlug,
        lesson_slug: lessonSlug,
        score: Math.round((score / (total || 1)) * 100),
        passed: score >= total * 0.7,
        response: `Practice Quiz score: ${score}/${total}`,
        created_at: new Date().toISOString(),
      });
    }
  } catch (syncErr) {
    console.debug("Notice: Practice attempt saved locally:", syncErr);
  }

  return state;
}

/**
 * Save an authoritative Proof Mode challenge result and persist to database.
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

  // Authoritative background sync to database
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // 1. Record proof attempt
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).from("user_proof_attempts").insert({
        user_id: user.id,
        course_slug: courseSlug,
        module_slug: moduleSlug,
        lesson_slug: lessonSlug,
        score: Math.round((score / (total || 1)) * 100),
        passed,
        response: response || `Proof challenge ${passed ? "passed" : "attempted"} with score ${score}/${total}`,
        created_at: new Date().toISOString(),
      });

      // 2. If passed, mark lesson as completed in Supabase
      if (passed) {
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
    }
  } catch (syncErr) {
    console.debug("Notice: Proof attempt saved to local storage:", syncErr);
  }

  return state;
}

/**
 * Synchronizes student data bidirectionally between Supabase cloud database and local state.
 * Called on login or profile load to guarantee multi-device persistence for students.
 */
export async function syncStudentDataToDatabase(): Promise<LessonProgressState> {
  const local = getLocalProgress();
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return local;

    // Fetch student's progress from cloud database
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: dbProgress, error: progressErr } = await (supabase as any)
      .from("user_lesson_progress")
      .select("course_slug, module_slug, lesson_slug, is_completed")
      .eq("user_id", user.id);

    if (!progressErr && dbProgress && Array.isArray(dbProgress)) {
      for (const row of dbProgress) {
        if (row.is_completed) {
          const key = makeLessonKey(row.course_slug, row.module_slug, row.lesson_slug);
          if (!local.completedLessons.includes(key)) {
            local.completedLessons.push(key);
          }
        }
      }
    }

    // Push any offline completed lessons to Supabase
    for (const key of local.completedLessons) {
      const parts = key.split("/");
      if (parts.length === 3) {
        const [cSlug, mSlug, lSlug] = parts;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any).from("user_lesson_progress").upsert(
          {
            user_id: user.id,
            course_slug: cSlug,
            module_slug: mSlug,
            lesson_slug: lSlug,
            is_completed: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,course_slug,module_slug,lesson_slug" }
        );
      }
    }

    saveLocalProgress(local);
  } catch (err) {
    console.debug("Notice: Database synchronization deferred:", err);
  }

  return local;
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

/**
 * Save course final certification exam result and issue certificate if passed.
 */
export function recordCourseExamAttempt(
  attempt: CourseExamAttempt
): LessonProgressState {
  const state = getLocalProgress();
  if (!state.courseExamAttempts) {
    state.courseExamAttempts = {};
  }
  state.courseExamAttempts[attempt.courseSlug] = attempt;

  if (attempt.passed) {
    if (!state.certificates) {
      state.certificates = {};
    }
    const course = COURSES.find((c) => c.slug === attempt.courseSlug);
    const existing = state.certificates[attempt.courseSlug];
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const cleanSlug = attempt.courseSlug.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 6);
    const certId =
      existing?.certificateId || `PLF-2026-${cleanSlug}-${randomSuffix}`;

    state.certificates[attempt.courseSlug] = {
      certificateId: certId,
      courseSlug: attempt.courseSlug,
      courseTitle: course?.title || attempt.courseSlug,
      category: course?.category || "Computer Science",
      studentName: attempt.studentName || "Certified Scholar",
      grade: attempt.percentage,
      issuedAt: new Date().toISOString(),
      badgeName: `Certified ${course?.category || "Specialist"}`,
      badgeColor: course?.badgeColor || "blue",
      verificationHash: `verify.prooflearn.com/certs/${certId}`,
    };
  }

  saveLocalProgress(state);
  return state;
}

/**
 * Update student name on an existing earned certificate.
 */
export function updateCourseCertificate(
  courseSlug: string,
  studentName: string
): LessonProgressState {
  const state = getLocalProgress();
  if (state.certificates && state.certificates[courseSlug]) {
    state.certificates[courseSlug].studentName = studentName;
    saveLocalProgress(state);
  }
  return state;
}

/**
 * Retrieve an earned certificate for a course slug.
 */
export function getCourseCertificate(
  courseSlug: string
): CourseCertificate | null {
  const state = getLocalProgress();
  return state.certificates?.[courseSlug] || null;
}

/**
 * Retrieve a final exam attempt for a course slug.
 */
export function getCourseExamAttempt(
  courseSlug: string
): CourseExamAttempt | null {
  const state = getLocalProgress();
  return state.courseExamAttempts?.[courseSlug] || null;
}

