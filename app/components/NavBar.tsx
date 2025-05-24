"use client";

import { handleSignOut, getCurrentUser } from "@/app/utils/supabase/auth";
import { UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function NavBar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      console.log("Checking current user...");
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
      if (currentUser) {
        console.log("User is authenticated:", { email: currentUser.email });
      } else {
        console.log("No authenticated user found");
      }
    };
    checkUser();
  }, []);

  const handleSignOutClick = async () => {
    console.log("Attempting to sign out...");
    const error = await handleSignOut();
    if (!error) {
      console.log("Sign out successful, redirecting to sign in...");
      router.push("/sign-in");
      router.refresh();
    } else {
      console.error("Sign out failed:", error);
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
