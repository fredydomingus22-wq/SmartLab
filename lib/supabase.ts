import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const SUPABASE_URL = (globalThis as any).process?.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = (globalThis as any).process?.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function ensureSupabaseEnv() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      "Missing Supabase environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are configured."
    );
  }

  return { url: SUPABASE_URL, anonKey: SUPABASE_ANON_KEY };
}

let browserClient: any | undefined;

export function createSupabaseBrowserClient(): any {
  const { url, anonKey } = ensureSupabaseEnv();
  if (!browserClient) {
    browserClient = createBrowserClient(url, anonKey);
  }
  return browserClient;
}

export function createSupabaseServerClient(): any {
  const { url, anonKey } = ensureSupabaseEnv();
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
