"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { enviarEmailAccesoAfiliado } from "@/lib/email";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function crearColaborador(formData: FormData) {
  const supabase = await createClient();

  const nombre = formData.get("nombre") as string;
  const tipo = formData.get("tipo") as string;
  const email_contacto = formData.get("email_contacto") as string;

  const { error } = await supabase.from("colaboradores").insert({
    nombre,
    tipo,
    email_contacto: email_contacto || null,
  });

  if (error) {
    // En un formulario real mostraríamos este error en la UI.
    // Lo lanzamos para que sea visible durante el desarrollo.
    throw new Error(error.message);
  }

  revalidatePath("/admin/colaboradores");
  redirect("/admin/colaboradores");
}

export async function invitarAfiliado(colaboradorId: string, formData: FormData) {
  const email = formData.get("email") as string;
  const codigoReferido = (formData.get("codigo_referido") as string)
    .trim()
    .toUpperCase();

  if (!email || !codigoReferido) {
    return { ok: false as const, error: "Faltan datos" };
  }

  const supabase = await createClient();

  // Guardamos el código de referido en el propio colaborador antes
  // de crear la cuenta, así si algo falla después no queda un
  // colaborador con acceso pero sin código.
  const { error: codigoError } = await supabase
    .from("colaboradores")
    .update({ codigo_referido: codigoReferido })
    .eq("id", colaboradorId);
  if (codigoError) return { ok: false as const, error: codigoError.message };

  const admin = createAdminClient();

  // generateLink (en vez de inviteUserByEmail): crea el usuario y nos
  // devuelve el enlace a nosotros, sin depender del servicio de email
  // de pruebas incluido en Supabase.
  const { data, error } = await admin.auth.admin.generateLink({
    type: "invite",
    email,
  });
  if (error || !data.user) {
    return { ok: false as const, error: error?.message ?? "No se pudo crear el acceso." };
  }

  const { error: perfilError } = await admin.from("perfiles").insert({
    id: data.user.id,
    rol: "afiliado",
    colaborador_id: colaboradorId,
  });
  if (perfilError) return { ok: false as const, error: perfilError.message };

  revalidatePath("/admin/colaboradores");

  const { data: colaborador } = await supabase
    .from("colaboradores")
    .select("nombre")
    .eq("id", colaboradorId)
    .single();

  await enviarEmailAccesoAfiliado({
    to: email,
    nombre: colaborador?.nombre ?? "",
    enlace: data.properties.action_link,
  });

  return { ok: true as const, enlace: data.properties.action_link };
}

export async function borrarColaborador(colaboradorId: string) {
  const supabase = await createClient();
  await supabase.from("colaboradores").delete().eq("id", colaboradorId);
  revalidatePath("/admin/colaboradores");
}
