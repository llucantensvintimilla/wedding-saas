"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { verificarAcceso } from "./acceso-actions";

export function PasswordGate({ slug }: { slug: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [cargando, setCargando] = useState(false);

  async function comprobar(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError(false);
    const { ok } = await verificarAcceso(slug, password);
    setCargando(false);
    if (ok) {
      // La cookie ya se ha guardado en el servidor; refrescamos para
      // que el layout la detecte y muestre el contenido real.
      router.refresh();
    } else {
      setError(true);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={comprobar} className="w-full max-w-sm text-center space-y-4">
        <h1 className="text-xl font-heading text-secondary">
          This wedding is private
        </h1>
        <p className="text-sm text-black/50">
          Enter the password the couple shared with you.
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-black/10 px-4 py-2 text-sm text-center"
          autoFocus
        />
        {error && (
          <p className="text-sm text-red-600">Incorrect password.</p>
        )}
        <button
          disabled={cargando}
          className="w-full rounded-lg bg-black text-white py-2 text-sm font-medium disabled:opacity-50"
        >
          {cargando ? "Checking..." : "Enter"}
        </button>
      </form>
    </div>
  );
}
