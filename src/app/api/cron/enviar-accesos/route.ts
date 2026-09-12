import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { enviarEmailAccesoNovios } from "@/lib/email";

/**
 * Vercel ejecuta esto periódicamente (ver vercel.json). En cada
 * pasada, busca bodas cuyo email de acceso ya tocaba enviarse (su
 * "acceso_programado_en" ya pasó) y todavía no se ha mandado.
 *
 * Protegida con un secreto propio: sin él, cualquiera podría llamar
 * a esta URL y forzar envíos. Vercel se lo pasa solo en cada
 * ejecución programada; tú lo defines una vez en las variables de
 * entorno.
 */
export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data: pendientes } = await admin
    .from("bodas")
    .select("id, nombre_novia, nombre_novio, acceso_email, acceso_enlace")
    .eq("acceso_enviado", false)
    .not("acceso_enlace", "is", null)
    .lte("acceso_programado_en", new Date().toISOString());

  let enviados = 0;

  for (const boda of pendientes ?? []) {
    if (!boda.acceso_email || !boda.acceso_enlace) continue;

    const resultado = await enviarEmailAccesoNovios({
      to: boda.acceso_email,
      nombrePareja: `${boda.nombre_novia} & ${boda.nombre_novio}`,
      enlace: boda.acceso_enlace,
    });

    if (resultado.ok) {
      await admin.from("bodas").update({ acceso_enviado: true, activa: true }).eq("id", boda.id);
      enviados++;
    }
  }

  return NextResponse.json({ revisados: pendientes?.length ?? 0, enviados });
}
