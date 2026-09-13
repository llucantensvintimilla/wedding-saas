import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { motion } from "framer-motion";

export default async function StudioDashboard() {
  const supabase = await createClient();

  // Wedding Data
  const { data: boda } = await supabase.from("bodas").select("*").single();

  // RSVP Count
  const { count: rsvpCount } = await supabase
    .from("rsvp")
    .select("*", { count: "exact", head: true })
    .eq("asistira", true);

  // Total Guests Count
  const { count: guestsCount } = await supabase
    .from("invitados")
    .select("*", { count: "exact", head: true });

  if (!boda) return <div className="p-8 text-center italic text-black/40">Loading your experience...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-16">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <h1 className="font-heading text-6xl text-black/80 leading-tight">
            {boda.nombre_novia} & {boda.nombre_novio}
          </h1>
          <p className="text-black/50 text-xl italic font-light">The Couple's Atelier</p>
        </div>
        <div className="flex gap-4">
          <Link
            href={`/${boda.slug}`}
            target="_blank"
            className="px-6 py-3 rounded-full bg-white border border-black/10 text-sm font-medium hover:bg-black hover:text-white transition-all duration-300"
          >
            View Live Site →
          </Link>
          <Link
            href="/studio/editar"
            className="px-6 py-3 rounded-full bg-black text-white text-sm font-medium hover:opacity-90 transition-all duration-300 shadow-lg"
          >
            Enter Design Studio
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-10 rounded-3xl border border-black/5 shadow-sm space-y-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-black/40 font-bold">Guest Progress</p>
          <div className="flex items-baseline gap-3">
            <span className="text-6xl font-heading text-black/80">{rsvpCount ?? 0}</span>
            <span className="text-sm text-black/40 font-light">of {guestsCount ?? 0} confirmed</span>
          </div>
          <div className="h-[2px] w-full bg-black/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: guestsCount ? `${((rsvpCount ?? 0) / guestsCount) * 100}%` : '0%' }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-gold"
              style={{ backgroundColor: "#b08d57" }}
            />
          </div>
        </div>

        <div className="bg-white p-10 rounded-3xl border border-black/5 shadow-sm space-y-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-black/40 font-bold">System Status</p>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xl font-medium text-black/80">Experience Live</span>
          </div>
          <p className="text-sm text-black/40 font-light leading-relaxed">
            Your curated site is currently visible to your guests globally.
          </p>
        </div>

        <div className="bg-white p-10 rounded-3xl border border-black/5 shadow-sm space-y-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-black/40 font-bold">Upcoming Milestone</p>
          <div className="text-xl font-medium text-black/80">Guestlist Finalization</div>
          <p className="text-sm text-black/40 font-light leading-relaxed">
            We suggest confirming your final guest count 30 days prior to the celebration.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <h3 className="font-heading text-3xl text-black/80 italic">Atelier Shortcuts</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Guest Management",
              desc: "Curate your invites and groups",
              href: "/studio/invitados",
            },
            {
              title: "RSVP Registry",
              desc: "View confirmations and dietary needs",
              href: "/studio/confirmaciones",
            },
            {
              title: "Curated Gallery",
              desc: "Moderate and organize guest photos",
              href: "/studio/galeria",
            },
            {
              title: "Digital Guestbook",
              desc: "Review and approve guest messages",
              href: "/studio/mensajes",
            }
          ].map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="group p-8 rounded-3xl border border-black/5 bg-white hover:border-gold/30 transition-all duration-500 hover:shadow-2xl"
            >
              <p className="font-medium text-lg mb-2 text-black/80 group-hover:text-gold transition-colors">{item.title}</p>
              <p className="text-xs text-black/40 leading-relaxed font-light">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
