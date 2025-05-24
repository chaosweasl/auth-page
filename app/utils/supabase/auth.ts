import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function handleSignUp(
  username: string,
  email: string,
  password: string
) {
  if (!username || !email || !password) {
    return "Please fill in all fields";
  }

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    return "Please enter a valid email";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }

  if (username.length < 3) {
    return "Username must be at least 3 characters long";
  }

  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: { username },
    },
  });

  if (signUpError) {
    console.error("Sign up error:", signUpError.message);
    return signUpError.message;
  }

  console.log("Sign up successful:", { email, username });
  return null; // Success - no error
}

export async function handleSignIn(email: string, password: string) {
  if (!email || !password) {
    return "Please fill in all fields";
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Sign in error:", error.message);
    return error.message;
  }

  console.log("Sign in successful:", { email, userId: data.user?.id });
  return null; // Success - no error
}

export async function handleSignOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Sign out error:", error.message);
    return error.message;
  }
  console.log("Sign out successful");
  return null;
}

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) {
    console.error("Get current user error:", error.message);
    return null;
  }
  if (user) {
    console.log("Current user retrieved:", {
      email: user.email,
      userId: user.id,
    });
  }
  return user;
}
