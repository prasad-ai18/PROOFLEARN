import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/app-shell";
import { LearningHistoryList } from "@/components/history/learning-history-list";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const cookieStore = await cookies();
  const isGuest = cookieStore.get("prooflearn_guest")?.value === "true";
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseConfigured =
    Boolean(rawUrl) && !rawUrl?.includes("your-project");

  let user = null;
  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      user = authUser;
    } catch {
      user = null;
    }
  }

  if (!user && !isGuest && isSupabaseConfigured) {
    redirect("/auth/sign-in?redirectTo=/history");
  }

  return (
    <AppShell>
      <div className="py-6">
        <LearningHistoryList />
      </div>
    </AppShell>
  );
}
