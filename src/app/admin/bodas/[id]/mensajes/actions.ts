"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function ocultarMensaje(bodaId: string, mensajeId: string) {
  const supabase = await createClient();
  await supabase.from("mensajes").update({ estado: "oculto" }).eq("id", mensajeId);
  revalidatePath(`/admin/bodas/${bodaId}/mensajes`);
  revalidatePath(`/panel/mensajes`);
}

export async function aprobarMensaje(bodaId: string, mensajeId: string) {
  const supabase = await createClient();
  await supabase.from("mensajes").update({ estado: "aprobado" }).eq("id", mensajeId);
  revalidatePath(`/admin/bodas/${bodaId}/mensajes`);
  revalidatePath(`/panel/mensajes`);
}

export async function borrarMensaje(bodaId: string, mensajeId: string) {
  const supabase = await createClient();
  await supabase.from("mensajes").delete().eq("id", mensajeId);
  revalidatePath(`/admin/bodas/${bodaId}/mensajes`);
  revalidatePath(`/panel/mensajes`);
}
