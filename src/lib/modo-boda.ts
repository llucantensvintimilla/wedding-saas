export type ModoBoda = "antes" | "durante" | "despues";

/**
 * Compara la fecha de hoy con la fecha de la boda usando solo el
 * calendario (YYYY-MM-DD), no la hora exacta -- así toda la web
 * cambia de "modo" a las 00:00 del día de la boda, sin depender de
 * en qué zona horaria esté cada invitado.
 *
 * Simplificación consciente: usamos la fecha UTC del servidor, no la
 * zona horaria local del lugar de la boda (no la guardamos). Para el
 * caso de uso -- cambiar el contenido de la web, no coordinar nada
 * crítico en tiempo real -- es más que suficiente.
 */
export function calcularModoBoda(fechaBoda: string | null): ModoBoda {
  if (!fechaBoda) return "antes";

  const hoy = new Date().toISOString().slice(0, 10);

  if (hoy < fechaBoda) return "antes";
  if (hoy === fechaBoda) return "durante";
  return "despues";
}

/** Cuántos días completos han pasado desde la boda. Vive aquí, no
 *  dentro de un componente, porque llamar a Date.now() directamente
 *  en el cuerpo de un componente se considera una operación "impura"
 *  (podría dar un resultado distinto en cada render). */
export function calcularDiasCasados(fechaBoda: string): number {
  return Math.floor(
    (Date.now() - new Date(fechaBoda + "T00:00:00").getTime()) / (1000 * 60 * 60 * 24)
  );
}
