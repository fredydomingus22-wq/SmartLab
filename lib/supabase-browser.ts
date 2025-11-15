import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowserClient() {
  // As variáveis públicas já são embutidas no build pelo Next.js
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
