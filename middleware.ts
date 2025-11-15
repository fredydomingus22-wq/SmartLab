import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { type AppRole } from "@/lib/utils";

const protectedRoutes: Record<string, AppRole[]> = {
  "/production-lots/create": ["admin_root", "plant_manager", "qa_supervisor"],
  "/raw-material-lots/create": ["admin_root", "plant_manager", "qa_supervisor"],
  "/lab-tests/create": ["admin_root", "qa_supervisor", "lab_tech"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const matchedRoute = Object.entries(protectedRoutes).find(([route]) =>
    pathname.startsWith(route)
  );

  if (!matchedRoute) {
    return NextResponse.next();
  }

  const [, allowedRoles] = matchedRoute;
  const sessionCookie = request.cookies.get("sb-user");
  if (!sessionCookie?.value) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  try {
    const user = JSON.parse(sessionCookie.value) as { role: AppRole };
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.redirect(new URL("/auth/forbidden", request.url));
    }
  } catch (error) {
    console.error("Invalid session cookie", error);
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/production-lots/:path*", "/raw-material-lots/:path*", "/lab-tests/:path*"],
};
