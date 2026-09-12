import { FadeIn } from "@/components/FadeIn";
import { Ornamento, EtiquetaSeccion, type EstiloSeparador } from "@/components/wedding/Ornamento";
import { useWeddingTheme } from "@/components/wedding/WeddingThemeProvider";

export function Ubicacion({
  ceremonia,
  celebracion,
  lat,
  lng,
  titulo = "Location",
  estiloSeparador = "linea",
}: {
  ceremonia: string | null;
  celebracion: string | null;
  lat: number | null;
  lng: number | null;
  titulo?: string;
  estiloSeparador?: EstiloSeparador;
}) {
  const { tokens } = useWeddingTheme();

  if (!ceremonia && !celebracion) return null;

  const srcMapa =
    lat && lng
      ? `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`
      : `https://www.google.com/maps?q=${encodeURIComponent(
          celebracion ?? ceremonia ?? ""
        )}&z=13&output=embed`;

  return (
    <section className="py-28 px-6 max-w-3xl mx-auto text-center">
      <FadeIn>
        <EtiquetaSeccion>Getting there</EtiquetaSeccion>
        <h2 className={`text-3xl md:text-4xl ${tokens.typography.heading} mb-10`} style={{ color: tokens.colors.primary }}>
          {titulo}
        </h2>

        <div className="grid sm:grid-cols-2 gap-8 text-left mb-10">
          {ceremonia && (
            <div className={tokens.typography.body}>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: tokens.colors.accent }}>
                Ceremony
              </p>
              <p style={{ color: tokens.colors.text }}>{ceremonia}</p>
            </div>
          )}
          {celebracion && (
            <div className={tokens.typography.body}>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: tokens.colors.accent }}>
                Reception
              </p>
              <p style={{ color: tokens.colors.text }}>{celebracion}</p>
            </div>
          )}
        </div>

        <div className="rounded-[var(--radio-imagen)] overflow-hidden shadow-sm h-72">
          <iframe
            title="Wedding location"
            src={srcMapa}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
          />
        </div>

        <Ornamento className="mt-10" estilo={estiloSeparador} />
      </FadeIn>
    </section>
  );
}
