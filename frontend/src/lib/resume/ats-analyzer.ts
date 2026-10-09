import { ResumeData, AtsAnalysisResult, AtsScoreBreakdown, TargetJobMatch } from "./types";

const STRONG_ACTION_VERBS = [
  "architected",
  "engineered",
  "developed",
  "built",
  "designed",
  "implemented",
  "spearheaded",
  "optimized",
  "scaled",
  "deployed",
  "automated",
  "formulated",
  "refactored",
  "integrated",
  "streamlined",
  "orchestrated",
  "trained",
  "mentored",
  "established",
  "benchmarked",
  "researched",
  "debugged",
  "reduced",
  "increased",
  "accelerated",
  "synthesized",
  "authored",
  "secured",
  "managed",
  "created",
  "collaborated",
  "executed",
];

const WEAK_VERBS = [
  "worked on",
  "assisted with",
  "helped",
  "was responsible for",
  "participated in",
  "handled",
  "did",
  "tried",
  "attempted",
];

const COMMON_TECH_KEYWORDS = [
  "python",
  "c++",
  "c",
  "java",
  "rust",
  "golang",
  "go",
  "javascript",
  "typescript",
  "sql",
  "postgresql",
  "mongodb",
  "redis",
  "kafka",
  "docker",
  "kubernetes",
  "aws",
  "gcp",
  "azure",
  "git",
  "linux",
  "react",
  "next.js",
  "node.js",
  "fastapi",
  "pytorch",
  "tensorflow",
  "scikit-learn",
  "rest",
  "grpc",
  "ci/cd",
  "microservices",
  "system design",
  "algorithms",
  "data structures",
  "verilog",
  "embedded",
  "rtos",
  "arm",
  "esp32",
  "pcb",
  "fpga",
  "graphql",
];

/**
 * Analyzes resume data and computes comprehensive ATS score (0-100),
 * category breakdowns, detected verbs, metrics, and actionable recommendations.
 */
export function analyzeResumeATS(
  resume: ResumeData,
  targetJobDescription: string = ""
): AtsAnalysisResult {
  const allBullets: string[] = [
    ...resume.experience.flatMap((e) => e.bullets),
    ...resume.projects.flatMap((p) => p.bullets),
    resume.personalInfo.summary,
  ].filter(Boolean);

  const fullResumeText = [
    resume.personalInfo.fullName,
    resume.personalInfo.headline,
    resume.personalInfo.summary,
    ...resume.education.map((e) => `${e.institution} ${e.degree} ${e.fieldOfStudy}`),
    ...resume.experience.map((e) => `${e.role} ${e.company} ${e.bullets.join(" ")}`),
    ...resume.projects.map((p) => `${p.name} ${p.description} ${p.bullets.join(" ")}`),
    ...Object.values(resume.skills).flat(),
    ...resume.certifications.map((c) => `${c.title} ${c.issuer}`),
  ]
    .join(" ")
    .toLowerCase();

  // 1. Action Verbs Score (25 points max)
  const detectedActionVerbs: Set<string> = new Set();
  const weakVerbsFound: Set<string> = new Set();

  allBullets.forEach((bullet) => {
    const lower = bullet.toLowerCase();
    STRONG_ACTION_VERBS.forEach((verb) => {
      if (new RegExp(`\\b${verb}\\b`, "i").test(lower)) {
        detectedActionVerbs.add(verb);
      }
    });
    WEAK_VERBS.forEach((weak) => {
      if (lower.includes(weak)) {
        weakVerbsFound.add(weak);
      }
    });
  });

  const verbCount = detectedActionVerbs.size;
  const actionVerbsScore = Math.min(25, Math.round((verbCount / 6) * 25));

  // 2. Quantifiable Metrics Score (25 points max)
  // Check for numbers, %, $, ms, scale
  const metricRegex = /\b(\d+([.,]\d+)?(%|\$|x|k|m|b|ms|s|gb|tb)?|\$[\d,]+)\b/gi;
  const detectedMetrics: Set<string> = new Set();

  allBullets.forEach((bullet) => {
    const matches = bullet.match(metricRegex);
    if (matches) {
      matches.forEach((m) => {
        if (!["1", "2", "2023", "2024", "2025", "2026"].includes(m)) {
          detectedMetrics.add(m);
        }
      });
    }
  });

  const metricCount = detectedMetrics.size;
  const quantifiableMetricsScore = Math.min(25, Math.round((metricCount / 5) * 25));

  // 3. Completeness Score (25 points max)
  const missingSections: string[] = [];
  let completenessScore = 25;

  if (!resume.personalInfo.fullName.trim()) {
    missingSections.push("Full Name");
    completenessScore -= 5;
  }
  if (!resume.personalInfo.email.trim() || !resume.personalInfo.phone.trim()) {
    missingSections.push("Contact Details (Email / Phone)");
    completenessScore -= 5;
  }
  if (!resume.personalInfo.summary.trim() || resume.personalInfo.summary.split(/\s+/).length < 15) {
    missingSections.push("Comprehensive Professional Summary");
    completenessScore -= 4;
  }
  if (resume.education.length === 0) {
    missingSections.push("Education Section");
    completenessScore -= 4;
  }
  if (resume.experience.length === 0) {
    missingSections.push("Work Experience");
    completenessScore -= 4;
  }
  if (resume.projects.length === 0) {
    missingSections.push("Technical Projects");
    completenessScore -= 3;
  }

  completenessScore = Math.max(0, completenessScore);

  // 4. Skills Coverage Score (15 points max)
  const totalSkillsCount =
    resume.skills.languages.length +
    resume.skills.frameworks.length +
    resume.skills.toolsAndCloud.length +
    resume.skills.coreConcepts.length;

  const skillsCoverageScore = Math.min(15, Math.round((totalSkillsCount / 12) * 15));

  // 5. Formatting & Certifications Score (10 points max)
  let formattingScore = 10;
  const formattingNotes: string[] = [];

  if (resume.certifications.length > 0) {
    formattingNotes.push("✔ Included verified professional certifications");
  } else {
    formattingScore -= 3;
    formattingNotes.push("Add recognized certifications (e.g., PROOFLEARN credentials)");
  }

  if (weakVerbsFound.size > 0) {
    formattingScore -= 2;
    formattingNotes.push(`Replace weak phrases: "${Array.from(weakVerbsFound).join(", ")}"`);
  } else {
    formattingNotes.push("✔ No passive or weak filler phrases detected");
  }

  // Calculate Overall Score
  const rawScore =
    actionVerbsScore +
    quantifiableMetricsScore +
    completenessScore +
    skillsCoverageScore +
    formattingScore;

  const overallScore = Math.min(100, Math.max(20, rawScore));

  // Determine Grade & Status
  let grade: "A+" | "A" | "B" | "C" | "D" = "C";
  let status: AtsAnalysisResult["status"] = "Needs Improvement";

  if (overallScore >= 90) {
    grade = "A+";
    status = "Optimized";
  } else if (overallScore >= 80) {
    grade = "A";
    status = "Competitive";
  } else if (overallScore >= 65) {
    grade = "B";
    status = "Competitive";
  } else if (overallScore >= 50) {
    grade = "C";
    status = "Needs Improvement";
  } else {
    grade = "D";
    status = "Under-optimized";
  }

  // Target Job Description Matching (if provided)
  let targetJobMatch: TargetJobMatch | undefined = undefined;
  if (targetJobDescription.trim()) {
    const jdLower = targetJobDescription.toLowerCase();
    const matched: Set<string> = new Set();
    const missing: Set<string> = new Set();

    COMMON_TECH_KEYWORDS.forEach((kw) => {
      if (new RegExp(`\\b${kw.replace("+", "\\+")}\\b`, "i").test(jdLower)) {
        if (fullResumeText.includes(kw)) {
          matched.add(kw);
        } else {
          missing.add(kw);
        }
      }
    });

    const totalJdKeywords = matched.size + missing.size;
    const matchPercentage =
      totalJdKeywords > 0 ? Math.round((matched.size / totalJdKeywords) * 100) : 85;

    targetJobMatch = {
      jobTitle: "Target Position Match",
      matchPercentage,
      matchedKeywords: Array.from(matched),
      missingKeywords: Array.from(missing),
    };
  }

  // Generate Prioritized Actionable Recommendations
  const actionableTips: string[] = [];

  if (quantifiableMetricsScore < 20) {
    actionableTips.push(
      "Add more quantifiable metrics to your bullet points (e.g., 'reduced latency by 40%', 'scaled to 10k users', 'processed 100k events')."
    );
  }
  if (actionVerbsScore < 20) {
    actionableTips.push(
      "Start every experience bullet with a power action verb (e.g., 'Architected', 'Engineered', 'Optimized', 'Deployed')."
    );
  }
  if (weakVerbsFound.size > 0) {
    actionableTips.push(
      `Replace passive phrases (${Array.from(weakVerbsFound).slice(0, 2).join(", ")}) with decisive engineering leadership verbs.`
    );
  }
  if (resume.certifications.filter((c) => c.isProofLearnCert).length === 0) {
    actionableTips.push(
      "Import your earned PROOFLEARN Certified Candidate badges to demonstrate verifiable skills to recruiters."
    );
  }
  if (missingSections.length > 0) {
    actionableTips.push(`Complete missing resume fields: ${missingSections.join(", ")}.`);
  }
  if (totalSkillsCount < 10) {
    actionableTips.push(
      "Expand your technical skills list to include key tools like Git, Docker, Linux, and specific programming frameworks."
    );
  }
  if (targetJobMatch && targetJobMatch.missingKeywords.length > 0) {
    actionableTips.push(
      `Job Description Gap: Consider adding missing keywords (${targetJobMatch.missingKeywords.slice(0, 4).join(", ")}) if you possess experience with them.`
    );
  }

  if (actionableTips.length === 0) {
    actionableTips.push("Your resume is exceptionally well-tailored for automated ATS screening systems and hiring managers!");
  }

  const breakdown: AtsScoreBreakdown = {
    actionVerbsScore,
    detectedActionVerbs: Array.from(detectedActionVerbs),
    weakVerbs: Array.from(weakVerbsFound),
    quantifiableMetricsScore,
    detectedMetrics: Array.from(detectedMetrics),
    completenessScore,
    missingSections,
    skillsCoverageScore,
    topSkillsCount: totalSkillsCount,
    formattingScore,
    formattingNotes,
  };

  return {
    overallScore,
    grade,
    status,
    breakdown,
    targetJobMatch,
    actionableTips,
  };
}
