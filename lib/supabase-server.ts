/// <reference types="node" />
"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

export function createSupabaseServerClient() {
  const SUPABASE_URL = (globalThis as any).process?.env.NEXT_PUBLIC_SUPABASE_URL!;
  const SUPABASE_ANON_KEY = (globalThis as any).process?.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const cookieStore = cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
    },
  });
}
