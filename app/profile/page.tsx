import { createClient } from "@supabase/supabase-js";
import React from "react";

export default async function Profile() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: user } = await supabase.auth.getUser();

  console.log(user);

  return <div>Profile</div>;
}
