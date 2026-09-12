import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ConfirmacionesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: boda }, { data: rsvps }] = await Promise.all([
    supabase.from("bodas").select("nombre_novia, nombre_novio").eq("id", id).single(),
    supabase
      .from("rsvp")
      .select("id, asistira, num_asistentes_confirmados, menu_elegido, alergias, mensaje, invitados(nombre_completo)")
      .eq("boda_id", id)
      .order("respondido_en", { ascending: false }),
  ]);

  if (!boda) notFound();

  const totalAsistentes = (rsvps ?? [])
    .filter((r) => r.asistira)
    .reduce((acc, r) => acc + r.num_asistentes_confirmados, 0);

  return (
    <div className="p-8 max-w-3xl">
      <Link href="/admin/bodas" className="text-xs text-black/40">
        ← Volver a bodas
      </Link>
      <div className="flex items-center justify-between mt-2 mb-1">
        <h1 className="text-xl font-medium">
          Confirmaciones — {boda.nombre_novia} &amp; {boda.nombre_novio}
        </h1>
        <a
          href={`/admin/bodas/${id}/confirmaciones/exportar`}
          className="text-sm bg-black text-white rounded-lg px-4 py-2"
        >
          Descargar CSV
        </a>
      </div>
      <p className="text-sm text-black/50 mb-6">
        {rsvps?.length ?? 0} respuestas · {totalAsistentes} asistentes confirmados
      </p>

      <div className="divide-y divide-black/10 border border-black/10 rounded-xl overflow-hidden">
        {rsvps?.length ? (
          rsvps.map((r) => (
            <div key={r.id} className="p-4 text-sm">
              <div className="flex items-center justify-between">
                <p className="font-medium">
                  {/* @ts-expect-error -- el join siempre devuelve un único invitado */}
                  {r.invitados?.nombre_completo}
                </p>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    r.asistira
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {r.asistira
                    ? `Asiste (${r.num_asistentes_confirmados})`
                    : "No asiste"}
                </span>
              </div>
              {r.menu_elegido && (
                <p className="text-xs text-black/50 mt-1">Menú: {r.menu_elegido}</p>
              )}
              {r.alergias && (
                <p className="text-xs text-black/50">Alergias: {r.alergias}</p>
              )}
              {r.mensaje && (
                <p className="text-xs text-black/60 italic mt-1">
                  &quot;{r.mensaje}&quot;
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="p-4 text-sm text-black/50">
            Todavía no hay confirmaciones.
          </p>
        )}
      </div>
    </div>
  );
}
