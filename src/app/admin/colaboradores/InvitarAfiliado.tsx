"use client";

import { useState } from "react";
import { invitarAfiliado } from "./actions";

export function InvitarAfiliado({
  colaboradorId,
  codigoSugerido,
}: {
  colaboradorId: string;
  codigoSugerido: string;
}) {
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState(codigoSugerido);
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
    formData.set("codigo_referido", codigo);
    const res = await invitarAfiliado(colaboradorId, formData);

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
      <div className="mt-3 space-y-2">
        <p className="text-xs text-green-700">
          ✓ Acceso creado. Copia el enlace y envíaselo tú (no depende de que
          un email llegue solo):
        </p>
        <div className="flex gap-2">
          <input
            readOnly
            value={enlace}
            className="flex-1 rounded-lg border border-black/10 px-2 py-1.5 text-xs text-black/60"
            onFocus={(e) => e.target.select()}
          />
          <button
            onClick={copiar}
            className="rounded-lg bg-black text-white px-3 py-1.5 text-xs whitespace-nowrap"
          >
            {copiado ? "¡Copiado!" : "Copiar"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={invitar} className="flex gap-2 mt-3">
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        required
        placeholder="email del colaborador"
        className="flex-1 rounded-lg border border-black/10 px-2 py-1.5 text-xs"
      />
      <input
        value={codigo}
        onChange={(e) => setCodigo(e.target.value.toUpperCase())}
        required
        placeholder="CÓDIGO"
        className="w-28 rounded-lg border border-black/10 px-2 py-1.5 text-xs uppercase"
      />
      <button
        disabled={enviando}
        className="rounded-lg bg-black text-white px-3 py-1.5 text-xs whitespace-nowrap disabled:opacity-50"
      >
        {enviando ? "Creando..." : "Invitar acceso"}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </form>
  );
}
