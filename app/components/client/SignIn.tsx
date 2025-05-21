"use client";

import { handleSignIn } from "@/utils/supabase/auth";
import Link from "next/link";
import { useState } from "react";

function AuthSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <>
      {error && (
        <div role="alert" className="alert alert-warning mt-10">
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

      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="fieldset-legend">Login</legend>

        <label className="label">Email</label>
        <input
          type="email"
          className="input"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="label">Password</label>
        <input
          type="password"
          className="input"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="btn btn-neutral mt-4"
          onClick={async () => {
            const result = await handleSignIn(email);
            if (typeof result === "string") {
              setError(result);
            } else {
              // Handle successful authentication
              setError("");
              console.log("Authentication successful", result);
            }
          }}
        >
          Login
        </button>
      </fieldset>

      <div>
        <h1>Don't have an account? Sign up instead</h1>
        <button className="btn btn-neutral">
          <Link href="/sign-up">Sign up</Link>
        </button>
      </div>
    </>
  );
}

export default AuthSignIn;
