"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { crearBodaDesdeAsistente } from "@/app/crear/actions";
import { VistaPreviaEstilo } from "@/components/marketing/VistaPreviaEstilo";
import type { TipografiaKey } from "@/lib/fonts";
import { FadeIn } from "@/components/FadeIn";

const TOTAL_PASOS = 7;

type Texto = {
  nombreNovia: string;
  nombreNovio: string;
  fechaBoda: string;
  email: string;
  historiaPareja: string;
  ubicacionCeremonia: string;
  ubicacionCelebracion: string;
  dressCode: string;
  venmo: string;
  spotifyUrl: string;
  tipografia: TipografiaKey;
  colorPrimario: string;
  colorSecundario: string;
  forma: "nitido" | "suave" | "redondeado";
};

export function AsistenteCreacion({ codigoReferido }: { codigoReferido?: string }) {
  const [paso, setPaso] = useState(1);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<{ slug: string; enlaceAcceso: string | null } | null>(null);

  const [datos, setDatos] = useState<Texto>({
    nombreNovia: "",
    nombreNovio: "",
    fechaBoda: "",
    email: "",
    historiaPareja: "",
    ubicacionCeremonia: "",
    ubicacionCelebracion: "",
    dressCode: "",
    venmo: "",
    spotifyUrl: "",
    tipografia: "elegante",
    colorPrimario: "#b08d57",
    colorSecundario: "#2e2e2e",
    forma: "suave",
  });

  const [fotos, setFotos] = useState<File[]>([]);
  const [indicePortada, setIndicePortada] = useState<number | null>(null);
  const [fotosOmitidas, setFotosOmitidas] = useState(false);

  function actualizar<K extends keyof Texto>(clave: K, valor: Texto[K]) {
    setDatos((d) => ({ ...d, [clave]: valor }));
  }

  function anadirFotos(e: React.ChangeEvent<HTMLInputElement>) {
    const nuevas = Array.from(e.target.files ?? []);
    setFotos((f) => {
      const combinadas = [...f, ...nuevas].slice(0, 8);
      return combinadas;
    });
    setFotosOmitidas(false);
    e.target.value = "";
  }

  function quitarFoto(i: number) {
    setFotos((f) => f.filter((_, idx) => idx !== i));
    if (indicePortada === i) setIndicePortada(null);
  }

  async function confirmar() {
    setEnviando(true);
    setError(null);

    const formData = new FormData();
    Object.entries(datos).forEach(([clave, valor]) => formData.set(clave, valor));
    fotos.forEach((foto) => formData.append("foto", foto));
    formData.set("indicePortada", String(indicePortada ?? -1));
    if (codigoReferido) formData.set("ref", codigoReferido);

    const res = await crearBodaDesdeAsistente(formData);
    setEnviando(false);

    if (!res.ok) {
      setError(res.error);
      return;
    }

    if (res.url) {
      window.location.href = res.url;
    }
  }

  const progreso = Math.round((paso / TOTAL_PASOS) * 100);

  return (
    <div className="max-w-6xl mx-auto relative">
      {/* Elegant Progress Indicator */}
      <div className="mb-20 relative">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] tracking-widest uppercase text-black/40 font-medium">
            Crafting your experience
          </span>
          <span className="text-xs font-heading italic text-primary">{progreso}%</span>
        </div>
        <div className="h-[2px] w-full bg-black/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progreso}%` }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="h-full bg-foreground"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-20 items-start">
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={paso}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="space-y-8"
            >
              {paso === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-heading text-4xl mb-2">The protagonists</h2>
                    <p className="text-black/50 text-sm mb-8">Every great story begins with two people. Tell us who you are.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="group">
                      <label className="text-[10px] uppercase tracking-widest text-black/40 mb-1 block ml-1">Partner One</label>
                      <input value={datos.nombreNovia} onChange={(e) => actualizar("nombreNovia", e.target.value)}
                        placeholder="Full name"
                        className="w-full bg-transparent border-b border-black/10 py-3 text-lg focus:border-primary outline-none transition-colors placeholder:text-black/20" />
                    </div>
                    <div className="group">
                      <label className="text-[10px] uppercase tracking-widest text-black/40 mb-1 block ml-1">Partner Two</label>
                      <input value={datos.nombreNovio} onChange={(e) => actualizar("nombreNovio", e.target.value)}
                        placeholder="Full name"
                        className="w-full bg-transparent border-b border-black/10 py-3 text-lg focus:border-primary outline-none transition-colors placeholder:text-black/20" />
                    </div>
                    <div className="group">
                      <label className="text-[10px] uppercase tracking-widest text-black/40 mb-1 block ml-1">The Date</label>
                      <input type="date" value={datos.fechaBoda} onChange={(e) => actualizar("fechaBoda", e.target.value)}
                        className="w-full bg-transparent border-b border-black/10 py-3 text-lg focus:border-primary outline-none transition-colors" />
                    </div>
                    <div className="group">
                      <label className="text-[10px] uppercase tracking-widest text-black/40 mb-1 block ml-1">Contact Email</label>
                      <input type="email" value={datos.email} onChange={(e) => actualizar("email", e.target.value)}
                        placeholder="For your private dashboard access"
                        className="w-full bg-transparent border-b border-black/10 py-3 text-lg focus:border-primary outline-none transition-colors placeholder:text-black/20" />
                    </div>
                  </div>
                </div>
              )}

              {paso === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-heading text-4xl mb-2">The narrative</h2>
                    <p className="text-black/50 text-sm mb-8">The details that make your love unique. Share your essence with us.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="group">
                      <label className="text-[10px] uppercase tracking-widest text-black/40 mb-1 block ml-1">Your story</label>
                      <textarea value={datos.historiaPareja} onChange={(e) => actualizar("historiaPareja", e.target.value)}
                        placeholder="A few sentences about how it all started..."
                        rows={4}
                        className="w-full bg-transparent border-b border-black/10 py-3 text-lg focus:border-primary outline-none transition-colors placeholder:text-black/20 resize-none" />
                    </div>
                    <div className="group">
                      <label className="text-[10px] uppercase tracking-widest text-black/40 mb-1 block ml-1">Ceremony location</label>
                      <input value={datos.ubicacionCeremonia} onChange={(e) => actualizar("ubicacionCeremonia", e.target.value)}
                        placeholder="The place where you say 'I do'"
                        className="w-full bg-transparent border-b border-black/10 py-3 text-lg focus:border-primary outline-none transition-colors placeholder:text-black/20" />
                    </div>
                    <div className="group">
                      <label className="text-[10px] uppercase tracking-widest text-black/40 mb-1 block ml-1">Reception location</label>
                      <input value={datos.ubicacionCelebracion} onChange={(e) => actualizar("ubicacionCelebracion", e.target.value)}
                        placeholder="The place for the celebration"
                        className="w-full bg-transparent border-b border-black/10 py-3 text-lg focus:border-primary outline-none transition-colors placeholder:text-black/20" />
                    </div>
                    <div className="group">
                      <label className="text-[10px] uppercase tracking-widest text-black/40 mb-1 block ml-1">Dress code</label>
                      <input value={datos.dressCode} onChange={(e) => actualizar("dressCode", e.target.value)}
                        placeholder="e.g. Black Tie, Garden Chic..."
                        className="w-full bg-transparent border-b border-black/10 py-3 text-lg focus:border-primary outline-none transition-colors placeholder:text-black/20" />
                    </div>
                  </div>
                </div>
              )}

              {paso === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-heading text-4xl mb-2">Visual memories</h2>
                    <p className="text-black/50 text-sm mb-8">High-quality imagery is the soul of editorial design. Upload your favorites.</p>
                  </div>
                  {!fotosOmitidas && (
                    <div className="space-y-6">
                      <label className="block cursor-pointer rounded-2xl border border-dashed border-black/15 p-12 text-sm text-black/60 text-center hover:border-primary transition-colors bg-white/50">
                        <span className="font-medium">Drop your photos here</span>
                        <span className="block text-xs opacity-60 mt-1">Up to 8 high-resolution images</span>
                        <input type="file" accept="image/*" multiple onChange={anadirFotos} className="hidden" />
                      </label>

                      {fotos.length > 0 && (
                        <div className="grid grid-cols-4 gap-4">
                          {fotos.map((foto, i) => (
                            <div key={i} className="relative group aspect-square">
                              <img
                                src={URL.createObjectURL(foto)}
                                alt=""
                                className={`w-full h-full object-cover rounded-xl transition-all duration-500 ${indicePortada === i ? "ring-2 ring-primary scale-95" : "opacity-80 group-hover:opacity-100"}`}
                              />
                              <button
                                type="button"
                                onClick={() => setIndicePortada(i)}
                                className={`absolute bottom-2 left-2 text-[8px] px-2 py-1 rounded-full uppercase tracking-tighter transition-all ${
                                  indicePortada === i ? "bg-primary text-white" : "bg-black/40 text-white opacity-0 group-hover:opacity-100"
                                }`}
                              >
                                {indicePortada === i ? "Cover" : "Set as cover"}
                              </button>
                              <button
                                type="button"
                                onClick={() => quitarFoto(i)}
                                className="absolute top-2 right-2 h-6 w-6 flex items-center justify-center rounded-full bg-black/60 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setFotosOmitidas((v) => !v)}
                    className="text-xs text-black/40 underline underline-offset-4 hover:text-primary transition-colors"
                  >
                    {fotosOmitidas ? "I'd rather add photos now" : "I'll add photos later"}
                  </button>
                </div>
              )}

              {paso === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-heading text-4xl mb-2">Typographic soul</h2>
                    <p className="text-black/50 text-sm mb-8">Typography defines the mood. Choose the one that resonates with your love.</p>
                  </div>
                  <div className="grid gap-4">
                    {(
                      [
                        { v: "elegante", t: "The Eternal", d: "Timeless Serif + Minimalist Sans" },
                        { v: "clasico", t: "The Heritage", d: "Classic Romance + Clean Structure" },
                        { v: "moderno", t: "The Vanguard", d: "Bold, Contemporary, Geometric" },
                      ] as const
                    ).map((op) => (
                      <button key={op.v} onClick={() => actualizar("tipografia", op.v)}
                        className={`w-full text-left rounded-xl border p-6 transition-all duration-300 ${
                          datos.tipografia === op.v ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-black/10 hover:border-black/30 bg-white/50"
                        }`}>
                        <span className="font-heading text-xl block mb-1">{op.t}</span>
                        <span className="text-black/40 text-xs">{op.d}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {paso === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-heading text-4xl mb-2">Chromatic palette</h2>
                    <p className="text-black/50 text-sm mb-8">Define the tones that will accompany your memories.</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-widest text-black/40 block">Primary Tone</label>
                      <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-black/10">
                        <input type="color" value={datos.colorPrimario} onChange={(e) => actualizar("colorPrimario", e.target.value)}
                          className="h-10 w-10 rounded-full border-none bg-transparent cursor-pointer" />
                        <span className="text-sm font-mono uppercase">{datos.colorPrimario}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-widest text-black/40 block">Secondary Tone</label>
                      <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-black/10">
                        <input type="color" value={datos.colorSecundario} onChange={(e) => actualizar("colorSecundario", e.target.value)}
                          className="h-10 w-10 rounded-full border-none bg-transparent cursor-pointer" />
                        <span className="text-sm font-mono uppercase">{datos.colorSecundario}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {paso === 6 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-heading text-4xl mb-2">Visual edges</h2>
                    <p className="text-black/50 text-sm mb-8">The subtle details that define the final silhouette.</p>
                  </div>
                  <div className="grid gap-4">
                    {(
                      [
                        { v: "nitido", t: "Sharp & Editorial", d: "Straight lines, haute couture feel" },
                        { v: "suave", t: "Soft & Organic", d: "Gentle curves, modern elegance" },
                        { v: "redondeado", t: "Purely Rounded", d: "Soft edges, welcoming and warm" },
                      ] as const
                    ).map((op) => (
                      <button key={op.v} onClick={() => actualizar("forma", op.v)}
                        className={`w-full text-left rounded-xl border p-6 transition-all duration-300 ${
                          datos.forma === op.v ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-black/10 hover:border-black/30 bg-white/50"
                        }`}>
                        <span className="font-heading text-xl block mb-1">{op.t}</span>
                        <span className="text-black/40 text-xs">{op.d}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {paso === 7 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-heading text-4xl mb-2">The finishing touches</h2>
                    <p className="text-black/50 text-sm mb-8">Optional details to complete your digital home.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="group">
                      <label className="text-[10px] uppercase tracking-widest text-black/40 mb-1 block ml-1">Gift Registry (Venmo/Cashapp)</label>
                      <input value={datos.venmo} onChange={(e) => actualizar("venmo", e.target.value)}
                        placeholder="@handle"
                        className="w-full bg-transparent border-b border-black/10 py-3 text-lg focus:border-primary outline-none transition-colors placeholder:text-black/20" />
                    </div>
                    <div className="group">
                      <label className="text-[10px] uppercase tracking-widest text-black/40 mb-1 block ml-1">Musical Mood (Spotify)</label>
                      <input value={datos.spotifyUrl} onChange={(e) => actualizar("spotifyUrl", e.target.value)}
                        placeholder="https://open.spotify.com/..."
                        className="w-full bg-transparent border-b border-black/10 py-3 text-lg focus:border-primary outline-none transition-colors placeholder:text-black/20" />
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-600 text-sm mt-4 bg-red-50 p-3 rounded-lg">
                  {error}
                </motion.p>
              )}

              <div className="flex gap-4 mt-12">
                {paso > 1 && (
                  <button onClick={() => setPaso((p) => p - 1)} className="rounded-full border border-black/10 px-8 py-3 text-sm hover:bg-black/5 transition-colors">
                    Back
                  </button>
                )}
                {paso < TOTAL_PASOS ? (
                  <button
                    onClick={() => setPaso((p) => p + 1)}
                    disabled={paso === 1 && (!datos.nombreNovia || !datos.nombreNovio || !datos.email)}
                    className="rounded-full bg-foreground text-background px-10 py-3 text-sm font-medium disabled:opacity-30 hover:opacity-90 transition-all"
                  >
                    Continue
                  </button>
                ) : (
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-widest text-black/40 font-bold">Investment</p>
                      <div className="flex items-baseline gap-2 justify-end">
                        <span className="text-xs text-black/30 line-through">$1,999</span>
                        <span className="text-xl font-heading italic text-primary">$1,499</span>
                      </div>
                    </div>
                    <button onClick={confirmar} disabled={enviando}
                      className="rounded-full bg-foreground text-background px-10 py-3 text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-all shadow-lg"
                    >
                      {enviando ? "Crafting your experience..." : "Finalize & Pay"}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="lg:sticky lg:top-20 w-full lg:w-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-black/5">
            <div className="p-4 border-b border-black/5 bg-muted/20">
              <p className="text-[10px] uppercase tracking-widest text-center text-black/40 font-medium">Live Editorial Preview</p>
            </div>
            <div className="p-2">
              <VistaPreviaEstilo
                nombreNovia={datos.nombreNovia || "Sarah"}
                nombreNovio={datos.nombreNovio || "James"}
                tipografia={datos.tipografia}
                colorPrimario={datos.colorPrimario}
                colorSecundario={datos.colorSecundario}
                forma={datos.forma}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
