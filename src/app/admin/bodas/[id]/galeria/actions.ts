"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/** Convierte una URL pública de Storage de vuelta a la ruta interna
 *  del archivo, para poder borrarlo del propio Storage. */
function rutaDesdeUrl(url: string): string | null {
  const marcador = "/storage/v1/object/public/bodas/";
  const i = url.indexOf(marcador);
  if (i === -1) return null;
  return url.slice(i + marcador.length);
}

export async function subirFotoOficial(bodaId: string, formData: FormData) {
  const supabase = await createClient();
  const file = formData.get("file") as File;
  if (!file || file.size === 0) return;

  const nombreArchivo = `${crypto.randomUUID()}-${file.name}`;
  const ruta = `${bodaId}/oficial/${nombreArchivo}`;

  const { error: uploadError } = await supabase.storage
    .from("bodas")
    .upload(ruta, file);
  if (uploadError) throw new Error(uploadError.message);

  const { data: urlData } = supabase.storage.from("bodas").getPublicUrl(ruta);

  const { error: insertError } = await supabase.from("galeria_oficial").insert({
    boda_id: bodaId,
    url: urlData.publicUrl,
  });
  if (insertError) throw new Error(insertError.message);

  revalidatePath(`/admin/bodas/${bodaId}/galeria`);
  revalidatePath(`/panel/galeria`);
}

export async function borrarFotoOficial(
  bodaId: string,
  fotoId: string,
  url: string
) {
  const supabase = await createClient();
  const ruta = rutaDesdeUrl(url);
  if (ruta) await supabase.storage.from("bodas").remove([ruta]);
  await supabase.from("galeria_oficial").delete().eq("id", fotoId);
  revalidatePath(`/admin/bodas/${bodaId}/galeria`);
  revalidatePath(`/panel/galeria`);
}

export async function moderarFotoInvitado(
  bodaId: string,
  fotoId: string,
  nuevoEstado: "aprobada" | "oculta"
) {
  const supabase = await createClient();
  await supabase
    .from("fotos_invitados")
    .update({ estado: nuevoEstado })
    .eq("id", fotoId);
  revalidatePath(`/admin/bodas/${bodaId}/galeria`);
  revalidatePath(`/panel/galeria`);
}

export async function borrarFotoInvitado(
  bodaId: string,
  fotoId: string,
  url: string
) {
  const supabase = await createClient();
  const ruta = rutaDesdeUrl(url);
  if (ruta) await supabase.storage.from("bodas").remove([ruta]);
  await supabase.from("fotos_invitados").delete().eq("id", fotoId);
  revalidatePath(`/admin/bodas/${bodaId}/galeria`);
  revalidatePath(`/panel/galeria`);
}
