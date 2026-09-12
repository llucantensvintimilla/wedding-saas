import Image from "next/image";
import { FadeIn } from "@/components/FadeIn";
import { Ornamento, EtiquetaSeccion, type EstiloSeparador } from "@/components/wedding/Ornamento";
import { useWeddingTheme } from "@/components/wedding/WeddingThemeProvider";

export function Historia({
  texto,
  fotoUrl,
  titulo = "How it all began",
  estiloSeparador = "linea",
}: {
  texto: string | null;
  fotoUrl: string | null;
  titulo?: string;
  estiloSeparador?: EstiloSeparador;
}) {
  const { tokens } = useWeddingTheme();

  if (!texto) return null;

  if (fotoUrl) {
    return (
      <section className="py-28 px-6 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <FadeIn>
            <div className="relative aspect-[4/5] rounded-[var(--radio-imagen)] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
              <Image
                src={fotoUrl}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </FadeIn>
          <FadeIn delay={120}>
            <EtiquetaSeccion>Our story</EtiquetaSeccion>
            <h2 className={`text-3xl md:text-4xl ${tokens.typography.heading} mb-6`} style={{ color: tokens.colors.primary }}>
              {titulo}
            </h2>
            <p className={`leading-loose whitespace-pre-line text-[15px] md:text-base ${tokens.typography.body}`} style={{ color: tokens.colors.text }}>
              {texto}
            </p>
            <Ornamento className="mt-10" align="start" estilo={estiloSeparador} />
          </FadeIn>
        </div>
      </section>
    );
  }

  return (
    <section className="py-28 px-6 max-w-2xl mx-auto text-center">
      <FadeIn>
        <EtiquetaSeccion>Our story</EtiquetaSeccion>
        <h2 className={`text-3xl md:text-4xl ${tokens.typography.heading} mb-8`} style={{ color: tokens.colors.primary }}>
          {titulo}
        </h2>
        <p className={`leading-loose whitespace-pre-line text-[15px] md:text-base ${tokens.typography.body}`} style={{ color: tokens.colors.text }}>
          {texto}
        </p>
        <Ornamento className="mt-10" estilo={estiloSeparador} />
      </FadeIn>
    </section>
  );
}
