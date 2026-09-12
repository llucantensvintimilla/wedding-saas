"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { EtiquetaSeccion } from "@/components/wedding/Ornamento";
import { FadeIn } from "@/components/FadeIn";
import { useWeddingTheme } from "@/components/wedding/WeddingThemeProvider";

type Foto = {
  id: string;
  url: string;
  nombreSubidoPor?: string | null;
  esOficial?: boolean;
};

export function Galeria({
  bodaId,
  fotosIniciales,
  titulo = "Moments",
}: {
  bodaId: string;
  fotosIniciales: Foto[];
  titulo?: string;
}) {
  const supabase = createClient();
  const { tokens } = useWeddingTheme();

  const [nombreSubida, setNombreSubida] = useState("");
  const [fotoAbierta, setFotoAbierta] = useState<number | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [mensajeSubida, setMensajeSubida] = useState<string | null>(null);

  async function subirFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setSubiendo(true);
    setMensajeSubida(null);

    const nombreArchivo = `${crypto.randomUUID()}-${file.name}`;
    const ruta = `${bodaId}/invitados/${nombreArchivo}`;

    const { error: uploadError } = await supabase.storage
      .from("bodas")
      .upload(ruta, file);

    if (uploadError) {
      setSubiendo(false);
      setMensajeSubida("Could not upload the photo. Please try again.");
      return;
    }

    const { data: urlData } = supabase.storage.from("bodas").getPublicUrl(ruta);

    const { error: insertError } = await supabase.from("fotos_invitados").insert({
      boda_id: bodaId,
      url: urlData.publicUrl,
      estado: "pendiente",
      nombre_subido_por: nombreSubida.trim() || null,
    });

    setSubiendo(false);

    if (insertError) {
      setMensajeSubida("The photo uploaded, but could not be saved.");
      return;
    }

    setMensajeSubida(
      "Thank you! Your photo will be reviewed before appearing in the gallery."
    );
  }

  const subidor = (
    <SubidorFoto
      tokens={tokens}
      nombreSubida={nombreSubida}
      onNombreChange={setNombreSubida}
      subiendo={subiendo}
      mensaje={mensajeSubida}
      onSubir={subirFoto}
    />
  );

  if (fotosIniciales.length === 0) {
    return (
      <section className="py-28 px-6 max-w-lg mx-auto text-center">
        <FadeIn>
          <EtiquetaSeccion>Gallery</EtiquetaSeccion>
          <h2 className={`text-3xl ${tokens.typography.heading} mb-6`} style={{ color: tokens.colors.primary }}>
            {titulo}
          </h2>
          {subidor}
        </FadeIn>
      </section>
    );
  }

  return (
    <section className="py-28 px-6 max-w-4xl mx-auto text-center">
      <FadeIn>
        <EtiquetaSeccion>Gallery</EtiquetaSeccion>
        <h2 className={`text-3xl md:text-4xl ${tokens.typography.heading} mb-10`} style={{ color: tokens.colors.primary }}>
          {titulo}
        </h2>
      </FadeIn>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {fotosIniciales.map((foto, i) => (
          <FadeIn key={foto.id} delay={(i % 6) * 60}>
            <button
              onClick={() => setFotoAbierta(i)}
              className="relative block aspect-square w-full overflow-hidden rounded-[var(--radio-imagen)] group"
            >
              <Image
                src={foto.url}
                alt=""
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {foto.nombreSubidoPor && (
                <span className="absolute bottom-1.5 left-1.5 text-[10px] text-white bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  {foto.nombreSubidoPor}
                </span>
              )}
            </button>
          </FadeIn>
        ))}
      </div>

      <div className="mt-12 max-w-sm mx-auto">{subidor}</div>

      {fotoAbierta !== null && (
        <VisorFotos
          fotos={fotosIniciales}
          indiceInicial={fotoAbierta}
          onCerrar={() => setFotoAbierta(null)}
        />
      )}
    </section>
  );
}

function SubidorFoto({
  tokens,
  nombreSubida,
  onNombreChange,
  subiendo,
  mensaje,
  onSubir,
}: {
  tokens: any;
  nombreSubida: string;
  onNombreChange: (v: string) => void;
  subiendo: boolean;
  mensaje: string | null;
  onSubir: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-2">
      <input
        value={nombreSubida}
        onChange={(e) => onNombreChange(e.target.value)}
        placeholder="Your name (to credit the photo)"
        className={`w-full rounded-[var(--radio-control)] border border-black/10 px-4 py-2 text-sm text-center ${tokens.typography.body}`}
      />
      <label className="block cursor-pointer rounded-[var(--radio-control)] border border-dashed border-black/20 p-6 text-sm text-black/60 hover:border-accent/50 transition-colors">
        {subiendo ? "Uploading..." : "Upload a wedding photo"}
        <input
          type="file"
          accept="image/*"
          onChange={onSubir}
          disabled={subiendo}
          className="hidden"
        />
        {mensaje && <p className="text-xs mt-2" style={{ color: tokens.colors.accent }}>{mensaje}</p>}
      </label>
    </div>
  );
}

function VisorFotos({
  fotos,
  indiceInicial,
  onCerrar,
}: {
  fotos: Foto[];
  indiceInicial: number;
  onCerrar: () => void;
}) {
  const [indice, setIndice] = useState(indiceInicial);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [descargando, setDescargando] = useState(false);

  const foto = fotos[indice];

  function anterior() {
    setIndice((i) => (i === 0 ? fotos.length - 1 : i - 1));
  }
  function siguiente() {
    setIndice((i) => (i === fotos.length - 1 ? 0 : i + 1));
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") anterior();
      if (e.key === "ArrowRight") siguiente();
      if (e.key === "Escape") onCerrar();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fotos.length]);

  function onTouchStart(e: React.TouchEvent) {
    setTouchStartX(e.touches[0].clientX);
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (delta > 50) anterior();
    if (delta < -50) siguiente();
    setTouchStartX(null);
  }

  async function compartir() {
    if (navigator.share) {
      try {
        await navigator.share({ url: foto.url });
      } catch {
        // the user cancelled the share dialog, do nothing
      }
    } else {
      await navigator.clipboard.writeText(foto.url);
    }
  }

  async function descargar() {
    setDescargando(true);
    try {
      const respuesta = await fetch(foto.url);
      const blob = await respuesta.blob();
      const url = URL.createObjectURL(blob);
      const enlace = document.createElement("a");
      enlace.href = url;
      enlace.download = `foto-boda-${foto.id}.jpg`;
      enlace.click();
      URL.revokeObjectURL(url);
    } finally {
      setDescargando(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4"
      onClick={onCerrar}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="relative w-full max-w-2xl h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image src={foto.url} alt="" fill sizes="100vw" className="object-contain" />
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          anterior();
        }}
        aria-label="Previous photo"
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
      >
        ←
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          siguiente();
        }}
        aria-label="Next photo"
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
      >
        →
      </button>

      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 text-white text-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {foto.nombreSubidoPor && (
          <span className="opacity-70">Uploaded by {foto.nombreSubidoPor}</span>
        )}
        <button onClick={compartir} className="underline underline-offset-4">
          Share
        </button>
        <button onClick={descargar} disabled={descargando} className="underline underline-offset-4">
          {descargando ? "Downloading..." : "Download"}
        </button>
      </div>

      <button
        onClick={onCerrar}
        aria-label="Close"
        className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl leading-none"
      >
        ×
      </button>
    </div>
  );
}
