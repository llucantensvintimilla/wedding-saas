import { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FadeIn } from "@/components/FadeIn";

export default async function StudioLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/studio/login");
  }

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("rol, boda_id")
    .eq("id", user.id)
    .single();

  if (!perfil || perfil.rol !== "novios") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-[#faf7f2] text-foreground font-body">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-muted flex flex-col">
        <div className="p-8">
          <h1 className="font-heading text-2xl tracking-tighter italic">OurWedding</h1>
          <p className="text-[10px] uppercase tracking-widest text-black/40 mt-1 font-medium">The Couple's Atelier</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <div className="text-[10px] uppercase tracking-widest text-black/30 font-bold px-4 mb-4 mt-8">
            Management
          </div>
          <Link href="/studio" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-muted/50 transition-colors">
            <span className="text-black/80">Dashboard Overview</span>
          </Link>
          <Link href="/studio/editar" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-muted/50 transition-colors">
            <span className="text-black/80">Visual Design Studio</span>
          </Link>
          <Link href="/studio/invitados" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-muted/50 transition-colors">
            <span className="text-black/80">Guest Management</span>
          </Link>
          <Link href="/studio/confirmaciones" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-muted/50 transition-colors">
            <span className="text-black/80">RSVP Registry</span>
          </Link>
          <Link href="/studio/galeria" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-muted/50 transition-colors">
            <span className="text-black/80">Curated Gallery</span>
          </Link>
          <Link href="/studio/mensajes" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-muted/50 transition-colors">
            <span className="text-black/80">Digital Guestbook</span>
          </Link>
        </nav>

        <div className="p-8 border-t border-muted">
          <Link
            href="/studio/login"
            className="block text-center py-3 px-4 rounded-full border border-black/10 text-xs font-medium hover:bg-black hover:text-white transition-all"
          >
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-20 border-b border-muted bg-white/50 backdrop-blur-sm flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-[10px] uppercase tracking-widest text-black/40 font-medium">Studio Live Sync Active</span>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-xs font-medium text-black/60 italic">Welcome back, Couple</span>
          </div>
        </header>

        <div className="p-8">
          <FadeIn>
            {children}
          </FadeIn>
        </div>
      </main>
    </div>
  );
}
