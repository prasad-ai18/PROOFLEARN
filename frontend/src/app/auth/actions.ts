"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

/**
 * Signs the user out server-side and redirects to the sign-in page.
 */
export async function signOut() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("prooflearn_guest");

    const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (rawUrl && !rawUrl.includes("your-project")) {
      const supabase = await createClient();
      await supabase.auth.signOut();
    }
  } catch (err) {
    console.debug("Sign-out cleanup notice:", err);
  }
  redirect("/auth/sign-in");
}

