"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function anadirCronograma(bodaId: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("cronograma").insert({
    boda_id: bodaId,
    hora: formData.get("hora") as string,
    titulo: formData.get("titulo") as string,
    descripcion: (formData.get("descripcion") as string) || null,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/bodas/${bodaId}/contenido`);
}

export async function borrarCronograma(bodaId: string, itemId: string) {
  const supabase = await createClient();
  await supabase.from("cronograma").delete().eq("id", itemId);
  revalidatePath(`/admin/bodas/${bodaId}/contenido`);
}

export async function anadirHotel(bodaId: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("hoteles").insert({
    boda_id: bodaId,
    nombre: formData.get("nombre") as string,
    descripcion: (formData.get("descripcion") as string) || null,
    enlace: (formData.get("enlace") as string) || null,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/bodas/${bodaId}/contenido`);
}

export async function borrarHotel(bodaId: string, itemId: string) {
  const supabase = await createClient();
  await supabase.from("hoteles").delete().eq("id", itemId);
  revalidatePath(`/admin/bodas/${bodaId}/contenido`);
}

export async function anadirTransporte(bodaId: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("transporte").insert({
    boda_id: bodaId,
    titulo: formData.get("titulo") as string,
    horario: (formData.get("horario") as string) || null,
    descripcion: (formData.get("descripcion") as string) || null,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/bodas/${bodaId}/contenido`);
}

export async function borrarTransporte(bodaId: string, itemId: string) {
  const supabase = await createClient();
  await supabase.from("transporte").delete().eq("id", itemId);
  revalidatePath(`/admin/bodas/${bodaId}/contenido`);
}

export async function anadirRegalo(bodaId: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("regalos").insert({
    boda_id: bodaId,
    titulo: formData.get("titulo") as string,
    descripcion: (formData.get("descripcion") as string) || null,
    enlace_externo: (formData.get("enlace_externo") as string) || null,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/bodas/${bodaId}/contenido`);
}

export async function borrarRegalo(bodaId: string, itemId: string) {
  const supabase = await createClient();
  await supabase.from("regalos").delete().eq("id", itemId);
  revalidatePath(`/admin/bodas/${bodaId}/contenido`);
}

export async function anadirFaq(bodaId: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("faqs").insert({
    boda_id: bodaId,
    pregunta: formData.get("pregunta") as string,
    respuesta: formData.get("respuesta") as string,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/bodas/${bodaId}/contenido`);
}

export async function borrarFaq(bodaId: string, itemId: string) {
  const supabase = await createClient();
  await supabase.from("faqs").delete().eq("id", itemId);
  revalidatePath(`/admin/bodas/${bodaId}/contenido`);
}
