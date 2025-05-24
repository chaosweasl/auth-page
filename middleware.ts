import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Log all cookies for debugging
  const cookies = request.cookies;
  const cookieNames = cookies.getAll().map((cookie) => cookie.name);
  console.log("Cookie names present:", cookieNames);

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  console.log("Middleware executing for path:", request.nextUrl.pathname);

  // Create a new Supabase client for each request
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = request.cookies.get(name);
          console.log(`Getting cookie ${name}:`, cookie?.value);
          return cookie?.value;
        },
        set(name: string, value: string, options: any) {
          console.log(`Setting cookie ${name}:`, value);
          // Ensure the cookie is set with the correct options
          response.cookies.set({
            name,
            value,
            ...options,
            // Add these options to ensure the cookie is properly set
            path: "/",
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
          });
        },
        remove(name: string, options: any) {
          console.log(`Removing cookie ${name}`);
          response.cookies.set({
            name,
            value: "",
            ...options,
            // Add these options to ensure the cookie is properly removed
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
    // Refresh the session
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Session error:", error.message);
    }

    console.log(
      "Session status:",
      session ? "Authenticated" : "Not authenticated"
    );
    if (session) {
      console.log("Session details:", {
        userId: session.user.id,
        email: session.user.email,
        expiresAt: session.expires_at,
        accessToken: session.access_token ? "present" : "missing",
        refreshToken: session.refresh_token ? "present" : "missing",
      });
    }

    // Get the pathname of the request
    const path = request.nextUrl.pathname;
    console.log("Current path:", path);

    // Define public paths that don't require authentication
    const isPublicPath = path === "/sign-in" || path === "/sign-up";
    console.log("Is public path:", isPublicPath);

    // Redirect unauthenticated users to sign-in page if trying to access protected routes
    if (!session && !isPublicPath) {
      console.log(
        "Redirecting to sign-in: Unauthenticated user accessing protected route"
      );
      const redirectUrl = new URL("/sign-in", request.url);
      return NextResponse.redirect(redirectUrl);
    }

    // Redirect authenticated users to home page if they try to access login/signup pages
    if (session && isPublicPath) {
      console.log(
        "Redirecting to home: Authenticated user accessing public route"
      );
      const redirectUrl = new URL("/", request.url);
      return NextResponse.redirect(redirectUrl);
    }

    console.log("No redirect needed, proceeding with request");
    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    // In case of error, allow the request to proceed
    return response;
  }
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
