"use client";

import React, { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import {
  ShieldCheck,
  Brain,
  Sparkles,
  Lock,
  Award,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Info,
  Terminal,
} from "lucide-react";

export default function DesignSystemShowcase() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <AppShell>
      <div className="space-y-12">
        {/* Showcase Hero / Branding Section */}
        <section className="text-center space-y-4 max-w-3xl mx-auto py-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            Task 03 — Design System & UI Foundation
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
            PROOF<span className="text-emerald-400">LEARN</span>
          </h1>

          <p className="text-lg sm:text-xl font-medium text-zinc-300">
            &ldquo;Don&apos;t just get the answer. Prove you learned it.&rdquo;
          </p>

          <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            AI should help students learn, not replace their ability to think.
            This interactive showcase demonstrates the unified design tokens, typography,
            and component primitives.
          </p>
        </section>

        <Separator />

        {/* Tabbed Component Showcase */}
        <Tabs defaultValue="actions" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 h-auto p-1.5 gap-1 bg-zinc-900 border border-zinc-800">
              <TabsTrigger value="actions">Actions & Buttons</TabsTrigger>
              <TabsTrigger value="cards">Cards & Containers</TabsTrigger>
              <TabsTrigger value="forms">Form Controls</TabsTrigger>
              <TabsTrigger value="feedback">Alerts & Badges</TabsTrigger>
              <TabsTrigger value="states">UI States</TabsTrigger>
              <TabsTrigger value="dialogs">Modals & Dialogs</TabsTrigger>
            </TabsList>
          </div>

          {/* 1. Actions & Buttons Tab */}
          <TabsContent value="actions" className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight">Button Variants & Sizes</h2>
              <p className="text-sm text-muted-foreground">
                Accessible, keyboard-navigable buttons with focus rings and semantic state feedback.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Primary & Intent Actions</CardTitle>
                  <CardDescription>Core call-to-actions for learning and proof modes.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  <Button variant="default">
                    <Brain className="w-4 h-4" /> Start Learning
                  </Button>
                  <Button variant="default">
                    <ShieldCheck className="w-4 h-4" /> Prove I Learned It
                  </Button>
                  <Button variant="destructive">
                    <Lock className="w-4 h-4" /> Lock AI Assistance
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Secondary & Outlined</CardTitle>
                  <CardDescription>Supporting actions and navigation buttons.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  <Button variant="secondary">
                    <BookOpen className="w-4 h-4" /> View Curriculum
                  </Button>
                  <Button variant="outline">
                    <Terminal className="w-4 h-4" /> Practice Challenge
                  </Button>
                  <Button variant="ghost">Skip for Now</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Size Scale & States</CardTitle>
                  <CardDescription>Responsive scale with disabled visual states.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small Action</Button>
                  <Button size="default">Default Size</Button>
                  <Button size="lg">Large Hero Action</Button>
                  <Button disabled>Disabled Action</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 2. Cards & Containers Tab */}
          <TabsContent value="cards" className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight">Curriculum & Concept Cards</h2>
              <p className="text-sm text-muted-foreground">
                Structured surfaces for subjects, concepts, and Learning Evidence index displays.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Concept Learning Card */}
              <Card className="flex flex-col justify-between border-zinc-800 hover:border-emerald-500/40 transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline">Python</Badge>
                    <Badge variant="success">Available</Badge>
                  </div>
                  <CardTitle>Recursion & Base Cases</CardTitle>
                  <CardDescription>
                    Understand call stack frames and formulate deterministic termination logic.
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-4 border-t border-border/50 flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">5 Practice Problems</span>
                  <Button size="sm">Start Concept</Button>
                </CardFooter>
              </Card>

              {/* Proof Mode Card */}
              <Card className="flex flex-col justify-between border-emerald-500/30 bg-emerald-950/10">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="success">PROOF MODE</Badge>
                    <Lock className="w-4 h-4 text-emerald-400" />
                  </div>
                  <CardTitle>Transfer Challenge</CardTitle>
                  <CardDescription>
                    Apply recursion to hierarchical file-system indexing without AI assistance.
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-4 border-t border-border/50 flex justify-between items-center">
                  <span className="text-xs text-emerald-400 font-medium">Server Lockdown Active</span>
                  <Button variant="default" size="sm">Enter Challenge</Button>
                </CardFooter>
              </Card>

              {/* Learning Evidence Card */}
              <Card className="flex flex-col justify-between border-zinc-800">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary">Evidence #8492</Badge>
                    <Award className="w-4 h-4 text-amber-400" />
                  </div>
                  <CardTitle>Learning Evidence Index</CardTitle>
                  <CardDescription>
                    Composite verified mastery evaluation score across 5 core dimensions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white">88</span>
                    <span className="text-sm text-zinc-400">/ 100 LEI</span>
                  </div>
                  <p className="text-xs text-muted-foreground">High independent mastery verified.</p>
                </CardContent>
                <CardFooter className="pt-4 border-t border-border/50 flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Issued Today</span>
                  <Button variant="outline" size="sm">View Certificate</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* 3. Form Controls Tab */}
          <TabsContent value="forms" className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight">Form & Input Primitives</h2>
              <p className="text-sm text-muted-foreground">
                Accessible input fields, labels, and code/explanation submission textareas.
              </p>
            </div>

            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-base">Independent Solution Submission</CardTitle>
                <CardDescription>Form control primitives demonstrating focus and placeholder states.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="student-handle">Student Display Name</Label>
                  <Input id="student-handle" placeholder="e.g. alex_learner" defaultValue="alex_proof" />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="explanation">Concept Explanation (Own Words)</Label>
                  <Textarea
                    id="explanation"
                    rows={3}
                    placeholder="Explain why the recursive base case must be evaluated before the recursive step..."
                  />
                  <p className="text-xs text-muted-foreground">Minimum 20 words for explanation validation.</p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="code-solution">Python Code Implementation</Label>
                  <Textarea
                    id="code-solution"
                    rows={4}
                    className="font-mono text-xs bg-zinc-950 text-zinc-200"
                    placeholder="def compute_factorial(n: int) -> int:&#10;    # Write your independent solution here&#10;    pass"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-3 border-t border-border/50 pt-4">
                <Button variant="outline">Reset Form</Button>
                <Button variant="default">Submit for Evaluation</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* 4. Alerts & Badges Tab */}
          <TabsContent value="feedback" className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight">Feedback, Alerts & Badges</h2>
              <p className="text-sm text-muted-foreground">
                Semantic notifications for system state, security alerts, and verification outcomes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Alert variant="success">
                <CheckCircle2 />
                <AlertTitle>Learning Evidence Verified</AlertTitle>
                <AlertDescription>
                  Your independent challenge passed all 12 test cases. Proof session concluded.
                </AlertDescription>
              </Alert>

              <Alert variant="destructive">
                <AlertTriangle />
                <AlertTitle>AI Assistance Blocked</AlertTitle>
                <AlertDescription>
                  Server-side security policy: AI tutoring is strictly disabled during active Proof Mode.
                </AlertDescription>
              </Alert>

              <Alert variant="info">
                <Info />
                <AlertTitle>Practice Mode Active</AlertTitle>
                <AlertDescription>
                  You are currently in guided practice. You may request AI hints anytime before entering Proof Mode.
                </AlertDescription>
              </Alert>

              <Alert variant="warning">
                <Lock />
                <AlertTitle>Proof Mode Warning</AlertTitle>
                <AlertDescription>
                  Entering Proof Mode will immediately sever all AI interaction for this session.
                </AlertDescription>
              </Alert>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Badge variant="default">Default Primary</Badge>
              <Badge variant="secondary">Secondary Subject</Badge>
              <Badge variant="outline">Curriculum Topic</Badge>
              <Badge variant="success">Mastery Verified</Badge>
              <Badge variant="warning">Attempt Pending</Badge>
              <Badge variant="destructive">Server Locked</Badge>
            </div>
          </TabsContent>

          {/* 5. UI States Tab */}
          <TabsContent value="states" className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight">Reusable UI State Patterns</h2>
              <p className="text-sm text-muted-foreground">
                Predictable loading, empty, and error boundary primitives.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Loading Pattern */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">Loading Skeleton State</CardTitle>
                </CardHeader>
                <CardContent>
                  <LoadingState count={2} />
                </CardContent>
              </Card>

              {/* Empty Pattern */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">Empty State</CardTitle>
                </CardHeader>
                <CardContent>
                  <EmptyState
                    title="No Completed Proofs Yet"
                    description="Choose a subject from the curriculum to start learning and earn your first evidence."
                    actionLabel="Explore Subjects"
                  />
                </CardContent>
              </Card>

              {/* Error Pattern */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">Error State</CardTitle>
                </CardHeader>
                <CardContent>
                  <ErrorState
                    title="Evaluation Failed"
                    message="Unable to verify code submission due to a temporary test runner failure."
                    retryLabel="Retry Test Suite"
                    onRetry={() => alert("Retry action triggered")}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 6. Modals & Dialogs Tab */}
          <TabsContent value="dialogs" className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight">Modals & Confirmation Dialogs</h2>
              <p className="text-sm text-muted-foreground">
                Accessible, keyboard-trapped dialogs for confirming critical state transitions.
              </p>
            </div>

            <div className="flex justify-center">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="default" size="lg" className="gap-2">
                    <ShieldCheck className="w-5 h-5" /> Open Proof Mode Confirmation
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-emerald-400">
                      <Lock className="w-5 h-5" /> Enter Server-Locked Proof Mode?
                    </DialogTitle>
                    <DialogDescription>
                      Once initiated, the server will enforce a complete AI assistance freeze.
                      You must independently solve the challenge and pass the transfer test to earn verified Learning Evidence.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="rounded-md bg-zinc-900 border border-zinc-800 p-3 text-xs text-zinc-400 space-y-1.5">
                    <div className="flex items-center gap-2 text-zinc-200 font-semibold">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Session Invariant:
                    </div>
                    <p>AI Tutoring: <strong>DISABLED</strong></p>
                    <p>Timer: <strong>30 minutes</strong></p>
                    <p>Outcome: <strong>Cryptographic Learning Evidence Record</strong></p>
                  </div>

                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Return to Practice
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => {
                        setDialogOpen(false);
                        alert("Proof Mode confirmation demo complete.");
                      }}
                    >
                      Confirm & Start Proof Mode
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
