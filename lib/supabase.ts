const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export type SupabaseClient = {
  from: (table: string) => {
    select: (...args: unknown[]) => Promise<never>;
    insert: (...args: unknown[]) => Promise<never>;
    update: (...args: unknown[]) => Promise<never>;
    delete: (...args: unknown[]) => Promise<never>;
  };
};

function notConfigured(): Promise<never> {
  return Promise.reject(
    new Error(
      "Supabase client is not configured in this offline stub. Provide the official SDK in production."
    )
  );
}

function buildClient(): SupabaseClient {
  return {
    from() {
      return {
        select: notConfigured,
        insert: notConfigured,
        update: notConfigured,
        delete: notConfigured,
      };
    },
  };
}

export function createSupabaseBrowserClient(): SupabaseClient {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn(
      "Supabase environment variables are missing. Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY when connecting to Supabase."
    );
  }
  return buildClient();
}

export function createSupabaseServerClient(): SupabaseClient {
  return createSupabaseBrowserClient();
}
