import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create a new Supabase client for each request
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({
            name,
            value,
            ...options,
            path: "/",
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
          });
        },
        remove(name: string, options: any) {
          response.cookies.set({
            name,
            value: "",
            ...options,
            path: "/",
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 0,
          });
        },
      },
    }
  );

  try {
    // Verify the user with the auth server
    const {
      data: { user },
      error: verifyError,
    } = await supabase.auth.getUser();

    if (verifyError) {
      console.error(
        "User verification error in middleware:",
        verifyError.message
      );
      // If verification fails, treat as unauthenticated
      if (!isPublicPath(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }
      return response;
    }

    const isAuthenticated = !!user;
    console.log("Auth status:", {
      path: request.nextUrl.pathname,
      isAuthenticated,
      email: user?.email,
    });

    // Handle protected routes
    if (!isAuthenticated && !isPublicPath(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // Handle authenticated users trying to access auth pages
    if (isAuthenticated && isAuthPath(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return response;
  } catch (err) {
    console.error("Unexpected error in middleware:", err);
    // On error, treat as unauthenticated for security
    if (!isPublicPath(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    return response;
  }
}

// Helper functions to check path types
function isPublicPath(path: string): boolean {
  return (
    path === "/" ||
    path.startsWith("/sign-in") ||
    path.startsWith("/sign-up") ||
    path.startsWith("/auth/callback") ||
    path.startsWith("/_next") ||
    path.startsWith("/public")
  );
}

function isAuthPath(path: string): boolean {
  return path.startsWith("/sign-in") || path.startsWith("/sign-up");
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
