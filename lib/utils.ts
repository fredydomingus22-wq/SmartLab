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
