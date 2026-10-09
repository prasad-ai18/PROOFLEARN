import type { Course } from "./course-types";

export interface GeneratedExamQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic?: string;
}

export interface GeneratedExamTask {
  title: string;
  scenario: string;
  requirements: string[];
  deliverable: string;
  evaluationCriteria: string[];
}

export interface GeneratedFinalExam {
  courseSlug: string;
  courseTitle: string;
  category: string;
  passingScorePercent: number;
  questions: GeneratedExamQuestion[];
  task: GeneratedExamTask;
}

/**
 * Extracts and synthesizes a comprehensive 10-question final certification exam
 * and a practical engineering capstone task for any course in PROOFLEARN.
 */
export function getCourseFinalExam(course: Course): GeneratedFinalExam {
  const extractedQuestions: GeneratedExamQuestion[] = [];

  // 1. Gather all practice questions from lessons
  for (const mod of course.modules) {
    for (const les of mod.lessons) {
      for (const pq of les.practiceQuestions || []) {
        if (pq.options && pq.options.length >= 2) {
          extractedQuestions.push({
            id: `exam-pq-${pq.id}`,
            prompt: pq.prompt,
            options: pq.options,
            correctAnswer: typeof pq.correctAnswer === "number" ? pq.correctAnswer : 0,
            explanation: pq.explanation,
            topic: les.title,
          });
        }
      }

      // Also gather proof challenge questions if multi-question
      if (les.proofChallenge?.questions) {
        for (const prQ of les.proofChallenge.questions) {
          if (prQ.options && prQ.options.length >= 2) {
            extractedQuestions.push({
              id: `exam-proof-${prQ.id}`,
              prompt: prQ.prompt,
              options: prQ.options,
              correctAnswer: prQ.correctAnswer || 0,
              explanation: prQ.explanation,
              topic: les.title,
            });
          }
        }
      }
    }
  }

  // 2. Synthesize additional high-caliber questions from learning outcomes if fewer than 10
  const outcomes = course.learningOutcomes || [];
  let questionIdx = extractedQuestions.length;

  while (extractedQuestions.length < 10) {
    const outcome = outcomes[questionIdx % outcomes.length] || `Mastery of ${course.title} architecture`;
    const qNum = extractedQuestions.length + 1;

    extractedQuestions.push({
      id: `exam-synth-${course.slug}-${qNum}`,
      prompt: `Regarding ${course.title}: In a production engineering environment, how do you correctly satisfy the principle: "${outcome}"?`,
      options: [
        `Implement rigorous architectural isolation, deterministic memory/concurrency bounds, and continuous automated verification matching industry standards`,
        `Rely on manual ad-hoc testing without version control or benchmarking`,
        `Hardcode configuration variables and disable error checking`,
        `Bypass hardware and architectural constraints to increase deployment frequency`,
      ],
      correctAnswer: 0,
      explanation: `Engineering best practices for ${course.title} require formal specifications, automated testing, and deterministic architecture rather than haphazard shortcuts.`,
      topic: `${course.title} Core Principles`,
    });
    questionIdx++;
  }

  // Take the first 10 balanced questions
  const finalQuestions = extractedQuestions.slice(0, 10);

  // 3. Synthesize a practical capstone task
  const taskTitle = `PROOFLEARN Capstone Task: Production ${course.title} Implementation`;
  const taskScenario = `You are the lead engineer commissioned to design, implement, and verify a mission-critical ${course.title} system for an enterprise environment. Your architecture must handle high throughput, demonstrate zero runtime defects, and satisfy all security and functional constraints.`;
  
  const taskRequirements = [
    `Architect a complete solution addressing: ${outcomes[0] || 'Core system requirements'}`,
    `Incorporate edge-case handling, error recovery, and performance benchmarks adhering to: ${outcomes[1] || 'Reliability standards'}`,
    `Provide verified test assertions and reproducible documentation demonstrating proof of correctness`,
  ];

  const taskDeliverable = `Provide a comprehensive technical solution plan, code snippet / architecture diagram, and verification proof explanation detailing how your implementation eliminates common failure modes in ${course.title}.`;

  const evaluationCriteria = [
    "Correctness: Adherence to domain fundamentals and API/hardware specifications (40%)",
    "Robustness: Error mitigation, edge-case coverage, and fault tolerance (30%)",
    "Proof & Verification: Valid assertions, test cases, and reproducible reasoning (30%)",
  ];

  return {
    courseSlug: course.slug,
    courseTitle: course.title,
    category: course.category,
    passingScorePercent: 70,
    questions: finalQuestions,
    task: {
      title: taskTitle,
      scenario: taskScenario,
      requirements: taskRequirements,
      deliverable: taskDeliverable,
      evaluationCriteria,
    },
  };
}
