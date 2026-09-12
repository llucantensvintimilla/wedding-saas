/** Genera el contenido de un archivo .ics (formato estándar de
 *  calendario, compatible con Google Calendar, Apple Calendar y
 *  Outlook) para que el invitado pueda "guardar la fecha" con un
 *  solo clic, sin necesidad de ninguna API externa de pago. */
export function generarIcs({
  titulo,
  fecha,
  ubicacion,
}: {
  titulo: string;
  fecha: string; // formato YYYY-MM-DD
  ubicacion: string | null;
}): string {
  const fechaCompacta = fecha.replace(/-/g, "");

  const lineas = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//WeddingSaaS//ES",
    "BEGIN:VEVENT",
    `UID:${fechaCompacta}-${titulo.replace(/\s+/g, "")}@wedding-saas`,
    `DTSTART;VALUE=DATE:${fechaCompacta}`,
    `SUMMARY:${titulo}`,
    ubicacion ? `LOCATION:${ubicacion}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);

  return lineas.join("\r\n");
}
