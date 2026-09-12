import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { moderateMessage, deleteMessage } from "@/app/studio/actions";
import { FadeIn } from "@/components/FadeIn";

export default async function MensajesPanelPage() {
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

  const { data: mensajes } = await supabase
    .from("mensajes")
    .select("*")
    .eq("boda_id", bodaId)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <Link href="/studio" className="text-xs text-black/40 hover:text-black transition-colors">
            ← Back to Studio
          </Link>
          <h1 className="text-4xl font-serif italic text-black/80">Guestbook Curator</h1>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-black/40 font-bold">Messages</p>
          <p className="text-sm italic">{mensajes?.length ?? 0} expressions of love</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Filter/Status summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 bg-white rounded-3xl border border-black/5 shadow-sm space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-black/40 font-bold">Moderation Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-black/60">Published</span>
                <span className="font-medium">{mensajes?.filter(m => m.estado === "aprobado").length ?? 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-black/60">Pending/Hidden</span>
                <span className="font-medium">{mensajes?.filter(m => m.estado !== "aprobado").length ?? 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="lg:col-span-2 space-y-6">
          {mensajes?.length ? (
            <div className="space-y-4">
              {mensajes.map((m) => (
                <div
                  key={m.id}
                  className={`p-6 rounded-3xl border transition-all duration-300 ${
                    m.estado === "aprobado"
                    ? "bg-white border-black/5 shadow-sm"
                    : "bg-black/[0.01] border-transparent opacity-70"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <p className="font-medium text-black/80">{m.nombre_autor}</p>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter ${
                          m.estado === "aprobado"
                            ? "bg-green-50 text-green-600"
                            : m.estado === "oculto"
                            ? "bg-black/5 text-black/40"
                            : "bg-yellow-50 text-yellow-600"
                        }`}
                      >
                        {m.estado}
                      </span>
                    </div>
                    <form action={deleteMessage.bind(null, m.id)}>
                      <button className="text-xs text-red-300 hover:text-red-600 transition-colors uppercase tracking-widest font-medium">
                        Delete
                      </button>
                    </form>
                  </div>
                  <p className="text-black/60 italic text-lg leading-relaxed mb-6">
                    &quot;{m.mensaje}&quot;
                  </p>
                  <div className="flex justify-end gap-3">
                    {m.estado !== "aprobado" && (
                      <form action={moderateMessage.bind(null, m.id, "aprobado")}>
                        <button className="px-4 py-2 rounded-full bg-black text-white text-xs font-medium hover:bg-charcoal transition-all active:scale-95">
                          Approve Message
                        </button>
                      </form>
                    )}
                    {m.estado !== "oculto" && (
                      <form action={moderateMessage.bind(null, m.id, "oculto")}>
                        <button className="px-4 py-2 rounded-full bg-white border border-black/10 text-black/60 text-xs font-medium hover:bg-black/5 transition-all active:scale-95">
                          {m.estado === "aprobado" ? "Hide Message" : "Mark as Hidden"}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-black/5 rounded-3xl">
              <p className="text-sm text-black/40 italic">The guestbook is currently empty. Your guests will leave their marks here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
