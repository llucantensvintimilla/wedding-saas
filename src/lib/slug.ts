import { createClient } from "@/lib/supabase/server";

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita acentos: "María" -> "maria"
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Genera un slug tipo "laura-alberto" y, si ya existe, le añade un
 *  número al final ("laura-alberto-2") hasta encontrar uno libre. */
export async function generarSlugUnico(
  nombreNovia: string,
  nombreNovio: string
): Promise<string> {
  const base = normalizar(`${nombreNovia}-${nombreNovio}`) || "boda";
  const supabase = await createClient();

  let candidato = base;
  let sufijo = 1;

  while (true) {
    const { data: existe } = await supabase.rpc("existe_slug", {
      p_slug: candidato,
    });

    if (!existe) return candidato;

    sufijo += 1;
    candidato = `${base}-${sufijo}`;
  }
}
