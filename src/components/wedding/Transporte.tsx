import { FadeIn } from "@/components/FadeIn";
import { EtiquetaSeccion } from "@/components/wedding/Ornamento";

type ItemTransporte = { id: string; titulo: string; descripcion: string | null; horario: string | null };

export function Transporte({ items }: { items: ItemTransporte[] }) {
  if (items.length === 0) return null;

  return (
    <section className="py-16 px-6 max-w-3xl mx-auto text-center">
      <FadeIn>
        <EtiquetaSeccion>Getting around</EtiquetaSeccion>
        <div className="grid sm:grid-cols-2 gap-4 mt-6 text-left">
          {items.map((t) => (
            <div key={t.id} className="p-5 rounded-[var(--radio-tarjeta)] border border-black/10">
              <p className="font-heading text-lg text-secondary">{t.titulo}</p>
              {t.horario && (
                <p className="text-xs text-primary mt-0.5">{t.horario}</p>
              )}
              {t.descripcion && (
                <p className="text-sm text-black/50 mt-1">{t.descripcion}</p>
              )}
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
