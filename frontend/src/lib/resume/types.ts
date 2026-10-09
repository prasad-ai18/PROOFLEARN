export type ResumeTemplate = "minimalist" | "modern" | "classic" | "developer";

export interface PersonalInfo {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  graduationYear: string;
  gpa?: string;
  honors?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  bullets: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  repoUrl?: string;
  bullets: string[];
}

export interface SkillsCategorized {
  languages: string[];
  frameworks: string[];
  toolsAndCloud: string[];
  coreConcepts: string[];
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  verificationUrl?: string;
  isProofLearnCert?: boolean;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: SkillsCategorized;
  certifications: CertificationItem[];
}

export interface AtsScoreBreakdown {
  actionVerbsScore: number;
  detectedActionVerbs: string[];
  weakVerbs: string[];

  quantifiableMetricsScore: number;
  detectedMetrics: string[];

  completenessScore: number;
  missingSections: string[];

  skillsCoverageScore: number;
  topSkillsCount: number;

  formattingScore: number;
  formattingNotes: string[];
}

export interface TargetJobMatch {
  jobTitle: string;
  matchPercentage: number;
  matchedKeywords: string[];
  missingKeywords: string[];
}

export interface AtsAnalysisResult {
  overallScore: number; // 0 - 100
  grade: "A+" | "A" | "B" | "C" | "D";
  status: "Optimized" | "Competitive" | "Needs Improvement" | "Under-optimized";
  breakdown: AtsScoreBreakdown;
  targetJobMatch?: TargetJobMatch;
  actionableTips: string[];
}
