import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function BodasPage() {
  const supabase = await createClient();
  const { data: bodas } = await supabase
    .from("bodas")
    .select("id, slug, nombre_novia, nombre_novio, fecha_boda, activa, colaboradores(nombre)")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium">Weddings</h1>
        <Link
          href="/admin/bodas/nueva"
          className="text-sm bg-black text-white rounded-lg px-4 py-2"
        >
          + New Wedding
        </Link>
      </div>

      <div className="divide-y divide-black/10 border border-black/10 rounded-xl overflow-hidden">
        {bodas?.length ? (
          bodas.map((b) => (
            <div
              key={b.id}
              className="p-4 flex items-center justify-between hover:bg-black/[0.02] transition-colors"
            >
              <Link href={`/admin/bodas/${b.id}/editar`} className="flex-1">
                <p className="text-sm font-medium">
                  {b.nombre_novia} &amp; {b.nombre_novio}
                </p>
                <p className="text-xs text-black/50">
                  /{b.slug} · {b.fecha_boda ?? "no date"}
                  {/* @ts-expect-error -- Supabase infiere el join como array, aquí siempre es un único colaborador */}
                  {b.colaboradores?.nombre && ` · ${b.colaboradores.nombre}`}
                </p>
              </Link>
              <div className="flex items-center gap-3">
                <Link
                  href={`/admin/bodas/${b.id}/contenido`}
                  className="text-xs text-black/50 hover:text-black"
                >
                  Content
                </Link>
                <Link
                  href={`/admin/bodas/${b.id}/galeria`}
                  className="text-xs text-black/50 hover:text-black"
                >
                  Gallery
                </Link>
                <Link
                  href={`/admin/bodas/${b.id}/mensajes`}
                  className="text-xs text-black/50 hover:text-black"
                >
                  Guestbook
                </Link>
                <Link
                  href={`/admin/bodas/${b.id}/invitados`}
                  className="text-xs text-black/50 hover:text-black"
                >
                  Guests
                </Link>
                <Link
                  href={`/admin/bodas/${b.id}/confirmaciones`}
                  className="text-xs text-black/50 hover:text-black"
                >
                  Confirmations
                </Link>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    b.activa
                      ? "bg-green-50 text-green-700"
                      : "bg-black/5 text-black/50"
                  }`}
                >
                  {b.activa ? "active" : "inactive"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="p-4 text-sm text-black/50">
            No weddings found. Create the first one.
          </p>
        )}
      </div>
    </div>
  );
}
