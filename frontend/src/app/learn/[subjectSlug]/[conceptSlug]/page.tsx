import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getSubjectAndConceptBySlugs } from "@/lib/data/concepts";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lightbulb } from "lucide-react";
import { AILearningRoom } from "@/components/learning/ai-learning-room";

interface ConceptPageProps {
  params: Promise<{
    subjectSlug: string;
    conceptSlug: string;
  }>;
}

export default async function ConceptLearningPage({ params }: ConceptPageProps) {
  const { subjectSlug, conceptSlug } = await params;

  const cookieStore = await cookies();
  const isGuest = cookieStore.get("prooflearn_guest")?.value === "true";
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseConfigured =
    Boolean(rawUrl) && !rawUrl?.includes("your-project");

  let user = null;
  const supabase = await createClient();

  if (isSupabaseConfigured) {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      user = authUser;
    } catch {
      user = null;
    }
  }

  if (!user && !isGuest && isSupabaseConfigured) {
    redirect(`/auth/sign-in?redirectTo=/learn/${subjectSlug}/${conceptSlug}`);
  }

  // 2. Validate Subject and Concept in database
  const result = await getSubjectAndConceptBySlugs(supabase, subjectSlug, conceptSlug);

  if (!result) {
    return (
      <AppShell>
        <div className="max-w-xl mx-auto py-16 text-center space-y-6">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400">
            <Lightbulb className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">Topic Not Found</h1>
            <p className="text-sm text-muted-foreground">
              The requested learning concept (<code className="text-zinc-300">{conceptSlug}</code>) could not be found under the subject (<code className="text-zinc-300">{subjectSlug}</code>).
            </p>
          </div>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/learn">
              <ArrowLeft className="w-4 h-4" />
              Return to Learning Selection
            </Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  const { subject, concept } = result;

  const safeUserData = user
    ? {
        id: user.id,
        email: user.email,
        displayName:
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "Learner",
        avatarUrl:
          user.user_metadata?.avatar_url ||
          user.user_metadata?.picture ||
          null,
      }
    : {
        id: "guest-learner",
        email: "guest@prooflearn.dev",
        displayName: "Guest Learner",
        avatarUrl: null,
      };

  return (
    <AppShell>
      <AILearningRoom
        subject={subject}
        concept={concept}
        user={safeUserData}
      />
    </AppShell>
  );
}
