import { notFound, redirect } from "next/navigation";
import { getSubjectAndConceptBySlugs } from "@/lib/data/concepts";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/app-shell";
import { LearningEvidenceView } from "@/components/evidence/learning-evidence-view";

interface EvidencePageProps {
  params: Promise<{
    subjectSlug: string;
    conceptSlug: string;
  }>;
  searchParams: Promise<{
    session_id?: string;
  }>;
}

export default async function EvidencePage({
  params,
  searchParams,
}: EvidencePageProps) {
  const { subjectSlug, conceptSlug } = await params;
  const { session_id } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/sign-in?next=/learn/${subjectSlug}/${conceptSlug}/evidence`);
  }

  const result = await getSubjectAndConceptBySlugs(supabase, subjectSlug, conceptSlug);
  if (!result) {
    notFound();
  }

  return (
    <AppShell>
      <div className="py-6">
        <LearningEvidenceView
          sessionId={session_id || ""}
          subjectSlug={subjectSlug}
          conceptSlug={conceptSlug}
        />
      </div>
    </AppShell>
  );
}
