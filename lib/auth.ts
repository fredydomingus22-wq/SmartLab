import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { AppRole } from "@/lib/utils";
import { hasRequiredRole } from "@/lib/utils";

export interface SessionUser {
  id: string;
  email: string;
  role: AppRole;
}

export interface SessionContext {
  user: SessionUser | null;
}

export async function getSession(): Promise<SessionContext> {
  const cookieStore = cookies();
  const rawUser = cookieStore.get("sb-user");
  if (!rawUser?.value) {
    return { user: null };
  }

  try {
    const user: SessionUser = JSON.parse(rawUser.value);
    return { user };
  } catch (error) {
    console.error("Failed to parse session cookie", error);
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
