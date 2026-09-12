"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Ornamento, EtiquetaSeccion, type EstiloSeparador } from "@/components/wedding/Ornamento";
import { FadeIn } from "@/components/FadeIn";
import { useWeddingTheme } from "@/components/wedding/WeddingThemeProvider";

type Invitado = {
  id: string;
  nombre_completo: string;
  num_acompanantes_permitidos: number;
};

export function RSVP({
  bodaId,
  titulo = "Confirm your attendance",
  estiloSeparador = "linea",
}: {
  bodaId: string;
  titulo?: string;
  estiloSeparador?: EstiloSeparador;
}) {
  const supabase = createClient();
  const { tokens } = useWeddingTheme();

  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState<Invitado[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [seleccionado, setSeleccionado] = useState<Invitado | null>(null);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Confirmation form fields
  const [asistira, setAsistira] = useState<"si" | "no" | null>(null);
  const [numAsistentes, setNumAsistentes] = useState(1);
  const [menu, setMenu] = useState("estandar");
  const [alergias, setAlergias] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function buscar(valor: string) {
    setBusqueda(valor);
    setError(null);
    if (valor.trim().length < 3) {
      setResultados([]);
      return;
    }
    setBuscando(true);
    const { data, error: rpcError } = await supabase.rpc("buscar_invitado", {
      p_boda_id: bodaId,
      p_busqueda: valor.trim(),
    });
    setBuscando(false);
    if (rpcError) {
      setError("Couldn't search for your name. Please try again.");
      return;
    }
    setResultados(data ?? []);
  }

  async function confirmar() {
    if (!seleccionado || asistira === null) return;
    setEnviando(true);
    setError(null);

    const { error: insertError } = await supabase.from("rsvp").insert({
      invitado_id: seleccionado.id,
      boda_id: bodaId,
      asistira: asistira === "si",
      num_asistentes_confirmados: asistira === "si" ? numAsistentes : 0,
      menu_elegido: asistira === "si" ? menu : null,
      alergias: asistira === "si" ? alergias : null,
      mensaje: mensaje || null,
    });

    setEnviando(false);

    if (insertError) {
      setError("Couldn't send your RSVP. Please try again.");
      return;
    }

    setEnviado(true);
  }

  if (enviado) {
    return (
      <section className="py-28 px-6 max-w-lg mx-auto text-center">
        <FadeIn>
          <EtiquetaSeccion>RSVP</EtiquetaSeccion>
          <h2 className={`text-3xl ${tokens.typography.heading} mb-4`} style={{ color: tokens.colors.primary }}>
            Thank you, {seleccionado?.nombre_completo.split(" ")[0]}!
          </h2>
          <p className={`text-black/60 ${tokens.typography.body}`}>
            {asistira === "si"
              ? "We've received your RSVP. See you at the wedding!"
              : "We've received your response. We'll miss you there."}
          </p>
        </FadeIn>
      </section>
    );
  }

  return (
    <section className="py-28 px-6 max-w-lg mx-auto text-center">
      <FadeIn>
        <EtiquetaSeccion>RSVP</EtiquetaSeccion>
        <h2 className={`text-3xl ${tokens.typography.heading} mb-3`} style={{ color: tokens.colors.primary }}>
          {titulo}
        </h2>

        {!seleccionado ? (
          <div className="mt-8 text-left">
            <label className={`text-sm ${tokens.typography.body}`} style={{ color: tokens.colors.muted }}>
              Type your full name
            </label>
            <input
              value={busqueda}
              onChange={(e) => buscar(e.target.value)}
              placeholder="e.g. Jane Smith"
              className={`w-full mt-2 rounded-[var(--radio-control)] border border-black/10 px-4 py-3 text-sm ${tokens.typography.body}`}
            />

            {buscando && (
              <p className="text-xs text-black/40 mt-2">Searching...</p>
            )}

            {resultados.length > 0 && (
              <ul className="mt-3 border border-black/10 rounded-lg divide-y divide-black/5 overflow-hidden">
                {resultados.map((inv) => (
                  <li key={inv.id}>
                    <button
                      onClick={() => {
                        setSeleccionado(inv);
                        setNumAsistentes(1);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-black/[0.03] ${tokens.typography.body}`}
                    >
                      {inv.nombre_completo}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {!buscando && busqueda.trim().length >= 3 && resultados.length === 0 && (
              <p className="text-xs text-black/40 mt-2">
                We couldn&apos;t find that name on the guest list. Try spelling it
                differently, or reach out to the couple.
              </p>
            )}
          </div>
        ) : (
          <div className="mt-8 text-left space-y-5">
            <p className={`text-sm ${tokens.typography.body}`} style={{ color: tokens.colors.muted }}>
              Confirming as{" "}
              <span className={`font-medium ${tokens.typography.heading}`} style={{ color: tokens.colors.secondary }}>
                {seleccionado.nombre_completo}
              </span>
              .{" "}
              <button
                onClick={() => setSeleccionado(null)}
                className="underline text-xs"
              >
                That&apos;s not me
              </button>
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setAsistira("si")}
                className={`flex-1 rounded-lg border py-2 text-sm transition-colors ${
                  asistira === "si"
                    ? "text-white border-primary"
                    : "border-black/10"
                }`}
                style={{ backgroundColor: asistira === "si" ? tokens.colors.primary : "transparent", color: asistira === "si" ? "white" : tokens.colors.text }}
              >
                I&apos;ll be there
              </button>
              <button
                onClick={() => setAsistira("no")}
                className={`flex-1 rounded-lg border py-2 text-sm transition-colors ${
                  asistira === "no"
                    ? "text-white border-secondary"
                    : "border-black/10"
                }`}
                style={{ backgroundColor: asistira === "no" ? tokens.colors.secondary : "transparent", color: asistira === "no" ? "white" : tokens.colors.text }}
              >
                Can&apos;t make it
              </button>
            </div>

            {asistira === "si" && (
              <>
                {seleccionado.num_acompanantes_permitidos > 0 && (
                  <div className={tokens.typography.body}>
                    <label className="text-sm" style={{ color: tokens.colors.muted }}>
                      How many are you in total? (max{" "}
                      {seleccionado.num_acompanantes_permitidos + 1})
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={seleccionado.num_acompanantes_permitidos + 1}
                      value={numAsistentes}
                      onChange={(e) => setNumAsistentes(Number(e.target.value))}
                      className={`w-full mt-1 rounded-[var(--radio-control)] border border-black/10 px-4 py-2 text-sm ${tokens.typography.body}`}
                    />
                  </div>
                )}

                <div className={tokens.typography.body}>
                  <label className="text-sm" style={{ color: tokens.colors.muted }}>Meal</label>
                  <select
                    value={menu}
                    onChange={(e) => setMenu(e.target.value)}
                    className={`w-full mt-1 rounded-[var(--radio-control)] border border-black/10 px-4 py-2 text-sm ${tokens.typography.body}`}
                  >
                    <option value="estandar">Standard</option>
                    <option value="vegetariano">Vegetarian</option>
                    <option value="vegano">Vegan</option>
                    <option value="infantil">Kids</option>
                  </select>
                </div>

                <div className={tokens.typography.body}>
                  <label className="text-sm" style={{ color: tokens.colors.muted }}>
                    Allergies or dietary restrictions
                  </label>
                  <input
                    value={alergias}
                    onChange={(e) => setAlergias(e.target.value)}
                    className={`w-full mt-1 rounded-[var(--radio-control)] border border-black/10 px-4 py-2 text-sm ${tokens.typography.body}`}
                  />
                </div>
              </>
            )}

            <div className={tokens.typography.body}>
              <label className="text-sm" style={{ color: tokens.colors.muted }}>
                Message for the couple (optional)
              </label>
              <textarea
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                rows={3}
                className={`w-full mt-1 rounded-[var(--radio-control)] border border-black/10 px-4 py-2 text-sm ${tokens.typography.body}`}
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              onClick={confirmar}
              disabled={asistira === null || enviando}
              className="w-full rounded-[var(--radio-control)] bg-black text-white py-3 text-sm font-medium disabled:opacity-50 transition-colors"
              style={{ backgroundColor: tokens.colors.primary }}
            >
              {enviando ? "Sending..." : "Send RSVP"}
            </button>
          </div>
        )}

        <Ornamento className="mt-12" estilo={estiloSeparador} />
      </FadeIn>
    </section>
  );
}
