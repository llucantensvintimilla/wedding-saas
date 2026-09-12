"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signOutAfiliado() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/afiliado/login");
}
