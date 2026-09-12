import { Playfair_Display, Cormorant_Garamond, Manrope, Inter, Work_Sans } from "next/font/google";

/**
 * Catálogo cerrado de combinaciones tipográficas.
 *
 * Por qué un catálogo y no texto libre: cada fuente que añadimos aquí
 * se optimiza automáticamente por next/font (se descarga una vez en
 * el build, no en el navegador de cada visitante) y se prueba que
 * combina bien antes de estar disponible. Desde el panel de admin,
 * el colaborador elegirá una de estas 3 claves ("elegante", "clasico",
 * "moderno") en un desplegable — nunca el nombre de una fuente a mano.
 *
 * Para añadir una cuarta combinación en el futuro: se define aquí una
 * vez, y queda disponible para las próximas mil bodas sin más trabajo.
 */

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600"],
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600"],
});
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600"],
});
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const workSans = Work_Sans({ subsets: ["latin"], variable: "--font-body" });

export const fontPairs = {
  elegante: { heading: playfair, body: inter },
  clasico: { heading: cormorant, body: workSans },
  moderno: { heading: manrope, body: inter },
} as const;

export type TipografiaKey = keyof typeof fontPairs;

/** Clases CSS a aplicar en el <html> o contenedor de la boda */
export function getFontClassNames(key: TipografiaKey): string {
  const pair = fontPairs[key] ?? fontPairs.elegante;
  return `${pair.heading.variable} ${pair.body.variable}`;
}
