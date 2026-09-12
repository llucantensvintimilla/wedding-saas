"use client";

import { useEffect, useState } from "react";

function calcularRestante(fechaBoda: string) {
  const objetivo = new Date(fechaBoda + "T00:00:00").getTime();
  const ahora = Date.now();
  const diff = Math.max(objetivo - ahora, 0);

  return {
    dias: Math.floor(diff / (1000 * 60 * 60 * 24)),
    horas: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutos: Math.floor((diff / (1000 * 60)) % 60),
  };
}

export function Countdown({ fechaBoda }: { fechaBoda: string }) {
  const [restante, setRestante] = useState<ReturnType<
    typeof calcularRestante
  > | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRestante(calcularRestante(fechaBoda));
    const interval = setInterval(() => {
      setRestante(calcularRestante(fechaBoda));
    }, 60_000);
    return () => clearInterval(interval);
  }, [fechaBoda]);

  if (!restante) return null;

  const unidades = [
    { valor: restante.dias, etiqueta: "Days" },
    { valor: restante.horas, etiqueta: "Hours" },
    { valor: restante.minutos, etiqueta: "Min" },
  ];

  return (
    <div className="flex justify-center gap-4 md:gap-6">
      {unidades.map((u) => (
        <div
          key={u.etiqueta}
          className="w-24 md:w-28 aspect-square rounded-[var(--radio-imagen)] border border-accent/25 bg-background/60 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center"
        >
          <p className="text-4xl md:text-5xl font-heading text-primary tabular-nums">
            {String(u.valor).padStart(2, "0")}
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-black/40 mt-1">
            {u.etiqueta}
          </p>
        </div>
      ))}
    </div>
  );
}
