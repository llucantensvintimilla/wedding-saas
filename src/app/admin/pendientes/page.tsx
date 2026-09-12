import { createClient } from "@/lib/supabase/server";
import { EnviarAhoraBoton } from "./EnviarAhoraBoton";
import { CopiarEnlace } from "./CopiarEnlace";

export default async function PendientesPage() {
  const supabase = await createClient();
  const { data: bodas } = await supabase
    .from("bodas")
    .select("id, nombre_novia, nombre_novio, acceso_email, acceso_enlace, acceso_programado_en, acceso_enviado")
    .not("acceso_enlace", "is", null)
    .order("acceso_programado_en", { ascending: true });

  const pendientes = bodas?.filter((b) => !b.acceso_enviado) ?? [];
  const enviados = bodas?.filter((b) => b.acceso_enviado) ?? [];

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-xl font-medium mb-1">Scheduled Access</h1>
      <p className="text-sm text-black/50 mb-6">
        In local development (npm run dev), no cron jobs are running, so these
        won't be sent automatically until you deploy to Vercel. In the meantime,
        you can trigger them manually here, or copy the access link directly.
      </p>

      <h2 className="text-sm font-medium mb-3">
        Pending ({pendientes.length})
      </h2>
      <div className="divide-y divide-black/10 border border-black/10 rounded-xl overflow-hidden mb-8">
        {pendientes.length ? (
          pendientes.map((b) => (
            <div key={b.id} className="p-4 flex items-center justify-between text-sm">
              <div>
                <p className="font-medium">{b.nombre_novia} &amp; {b.nombre_novio}</p>
                <p className="text-xs text-black/50">
                  {b.acceso_email} · scheduled for{" "}
                  {b.acceso_programado_en
                    ? new Date(b.acceso_programado_en).toLocaleString("en-US")
                    : "?"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CopiarEnlace enlace={b.acceso_enlace!} />
                <EnviarAhoraBoton bodaId={b.id} />
              </div>
            </div>
          ))
        ) : (
          <p className="p-4 text-sm text-black/50">Nothing pending right now.</p>
        )}
      </div>

      <h2 className="text-sm font-medium mb-3">Already Sent ({enviados.length})</h2>
      <div className="divide-y divide-black/10 border border-black/10 rounded-xl overflow-hidden">
        {enviados.map((b) => (
          <div key={b.id} className="p-4 text-sm text-black/50">
            {b.nombre_novia} &amp; {b.nombre_novio} — {b.acceso_email}
          </div>
        ))}
      </div>
    </div>
  );
}
