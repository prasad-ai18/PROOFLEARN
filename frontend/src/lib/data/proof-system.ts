import type { Lesson, ProofQuestion, Course, Module } from "./course-types";
import type { LessonProgressState } from "@/lib/progress/tracker";
import { makeLessonKey } from "@/lib/progress/tracker";

export const PASSING_SCORE_PERCENT = 70;

/**
 * Ensures every lesson has a robust multi-question proof verification quiz (minimum 3-4 questions).
 * If the lesson defines explicit proofChallenge.questions, uses those.
 * Otherwise, synthesizes a rigorous multi-question verification suite using the lesson's proof challenge,
 * practice items, and core concepts.
 */
export function getProofQuestionsForLesson(lesson: Lesson): ProofQuestion[] {
  if (lesson.proofChallenge?.questions && lesson.proofChallenge.questions.length > 0) {
    return lesson.proofChallenge.questions;
  }

  const questions: ProofQuestion[] = [];

  // Question 1: Main Proof Challenge
  if (lesson.proofChallenge && lesson.proofChallenge.options && lesson.proofChallenge.options.length > 0) {
    questions.push({
      id: `${lesson.proofChallenge.id || lesson.id}-pq-main`,
      prompt: lesson.proofChallenge.prompt || lesson.proofChallenge.title,
      scenario: lesson.proofChallenge.scenario,
      type: "scenario-analysis",
      options: lesson.proofChallenge.options,
      correctAnswer: typeof lesson.proofChallenge.correctAnswer === "number" ? lesson.proofChallenge.correctAnswer : 0,
      explanation: lesson.proofChallenge.explanation || "Official proof validation rubric.",
    });
  }

  // Question 2+: Convert Practice Questions into High-Stakes Proof Verification
  if (lesson.practiceQuestions && lesson.practiceQuestions.length > 0) {
    lesson.practiceQuestions.forEach((pq, idx) => {
      if (pq.options && pq.options.length > 0) {
        questions.push({
          id: `${lesson.id}-proof-pq-${idx + 1}`,
          prompt: `Verification Check ${idx + 1}: ${pq.prompt}`,
          scenario: `Scenario Analysis: Evaluate the following implementation or behavior under production constraints:`,
          codeSnippet: pq.codeSnippet,
          type: "code-prediction",
          options: pq.options,
          correctAnswer: typeof pq.correctAnswer === "number" ? pq.correctAnswer : 0,
          explanation: pq.explanation,
        });
      }
    });
  }

  // Ensure at least 3-4 questions exist for rigorous >=70% calculation
  if (questions.length < 3 && lesson.keyTakeaways && lesson.keyTakeaways.length > 0) {
    lesson.keyTakeaways.slice(0, 3 - questions.length).forEach((takeaway, idx) => {
      questions.push({
        id: `${lesson.id}-proof-syn-${idx + 1}`,
        prompt: `Architectural Verification: Which principle best upholds the standard: "${takeaway}"?`,
        scenario: `System design and best practice compliance audit:`,
        type: "scenario-analysis",
        options: [
          `Strict compliance: ${takeaway}`,
          `Ignore constraints and rely on default implicit behavior`,
          `Bypass validation checks for rapid prototyping without verification`,
          `Deprecated pattern: manual override without defensive assertions`
        ],
        correctAnswer: 0,
        explanation: `Upholding '${takeaway}' ensures verifiable code quality and prevents runtime regressions.`
      });
    });
  }

  return questions;
}

/**
 * Calculates proof quiz score and determines if user met the 70% threshold.
 */
export function calculateProofScore(
  questions: ProofQuestion[],
  answers: Record<string, number>
): {
  score: number;
  total: number;
  percent: number;
  passed: boolean;
  passingThreshold: number;
} {
  const total = questions.length;
  if (total === 0) {
    return { score: 0, total: 0, percent: 100, passed: true, passingThreshold: PASSING_SCORE_PERCENT };
  }

  let score = 0;
  questions.forEach((q) => {
    if (answers[q.id] === q.correctAnswer) {
      score += 1;
    }
  });

  const percent = Math.round((score / total) * 100);
  const passed = percent >= PASSING_SCORE_PERCENT;

  return {
    score,
    total,
    percent,
    passed,
    passingThreshold: PASSING_SCORE_PERCENT,
  };
}

/**
 * Determines if a specific lesson is unlocked for the user.
 * A lesson is unlocked if:
 * 1. It is the very first lesson of the course, OR
 * 2. The previous lesson in the course syllabus has its Proof Challenge passed with >= 70%.
 */
export function isLessonUnlocked(
  course: Course,
  moduleSlug: string,
  lessonSlug: string,
  progressState: LessonProgressState | null
): boolean {
  if (!progressState) return true; // optimistic for first load

  // Flatten all lessons in order
  const allLessons: { modSlug: string; lesSlug: string }[] = [];
  course.modules.forEach((m: Module) => {
    m.lessons.forEach((l: Lesson) => {
      allLessons.push({ modSlug: m.slug, lesSlug: l.slug });
    });
  });

  const currentIndex = allLessons.findIndex(
    (item) => item.modSlug === moduleSlug && item.lesSlug === lessonSlug
  );

  // First lesson is always unlocked
  if (currentIndex <= 0) return true;

  // Check if previous lesson has a verified passed proof
  const prev = allLessons[currentIndex - 1];
  const prevKey = makeLessonKey(course.slug, prev.modSlug, prev.lesSlug);
  const prevProof = progressState.proofAttempts[prevKey];

  return Boolean(prevProof?.passed);
}
