"use client";

import { useState } from "react";
import { registrarInteres } from "@/app/actions";

export function FormularioInteres() {
  const [email, setEmail] = useState("");
  const [nombrePareja, setNombrePareja] = useState("");
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "error">("idle");

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEstado("enviando");

    const formData = new FormData();
    formData.set("email", email);
    formData.set("nombre_pareja", nombrePareja);

    const resultado = await registrarInteres(formData);
    setEstado(resultado.ok ? "ok" : "error");
  }

  if (estado === "ok") {
    return (
      <p className="text-center text-black/70 text-sm">
        Thank you! We&apos;ll be in touch within 24h. 🤍
      </p>
    );
  }

  return (
    <form onSubmit={enviar} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        value={nombrePareja}
        onChange={(e) => setNombrePareja(e.target.value)}
        placeholder="Your names (optional)"
        className="flex-1 rounded-full border border-black/15 bg-white px-5 py-3 text-sm text-black placeholder:text-black/30"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        required
        placeholder="Your email"
        className="flex-1 rounded-full border border-black/15 bg-white px-5 py-3 text-sm text-black placeholder:text-black/30"
      />
      <button
        disabled={estado === "enviando"}
        className="rounded-full bg-black text-white px-6 py-3 text-sm font-medium whitespace-nowrap disabled:opacity-50"
      >
        {estado === "enviando" ? "Sending..." : "Notify me"}
      </button>
      {estado === "error" && (
        <p className="text-red-600 text-xs">Something went wrong, please try again.</p>
      )}
    </form>
  );
}
