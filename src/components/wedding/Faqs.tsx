import { FadeIn } from "@/components/FadeIn";
import { EtiquetaSeccion } from "@/components/wedding/Ornamento";
import { useWeddingTheme } from "@/components/wedding/WeddingThemeProvider";

type Faq = { id: string; pregunta: string; respuesta: string };

export function Faqs({
  faqs,
  titulo = "Everything you need to know",
}: {
  faqs: Faq[];
  titulo?: string;
}) {
  const { tokens } = useWeddingTheme();

  if (faqs.length === 0) return null;

  return (
    <section className="py-28 px-6 max-w-2xl mx-auto text-center">
      <FadeIn>
        <EtiquetaSeccion>FAQ</EtiquetaSeccion>
        <h2 className={`text-3xl md:text-4xl ${tokens.typography.heading} mb-10`} style={{ color: tokens.colors.primary }}>
          {titulo}
        </h2>
      </FadeIn>

      <div className="text-left divide-y divide-black/10 border-t border-b border-black/10">
        {faqs.map((f, i) => (
          <FadeIn key={f.id} delay={i * 60}>
            <details className="group py-4">
              <summary className={`cursor-pointer list-none flex items-center justify-between font-medium ${tokens.typography.heading}`} style={{ color: tokens.colors.secondary }}>
                {f.pregunta}
                <span className="transition-transform group-open:rotate-45 text-xl leading-none" style={{ color: tokens.colors.accent }}>
                  +
                </span>
              </summary>
              <p className={`text-sm mt-3 leading-relaxed ${tokens.typography.body}`} style={{ color: tokens.colors.text }}>
                {f.respuesta}
              </p>
            </details>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
