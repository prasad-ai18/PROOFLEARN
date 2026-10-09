export type SupportedLanguage =
  | "python"
  | "c"
  | "cpp"
  | "java"
  | "javascript"
  | "typescript"
  | "rust"
  | "go"
  | "sql"
  | "bash"
  | "verilog";

export interface LanguageInfo {
  id: SupportedLanguage;
  name: string;
  version: string;
  iconName: string;
  extension: string;
  category: "Systems & ECE" | "Core Programming" | "Web & Cloud" | "Data & Query";
  defaultCode: string;
  description: string;
  samplePrograms: {
    title: string;
    description: string;
    code: string;
  }[];
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  description?: string;
  isSecret?: boolean;
}

export interface CodingChallenge {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  domain: "Computer Science" | "AI & Data Science" | "ECE & Embedded" | "Backend Systems";
  description: string;
  constraints: string[];
  starterCode: Partial<Record<SupportedLanguage, string>>;
  testCases: TestCase[];
  solutionHints: string[];
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTimeMs: number;
  memoryKb?: number;
  compilerOutput?: string;
  isError: boolean;
  status: "success" | "compilation_error" | "runtime_error" | "timeout";
}

export interface TestResultItem {
  testCase: TestCase;
  passed: boolean;
  actualOutput: string;
  errorMessage?: string;
}
