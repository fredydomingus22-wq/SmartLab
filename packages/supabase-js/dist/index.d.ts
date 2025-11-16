export interface User {
  id: string;
  email?: string | null;
  phone?: string | null;
  user_metadata?: Record<string, unknown> | null;
  app_metadata?: Record<string, unknown> | null;
  role?: string | null;
}

export interface Session {
  user: User | null;
  access_token?: string;
  expires_at?: number;
}

export interface AuthResponse<T> {
  data: T;
  error: Error | null;
}

export interface SupabaseClient {
  auth: {
    getSession(): Promise<AuthResponse<{ session: Session | null }>>;
    getUser(): Promise<AuthResponse<{ user: User | null }>>;
  };
}

export interface CreateClientOptions {
  cookies?: {
    get(name: string): string | undefined;
    set?: (name: string, value: string, options?: Record<string, unknown>) => void;
    remove?: (name: string, options?: Record<string, unknown>) => void;
  };
}

export function createClient(
  url: string,
  anonKey: string,
  options?: CreateClientOptions
): SupabaseClient;
