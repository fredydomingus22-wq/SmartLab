import type { SupabaseClient, CreateClientOptions } from "@supabase/supabase-js";

export function createBrowserClient(
  url: string,
  anonKey: string,
  options?: CreateClientOptions
): SupabaseClient;

export function createServerClient(
  url: string,
  anonKey: string,
  options?: CreateClientOptions
): SupabaseClient;
