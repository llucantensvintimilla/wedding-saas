"use client";

import { generarIcs } from "@/lib/ics";

export function AnadirCalendario({
  titulo,
  fecha,
  ubicacion,
}: {
  titulo: string;
  fecha: string;
  ubicacion: string | null;
}) {
  function descargar() {
    const contenido = generarIcs({ titulo, fecha, ubicacion });
    const blob = new Blob([contenido], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = "boda.ics";
    enlace.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={descargar}
      className="text-xs uppercase tracking-widest text-accent underline underline-offset-4 hover:opacity-70 transition-opacity mt-4"
    >
      Add to my calendar
    </button>
  );
}
