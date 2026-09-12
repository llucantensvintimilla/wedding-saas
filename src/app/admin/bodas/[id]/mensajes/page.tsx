import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ocultarMensaje, aprobarMensaje, borrarMensaje } from "./actions";

export default async function MensajesAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: boda }, { data: mensajes }] = await Promise.all([
    supabase.from("bodas").select("nombre_novia, nombre_novio").eq("id", id).single(),
    supabase
      .from("mensajes")
      .select("*")
      .eq("boda_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!boda) notFound();

  return (
    <div className="p-8 max-w-2xl">
      <Link href="/admin/bodas" className="text-xs text-black/40">
        ← Volver a bodas
      </Link>
      <h1 className="text-xl font-medium mt-2 mb-6">
        Libro de firmas — {boda.nombre_novia} &amp; {boda.nombre_novio}
      </h1>

      <div className="divide-y divide-black/10 border border-black/10 rounded-xl overflow-hidden">
        {mensajes?.length ? (
          mensajes.map((m) => (
            <div key={m.id} className="p-4 text-sm">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium">{m.nombre_autor}</p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    m.estado === "aprobado"
                      ? "bg-green-50 text-green-700"
                      : m.estado === "oculto"
                      ? "bg-black/5 text-black/50"
                      : "bg-yellow-50 text-yellow-700"
                  }`}
                >
                  {m.estado}
                </span>
              </div>
              <p className="text-black/60 italic mb-2">&quot;{m.mensaje}&quot;</p>
              <div className="flex gap-2">
                {m.estado !== "aprobado" && (
                  <form action={aprobarMensaje.bind(null, id, m.id)}>
                    <button className="text-xs bg-green-50 text-green-700 rounded px-2 py-0.5">
                      Aprobar
                    </button>
                  </form>
                )}
                {m.estado !== "oculto" && (
                  <form action={ocultarMensaje.bind(null, id, m.id)}>
                    <button className="text-xs bg-black/5 rounded px-2 py-0.5">
                      Ocultar
                    </button>
                  </form>
                )}
                <form action={borrarMensaje.bind(null, id, m.id)}>
                  <button className="text-xs bg-red-50 text-red-600 rounded px-2 py-0.5">
                    Eliminar
                  </button>
                </form>
              </div>
            </div>
          ))
        ) : (
          <p className="p-4 text-sm text-black/50">Aún no hay mensajes.</p>
        )}
      </div>
    </div>
  );
}
