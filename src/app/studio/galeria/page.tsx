import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  uploadOfficialPhoto,
  deleteOfficialPhoto,
  moderatePhoto,
  deleteGuestPhoto,
} from "@/app/studio/actions";
import { FadeIn } from "@/components/FadeIn";
import { motion } from "framer-motion";

export default async function GaleriaPanelPage() {
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

  const [{ data: oficiales }, { data: deInvitados }] = await Promise.all([
    supabase.from("galeria_oficial").select("*").eq("boda_id", bodaId).order("orden"),
    supabase.from("fotos_invitados").select("*").eq("boda_id", bodaId).order("created_at", { ascending: false }),
  ]);

  const pendientes = deInvitados?.filter((f) => f.estado === "pendiente") ?? [];
  const resto = deInvitados?.filter((f) => f.estado !== "pendiente") ?? [];

  return (
    <div className="max-w-5xl mx-auto space-y-16 py-8">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <Link href="/studio" className="text-xs text-black/40 hover:text-black transition-colors">
            ← Back to Studio
          </Link>
          <h1 className="text-4xl font-serif italic text-black/80">Visual Gallery</h1>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-black/40 font-bold">Curated Content</p>
          <p className="text-sm italic">{oficiales?.length ?? 0} Official · {deInvitados?.length ?? 0} Guest Photos</p>
        </div>
      </header>

      {/* Official Gallery Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between border-b border-black/5 pb-4">
          <h2 className="text-xl font-serif italic">Official Collection</h2>
          <form action={uploadOfficialPhoto.bind(null, bodaId)} className="flex items-center gap-3">
            <input
              type="file"
              name="file"
              accept="image/*"
              required
              className="text-xs text-black/40 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-black/5 file:text-black/60 hover:file:bg-black/10 transition-all cursor-pointer"
            />
            <button className="px-4 py-2 rounded-full bg-black text-white text-xs font-medium hover:bg-charcoal transition-all active:scale-95 shadow-md">
              Upload
            </button>
          </form>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {oficiales?.map((f) => (
            <div key={f.id} className="group relative aspect-square overflow-hidden rounded-2xl bg-muted">
              <img src={f.url} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <form action={deleteOfficialPhoto.bind(null, f.id)}>
                  <button className="p-2 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </form>
              </div>
            </div>
          ))}
          {oficiales?.length === 0 && (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-black/5 rounded-3xl">
              <p className="text-sm text-black/40 italic">Your official gallery is empty. Start by uploading your best shots.</p>
            </div>
          )}
        </div>
      </section>

      {/* Guest Gallery Section */}
      <section className="space-y-12">
        <div className="border-b border-black/5 pb-4">
          <h2 className="text-xl font-serif italic">Guest Contributions</h2>
        </div>

        {/* Pending Approval */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold text-[10px] font-bold uppercase tracking-wider">Pending Review</span>
            <span className="text-xs text-black/40">{pendientes.length} photos</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {pendientes.map((f) => (
              <div key={f.id} className="space-y-3 group">
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted border border-black/5">
                  <img src={f.url} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="flex items-center justify-between px-1">
                  <p className="text-[10px] text-black/40 truncate font-medium">{f.nombre_subido_por ?? "Anonymous"}</p>
                  <div className="flex gap-2">
                    <form action={moderatePhoto.bind(null, f.id, "aprobada")}>
                      <button className="p-1.5 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors" title="Approve">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </button>
                    </form>
                    <form action={deleteGuestPhoto.bind(null, f.id)}>
                      <button className="p-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
            {pendientes.length === 0 && (
              <div className="col-span-full py-8 text-center">
                <p className="text-xs text-black/40 italic">All guest photos have been reviewed.</p>
              </div>
            )}
          </div>
        </div>

        {/* Approved/Hidden */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded-full bg-black/5 text-black/60 text-[10px] font-bold uppercase tracking-wider">Published Gallery</span>
            <span className="text-xs text-black/40">{resto.length} photos</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {resto.map((f) => (
              <div key={f.id} className="space-y-3 group">
                <div className={`relative aspect-square overflow-hidden rounded-2xl bg-muted border border-black/5 transition-opacity ${f.estado === "oculta" ? "opacity-40" : "opacity-100"}`}>
                  <img src={f.url} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  {f.estado === "oculta" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="px-2 py-1 rounded bg-black/60 text-white text-[8px] uppercase font-bold">Hidden</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between px-1">
                  <p className="text-[10px] text-black/40 truncate font-medium">{f.nombre_subido_por ?? "Anonymous"}</p>
                  <div className="flex gap-2">
                    <form action={moderatePhoto.bind(null, f.id, f.estado === "aprobada" ? "oculta" : "aprobada")}>
                      <button className={`p-1.5 rounded-full transition-colors ${f.estado === "aprobada" ? "bg-black/5 text-black/60 hover:bg-black/10" : "bg-green-50 text-green-600 hover:bg-green-100"}`} title={f.estado === "aprobada" ? "Hide" : "Approve"}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          {f.estado === "aprobada" ? <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M//... (placeholder)"/> : <polyline points="20 6 9 17 4 12"/>}
                        </svg>
                        {f.estado === "aprobada" ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        )}
                      </button>
                    </form>
                    <form action={deleteGuestPhoto.bind(null, f.id)}>
                      <button className="p-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
