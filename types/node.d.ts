/// <reference lib="esnext" />

// Minimal NodeJS process/env declarations to avoid depending on @types/node
// This only covers the pieces used across the SMART LAB frontend.
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL?: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
    NEXT_PUBLIC_SITE_URL?: string;
    [key: string]: string | undefined;
  }

  interface Process {
    env: ProcessEnv;
  }
}

declare const process: NodeJS.Process;

export {};
