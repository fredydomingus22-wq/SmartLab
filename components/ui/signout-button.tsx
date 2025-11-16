"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    try {
      const SUPABASE_URL = (globalThis as any).process?.env.NEXT_PUBLIC_SUPABASE_URL!;
      const SUPABASE_ANON_KEY = (globalThis as any).process?.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const supabase = createSupabaseBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      await supabase.auth.signOut();
    } catch (e) {
      // ignore client sign out errors and continue to clear server cookie
    }

    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/auth/sign-in");
    router.refresh();
  }

  return (
    <Button variant="ghost" onClick={handleSignOut}>
      Sign out
    </Button>
  );
}
