"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function crearBoda(formData: FormData) {
  const supabase = createAdminClient();

  const slug = formData.get("slug") as string;
  const nombre_novia = formData.get("nombre_novia") as string;
  const nombre_novio = formData.get("nombre_novio") as string;
  const fecha_boda = formData.get("fecha_boda") as string;
  const colaborador_id = formData.get("colaborador_id") as string;

  const { error } = await supabase.from("bodas").insert({
    slug,
    nombre_novia,
    nombre_novio,
    fecha_boda: fecha_boda || null,
    colaborador_id: colaborador_id || null,
  });

  if (error) {
    if (error.code === "23505") {
      throw new Error(
        `Ya existe una boda con el enlace "${slug}". Elige uno diferente.`
      );
    }
    throw new Error(error.message);
  }

  revalidatePath("/admin/bodas");
  redirect("/admin/bodas");
}

export async function actualizarBoda(id: string, formData: FormData) {
  const supabase = createAdminClient();

  const paletaDresscode = formData
    .getAll("paleta_dresscode")
    .map((v) => v as string)
    .filter(Boolean);

  const clavesTitulo = [
    "historia",
    "cronograma",
    "ubicacion",
    "dresscode",
    "galeria",
    "regalos",
    "rsvp",
    "faqs",
    "mensajes",
  ];
  const titulos: Record<string, string> = {};
  for (const clave of clavesTitulo) {
    const valor = formData.get(`titulo_${clave}`) as string;
    if (valor) titulos[clave] = valor;
  }

  const configuracion = {
    color_primario: formData.get("color_primario") as string,
    color_secundario: formData.get("color_secundario") as string,
    color_acento: formData.get("color_acento") as string,
    color_fondo: formData.get("color_fondo") as string,
    tipografia: formData.get("tipografia") as string,
    forma: formData.get("forma") as string,
    hero_overlay: formData.get("hero_overlay") as string,
    estilo_separador: formData.get("estilo_separador") as string,
    paleta_dresscode: paletaDresscode,
    titulos,
    secciones_visibles: {
      historia: formData.get("mostrar_historia") === "on",
      ubicacion: formData.get("mostrar_ubicacion") === "on",
      dresscode: formData.get("mostrar_dresscode") === "on",
      galeria: formData.get("mostrar_galeria") === "on",
      rsvp: formData.get("mostrar_rsvp") === "on",
      mensajes: formData.get("mostrar_mensajes") === "on",
    },
  };

  const { error } = await supabase
    .from("bodas")
    .update({
      nombre_novia: formData.get("nombre_novia") as string,
      nombre_novio: formData.get("nombre_novio") as string,
      fecha_boda: (formData.get("fecha_boda") as string) || null,
      colaborador_id: (formData.get("colaborador_id") as string) || null,
      historia_pareja: formData.get("historia_pareja") as string,
      foto_secundaria_url: (formData.get("foto_secundaria_url") as string) || null,
      imagen_portada_url: formData.get("imagen_portada_url") as string,
      ubicacion_ceremonia: formData.get("ubicacion_ceremonia") as string,
      ubicacion_celebracion: formData.get("ubicacion_celebracion") as string,
      lat: formData.get("lat") ? Number(formData.get("lat")) : null,
      lng: formData.get("lng") ? Number(formData.get("lng")) : null,
      dress_code: formData.get("dress_code") as string,
      spotify_playlist_url: formData.get("spotify_playlist_url") as string,
      bizum_numero: formData.get("bizum_numero") as string,
      datos_transferencia: formData.get("datos_transferencia") as string,
      password_acceso: (formData.get("password_acceso") as string) || null,
      activa: formData.get("activa") === "on",
      configuracion,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/bodas");
  revalidatePath(`/admin/bodas/${id}/editar`);
}

export async function registrarVenta(bodaId: string, formData: FormData) {
  const supabase = createAdminClient();

  const colaborador_id = (formData.get("colaborador_id") as string) || null;
  const importe = Number(formData.get("importe"));
  const comision = Number(formData.get("comision") || 300);

  const { error } = await supabase.from("ventas").insert({
    boda_id: bodaId,
    colaborador_id,
    importe,
    comision,
  });

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/bodas/${bodaId}/editar`);
}

export async function marcarComisionPagada(bodaId: string, ventaId: string) {
  const supabase = createAdminClient();
  await supabase.from("ventas").update({ comision_pagada: true }).eq("id", ventaId);
  revalidatePath(`/admin/bodas/${bodaId}/editar`);
}
