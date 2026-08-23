"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Subject, Concept } from "@/types/database.types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Code,
  Layers,
  Database as DatabaseIcon,
  BrainCircuit,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  BookOpen,
  HelpCircle,
} from "lucide-react";

interface LearningSelectorProps {
  subjects: Subject[];
  allConcepts: Concept[];
}

const SUBJECT_ICONS: Record<string, React.ReactNode> = {
  python: <Code className="w-5 h-5 text-emerald-400" />,
  java: <Layers className="w-5 h-5 text-cyan-400" />,
  sql: <DatabaseIcon className="w-5 h-5 text-amber-400" />,
  "ai-ml": <BrainCircuit className="w-5 h-5 text-indigo-400" />,
  "data-science": <BarChart3 className="w-5 h-5 text-emerald-400" />,
};

function getDifficultyBadge(difficulty: Concept["difficulty"]) {
  switch (difficulty) {
    case "beginner":
      return (
        <Badge variant="outline" className="text-[11px] border-emerald-500/40 text-emerald-400 bg-emerald-950/20">
          Beginner
        </Badge>
      );
    case "intermediate":
      return (
        <Badge variant="outline" className="text-[11px] border-amber-500/40 text-amber-400 bg-amber-950/20">
          Intermediate
        </Badge>
      );
    case "advanced":
      return (
        <Badge variant="outline" className="text-[11px] border-rose-500/40 text-rose-400 bg-rose-950/20">
          Advanced
        </Badge>
      );
    default:
      return null;
  }
}

export function LearningSelector({ subjects, allConcepts }: LearningSelectorProps) {
  const router = useRouter();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    subjects.length > 0 ? subjects[0].id : null
  );
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(null);

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId) || null;
  const filteredConcepts = selectedSubjectId
    ? allConcepts.filter((c) => c.subject_id === selectedSubjectId && c.is_active)
    : [];
  const selectedConcept = filteredConcepts.find((c) => c.id === selectedConceptId) || null;

  const handleSubjectSelect = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setSelectedConceptId(null); // Reset concept on subject change
  };

  const handleConceptSelect = (conceptId: string) => {
    setSelectedConceptId(conceptId);
  };

  const handleStartLearning = () => {
    if (selectedSubject && selectedConcept) {
      router.push(`/learn/${selectedSubject.slug}/${selectedConcept.slug}`);
    }
  };

  return (
    <div className="space-y-10">
      {/* 1. Subject Selection Area */}
      <section className="space-y-4" aria-labelledby="subjects-heading">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                1
              </span>
              <h2 id="subjects-heading" className="text-lg font-semibold tracking-tight text-white">
                Choose Subject
              </h2>
            </div>
            <p className="text-xs text-muted-foreground pl-8">
              Select the core technical domain you wish to master.
            </p>
          </div>
          {selectedSubject && (
            <Badge variant="outline" className="gap-1.5 text-xs text-emerald-400 border-emerald-500/30 bg-emerald-950/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{selectedSubject.name}</span>
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {subjects.map((subject) => {
            const isSelected = subject.id === selectedSubjectId;
            const icon = SUBJECT_ICONS[subject.slug] || <BookOpen className="w-5 h-5 text-emerald-400" />;

            return (
              <button
                key={subject.id}
                type="button"
                onClick={() => handleSubjectSelect(subject.id)}
                aria-pressed={isSelected}
                className={`group relative flex flex-col justify-between text-left p-4 rounded-xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  isSelected
                    ? "border-emerald-500 bg-zinc-900/90 shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500"
                    : "border-border/70 bg-card/60 hover:border-zinc-700 hover:bg-card/90"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-zinc-900 border border-border/80">
                      {icon}
                    </div>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        Selected
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground group-hover:text-white transition-colors">
                      {subject.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                      {subject.description || "Core concepts, algorithmic principles, and practical problem solving."}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Concept Selection Area */}
      <section className="space-y-4" aria-labelledby="concepts-heading">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                2
              </span>
              <h2 id="concepts-heading" className="text-lg font-semibold tracking-tight text-white">
                Choose Concept
              </h2>
            </div>
            <p className="text-xs text-muted-foreground pl-8">
              {selectedSubject
                ? `Available learning concepts for ${selectedSubject.name}.`
                : "Please select a subject first."}
            </p>
          </div>
          {selectedConcept && (
            <Badge variant="outline" className="gap-1.5 text-xs text-emerald-400 border-emerald-500/30 bg-emerald-950/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{selectedConcept.name}</span>
            </Badge>
          )}
        </div>

        {filteredConcepts.length === 0 ? (
          <Card className="border-dashed border-border/80 bg-card/30 p-8 text-center">
            <div className="flex flex-col items-center justify-center space-y-2">
              <HelpCircle className="w-8 h-8 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                No concepts available for this subject yet.
              </p>
              <p className="text-xs text-muted-foreground">
                Please select another subject to continue.
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredConcepts.map((concept) => {
              const isSelected = concept.id === selectedConceptId;

              return (
                <button
                  key={concept.id}
                  type="button"
                  onClick={() => handleConceptSelect(concept.id)}
                  aria-pressed={isSelected}
                  className={`group relative flex flex-col justify-between text-left p-4 rounded-xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    isSelected
                      ? "border-emerald-500 bg-zinc-900/90 shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500"
                      : "border-border/70 bg-card/60 hover:border-zinc-700 hover:bg-card/90"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      {getDifficultyBadge(concept.difficulty)}
                      {isSelected && (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          Selected
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-foreground group-hover:text-white transition-colors">
                        {concept.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                        {concept.description || "Foundational topic unit ready for interactive comprehension and proof verification."}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. Selection Summary & Start Action */}
      <Card className="border-border/80 bg-zinc-900/80 shadow-xl backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left w-full sm:w-auto">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Session Target
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-sm">
                <span className="text-zinc-400">Subject:</span>
                <span className="font-medium text-white">
                  {selectedSubject ? selectedSubject.name : "None selected"}
                </span>
                <span className="text-zinc-600">/</span>
                <span className="text-zinc-400">Concept:</span>
                <span className="font-medium text-white">
                  {selectedConcept ? selectedConcept.name : "None selected"}
                </span>
              </div>
            </div>

            <Button
              type="button"
              size="lg"
              onClick={handleStartLearning}
              disabled={!selectedSubject || !selectedConcept}
              className="w-full sm:w-auto min-w-[180px] h-12 gap-2 text-sm font-semibold shadow-lg shadow-emerald-950/50"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
