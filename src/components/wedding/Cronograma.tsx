import { FadeIn } from "@/components/FadeIn";
import { Ornamento, EtiquetaSeccion, type EstiloSeparador } from "@/components/wedding/Ornamento";
import { LineaTiempo } from "@/components/wedding/LineaTiempo";
import { useWeddingTheme } from "@/components/wedding/WeddingThemeProvider";

type ItemCronograma = { id: string; hora: string; titulo: string; descripcion: string | null };

export function Cronograma({
  items,
  titulo = "Schedule",
  estiloSeparador = "linea",
}: {
  items: ItemCronograma[];
  titulo?: string;
  estiloSeparador?: EstiloSeparador;
}) {
  const { tokens } = useWeddingTheme();

  if (items.length === 0) return null;

  return (
    <section className="py-28 px-6 max-w-lg mx-auto text-center">
      <FadeIn>
        <EtiquetaSeccion>The big day</EtiquetaSeccion>
        <h2 className={`text-3xl md:text-4xl ${tokens.typography.heading} mb-12`} style={{ color: tokens.colors.primary }}>
          {titulo}
        </h2>
      </FadeIn>

      <div className="text-left space-y-8 relative">
        <LineaTiempo />

        {items.map((item, i) => (
          <FadeIn key={item.id} delay={i * 80}>
            <div className="flex gap-6 items-start relative">
              <span className={`w-20 shrink-0 text-sm font-medium text-right pt-0.5 ${tokens.typography.body}`} style={{ color: tokens.colors.accent }}>
                {item.hora}
              </span>
              <span className="h-2.5 w-2.5 rounded-full relative z-10 shrink-0" style={{ backgroundColor: tokens.colors.accent }} />
              <div>
                <p className={`text-lg ${tokens.typography.heading}`} style={{ color: tokens.colors.secondary }}>
                  {item.titulo}
                </p>
                {item.descripcion && (
                  <p className={`text-sm mt-1 ${tokens.typography.body}`} style={{ color: tokens.colors.muted }}>
                    {item.descripcion}
                  </p>
                )}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn>
        <Ornamento className="mt-12" estilo={estiloSeparador} />
      </FadeIn>
    </section>
  );
}
