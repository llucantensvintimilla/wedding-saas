"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function marcarContactado(leadId: string) {
  const supabase = await createClient();
  await supabase.from("leads").update({ contactado: true }).eq("id", leadId);
  revalidatePath("/admin/leads");
}

export async function borrarLead(leadId: string) {
  const supabase = await createClient();
  await supabase.from("leads").delete().eq("id", leadId);
  revalidatePath("/admin/leads");
}
