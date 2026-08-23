import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/app-shell";
import { LearningHistoryList } from "@/components/history/learning-history-list";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in?next=/history");
  }

  return (
    <AppShell>
      <div className="py-6">
        <LearningHistoryList />
      </div>
    </AppShell>
  );
}
