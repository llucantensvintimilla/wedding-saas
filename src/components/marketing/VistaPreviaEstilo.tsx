"use client";

import { getFontClassNames, type TipografiaKey } from "@/lib/fonts";

export function VistaPreviaEstilo({
  nombreNovia,
  nombreNovio,
  tipografia,
  colorPrimario,
  colorSecundario,
  forma,
}: {
  nombreNovia: string;
  nombreNovio: string;
  tipografia: TipografiaKey;
  colorPrimario: string;
  colorSecundario: string;
  forma: "nitido" | "suave" | "redondeado";
}) {
  const radio = { nitido: "4px", suave: "20px", redondeado: "9999px" }[forma];
  const radioTarjeta = { nitido: "4px", suave: "16px", redondeado: "28px" }[forma];

  return (
    <div
      className={`${getFontClassNames(
        tipografia
      )} rounded-2xl overflow-hidden border border-black/10 bg-white shadow-sm`}
    >
      <div
        className="h-40 flex items-center justify-center text-white text-center px-4"
        style={{ backgroundColor: colorSecundario || "#2e2e2e" }}
      >
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase opacity-70 mb-2">
            Live preview
          </p>
          <p className="font-heading text-2xl leading-tight">
            {nombreNovia || "Name"}
            <span className="italic opacity-70 mx-1">&amp;</span>
            {nombreNovio || "Name"}
          </p>
        </div>
      </div>
      <div className="p-5 space-y-3">
        <div
          className="h-9 w-full flex items-center justify-center text-white text-xs font-medium"
          style={{ backgroundColor: colorPrimario || "#b08d57", borderRadius: radio }}
        >
          Sample button
        </div>
        <div
          className="h-16 w-full border border-black/10 flex items-center justify-center text-xs text-black/40"
          style={{ borderRadius: radioTarjeta }}
        >
          This is how your cards will look
        </div>
      </div>
    </div>
  );
}
