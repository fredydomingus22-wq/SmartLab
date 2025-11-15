import type { User } from "@supabase/supabase-js";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ROLE_PRIORITIES = [
  "admin_root",
  "plant_manager",
  "qa_supervisor",
  "lab_tech",
  "auditor_readonly",
] as const;

export type AppRole = (typeof ROLE_PRIORITIES)[number];

export function hasRequiredRole(userRole: AppRole | undefined, allowedRoles: AppRole[]) {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
}

export function extractRoleFromUser(user: Pick<User, "app_metadata" | "user_metadata"> | null | undefined) {
  if (!user) return undefined;

  const candidate =
    (user.app_metadata?.role as string | undefined) ??
    (user.user_metadata?.role as string | undefined);

  if (candidate && ROLE_PRIORITIES.includes(candidate as AppRole)) {
    return candidate as AppRole;
  }

  return undefined;
}
