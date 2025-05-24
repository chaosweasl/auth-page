import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => request.cookies.get(name)?.value,
        set: (name, value, options) => {
          res.cookies.set({ name, value, ...options });
        },
        remove: (name, options) => {
          res.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === "/sign-in" || path === "/sign-up";

  // Redirect unauthenticated users to sign-in page if trying to access protected routes
  if (!session && !isPublicPath) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Redirect authenticated users to home page if they try to access login/signup pages
  if (session && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return res;
}

// Specify which routes this middleware should run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
