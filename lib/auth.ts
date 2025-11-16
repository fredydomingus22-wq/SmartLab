import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { AppRole } from "@/lib/utils";
import { extractRoleFromUser, hasRequiredRole } from "@/lib/utils";

export interface SessionUser {
  id: string;
  email: string;
  role: AppRole;
}

export interface SessionContext {
  user: SessionUser | null;
}

export async function getSession(): Promise<SessionContext> {
  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Failed to fetch Supabase session", error);
      return { user: null };
    }

    const user = session?.user;
    if (!user) {
      return { user: null };
    }

    return {
      user: mapUserToSession(user),
    };
  } catch (error) {
    console.error("Unexpected Supabase auth error", error);
    return { user: null };
  }
}

export async function requireRole(allowedRoles: AppRole[]) {
  const session = await getSession();
  if (!session.user || !hasRequiredRole(session.user.role, allowedRoles)) {
    redirect("/auth/sign-in");
  }
  return session.user;
}

function mapUserToSession(user: User): SessionUser {
  const role = extractRoleFromUser(user) ?? "auditor_readonly";

  return {
    id: user.id,
    email: user.email ?? "",
    role,
  };
}
