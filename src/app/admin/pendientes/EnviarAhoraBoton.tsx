"use client";

import { useState } from "react";
import { enviarAhora } from "./actions";

export function EnviarAhoraBoton({ bodaId }: { bodaId: string }) {
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "error">("idle");

  async function enviar() {
    setEstado("enviando");
    const res = await enviarAhora(bodaId);
    setEstado(res.ok ? "ok" : "error");
  }

  if (estado === "ok") {
    return <span className="text-xs text-green-700">✓ Enviado</span>;
  }

  return (
    <div className="text-right">
      <button
        onClick={enviar}
        disabled={estado === "enviando"}
        className="text-xs bg-black text-white rounded px-3 py-1.5 disabled:opacity-50"
      >
        {estado === "enviando" ? "Enviando..." : "Enviar ahora"}
      </button>
      {estado === "error" && (
        <p className="text-[10px] text-red-600 mt-1">No se pudo enviar</p>
      )}
    </div>
  );
}
