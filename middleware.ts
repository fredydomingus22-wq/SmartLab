import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { type AppRole, extractRoleFromUser } from "@/lib/utils";

const protectedRoutes: Record<string, AppRole[]> = {
  "/production-lots/create": ["admin_root", "plant_manager", "qa_supervisor"],
  "/raw-material-lots/create": ["admin_root", "plant_manager", "qa_supervisor"],
  "/lab-tests/create": ["admin_root", "qa_supervisor", "lab_tech"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const matchedRoute = Object.entries(protectedRoutes).find(([route]) =>
    pathname.startsWith(route)
  );

  if (!matchedRoute) {
    return NextResponse.next();
  }

  const [, allowedRoles] = matchedRoute;
  const response = NextResponse.next();

  try {
    const supabaseUrl = (globalThis as any).process?.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = (globalThis as any).process?.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase environment variables are not configured for middleware checks.");
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options) {
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options) {
            response.cookies.delete({ name, ...options });
          },
        },
      }
    );

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }

    const role = extractRoleFromUser(user);
    if (!role || !allowedRoles.includes(role)) {
      return NextResponse.redirect(new URL("/auth/forbidden", request.url));
    }

    return response;
  } catch (error) {
    console.error("Supabase middleware guard failed", error);
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }
}

export const config = {
  matcher: ["/production-lots/:path*", "/raw-material-lots/:path*", "/lab-tests/:path*"],
};
