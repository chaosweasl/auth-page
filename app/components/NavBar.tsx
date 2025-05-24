"use client";

import { createBrowserClient } from "@supabase/ssr";
import { UserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

function NavBar() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const checkUser = async () => {
      console.log("Checking current user...");
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Session error:", error.message);
        setUser(null);
      } else if (session) {
        console.log("User is authenticated:", {
          email: session.user.email,
          userId: session.user.id,
          expiresAt: session.expires_at,
        });
        setUser(session.user);
      } else {
        console.log("No authenticated user found");
        setUser(null);
      }
      setIsLoading(false);
    };

    checkUser();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOutClick = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    console.log("Attempting to sign out...");
    const { error } = await supabase.auth.signOut();
    if (!error) {
      console.log("Sign out successful, redirecting to sign in...");
      // Force a hard navigation to ensure the middleware picks up the session change
      window.location.href = "/sign-in";
    } else {
      console.error("Sign out failed:", error.message);
    }
  };

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">
          AuthPage
        </Link>
      </div>
      <div className="flex-none">
        <div className="menu menu-horizontal px-1 gap-4">
          {user ? (
            <>
              <li className="justify-center items-center">
                <button onClick={handleSignOutClick} className="btn btn-error">
                  Sign Out
                </button>
              </li>
              <li>
                <Link href="/profile">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar"
                  >
                    <div className="w-10 rounded-full">
                      {user.user_metadata?.avatar_url ? (
                        <img
                          alt="Profile"
                          src={user.user_metadata.avatar_url}
                        />
                      ) : (
                        <div className="w-10 rounded-full grid place-items-center place-content-center bg-base-200">
                          <UserRound className="h-8 w-8" />
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            </>
          ) : (
            <li>
              <Link href="/sign-in" className="btn btn-primary">
                Sign In
              </Link>
            </li>
          )}
        </div>
      </div>
    </div>
  );
}

export default NavBar;
