"use client";

import { useState } from "react";
import { invitarNovios } from "./invitar-actions";

export function InvitarNovios({ bodaId }: { bodaId: string }) {
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enlace, setEnlace] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  async function invitar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError(null);

    const formData = new FormData();
    formData.set("email", email);
    const res = await invitarNovios(bodaId, formData);

    setEnviando(false);

    if (!res.ok) {
      setError(res.error);
      return;
    }
    setEnlace(res.enlace);
  }

  function copiar() {
    if (!enlace) return;
    navigator.clipboard.writeText(enlace);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  if (enlace) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-green-700">
          ✓ Acceso creado. Copia este enlace y envíaselo a los novios (por
          email, WhatsApp, donde prefieras) — es de un solo uso y les deja
          poner su propia contraseña.
        </p>
        <div className="flex gap-2">
          <input
            readOnly
            value={enlace}
            className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-xs text-black/60"
            onFocus={(e) => e.target.select()}
          />
          <button
            onClick={copiar}
            className="rounded-lg bg-black text-white px-4 py-2 text-xs whitespace-nowrap"
          >
            {copiado ? "¡Copiado!" : "Copiar"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={invitar} className="flex gap-2">
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        required
        placeholder="email@delosnovios.com"
        className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm"
      />
      <button
        disabled={enviando}
        className="rounded-lg bg-black text-white px-4 py-2 text-sm disabled:opacity-50"
      >
        {enviando ? "Creando..." : "Invitar"}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </form>
  );
}
