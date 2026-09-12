"use client";

import { useEffect, useState } from "react";
import { useWeddingTheme } from "@/components/wedding/WeddingThemeProvider";

export type SeccionNav = { id: string; etiqueta: string };

export function Navegacion({
  nombreCorto,
  secciones,
}: {
  nombreCorto: string;
  secciones: SeccionNav[];
}) {
  const [scrolleado, setScrolleado] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { tokens } = useWeddingTheme();

  useEffect(() => {
    function onScroll() {
      setScrolleado(window.scrollY > 80);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function irA(id: string) {
    setMenuAbierto(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  const claseNav = scrolleado
    ? "bg-background/90 backdrop-blur-md shadow-sm"
    : "bg-transparent text-white";

  const textColor = scrolleado ? tokens.colors.secondary : "white";

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-500 ${claseNav}`}
      style={{ color: textColor }}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
        <button
          onClick={() => irA("inicio")}
          className={`text-lg tracking-wide ${tokens.typography.heading}`}
        >
          {nombreCorto}
        </button>

        {/* Menú de escritorio */}
        <ul className={`hidden md:flex items-center gap-8 text-xs tracking-[0.2em] uppercase ${tokens.typography.body}`}>
          {secciones.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => irA(s.id)}
                className="relative pb-1 opacity-90 hover:opacity-100 transition-opacity group/link"
              >
                {s.etiqueta}
                <span className="absolute left-1/2 -translate-x-1/2 bottom-0 h-px w-0 bg-current transition-all duration-300 group-hover/link:w-full" />
              </button>
            </li>
          ))}
        </ul>

        {/* Botón de menú móvil */}
        <button
          onClick={() => setMenuAbierto((v) => !v)}
          className="md:hidden"
          aria-label="Open menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Menú móvil desplegable */}
      {menuAbierto && (
        <ul
          className={`md:hidden px-6 pb-6 flex flex-col gap-4 text-sm uppercase tracking-widest ${tokens.typography.body}`}
          style={{ backgroundColor: tokens.colors.background, color: tokens.colors.secondary }}
        >
          {secciones.map((s) => (
            <li key={s.id}>
              <button onClick={() => irA(s.id)}>{s.etiqueta}</button>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
