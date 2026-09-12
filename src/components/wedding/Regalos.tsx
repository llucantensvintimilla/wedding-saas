import { FadeIn } from "@/components/FadeIn";
import { Ornamento, EtiquetaSeccion, type EstiloSeparador } from "@/components/wedding/Ornamento";
import { useWeddingTheme } from "@/components/wedding/WeddingThemeProvider";

type Regalo = { id: string; titulo: string; descripcion: string | null; enlace_externo: string | null };

export function Regalos({
  regalos,
  bizumNumero,
  datosTransferencia,
  titulo = "Your presence is the best gift",
  estiloSeparador = "linea",
}: {
  regalos: Regalo[];
  bizumNumero: string | null;
  datosTransferencia: string | null;
  titulo?: string;
  estiloSeparador?: EstiloSeparador;
}) {
  const { tokens } = useWeddingTheme();

  if (regalos.length === 0 && !bizumNumero && !datosTransferencia) return null;

  return (
    <section className="py-28 px-6 max-w-lg mx-auto text-center">
      <FadeIn>
        <EtiquetaSeccion>Gift</EtiquetaSeccion>
        <h2 className={`text-3xl md:text-4xl ${tokens.typography.heading} mb-6`} style={{ color: tokens.colors.primary }}>
          {titulo}
        </h2>
        <p className={`text-black/60 mb-10 ${tokens.typography.body}`}>
          But if you still want to spoil us, here are a few options.
        </p>

        <div className="space-y-4 text-left">
          {bizumNumero && (
            <div className="p-4 rounded-[var(--radio-tarjeta)] border border-black/10 flex items-center justify-between">
              <span className={`text-sm ${tokens.typography.body}`} style={{ color: tokens.colors.muted }}>Venmo</span>
              <span className={`font-medium ${tokens.typography.body}`} style={{ color: tokens.colors.text }}>{bizumNumero}</span>
            </div>
          )}
          {datosTransferencia && (
            <div className="p-4 rounded-[var(--radio-tarjeta)] border border-black/10">
              <span className={`text-sm ${tokens.typography.body} block mb-1`} style={{ color: tokens.colors.muted }}>
                Bank transfer
              </span>
              <span className={`font-medium text-sm ${tokens.typography.body}`} style={{ color: tokens.colors.text }}>{datosTransferencia}</span>
            </div>
          )}
          {regalos.map((r) => (
            <a
              key={r.id}
              href={r.enlace_externo ?? undefined}
              target={r.enlace_externo ? "_blank" : undefined}
              rel="noreferrer"
              className="block p-4 rounded-[var(--radio-tarjeta)] border border-black/10 hover:border-accent/50 transition-colors"
            >
              <p className={`font-medium ${tokens.typography.heading}`} style={{ color: tokens.colors.secondary }}>{r.titulo}</p>
              {r.descripcion && (
                <p className={`text-sm mt-1 ${tokens.typography.body}`} style={{ color: tokens.colors.muted }}>{r.descripcion}</p>
              )}
            </a>
          ))}
        </div>

        <Ornamento className="mt-10" estilo={estiloSeparador} />
      </FadeIn>
    </section>
  );
}
