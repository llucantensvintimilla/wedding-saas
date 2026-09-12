import { createClient } from "@/lib/supabase/server";
import { marcarContactado, borrarLead } from "./actions";

export default async function LeadsPage() {
  const supabase = await createClient();
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  const pendientes = leads?.filter((l) => !l.contactado) ?? [];
  const contactados = leads?.filter((l) => l.contactado) ?? [];

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-xl font-medium mb-1">Leads (Landing Page)</h1>
      <p className="text-sm text-black/50 mb-6">
        {pendientes.length} pending contact · {contactados.length} contacted
      </p>

      <div className="divide-y divide-black/10 border border-black/10 rounded-xl overflow-hidden">
        {leads?.length ? (
          leads.map((l) => (
            <div key={l.id} className="p-4 flex items-center justify-between text-sm">
              <div>
                <p className="font-medium">{l.nombre_pareja || l.email}</p>
                <p className="text-xs text-black/50">
                  {l.email} · {new Date(l.created_at).toLocaleDateString("en-US")}
                </p>
              </div>
              {l.contactado ? (
                <span className="text-xs text-green-700">contacted</span>
              ) : (
                <form action={marcarContactado.bind(null, l.id)}>
                  <button className="text-xs bg-black text-white rounded px-2 py-1">
                    Mark as contacted
                  </button>
                </form>
              )}
              <form action={borrarLead.bind(null, l.id)}>
                <button className="text-xs text-red-500 ml-2">Delete</button>
              </form>
            </div>
          ))
        ) : (
          <p className="p-4 text-sm text-black/50">No leads have been captured yet.</p>
        )}
      </div>
    </div>
  );
}
