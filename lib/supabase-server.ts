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
        // App Router server components cannot mutate cookies.
        // Route handlers should instantiate their own client if they need write access.
      },
      remove() {
        // Same as above – the read-only cookies helper blocks deletions.
      },
    },
  });
}
