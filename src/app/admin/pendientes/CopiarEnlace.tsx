"use client";

import { useState } from "react";

export function CopiarEnlace({ enlace }: { enlace: string }) {
  const [copiado, setCopiado] = useState(false);

  function copiar() {
    navigator.clipboard.writeText(enlace);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <button
      onClick={copiar}
      className="text-xs border border-black/15 rounded px-3 py-1.5"
    >
      {copiado ? "¡Copiado!" : "Copiar enlace"}
    </button>
  );
}
