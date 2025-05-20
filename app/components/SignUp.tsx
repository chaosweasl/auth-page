import React from "react";

function SignUp() {
  return (
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
          const result = await handleInputData(email, password, error);
          if (typeof result === "string") {
            setError(result);
          } else {
            // Handle successful authentication
            setError("");
            console.log("Authentication successful", result);
            // Add your authentication logic here (e.g., API call, redirect)
          }
        }}
      >
        Login
      </button>
    </fieldset>
  );
}

export default SignUp;
