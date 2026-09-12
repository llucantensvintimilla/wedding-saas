import { FadeIn } from "@/components/FadeIn";
import { Ornamento, EtiquetaSeccion, type EstiloSeparador } from "@/components/wedding/Ornamento";
import { useWeddingTheme } from "@/components/wedding/WeddingThemeProvider";

export function DressCode({
  texto,
  paleta,
  titulo = "What to wear",
  estiloSeparador = "linea",
}: {
  texto: string | null;
  paleta: string[];
  titulo?: string;
  estiloSeparador?: EstiloSeparador;
}) {
  const { tokens } = useWeddingTheme();

  if (!texto && paleta.length === 0) return null;

  return (
    <section className="py-28 px-6 max-w-xl mx-auto text-center">
      <FadeIn>
        <EtiquetaSeccion>Dress code</EtiquetaSeccion>
        <h2 className={`text-3xl md:text-4xl ${tokens.typography.heading} mb-6`} style={{ color: tokens.colors.primary }}>
          {titulo}
        </h2>
        {texto && (
          <p className={`leading-relaxed mb-10 ${tokens.typography.body}`} style={{ color: tokens.colors.text }}>{texto}</p>
        )}

        {paleta.length > 0 && (
          <div className="flex items-center justify-center gap-4 md:gap-6">
            {paleta.map((color, i) => (
              <div
                key={i}
                className="h-12 w-12 md:h-14 md:w-14 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.15)] ring-1 ring-black/5 transition-transform hover:scale-110"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        )}

        <Ornamento className="mt-10" estilo={estiloSeparador} />
      </FadeIn>
    </section>
  );
}
