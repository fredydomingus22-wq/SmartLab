import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowserClient(SUPABASE_URL: string, SUPABASE_ANON_KEY: string) {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
