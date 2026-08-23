"use client";

import React from "react";
import Link from "next/link";
import { LearningHistoryItem } from "@/types/api";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Calendar,
  Compass,
} from "lucide-react";

interface LearningHistoryCardProps {
  item: LearningHistoryItem;
}

export function LearningHistoryCard({ item }: LearningHistoryCardProps) {
  const isCompleted = item.status === "completed" && item.evidence_available;

  const formattedDate = new Date(item.started_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card className="border-border/80 bg-zinc-900/80 hover:border-zinc-700 transition-all shadow-md overflow-hidden">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400">
              {item.subject_name}
            </span>
          </div>

          {isCompleted ? (
            <Badge variant="outline" className="text-[11px] border-emerald-500/40 bg-emerald-950/40 text-emerald-400 gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Completed
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[11px] border-amber-500/40 bg-amber-950/40 text-amber-400 gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              In Progress ({item.stage})
            </Badge>
          )}
        </div>

        <CardTitle className="text-lg font-bold text-white pt-1">
          {item.concept_name}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-5 py-2 space-y-3">
        {isCompleted && item.lei_score !== null && item.lei_score !== undefined ? (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-[10px] uppercase font-semibold text-zinc-400">
                Learning Evidence Index
              </div>
              <div className="text-xs text-emerald-300 font-medium line-clamp-1">
                {item.interpretation || "Verified independent understanding"}
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white font-mono">{item.lei_score}</span>
              <span className="text-xs text-zinc-500 font-mono">/100</span>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-border/60 bg-zinc-950/50 p-3 space-y-0.5 text-xs text-zinc-400">
            <div className="font-semibold text-amber-300">Proof Verification Pending</div>
            <div className="text-[11px]">Complete the independent and transfer stages to generate your LEI.</div>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>Session started on {formattedDate}</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 px-5 border-t border-border/60 bg-zinc-950/40 flex items-center justify-between">
        <span className="text-[10px] text-zinc-500 font-mono">
          ID: {item.session_id.slice(0, 16)}...
        </span>

        {isCompleted ? (
          <Link href={`/learn/${item.subject_slug}/${item.concept_slug}/evidence?session_id=${item.session_id}`}>
            <Button size="sm" className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>View Evidence</span>
            </Button>
          </Link>
        ) : (
          <Link href={`/learn/${item.subject_slug}/${item.concept_slug}`}>
            <Button size="sm" variant="outline" className="gap-1.5 text-xs border-amber-500/40 text-amber-300 hover:bg-amber-950/30">
              <Compass className="w-3.5 h-3.5" />
              <span>Continue Session</span>
              <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
