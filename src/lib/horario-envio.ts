const ZONA_HORARIA = "America/New_York";
const HORA_MANANA = 9; // 9:00 AM ET
const HORA_TARDE = 16; // 4:00 PM ET

/** Cuántas horas hay que sumar a la hora "de pared" de una zona
 *  horaria para obtener la hora UTC real (cambia sola con el
 *  horario de verano, sin que tengamos que gestionarlo a mano). */
function desfaseHorasUTC(zona: string): number {
  const ahora = new Date();
  const utc = new Date(ahora.toLocaleString("en-US", { timeZone: "UTC" }));
  const local = new Date(ahora.toLocaleString("en-US", { timeZone: zona }));
  return (utc.getTime() - local.getTime()) / 3_600_000;
}

/**
 * Si el pedido llega en la primera mitad del día (00:00-11:59 ET),
 * se envía esa misma tarde (16:00 ET). Si llega en la segunda mitad
 * (12:00-23:59 ET), se envía a la mañana siguiente (9:00 ET).
 * Nunca hace esperar más de ~20h, y siempre dentro de horario
 * razonable para EE.UU. -- nunca un email a las 3 de la madrugada.
 */
export function calcularEnvioProgramado(): Date {
  const desfase = desfaseHorasUTC(ZONA_HORARIA);
  const ahoraLocal = new Date(new Date().toLocaleString("en-US", { timeZone: ZONA_HORARIA }));

  const primeraMitadDelDia = ahoraLocal.getHours() < 12;
  const objetivoLocal = new Date(ahoraLocal);

  if (primeraMitadDelDia) {
    objetivoLocal.setHours(HORA_TARDE, 0, 0, 0);
  } else {
    objetivoLocal.setDate(objetivoLocal.getDate() + 1);
    objetivoLocal.setHours(HORA_MANANA, 0, 0, 0);
  }

  return new Date(objetivoLocal.getTime() + desfase * 3_600_000);
}
