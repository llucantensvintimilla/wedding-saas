"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function verificarAcceso(
  slug: string,
  password: string
): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const { data: boda } = await supabase
    .from("bodas")
    .select("password_acceso")
    .eq("slug", slug)
    .eq("activa", true)
    .single();

  // Si la boda no tiene contraseña configurada, o coincide con la
  // introducida, dejamos pasar y recordamos el acceso en una cookie
  // durante 30 días para no pedirla en cada visita.
  if (!boda?.password_acceso || boda.password_acceso === password) {
    const cookieStore = await cookies();
    cookieStore.set(`acceso_${slug}`, "ok", {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });
    return { ok: true };
  }

  return { ok: false };
}
