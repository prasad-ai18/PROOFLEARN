"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { LearningHistoryItem } from "@/types/api";
import { api, ApiError } from "@/lib/api/client";
import { createClient } from "@/lib/supabase/client";
import { LearningHistoryCard } from "@/components/history/learning-history-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  History,
  RotateCcw,
  Sparkles,
  Compass,
  AlertCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export function LearningHistoryList() {
  const [items, setItems] = useState<LearningHistoryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filters & Pagination State
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [page, setPage] = useState(0);
  const limit = 10;

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const token = session?.access_token || "";

        const res = await api.getLearningHistory(
          {
            limit,
            offset: page * limit,
            status: statusFilter === "all" ? undefined : statusFilter,
            subject_slug: subjectFilter === "all" ? undefined : subjectFilter,
          },
          token
        );

        if (isMounted) {
          setItems(res.items);
          setTotal(res.total);
        }
      } catch (err: unknown) {
        if (isMounted) {
          if (err instanceof ApiError) {
            setErrorMessage(err.message);
          } else {
            setErrorMessage("Unable to load learning history. Please try again.");
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [page, statusFilter, subjectFilter]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <History className="w-4 h-4" />
            <span>Verifiable Learning Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Learning History & Evidence
          </h1>
          <p className="text-xs text-muted-foreground">
            Authoritative historical record of what you have learned and independently proved.
          </p>
        </div>

        <Link href="/learn">
          <Button size="sm" className="gap-2 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-md">
            <Compass className="w-3.5 h-3.5" />
            <span>Explore Curriculum</span>
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-zinc-500" />
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-zinc-950/60 border border-border/70 p-1 rounded-xl text-xs">
            <button
              onClick={() => {
                setStatusFilter("all");
                setPage(0);
              }}
              className={`px-3 py-1 rounded-lg transition-colors ${
                statusFilter === "all" ? "bg-zinc-800 text-white font-semibold" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              All Sessions
            </button>
            <button
              onClick={() => {
                setStatusFilter("completed");
                setPage(0);
              }}
              className={`px-3 py-1 rounded-lg transition-colors ${
                statusFilter === "completed" ? "bg-emerald-950/60 text-emerald-300 font-semibold" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Completed (LEI)
            </button>
            <button
              onClick={() => {
                setStatusFilter("in_progress");
                setPage(0);
              }}
              className={`px-3 py-1 rounded-lg transition-colors ${
                statusFilter === "in_progress" ? "bg-amber-950/60 text-amber-300 font-semibold" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              In Progress
            </button>
          </div>

          {/* Subject Filter */}
          <select
            value={subjectFilter}
            onChange={(e) => {
              setSubjectFilter(e.target.value);
              setPage(0);
            }}
            className="bg-zinc-950/60 border border-border/70 text-xs text-zinc-300 rounded-xl px-2.5 py-1.5 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="all">All Subjects</option>
            <option value="python">Python</option>
            <option value="sql">SQL</option>
            <option value="ai-ml">AI & Machine Learning</option>
            <option value="java">Java</option>
            <option value="csharp">C#</option>
          </select>
        </div>

        <div className="text-xs text-zinc-400 font-medium">
          {total} {total === 1 ? "session" : "sessions"} found
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <Card key={n} className="border-border/60 bg-zinc-900/40 p-5 space-y-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="h-4 w-20 bg-zinc-800 rounded" />
                <div className="h-5 w-24 bg-zinc-800 rounded-full" />
              </div>
              <div className="h-6 w-48 bg-zinc-800 rounded" />
              <div className="h-16 w-full bg-zinc-950/60 rounded-xl" />
              <div className="h-8 w-28 bg-zinc-800 rounded ml-auto" />
            </Card>
          ))}
        </div>
      )}

      {/* Error State */}
      {!isLoading && errorMessage && (
        <Card className="border-amber-500/30 bg-zinc-900/80 p-8 text-center space-y-4">
          <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-white">Could not load your learning history</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">{errorMessage}</p>
          </div>
          <Button
            onClick={() => {
              setPage(0);
              setStatusFilter("all");
              setSubjectFilter("all");
            }}
            size="sm"
            variant="outline"
            className="text-xs gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Try Again
          </Button>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !errorMessage && items.length === 0 && (
        <Card className="border-border/80 bg-zinc-900/60 p-10 text-center space-y-4">
          <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <History className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No learning evidence yet</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
              Complete your first concept learning session and prove your understanding to generate verifiable Learning Evidence.
            </p>
          </div>
          <Link href="/learn">
            <Button size="sm" className="gap-2 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Start Learning</span>
            </Button>
          </Link>
        </Card>
      )}

      {/* History Grid */}
      {!isLoading && !errorMessage && items.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => (
              <LearningHistoryCard key={item.session_id} item={item} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-border/60 text-xs">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="gap-1 text-xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </Button>

              <span className="text-muted-foreground">
                Page {page + 1} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="gap-1 text-xs"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
