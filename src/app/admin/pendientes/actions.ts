"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { enviarEmailAccesoNovios } from "@/lib/email";
import { revalidatePath } from "next/cache";

export async function enviarAhora(bodaId: string) {
  const admin = createAdminClient();

  const { data: boda } = await admin
    .from("bodas")
    .select("nombre_novia, nombre_novio, acceso_email, acceso_enlace")
    .eq("id", bodaId)
    .single();

  if (!boda?.acceso_email || !boda.acceso_enlace) {
    return { ok: false as const, error: "No hay un acceso pendiente para esta boda." };
  }

  const resultado = await enviarEmailAccesoNovios({
    to: boda.acceso_email,
    nombrePareja: `${boda.nombre_novia} & ${boda.nombre_novio}`,
    enlace: boda.acceso_enlace,
  });

  if (!resultado.ok) {
    return { ok: false as const, error: "Resend no pudo enviarlo. Revisa RESEND_API_KEY." };
  }

  await admin.from("bodas").update({ acceso_enviado: true, activa: true }).eq("id", bodaId);
  revalidatePath("/admin/pendientes");
  return { ok: true as const };
}
