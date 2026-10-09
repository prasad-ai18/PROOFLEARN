"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SUPPORTED_LANGUAGES } from "@/lib/playground/languages";
import { CODING_CHALLENGES } from "@/lib/playground/challenges";
import { executeCode } from "@/lib/playground/runner";
import {
  SupportedLanguage,
  ExecutionResult,
  CodingChallenge,
  TestResultItem,
} from "@/lib/playground/types";
import {
  Play,
  RotateCcw,
  Terminal,
  Code2,
  FileCode,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Download,
  Sparkles,
  BookOpen,
  Cpu,
  Layers,
  HelpCircle,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export default function CodePlaygroundPage() {
  const [selectedLangId, setSelectedLangId] = useState<SupportedLanguage>("python");
  const [code, setCode] = useState<string>("");
  const [stdin, setStdin] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [activeTab, setActiveTab] = useState<"output" | "stdin" | "challenges">("output");
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedChallenge, setSelectedChallenge] = useState<CodingChallenge | null>(null);
  const [challengeResults, setChallengeResults] = useState<TestResultItem[] | null>(null);

  // Active language info
  const activeLang =
    SUPPORTED_LANGUAGES.find((l) => l.id === selectedLangId) ||
    SUPPORTED_LANGUAGES[0];

  // Set default code when language changes
  useEffect(() => {
    if (!selectedChallenge) {
      setCode(activeLang.defaultCode);
    } else {
      const challengeStarter = selectedChallenge.starterCode[selectedLangId];
      if (challengeStarter) {
        setCode(challengeStarter);
      } else {
        setCode(activeLang.defaultCode);
      }
    }
    setResult(null);
    setChallengeResults(null);
  }, [selectedLangId, selectedChallenge]);

  // Run the code
  const handleRun = async () => {
    setIsRunning(true);
    setResult(null);
    try {
      const res = await executeCode(selectedLangId, code, stdin);
      setResult(res);
      setActiveTab("output");

      // If in challenge mode, evaluate test cases
      if (selectedChallenge) {
        const testRes: TestResultItem[] = selectedChallenge.testCases.map((tc) => {
          const passed =
            !res.isError &&
            (res.stdout.includes(tc.expectedOutput) ||
              res.stdout.trim() === tc.expectedOutput.trim());
          return {
            testCase: tc,
            passed,
            actualOutput: res.stdout,
            errorMessage: res.stderr || undefined,
          };
        });
        setChallengeResults(testRes);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setResult({
        stdout: "",
        stderr: errMsg,
        exitCode: 1,
        executionTimeMs: 0,
        isError: true,
        status: "runtime_error",
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Reset to default
  const handleReset = () => {
    if (selectedChallenge) {
      setCode(selectedChallenge.starterCode[selectedLangId] || activeLang.defaultCode);
    } else {
      setCode(activeLang.defaultCode);
    }
    setResult(null);
    setChallengeResults(null);
  };

  // Copy code to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download code file
  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `prooflearn_${selectedLangId}.${activeLang.extension}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Keyboard shortcut Ctrl+Enter to run
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [code, selectedLangId, stdin]);

  const lineCount = code.split("\n").length;

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-sky-100 dark:bg-amber-500/10 text-sky-700 dark:text-amber-400">
                <Code2 className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Multi-Language Code Playground
              </h1>
              <Badge variant="outline" className="text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800">
                Live Engine
              </Badge>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Run, test, and practice code across all 11 course programming languages: Python, C, C++, Java, Rust, Go, SQL, JS, TS, Bash, and Verilog.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (selectedChallenge) {
                  setSelectedChallenge(null);
                  setChallengeResults(null);
                } else {
                  setSelectedChallenge(CODING_CHALLENGES[0]);
                }
              }}
              className="text-xs font-semibold gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              {selectedChallenge ? "Exit Challenge Mode" : "Practice Challenges"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="text-xs gap-1.5"
              title="Download source file"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="text-xs gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="text-xs gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </Button>
            <Button
              onClick={handleRun}
              disabled={isRunning}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-2 shadow-sm px-4"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {isRunning ? "Running..." : "Run Code (Ctrl+Enter)"}
            </Button>
          </div>
        </div>

        {/* Language Selector Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Language:
          </span>
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = selectedLangId === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => setSelectedLangId(lang.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 dark:bg-amber-500 dark:text-zinc-950 dark:border-amber-500 shadow-xs"
                    : "bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <span>{lang.name}</span>
                <span className="text-[10px] opacity-75 font-mono">({lang.version.split(" ")[0]})</span>
              </button>
            );
          })}
        </div>

        {/* Preset Sample Programs Dropdown */}
        {activeLang.samplePrograms.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-xs bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-sky-600 dark:text-amber-400" />
              Load Course Preset:
            </span>
            {activeLang.samplePrograms.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCode(sample.code);
                  setResult(null);
                  setSelectedChallenge(null);
                }}
                className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-sky-500 dark:hover:border-amber-400 transition-colors"
                title={sample.description}
              >
                {sample.title}
              </button>
            ))}
          </div>
        )}

        {/* Optional Active Challenge Banner */}
        {selectedChallenge && (
          <Card className="border-amber-300 dark:border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20">
            <CardHeader className="py-3 px-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-amber-500 text-zinc-950 font-bold text-xs">
                    {selectedChallenge.difficulty}
                  </Badge>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                    Challenge: {selectedChallenge.title}
                  </CardTitle>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    ({selectedChallenge.domain})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedChallenge.id}
                    onChange={(e) => {
                      const found = CODING_CHALLENGES.find((c) => c.id === e.target.value);
                      if (found) setSelectedChallenge(found);
                    }}
                    className="text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-slate-800 dark:text-slate-200"
                  >
                    {CODING_CHALLENGES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} ({c.difficulty})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="py-2 px-4 text-xs text-slate-700 dark:text-slate-300 space-y-2">
              <p className="whitespace-pre-line">{selectedChallenge.description}</p>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                <strong>Constraints:</strong> {selectedChallenge.constraints.join(" • ")}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Split Grid: Editor (Left) & Output (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[550px]">
          {/* Left: Code Editor (7 cols) */}
          <div className="lg:col-span-7 flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-100 shadow-md overflow-hidden">
            {/* Editor Top Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2 font-mono">
                <FileCode className="w-4 h-4 text-sky-400 dark:text-amber-400" />
                <span className="font-semibold text-slate-200">main.{activeLang.extension}</span>
                <span className="text-slate-500">({activeLang.name})</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                <span>{lineCount} lines</span>
                <span>UTF-8</span>
              </div>
            </div>

            {/* Code Input Area with Line Numbers */}
            <div className="flex flex-1 relative font-mono text-xs sm:text-sm bg-slate-950 overflow-hidden min-h-[460px]">
              {/* Line Numbers */}
              <div className="w-12 py-3 bg-slate-900/50 text-slate-600 text-right pr-3 select-none font-mono text-xs border-r border-slate-800/80 shrink-0">
                {Array.from({ length: Math.max(lineCount, 20) }).map((_, i) => (
                  <div key={i} className="leading-6">
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Textarea Code Buffer */}
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                autoCapitalize="off"
                autoComplete="off"
                className="flex-1 w-full p-3 bg-transparent text-slate-100 font-mono text-xs sm:text-sm resize-none focus:outline-none leading-6 selection:bg-sky-700/50 dark:selection:bg-amber-600/50"
                placeholder={`Write your ${activeLang.name} code here...`}
              />
            </div>
          </div>

          {/* Right: Output & Terminal Panel (5 cols) */}
          <div className="lg:col-span-5 flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-md overflow-hidden">
            {/* Terminal Header Tabs */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-1.5">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab("output")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activeTab === "output"
                      ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                  Terminal Output
                </button>
                <button
                  onClick={() => setActiveTab("stdin")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activeTab === "stdin"
                      ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <span>Custom Input (stdin)</span>
                  {stdin && <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />}
                </button>
                {selectedChallenge && (
                  <button
                    onClick={() => setActiveTab("challenges")}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      activeTab === "challenges"
                        ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                    Test Cases
                  </button>
                )}
              </div>

              {result && (
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
                  <span>{result.executionTimeMs}ms</span>
                  {result.memoryKb && <span>{(result.memoryKb / 1024).toFixed(1)}MB</span>}
                </div>
              )}
            </div>

            {/* Tab Contents */}
            <div className="flex-1 p-4 font-mono text-xs overflow-auto min-h-[440px] bg-slate-950 text-slate-200">
              {activeTab === "output" && (
                <div className="space-y-3">
                  {/* Status Banner */}
                  {result && (
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        {result.isError ? (
                          <Badge variant="destructive" className="text-[10px] py-0">
                            Process Exited with Code {result.exitCode}
                          </Badge>
                        ) : (
                          <Badge className="bg-emerald-600 text-white text-[10px] py-0">
                            Process Exited with Code 0 (Success)
                          </Badge>
                        )}
                      </div>
                      <span className="text-slate-500">
                        Runtime: {result.executionTimeMs}ms
                      </span>
                    </div>
                  )}

                  {/* Compiler / Build Output if any */}
                  {result?.compilerOutput && (
                    <div className="text-slate-400 text-[11px] pb-2 border-b border-slate-800">
                      <div className="text-slate-500 font-semibold mb-1">Compiler Diagnostic:</div>
                      <pre className="whitespace-pre-wrap">{result.compilerOutput}</pre>
                    </div>
                  )}

                  {/* Stdout */}
                  {result?.stdout && (
                    <div>
                      <div className="text-emerald-400 font-semibold text-[11px] mb-1">Standard Output:</div>
                      <pre className="whitespace-pre-wrap text-emerald-300 font-mono leading-relaxed">
                        {result.stdout}
                      </pre>
                    </div>
                  )}

                  {/* Stderr */}
                  {result?.stderr && (
                    <div>
                      <div className="text-rose-400 font-semibold text-[11px] mb-1">Error / Stderr:</div>
                      <pre className="whitespace-pre-wrap text-rose-300 font-mono leading-relaxed bg-rose-950/30 p-2 rounded border border-rose-900/50">
                        {result.stderr}
                      </pre>
                    </div>
                  )}

                  {/* Empty state before running */}
                  {!result && !isRunning && (
                    <div className="h-full flex flex-col items-center justify-center text-center py-20 text-slate-500 space-y-2">
                      <Terminal className="w-8 h-8 text-slate-600" />
                      <p className="text-xs">Click &quot;Run Code&quot; or press Ctrl+Enter to compile and run.</p>
                      <p className="text-[11px] text-slate-600">Standard output and diagnostics will stream here.</p>
                    </div>
                  )}

                  {/* Loading spinner */}
                  {isRunning && (
                    <div className="h-full flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
                      <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs">Compiling & executing in sandbox...</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "stdin" && (
                <div className="space-y-3">
                  <div className="text-slate-400 text-xs">
                    Provide custom input strings for your program (read via <code className="text-sky-300">scanf</code>, <code className="text-sky-300">input()</code>, or <code className="text-sky-300">Scanner</code>):
                  </div>
                  <textarea
                    value={stdin}
                    onChange={(e) => setStdin(e.target.value)}
                    placeholder="Enter input parameters here (e.g., 5 \n 1 2 3 4 5)..."
                    className="w-full h-64 p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-sky-500"
                  />
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setStdin("")}
                      className="text-xs text-slate-400 border-slate-800"
                    >
                      Clear Stdin
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === "challenges" && selectedChallenge && (
                <div className="space-y-3">
                  <div className="text-xs text-slate-400 font-semibold mb-2">
                    Automated Test Suite ({selectedChallenge.testCases.length} cases):
                  </div>

                  {selectedChallenge.testCases.map((tc, idx) => {
                    const res = challengeResults?.[idx];
                    return (
                      <div
                        key={tc.id}
                        className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                          res?.passed
                            ? "bg-emerald-950/30 border-emerald-800 text-emerald-200"
                            : res
                            ? "bg-rose-950/30 border-rose-800 text-rose-200"
                            : "bg-slate-900/60 border-slate-800 text-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Test Case #{idx + 1}</span>
                          {res?.passed ? (
                            <Badge className="bg-emerald-600 text-white text-[10px]">PASSED</Badge>
                          ) : res ? (
                            <Badge variant="destructive" className="text-[10px]">FAILED</Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] text-slate-400">NOT RUN</Badge>
                          )}
                        </div>
                        <div className="font-mono text-[11px] text-slate-400">
                          <div><strong>Input:</strong> {tc.input}</div>
                          <div><strong>Expected:</strong> {tc.expectedOutput}</div>
                          {res && (
                            <div>
                              <strong>Actual:</strong> {res.actualOutput.trim() || "(Empty Output)"}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Courses Connection Cards */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-sky-600 dark:text-amber-400" />
              Tied Directly to ProofLearn Course Catalogs
            </h2>
            <Link
              href="/courses"
              className="text-xs font-semibold text-sky-600 dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              Browse all 207 Courses <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-1">
              <div className="font-semibold text-slate-800 dark:text-slate-200">AI & Data Science</div>
              <p className="text-slate-500 dark:text-slate-400">Practice Python, PyTorch vector ops, NumPy matrix math, and SQL queries.</p>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-1">
              <div className="font-semibold text-slate-800 dark:text-slate-200">Core Computer Science</div>
              <p className="text-slate-500 dark:text-slate-400">Master C/C++ memory management, Java OOP collections, and DSA algorithms.</p>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-1">
              <div className="font-semibold text-slate-800 dark:text-slate-200">ECE & Embedded Systems</div>
              <p className="text-slate-500 dark:text-slate-400">Simulate Verilog HDL logic gates, C bitwise register masks, and RTOS pipelines.</p>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-1">
              <div className="font-semibold text-slate-800 dark:text-slate-200">Cloud & Distributed</div>
              <p className="text-slate-500 dark:text-slate-400">Test Rust memory safety, Go concurrency channels, and Bash automation.</p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
