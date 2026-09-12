import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ConfirmacionesPanelPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("boda_id")
    .eq("id", user.id)
    .single();

  if (!perfil || !perfil.boda_id) notFound();
  const bodaId = perfil.boda_id;

  const { data: rsvps } = await supabase
    .from("rsvp")
    .select("id, asistira, num_asistentes_confirmados, menu_elegido, alergias, mensaje, invitados(nombre_completo)")
    .eq("boda_id", bodaId)
    .order("respondido_en", { ascending: false });

  const totalAsistentes = (rsvps ?? [])
    .filter((r) => r.asistira)
    .reduce((acc, r) => acc + r.num_asistentes_confirmados, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-8">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <Link href="/studio" className="text-xs text-black/40 hover:text-black transition-colors">
            ← Back to Studio
          </Link>
          <h1 className="text-4xl font-serif italic text-black/80">RSVP Curator</h1>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-black/40 font-bold">Attendance</p>
          <p className="text-sm italic">{rsvps?.length ?? 0} Responses · {totalAsistentes} Confirmed</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Summary Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-8 bg-white rounded-3xl border border-black/5 shadow-sm space-y-6">
            <h3 className="text-xs uppercase tracking-widest text-black/40 font-bold">Attendance Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-lg">
                <span className="text-black/60">Total Guests</span>
                <span className="font-medium text-black">{totalAsistentes}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-black/60">Total Responses</span>
                <span className="font-medium text-black">{rsvps?.length ?? 0}</span>
              </div>
              <div className="pt-4 border-t border-black/5">
                <Link
                  href="/studio/confirmaciones/exportar"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-black text-white text-xs font-medium hover:bg-charcoal transition-all active:scale-95 shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Export Guest List (CSV)
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Responses List */}
        <div className="lg:col-span-2 space-y-6">
          {rsvps?.length ? (
            <div className="grid grid-cols-1 gap-4">
              {rsvps.map((r) => (
                <div
                  key={r.id}
                  className={`p-6 rounded-3xl border transition-all ${
                    r.asistira
                      ? "bg-white border-black/5 shadow-sm"
                      : "bg-black/[0.01] border-transparent opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-medium text-black/80 text-lg">
                      {/* @ts-expect-error -- el join siempre devuelve un único invitado */}
                      {r.invitados?.nombre_completo}
                    </p>
                    <span
                      className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-tighter ${
                        r.asistira
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {r.asistira ? `Confirmed (+${r.num_asistentes_confirmados})` : "Declined"}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {r.menu_elegido && (
                      <div className="flex items-center gap-2 text-black/60">
                        <span className="text-[10px] uppercase tracking-widest font-bold opacity-50">Menu:</span>
                        <span>{r.menu_elegido}</span>
                      </div>
                    )}
                    {r.alergias && (
                      <div className="flex items-center gap-2 text-red-500">
                        <span className="text-[10px] uppercase tracking-widest font-bold opacity-50">Allergies:</span>
                        <span>{r.alergias}</span>
                      </div>
                    )}
                  </div>
                  {r.mensaje && (
                    <div className="mt-4 p-4 bg-black/[0.02] rounded-2xl italic text-black/60 text-sm border-l-2 border-black/10">
                      &quot;{r.mensaje}&quot;
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-black/5 rounded-3xl">
              <p className="text-sm text-black/40 italic">No responses have been received yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
