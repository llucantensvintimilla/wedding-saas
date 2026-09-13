"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function signOutNovios() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/studio/login");
}

/**
 * Updates the wedding configuration and editorial content.
 * Ensures the user is actually linked to the wedding.
 */
export async function updateWeddingContent(bodaId: string, updates: any) {
  const supabase = await createClient();

  // 1. Security check: Verify user is linked to this wedding
  const { data: perfil } = await supabase
    .from("perfiles")
    .select("boda_id")
    .eq("id", (await supabase.auth.getUser()).data.user?.id)
    .single();

  if (!perfil || perfil.boda_id !== bodaId) {
    throw new Error("Unauthorized: You do not have permission to edit this wedding.");
  }

  // 2. Perform update
  const { error } = await supabase
    .from("bodas")
    .update(updates)
    .eq("id", bodaId);

  if (error) throw error;

  revalidatePath(`/${(await supabase.from("bodas").select("slug").eq("id", bodaId).single()).data?.slug}`);
  revalidatePath("/studio/editar");
}

/**
 * Moderates a guest photo.
 */
export async function moderatePhoto(photoId: string, status: "aprobada" | "oculta") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Security check: User must be linked to the wedding of the photo
  const { data: foto } = await supabase
    .from("fotos_invitados")
    .select("boda_id")
    .eq("id", photoId)
    .single();

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("boda_id")
    .eq("id", user?.id)
    .single();

  if (!perfil || !foto || perfil.boda_id !== foto.boda_id) {
    throw new Error("Unauthorized to moderate this photo.");
  }

  const { error } = await supabase
    .from("fotos_invitados")
    .update({ estado: status })
    .eq("id", photoId);

  if (error) throw error;

  revalidatePath("/studio/galeria");
}

/**
 * Deletes a guest photo.
 */
export async function deleteGuestPhoto(photoId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: foto } = await supabase
    .from("fotos_invitados")
    .select("boda_id")
    .eq("id", photoId)
    .single();

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("boda_id")
    .eq("id", user?.id)
    .single();

  if (!perfil || !foto || perfil.boda_id !== foto.boda_id) {
    throw new Error("Unauthorized to delete this photo.");
  }

  // In a real app, we'd also delete the file from Supabase Storage here
  const { error } = await supabase
    .from("fotos_invitados")
    .delete()
    .eq("id", photoId);

  if (error) throw error;

  revalidatePath("/studio/galeria");
}

/**
 * Uploads an official photo to the wedding gallery.
 */
export async function uploadOfficialPhoto(bodaId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Security check
  const { data: perfil } = await supabase
    .from("perfiles")
    .select("boda_id")
    .eq("id", user?.id)
    .single();

  if (!perfil || perfil.boda_id !== bodaId) {
    throw new Error("Unauthorized to upload photos for this wedding.");
  }

  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided.");

  const fileName = `${Date.now()}-${file.name}`;
  const filePath = `galeria_oficial/${bodaId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("weddings")
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage.from("weddings").getPublicUrl(filePath);

  const { error: dbError } = await supabase
    .from("galeria_oficial")
    .insert({
      boda_id: bodaId,
      url: publicUrl,
      orden: 0,
    });

  if (dbError) throw dbError;

  revalidatePath("/studio/galeria");
}

/**
 * Deletes an official photo.
 */
export async function deleteOfficialPhoto(photoId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: foto } = await supabase
    .from("galeria_oficial")
    .select("boda_id")
    .eq("id", photoId)
    .single();

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("boda_id")
    .eq("id", user?.id)
    .single();

  if (!perfil || !foto || perfil.boda_id !== foto.boda_id) {
    throw new Error("Unauthorized to delete this photo.");
  }

  const { error } = await supabase
    .from("galeria_oficial")
    .delete()
    .eq("id", photoId);

  if (error) throw error;

  revalidatePath("/studio/galeria");
}

/**
 * Moderates a guestbook message.
 */
export async function moderateMessage(messageId: string, status: "aprobado" | "oculto") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: msg } = await supabase
    .from("mensajes")
    .select("boda_id")
    .eq("id", messageId)
    .single();

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("boda_id")
    .eq("id", user?.id)
    .single();

  if (!perfil || !msg || perfil.boda_id !== msg.boda_id) {
    throw new Error("Unauthorized to moderate this message.");
  }

  const { error } = await supabase
    .from("mensajes")
    .update({ estado: status })
    .eq("id", messageId);

  if (error) throw error;

  revalidatePath("/studio/mensajes");
}

/**
 * Deletes a guestbook message.
 */
export async function deleteMessage(messageId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: msg } = await supabase
    .from("mensajes")
    .select("boda_id")
    .eq("id", messageId)
    .single();

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("boda_id")
    .eq("id", user?.id)
    .single();

  if (!perfil || !msg || perfil.boda_id !== msg.boda_id) {
    throw new Error("Unauthorized to delete this message.");
  }

  const { error } = await supabase
    .from("mensajes")
    .delete()
    .eq("id", messageId);

  if (error) throw error;

  revalidatePath("/studio/mensajes");
}

/**
 * Securely adds a guest to the wedding list.
 */
export async function addGuest(bodaId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Security check
  const { data: perfil } = await supabase
    .from("perfiles")
    .select("boda_id")
    .eq("id", user?.id)
    .single();

  if (!perfil || perfil.boda_id !== bodaId) {
    throw new Error("Unauthorized to manage guests for this wedding.");
  }

  const guestData = {
    boda_id: bodaId,
    nombre_completo: formData.get("nombre_completo"),
    email: formData.get("email"),
    telefono: formData.get("telefono"),
    grupo: formData.get("grupo"),
    num_acompanantes_permitidos: parseInt(formData.get("num_acompanantes_permitidos") as string) || 0,
  };

  const { error } = await supabase.from("invitados").insert(guestData);
  if (error) throw error;

  revalidatePath("/studio/invitados");
}

/**
 * Securely removes a guest from the wedding list.
 */
export async function removeGuest(bodaId: string, guestId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Security check
  const { data: perfil } = await supabase
    .from("perfiles")
    .select("boda_id")
    .eq("id", user?.id)
    .single();

  if (!perfil || perfil.boda_id !== bodaId) {
    throw new Error("Unauthorized to remove guests from this wedding.");
  }

  const { error } = await supabase
    .from("invitados")
    .delete()
    .eq("id", guestId)
    .eq("boda_id", bodaId);

  if (error) throw error;

  revalidatePath("/studio/invitados");
}
