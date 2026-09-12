import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { InvitarAfiliado } from "./InvitarAfiliado";
import { borrarColaborador } from "./actions";

export default async function ColaboradoresPage() {
  const supabase = await createClient();
  const [{ data: colaboradores }, { data: perfiles }] = await Promise.all([
    supabase
      .from("colaboradores")
      .select("id, nombre, tipo, email_contacto, codigo_referido")
      .order("nombre"),
    supabase.from("perfiles").select("colaborador_id").eq("rol", "afiliado"),
  ]);

  const idsConAcceso = new Set((perfiles ?? []).map((p) => p.colaborador_id));

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium">Partners</h1>
        <Link
          href="/admin/colaboradores/nuevo"
          className="text-sm bg-black text-white rounded-lg px-4 py-2"
        >
          + New Partner
        </Link>
      </div>

      <div className="divide-y divide-black/10 border border-black/10 rounded-xl overflow-hidden">
        {colaboradores?.length ? (
          colaboradores.map((c) => (
            <div key={c.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{c.nombre}</p>
                  <p className="text-xs text-black/50 capitalize">
                    {c.tipo.replace("_", " ")}
                  </p>
                </div>
                <p className="text-xs text-black/50">{c.email_contacto}</p>
                <form action={borrarColaborador.bind(null, c.id)}>
                  <button className="text-xs text-red-500 mt-1">Delete</button>
                </form>
              </div>

              {idsConAcceso.has(c.id) ? (
                <p className="text-xs text-green-700 mt-2">
                  ✓ Affiliate access active · code {c.codigo_referido}
                </p>
              ) : (
                <InvitarAfiliado
                  colaboradorId={c.id}
                  codigoSugerido={c.nombre.split(" ")[0].toUpperCase()}
                />
              )}
            </div>
          ))
        ) : (
          <p className="p-4 text-sm text-black/50">
            No partners found. Create the first one.
          </p>
        )}
      </div>
    </div>
  );
}
