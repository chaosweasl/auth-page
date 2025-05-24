"use client";

import { handleSignUp } from "@/app/utils/supabase/auth";
import React from "react";
import { useState } from "react";

function AuthSignUp() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  return (
    <>
      {message && (
        <div role="alert" className="alert alert-info">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="h-6 w-6 shrink-0 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>{message}</span>
        </div>
      )}

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

      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="fieldset-legend">Sign Up</legend>

        <label className="label">Username</label>
        <input
          type="text"
          className="input"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

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
            const result = await handleSignUp(username, email, password);
            if (typeof result === "string") {
              setError(result);
            } else {
              setError("");
              console.log("Authentication successful", result);
              setMessage(
                "Sign up successful. Please check your email for verification."
              );
            }
          }}
        >
          Sign Up
        </button>
      </fieldset>
    </>
  );
}

export default AuthSignUp;
