"use client";

import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { useState } from "react";

function AuthSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    console.log("Attempting sign in for:", email);
    const { data, error: signInError } = await supabase.auth.signInWithPassword(
      {
        email,
        password,
      }
    );

    if (signInError) {
      console.error("Sign in failed:", signInError.message);
      setError(signInError.message);
      setIsLoading(false);
      return;
    }

    if (data.session) {
      console.log("Sign in successful:", {
        userId: data.user.id,
        email: data.user.email,
        accessToken: data.session.access_token ? "present" : "missing",
        refreshToken: data.session.refresh_token ? "present" : "missing",
      });

      // Wait a moment to ensure the session is properly set
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Force a hard navigation to ensure the middleware picks up the new session
      window.location.href = "/";
    } else {
      console.error("Sign in succeeded but no session was returned");
      setError("Authentication failed - no session created");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div role="alert" className="alert alert-warning">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <fieldset className="space-y-4">
        <legend className="text-xl font-bold">Login</legend>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            className="input input-bordered w-full"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            className="input input-bordered w-full"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </fieldset>

      <div className="text-center space-y-2">
        <p>Don&apos;t have an account?</p>
        <Link href="/sign-up" className="btn btn-outline">
          Sign up
        </Link>
      </div>
    </form>
  );
}

export default AuthSignIn;
