import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  addGuest,
  removeGuest,
} from "@/app/studio/actions";
import { FadeIn } from "@/components/FadeIn";

export default async function GuestManagementPage() {
  const supabase = await createClient();

  // Get the user's linked wedding
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("boda_id")
    .eq("id", user.id)
    .single();

  if (!perfil || !perfil.boda_id) notFound();
  const bodaId = perfil.boda_id;

  const { data: invitados } = await supabase
    .from("invitados")
    .select("id, nombre_completo, grupo, num_acompanantes_permitidos")
    .eq("boda_id", bodaId)
    .order("nombre_completo");

  // Binding bodaId to actions
  const anadirConId = addGuest.bind(null, bodaId);

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-serif italic text-black/80">Guest Management</h1>
        <p className="text-sm text-black/40 font-light italic">
          {invitados?.length ?? 0} guests curated in your list
        </p>
      </header>

      <section className="space-y-6">
        <h3 className="text-xs uppercase tracking-[0.2em] text-black/40 font-bold">Add New Guest</h3>
        <form
          action={anadirConId}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 p-8 bg-white border border-black/5 rounded-3xl shadow-sm"
        >
          <div className="col-span-full space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-black/40">Full Name</label>
            <input
              name="nombre_completo"
              placeholder="e.g. Jonathan Smith"
              required
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:border-gold outline-none transition-colors bg-[#faf7f2]/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-black/40">Email (Optional)</label>
            <input name="email" type="email" placeholder="email@example.com" className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:border-gold outline-none transition-colors bg-[#faf7f2]/50" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-black/40">Phone (Optional)</label>
            <input name="telefono" placeholder="+1 234 567 890" className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:border-gold outline-none transition-colors bg-[#faf7f2]/50" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-black/40">Group (e.g. Family, Work)</label>
            <input name="grupo" placeholder="Family" className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:border-gold outline-none transition-colors bg-[#faf7f2]/50" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-black/40">Plus-ones allowed</label>
            <input
              name="num_acompanantes_permitidos"
              type="number"
              min={0}
              defaultValue={0}
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:border-gold outline-none transition-colors bg-[#faf7f2]/50"
            />
          </div>
          <button className="col-span-full py-4 rounded-full bg-black text-white text-sm font-medium hover:bg-charcoal transition-all active:scale-95 shadow-lg mt-4">
            Add Guest to List
          </button>
        </form>
      </section>

      <section className="space-y-6">
        <h3 className="text-xs uppercase tracking-[0.2em] text-black/40 font-bold">Guest Registry</h3>
        <div className="bg-white border border-black/5 rounded-3xl overflow-hidden shadow-sm divide-y divide-black/5">
          {invitados?.length ? (
            invitados.map((inv) => (
              <div key={inv.id} className="p-6 flex items-center justify-between hover:bg-black/[0.01] transition-colors">
                <div className="space-y-1">
                  <p className="font-medium text-black/80">{inv.nombre_completo}</p>
                  <p className="text-xs text-black/40 font-light">
                    {inv.grupo ?? "unassigned group"} · {inv.num_acompanantes_permitidos === 0 ? "No plus-ones" : `+${inv.num_acompanantes_permitidos} guests`}
                  </p>
                </div>
                <form action={removeGuest.bind(null, bodaId, inv.id)}>
                  <button className="text-xs text-red-400 hover:text-red-600 transition-colors font-medium uppercase tracking-tighter">
                    Remove
                  </button>
                </form>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <p className="text-sm text-black/40 italic">No guests have been added to the registry yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
