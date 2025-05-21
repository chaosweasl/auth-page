import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function handleSignUp(
  username: string,
  email: string,
  password: string,
  error: string
) {
  if (!username || !email || !password) {
    error = "Please fill in all fields";
    return error;
  }

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!regex.test(email)) {
    error = "Please enter a valid email";
    return error;
  }

  if (password.length < 8) {
    error = "Password must be at least 8 characters long";
    return error;
  }

  if (username.length < 3) {
    error = "Username must be at least 3 characters long";
    return error;
  }

  //passed all checks
  //create user in supabase
  //redirect to home page

  const { data, error: signUpError } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      emailRedirectTo: "http://localhost:3000/",
      data: { username },
    },
  });

  if (signUpError) {
    return signUpError.message;
  }

  // For browser-based redirects - only works if this function is called from a client component
  if (typeof window !== "undefined") {
    window.location.href = "/verification";
  }

  return null; // Success - no error
}

export async function handleSignIn(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      emailRedirectTo: "http://localhost:3000/",
    },
  });

  if (error) {
    return error.message;
  }

  return null;
}

export function handleSignOut() {}
