export type EstiloSeparador = "linea" | "floral" | "ninguno";

export function Ornamento({
  className = "",
  align = "center",
  estilo = "linea",
}: {
  className?: string;
  align?: "center" | "start";
  estilo?: EstiloSeparador;
}) {
  if (estilo === "ninguno") return null;

  const justificar = align === "start" ? "justify-start" : "justify-center";

  if (estilo === "floral") {
    return (
      <div className={`flex items-center gap-3 ${justificar} ${className}`}>
        <span className="h-px w-8 bg-accent/30" />
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-accent">
          <path
            d="M12 3c1.2 2 1.2 4-.2 5.5C13.4 7 15.6 7 17.5 8.6c-1.9 1.1-3.7.9-5-.4.9 1.9.4 3.8-1.5 5-1-1.7-.9-3.5.3-4.8-1.9 1-3.7.6-5-1 1.9-.6 3.5.1 4.3 1.8-1.6-.9-2.5-2.3-2.4-4.2C9.8 6.4 10.8 4.5 12 3z"
            fill="currentColor"
          />
        </svg>
        <span className="h-px w-8 bg-accent/30" />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${justificar} ${className}`}>
      <span className="h-px w-10 bg-accent/40" />
      <span className="h-1.5 w-1.5 rotate-45 bg-accent" />
      <span className="h-px w-10 bg-accent/40" />
    </div>
  );
}

/** Pequeña etiqueta en mayúsculas espaciadas, tipo "cabecera editorial" */
export function EtiquetaSeccion({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs tracking-[0.35em] uppercase text-accent font-medium mb-4">
      {children}
    </p>
  );
}
