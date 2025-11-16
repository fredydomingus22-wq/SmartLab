import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseConfig } from "./supabase-config";

let browserClient: SupabaseClient | undefined;

export function createSupabaseBrowserClient(): SupabaseClient {
  const { url, anonKey } = getSupabaseConfig();

  if (!browserClient) {
    browserClient = createBrowserClient(url, anonKey);
  }

  return browserClient;
}
