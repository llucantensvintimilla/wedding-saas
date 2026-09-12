import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: rsvps } = await supabase
    .from("rsvp")
    .select("asistira, num_asistentes_confirmados, menu_elegido, alergias, mensaje, invitados(nombre_completo)")
    .eq("boda_id", id);

  const filas = (rsvps ?? []).map((r) => {
    // @ts-expect-error -- el join siempre devuelve un único invitado, no un array
    const nombre = r.invitados?.nombre_completo ?? "";
    return [
      nombre,
      r.asistira ? "Sí" : "No",
      r.num_asistentes_confirmados,
      r.menu_elegido ?? "",
      r.alergias ?? "",
      (r.mensaje ?? "").replace(/\n/g, " "),
    ];
  });

  const cabecera = ["Nombre", "Asiste", "Nº asistentes", "Menú", "Alergias", "Mensaje"];
  const csv = [cabecera, ...filas]
    .map((fila) => fila.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="confirmaciones.csv"`,
    },
  });
}
