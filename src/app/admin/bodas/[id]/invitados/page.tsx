import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { anadirInvitado, borrarInvitado } from "./actions";

export default async function InvitadosPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: boda }, { data: invitados }] = await Promise.all([
    supabase.from("bodas").select("nombre_novia, nombre_novio").eq("id", id).single(),
    supabase
      .from("invitados")
      .select("id, nombre_completo, grupo, num_acompanantes_permitidos")
      .eq("boda_id", id)
      .order("nombre_completo"),
  ]);

  if (!boda) notFound();

  const anadirConId = anadirInvitado.bind(null, id);

  return (
    <div className="p-8 max-w-3xl">
      <Link href="/admin/bodas" className="text-xs text-black/40">
        ← Volver a bodas
      </Link>
      <h1 className="text-xl font-medium mt-2 mb-1">
        Invitados — {boda.nombre_novia} &amp; {boda.nombre_novio}
      </h1>
      <p className="text-sm text-black/50 mb-6">
        {invitados?.length ?? 0} invitados en la lista
      </p>

      <form
        action={anadirConId}
        className="grid grid-cols-2 gap-3 mb-8 p-4 border border-black/10 rounded-xl"
      >
        <input
          name="nombre_completo"
          placeholder="Nombre completo"
          required
          className="col-span-2 rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
        <input
          name="email"
          placeholder="Email (opcional)"
          className="rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
        <input
          name="telefono"
          placeholder="Teléfono (opcional)"
          className="rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
        <input
          name="grupo"
          placeholder="Grupo (ej: familia novia)"
          className="rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
        <input
          name="num_acompanantes_permitidos"
          type="number"
          min={0}
          defaultValue={0}
          placeholder="Acompañantes permitidos"
          className="rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="col-span-2 rounded-lg bg-black text-white py-2 text-sm font-medium"
        >
          + Añadir invitado
        </button>
      </form>

      <div className="divide-y divide-black/10 border border-black/10 rounded-xl overflow-hidden">
        {invitados?.length ? (
          invitados.map((inv) => (
            <div
              key={inv.id}
              className="p-3 flex items-center justify-between text-sm"
            >
              <div>
                <p className="font-medium">{inv.nombre_completo}</p>
                <p className="text-xs text-black/40">
                  {inv.grupo ?? "sin grupo"} · +{inv.num_acompanantes_permitidos}{" "}
                  acompañantes
                </p>
              </div>
              <form action={borrarInvitado.bind(null, id, inv.id)}>
                <button className="text-xs text-red-500">Eliminar</button>
              </form>
            </div>
          ))
        ) : (
          <p className="p-4 text-sm text-black/50">
            Aún no hay invitados. Añade el primero arriba.
          </p>
        )}
      </div>
    </div>
  );
}
