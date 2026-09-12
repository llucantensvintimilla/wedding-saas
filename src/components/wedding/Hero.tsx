import Image from "next/image";
import type { ModoBoda } from "@/lib/modo-boda";
import { useWeddingTheme } from "@/components/wedding/WeddingThemeProvider";

export type EstiloOverlay = "oscuro" | "color" | "suave";

export function Hero({
  nombreNovia,
  nombreNovio,
  imagenPortadaUrl,
  fechaBoda,
  overlay = "oscuro",
  modo = "antes",
}: {
  nombreNovia: string;
  nombreNovio: string;
  imagenPortadaUrl: string | null;
  fechaBoda: string | null;
  overlay?: EstiloOverlay;
  modo?: ModoBoda;
}) {
  const { tokens } = useWeddingTheme();

  const fechaFormateada = fechaBoda
    ? new Date(fechaBoda + "T00:00:00").toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const etiquetaSuperior =
    modo === "durante"
      ? "Today"
      : modo === "despues"
        ? fechaFormateada
          ? `Married on ${fechaFormateada}`
          : "Just married"
        : fechaFormateada;

  const claseOverlay = {
    oscuro: "bg-gradient-to-t from-black/70 via-black/10 to-transparent",
    color: `bg-gradient-to-t from-[${tokens.colors.secondary}]/85 via-[${tokens.colors.secondary}]/20 to-transparent`,
    suave: "bg-gradient-to-t from-black/40 via-black/5 to-transparent",
  }[overlay];

  return (
    <section className="relative h-[100svh] w-full flex flex-col items-center justify-end overflow-hidden">
      {imagenPortadaUrl ? (
        <Image
          src={imagenPortadaUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover scale-105 animate-[heroZoom_9s_ease-out_forwards]"
        />
      ) : (
        <div className="absolute inset-0" style={{ backgroundColor: tokens.colors.secondary }} />
      )}
      <div className={`absolute inset-0 ${claseOverlay}`} />

      <div className="relative z-10 text-center text-white pb-20 px-6 animate-[heroFadeUp_1.2s_ease-out_forwards] opacity-0">
        {etiquetaSuperior && (
          <p className={`text-xs md:text-sm tracking-[0.35em] uppercase opacity-90 mb-4 ${tokens.typography.body}`}>
            {etiquetaSuperior}
          </p>
        )}
        <h1 className={`text-5xl md:text-7xl leading-[1.1] ${tokens.typography.heading}`}>
          {nombreNovia}
          <span className="block text-3xl md:text-4xl my-1 opacity-70 font-normal italic">
            &amp;
          </span>
          {nombreNovio}
        </h1>
      </div>

      <div className="relative z-10 mb-8 flex flex-col items-center gap-2 text-white/70 animate-[bounceSoft_2.4s_ease-in-out_infinite]">
        <span className="text-[10px] tracking-[0.3em] uppercase">Scroll to discover</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <style>{`
        @keyframes heroZoom {
          from { transform: scale(1.12); }
          to { transform: scale(1); }
        }
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(16px); filter: blur(8px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes bounceSoft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
      `}</style>
    </section>
  );
}
