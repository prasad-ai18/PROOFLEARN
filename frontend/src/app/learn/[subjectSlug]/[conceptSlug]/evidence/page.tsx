import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
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
    redirect(`/auth/sign-in?redirectTo=/learn/${subjectSlug}/${conceptSlug}/evidence`);
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
