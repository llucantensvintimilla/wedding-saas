"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { enviarEmailAccesoNovios } from "@/lib/email";
import { revalidatePath } from "next/cache";

export async function invitarNovios(bodaId: string, formData: FormData) {
  const email = formData.get("email") as string;
  if (!email) return { ok: false as const, error: "Falta el email" };

  const admin = createAdminClient();

  // generateLink crea el usuario Y nos devuelve el enlace de acceso
  // directamente a nosotros, en vez de confiar en que el servicio de
  // email incluido en Supabase (pensado solo para pruebas, con un
  // límite muy bajo de envíos) lo entregue. Así tú decides cómo se
  // lo haces llegar a los novios — email, WhatsApp, lo que sea — y
  // nunca depende de un envío que puede fallar en silencio.
  const { data, error } = await admin.auth.admin.generateLink({
    type: "invite",
    email,
  });

  if (error || !data.user) {
    return { ok: false as const, error: error?.message ?? "No se pudo crear el acceso." };
  }

  const { error: perfilError } = await admin.from("perfiles").insert({
    id: data.user.id,
    rol: "novios",
    boda_id: bodaId,
  });

  if (perfilError) {
    return { ok: false as const, error: perfilError.message };
  }

  revalidatePath(`/admin/bodas/${bodaId}/editar`);

  const supabase = await createClient();
  const { data: boda } = await supabase
    .from("bodas")
    .select("nombre_novia, nombre_novio")
    .eq("id", bodaId)
    .single();

  await enviarEmailAccesoNovios({
    to: email,
    nombrePareja: boda ? `${boda.nombre_novia} & ${boda.nombre_novio}` : "",
    enlace: data.properties.action_link,
  });

  return { ok: true as const, enlace: data.properties.action_link };
}
