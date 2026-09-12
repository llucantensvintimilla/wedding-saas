import { FadeIn } from "@/components/FadeIn";
import { EtiquetaSeccion } from "@/components/wedding/Ornamento";

type Hotel = { id: string; nombre: string; descripcion: string | null; enlace: string | null };

export function Hoteles({ hoteles }: { hoteles: Hotel[] }) {
  if (hoteles.length === 0) return null;

  return (
    <section className="py-16 px-6 max-w-3xl mx-auto text-center">
      <FadeIn>
        <EtiquetaSeccion>Where to stay</EtiquetaSeccion>
        <div className="grid sm:grid-cols-2 gap-4 mt-6 text-left">
          {hoteles.map((h) => (
            <a
              key={h.id}
              href={h.enlace ?? undefined}
              target={h.enlace ? "_blank" : undefined}
              rel="noreferrer"
              className="block p-5 rounded-[var(--radio-tarjeta)] border border-black/10 hover:border-accent/50 transition-colors"
            >
              <p className="font-heading text-lg text-secondary">{h.nombre}</p>
              {h.descripcion && (
                <p className="text-sm text-black/50 mt-1">{h.descripcion}</p>
              )}
            </a>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
