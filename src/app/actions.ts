"use server";

import { createClient } from "@/lib/supabase/server";

export async function registrarInteres(formData: FormData) {
  const email = formData.get("email") as string;
  const nombre_pareja = (formData.get("nombre_pareja") as string) || null;

  if (!email) return { ok: false };

  const supabase = await createClient();
  const { error } = await supabase.from("leads").insert({ email, nombre_pareja });

  if (error) return { ok: false };
  return { ok: true };
}
