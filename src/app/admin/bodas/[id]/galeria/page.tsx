import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  subirFotoOficial,
  borrarFotoOficial,
  moderarFotoInvitado,
  borrarFotoInvitado,
} from "./actions";

export default async function GaleriaAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: boda }, { data: oficiales }, { data: deInvitados }] =
    await Promise.all([
      supabase.from("bodas").select("nombre_novia, nombre_novio").eq("id", id).single(),
      supabase.from("galeria_oficial").select("*").eq("boda_id", id).order("orden"),
      supabase
        .from("fotos_invitados")
        .select("*")
        .eq("boda_id", id)
        .order("created_at", { ascending: false }),
    ]);

  if (!boda) notFound();

  const pendientes = deInvitados?.filter((f) => f.estado === "pendiente") ?? [];
  const resto = deInvitados?.filter((f) => f.estado !== "pendiente") ?? [];

  return (
    <div className="p-8 max-w-3xl space-y-12">
      <div>
        <Link href="/admin/bodas" className="text-xs text-black/40">
          ← Volver a bodas
        </Link>
        <h1 className="text-xl font-medium mt-2">
          Galería — {boda.nombre_novia} &amp; {boda.nombre_novio}
        </h1>
      </div>

      {/* FOTOS OFICIALES */}
      <section>
        <h2 className="text-sm font-medium mb-3">Fotos oficiales</h2>
        <form action={subirFotoOficial.bind(null, id)} className="mb-4">
          <input
            type="file"
            name="file"
            accept="image/*"
            required
            className="text-sm"
          />
          <button className="ml-2 rounded-lg bg-black text-white px-3 py-1.5 text-sm">
            Subir
          </button>
        </form>
        <div className="grid grid-cols-4 gap-2">
          {oficiales?.map((f) => (
            // eslint-disable-next-line @next/next/no-img-element -- vista previa simple en el panel, no necesita optimización de next/image
            <div key={f.id} className="relative group">
              <img
                src={f.url}
                alt=""
                className="aspect-square w-full object-cover rounded-lg"
              />
              <form
                action={borrarFotoOficial.bind(null, id, f.id, f.url)}
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <button className="bg-black/70 text-white text-xs rounded px-2 py-0.5">
                  Eliminar
                </button>
              </form>
            </div>
          ))}
        </div>
      </section>

      {/* MODERACIÓN DE INVITADOS */}
      <section>
        <h2 className="text-sm font-medium mb-3">
          Pendientes de aprobar ({pendientes.length})
        </h2>
        <div className="grid grid-cols-4 gap-2 mb-8">
          {pendientes.map((f) => (
            // eslint-disable-next-line @next/next/no-img-element -- vista previa simple en el panel
            <div key={f.id} className="space-y-1">
              <img
                src={f.url}
                alt=""
                className="aspect-square w-full object-cover rounded-lg"
              />
              {f.nombre_subido_por && (
                <p className="text-[10px] text-black/40 truncate">
                  {f.nombre_subido_por}
                </p>
              )}
              <div className="flex gap-1">
                <form action={moderarFotoInvitado.bind(null, id, f.id, "aprobada")}>
                  <button className="text-xs bg-green-50 text-green-700 rounded px-2 py-0.5">
                    Aprobar
                  </button>
                </form>
                <form action={borrarFotoInvitado.bind(null, id, f.id, f.url)}>
                  <button className="text-xs bg-red-50 text-red-600 rounded px-2 py-0.5">
                    Eliminar
                  </button>
                </form>
              </div>
            </div>
          ))}
          {pendientes.length === 0 && (
            <p className="text-xs text-black/40 col-span-4">
              No hay fotos pendientes de revisar.
            </p>
          )}
        </div>

        <h2 className="text-sm font-medium mb-3">Resto de fotos de invitados</h2>
        <div className="grid grid-cols-4 gap-2">
          {resto.map((f) => (
            // eslint-disable-next-line @next/next/no-img-element -- vista previa simple en el panel
            <div key={f.id} className="space-y-1">
              <img
                src={f.url}
                alt=""
                className="aspect-square w-full object-cover rounded-lg opacity-90"
              />
              <div className="flex gap-1">
                {f.estado === "aprobada" ? (
                  <form action={moderarFotoInvitado.bind(null, id, f.id, "oculta")}>
                    <button className="text-xs bg-black/5 rounded px-2 py-0.5">
                      Ocultar
                    </button>
                  </form>
                ) : (
                  <form action={moderarFotoInvitado.bind(null, id, f.id, "aprobada")}>
                    <button className="text-xs bg-green-50 text-green-700 rounded px-2 py-0.5">
                      Aprobar
                    </button>
                  </form>
                )}
                <form action={borrarFotoInvitado.bind(null, id, f.id, f.url)}>
                  <button className="text-xs bg-red-50 text-red-600 rounded px-2 py-0.5">
                    Eliminar
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
