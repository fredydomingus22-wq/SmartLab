import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import { getSupabaseConfig } from "./supabase-config";

export function createSupabaseServerClient(): SupabaseClient {
  const { url, anonKey } = getSupabaseConfig();
  const cookieStore = cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set() {
        // The App Router's `cookies()` helper is read-only in server components.
        // Route handlers should create their own Supabase client if they need to mutate cookies.
      },
      remove() {
        // See comment above – server components cannot mutate cookies.
      },
    },
  });
}
