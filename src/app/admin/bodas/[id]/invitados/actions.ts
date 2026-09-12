"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function anadirInvitado(bodaId: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("invitados").insert({
    boda_id: bodaId,
    nombre_completo: formData.get("nombre_completo") as string,
    email: (formData.get("email") as string) || null,
    telefono: (formData.get("telefono") as string) || null,
    grupo: (formData.get("grupo") as string) || null,
    num_acompanantes_permitidos: Number(
      formData.get("num_acompanantes_permitidos") || 0
    ),
  });

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/bodas/${bodaId}/invitados`);
  revalidatePath(`/panel/invitados`);
}

export async function borrarInvitado(bodaId: string, invitadoId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("invitados")
    .delete()
    .eq("id", invitadoId);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/bodas/${bodaId}/invitados`);
  revalidatePath(`/panel/invitados`);
}
