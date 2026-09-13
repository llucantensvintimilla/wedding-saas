import { createClient } from "@/lib/supabase/server";
import { signOutAfiliado } from "./actions";
import { motion } from "framer-motion";

export default async function PanelAfiliadoPage() {
  const supabase = await createClient();

  const { data: colaborador } = await supabase
    .from("colaboradores")
    .select("nombre, codigo_referido")
    .single();

  const { data: ventas } = await supabase
    .from("ventas")
    .select("importe, comision, comision_pagada, created_at")
    .order("created_at", { ascending: false });

  const totalComision = (ventas ?? []).reduce((acc, v) => acc + Number(v.comision), 0);
  const comisionPendiente = (ventas ?? [])
    .filter((v) => !v.comision_pagada)
    .reduce((acc, v) => acc + Number(v.comision), 0);

  const enlaceReferido = colaborador?.codigo_referido
    ? `${process.env.NEXT_PUBLIC_SITE_URL}?ref=${colaborador.codigo_referido}`
    : null;

  return (
    <div className="min-h-screen bg-[#faf7f2] text-charcoal font-body">
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-serif italic text-black/80">
              {colaborador?.nombre ?? "Partner Atelier"}
            </h1>
            <p className="text-sm text-black/40 italic">Luxury Affiliate Dashboard</p>
          </div>
          <form action={signOutAfiliado}>
            <button className="px-6 py-2 rounded-full border border-black/10 text-xs font-medium hover:bg-black hover:text-white transition-all active:scale-95 shadow-sm">
              Sign Out
            </button>
          </form>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Referral Toolkit */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-8 bg-white rounded-3xl border border-black/5 shadow-sm space-y-6">
              <div className="space-y-1">
                <h3 className="text-xs uppercase tracking-widest text-black/40 font-bold">Referral Identity</h3>
                <p className="text-lg font-medium text-black/80">Your unique invitation code</p>
              </div>

              <div className="p-4 bg-black/[0.02] rounded-2xl border border-black/5 text-center space-y-2">
                <span className="block text-2xl font-serif italic tracking-wider text-primary">
                  {colaborador?.codigo_referido ?? "N/A"}
                </span>
                <div className="h-px bg-black/5 mx-auto w-12" />
                <p className="text-[10px] text-black/40 uppercase tracking-tighter truncate px-4">
                  {enlaceReferido ?? "No link available"}
                </p>
              </div>

              <div className="pt-4 space-y-3">
                <p className="text-xs text-black/50 italic leading-relaxed">
                  Share this link with potential couples. For every luxury experience booked, you earn a premium commission.
                </p>
              </div>
            </div>
          </div>

          {/* Financials & Performance */}
          <div className="lg:col-span-2 space-y-12">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-8 bg-white rounded-3xl border border-black/5 shadow-sm space-y-2">
                <p className="text-xs uppercase tracking-widest text-black/40 font-bold">Total Commission</p>
                <p className="text-4xl font-serif italic text-black/80">
                  {totalComision.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </p>
              </div>
              <div className="p-8 bg-white rounded-3xl border border-black/5 shadow-sm space-y-2">
                <p className="text-xs uppercase tracking-widest text-black/40 font-bold">Pending Payout</p>
                <p className="text-4xl font-serif italic text-primary">
                  {comisionPendiente.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </p>
              </div>
            </div>

            {/* Sales Registry */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-black/5 pb-4">
                <h2 className="text-xl font-serif italic text-black/80">Conversion History</h2>
                <span className="text-xs text-black/40">{ventas?.length ?? 0} successful referrals</span>
              </div>

              <div className="bg-white border border-black/5 rounded-3xl overflow-hidden shadow-sm divide-y divide-black/5">
                {ventas?.length ? (
                  ventas.map((v, i) => (
                    <div key={i} className="p-6 flex items-center justify-between hover:bg-black/[0.01] transition-colors">
                      <div className="space-y-1">
                        <p className="font-medium text-black/80">
                          {Number(v.importe).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </p>
                        <p className="text-xs text-black/40 font-light">
                          {new Date(v.created_at).toLocaleDateString("en-US", {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-medium text-black/80">
                          {Number(v.comision).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </p>
                        <span
                          className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-tighter transition-colors ${
                            v.comision_pagada
                              ? "bg-green-50 text-green-700"
                              : "bg-yellow-50 text-yellow-700"
                            }`}
                        >
                          {v.comision_pagada ? "Paid" : "Pending"}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <p className="text-sm text-black/40 italic">No sales records yet. Your journey to premium commissions starts here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
