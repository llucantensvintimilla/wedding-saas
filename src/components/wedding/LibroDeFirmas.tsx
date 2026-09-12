"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { EtiquetaSeccion, Ornamento, type EstiloSeparador } from "@/components/wedding/Ornamento";
import { FadeIn } from "@/components/FadeIn";
import { useWeddingTheme } from "@/components/wedding/WeddingThemeProvider";

type Mensaje = { id: string; nombre_autor: string; mensaje: string };

export function LibroDeFirmas({
  bodaId,
  mensajesIniciales,
  titulo = "Leave us a message",
  estiloSeparador = "linea",
}: {
  bodaId: string;
  mensajesIniciales: Mensaje[];
  titulo?: string;
  estiloSeparador?: EstiloSeparador;
}) {
  const supabase = createClient();
  const { tokens } = useWeddingTheme();
  const [mensajes, setMensajes] = useState(mensajesIniciales);
  const [nombre, setNombre] = useState("");
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim() || !texto.trim()) return;
    setEnviando(true);

    const { data, error } = await supabase
      .from("mensajes")
      .insert({ boda_id: bodaId, nombre_autor: nombre, mensaje: texto })
      .select()
      .single();

    setEnviando(false);
    if (!error && data) {
      setMensajes([data, ...mensajes]);
      setNombre("");
      setTexto("");
    }
  }

  return (
    <section className="py-28 px-6 max-w-2xl mx-auto text-center">
      <FadeIn>
        <EtiquetaSeccion>Guestbook</EtiquetaSeccion>
        <h2 className={`text-3xl md:text-4xl ${tokens.typography.heading} mb-10`} style={{ color: tokens.colors.primary }}>
          {titulo}
        </h2>

        <form onSubmit={enviar} className="text-left space-y-3 mb-12">
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Your name"
            required
            className={`w-full rounded-[var(--radio-control)] border border-black/10 px-4 py-2 text-sm ${tokens.typography.body}`}
          />
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Write a few words..."
            required
            rows={3}
            className={`w-full rounded-[var(--radio-control)] border border-black/10 px-4 py-2 text-sm ${tokens.typography.body}`}
          />
          <button
            disabled={enviando}
            className="rounded-[var(--radio-control)] text-white px-5 py-2 text-sm font-medium disabled:opacity-50 transition-colors"
            style={{ backgroundColor: tokens.colors.primary }}
          >
            {enviando ? "Sending..." : "Sign"}
          </button>
        </form>

        <div className="grid sm:grid-cols-2 gap-4 text-left">
          {mensajes.map((m) => (
            <div key={m.id} className="p-4 rounded-[var(--radio-tarjeta)] border border-black/10">
              <p className={`text-sm italic ${tokens.typography.body}`} style={{ color: tokens.colors.text }}>
                &quot;{m.mensaje}&quot;
              </p>
              <p className={`text-xs mt-2 ${tokens.typography.body}`} style={{ color: tokens.colors.accent }}>— {m.nombre_autor}</p>
            </div>
          ))}
        </div>

        <Ornamento className="mt-12" estilo={estiloSeparador} />
      </FadeIn>
    </section>
  );
}
