"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Subject, Concept } from "@/types/database.types";
import { ChatMessage } from "@/types/api";
import { api, ApiError } from "@/lib/api/client";
import { createClient } from "@/lib/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { PracticeEngine } from "@/components/practice/practice-engine";
import {
  BrainCircuit,
  Send,
  User,
  Sparkles,
  ArrowLeft,
  Lock,
  RotateCcw,
  AlertCircle,
  Info,
  Lightbulb,
} from "lucide-react";

interface AILearningRoomProps {
  subject: Subject;
  concept: Concept;
  user?: {
    id: string;
    email?: string;
    displayName?: string;
    avatarUrl?: string | null;
  };
}

export function AILearningRoom({ subject, concept }: AILearningRoomProps) {
  const [viewMode, setViewMode] = useState<"tutor" | "practice">("tutor");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (viewMode === "tutor") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, viewMode]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmed = inputMessage.trim();
    if (!trimmed || isLoading) return;

    // Reset error state and input
    setErrorMessage(null);
    setInputMessage("");

    const newHistory: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      // Obtain active Supabase access token for authentication
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const token = session?.access_token || "";

      const response = await api.learnWithAI(
        {
          subject_slug: subject.slug,
          concept_slug: concept.slug,
          message: trimmed,
          history: messages,
        },
        token
      );

      setMessages([
        ...newHistory,
        { role: "model", content: response.message },
      ]);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Unable to connect to the AI tutoring service. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // If in practice view mode, render PracticeEngine
  if (viewMode === "practice") {
    return (
      <PracticeEngine
        subject={subject}
        concept={concept}
        onReturnToLearn={() => setViewMode("tutor")}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4 sm:py-6">
      {/* Top Breadcrumb & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/learn" className="hover:text-white transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Catalog
          </Link>
          <span>/</span>
          <span className="text-zinc-300">{subject.name}</span>
          <span>/</span>
          <span className="text-emerald-400 font-medium">{concept.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5 text-xs text-emerald-400 border-emerald-500/40 bg-emerald-950/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Learning Mode</span>
          </Badge>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setViewMode("practice")}
            className="gap-1.5 text-xs border-amber-500/40 text-amber-300 hover:bg-amber-950/40"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Start Practice</span>
          </Button>
        </div>
      </div>

      {/* Concept Header Card */}
      <Card className="border-border/80 bg-zinc-900/60 shadow-lg">
        <CardHeader className="py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <BrainCircuit className="w-6 h-6 text-emerald-400" />
                {concept.name}
              </CardTitle>
              <CardDescription className="text-xs text-zinc-400 mt-1 max-w-2xl">
                {concept.description || "Explore concept principles with your Socratic AI Tutor."}
              </CardDescription>
            </div>

            {/* Practice & Proof Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => setViewMode("practice")}
                className="gap-1.5 text-xs bg-amber-600 hover:bg-amber-500 text-white shadow-sm"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Practice Challenges</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled
                className="gap-1.5 text-xs opacity-60 cursor-not-allowed border-dashed border-zinc-700"
                title="Proof Mode will be enabled in Task 11"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Proof Mode</span>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Conversation Container */}
      <Card className="border-border/80 bg-card/90 shadow-xl flex flex-col min-h-[500px] max-h-[700px]">
        {/* Messages Stream */}
        <CardContent className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Welcome / Socratic Empty State */}
          {messages.length === 0 && (
            <div className="rounded-xl border border-border/60 bg-zinc-900/50 p-6 text-center space-y-3 my-8">
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-white">
                  Welcome to the {concept.name} Learning Room
                </h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                  I am your PROOFLEARN AI Tutor. Ask questions, explore examples, or ask me to explain how {concept.name} works step-by-step.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setInputMessage(`What is ${concept.name} and why is it important in ${subject.name}?`);
                  }}
                  className="text-xs text-emerald-400 bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-500/30 rounded-lg px-3 py-1.5 transition-colors text-left"
                >
                  &ldquo;What is {concept.name} and why is it important?&rdquo;
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInputMessage(`Can you give me a simple code example illustrating ${concept.name}?`);
                  }}
                  className="text-xs text-zinc-300 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg px-3 py-1.5 transition-colors text-left"
                >
                  &ldquo;Can you show a simple example?&rdquo;
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("practice")}
                  className="text-xs text-amber-300 bg-amber-950/40 hover:bg-amber-950/70 border border-amber-500/30 rounded-lg px-3 py-1.5 transition-colors text-left flex items-center gap-1.5"
                >
                  <Lightbulb className="w-3 h-3 text-amber-400" />
                  <span>Ready to test understanding with Practice?</span>
                </button>
              </div>
            </div>
          )}

          {/* Conversation History */}
          {messages.map((msg, index) => {
            const isUser = msg.role === "user";

            return (
              <div
                key={index}
                className={`flex gap-3.5 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mt-1">
                    <BrainCircuit className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`rounded-2xl px-4 py-3 max-w-[85%] sm:max-w-[75%] text-sm leading-relaxed ${
                    isUser
                      ? "bg-emerald-600 text-white rounded-tr-none shadow-md"
                      : "bg-zinc-900 border border-border/80 text-zinc-100 rounded-tl-none whitespace-pre-wrap font-sans"
                  }`}
                >
                  {!isUser && (
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 mb-1.5">
                      <Sparkles className="w-3 h-3" />
                      <span>PROOFLEARN Tutor</span>
                    </div>
                  )}
                  {msg.content}
                </div>

                {isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Subtle Thinking State */}
          {isLoading && (
            <div className="flex gap-3.5 justify-start">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <BrainCircuit className="w-4 h-4 animate-pulse" />
              </div>
              <div className="rounded-2xl rounded-tl-none bg-zinc-900 border border-border/80 px-4 py-3 text-xs text-zinc-400 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
                <span>PROOFLEARN Tutor is formulating your explanation...</span>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertTitle>AI Tutoring Notice</AlertTitle>
              <AlertDescription className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>{errorMessage}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSendMessage()}
                  className="gap-1.5 text-xs h-7"
                >
                  <RotateCcw className="w-3 h-3" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div ref={messagesEndRef} />
        </CardContent>

        {/* Input Footer Area */}
        <CardFooter className="p-4 border-t border-border/70 bg-zinc-950/40">
          <form onSubmit={handleSendMessage} className="w-full space-y-2">
            <div className="relative flex items-end gap-2">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value.slice(0, 4000))}
                onKeyDown={handleKeyDown}
                placeholder={`Ask a question or explain what you understand about ${concept.name}... (Press Enter to send)`}
                disabled={isLoading}
                rows={2}
                className="resize-none pr-12 min-h-[56px] text-sm bg-zinc-900/90 border-border/80 focus-visible:ring-emerald-500"
                aria-label="Message to AI Tutor"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!inputMessage.trim() || isLoading}
                className="h-10 w-10 shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
              <span className="flex items-center gap-1">
                <Info className="w-3 h-3 text-zinc-500" />
                Shift + Enter for new line • Learning mode assistance active
              </span>
              <span>{inputMessage.length} / 4000</span>
            </div>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
