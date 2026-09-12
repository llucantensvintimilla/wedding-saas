import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente de Supabase para usarse en Client Components,
 * es decir, código que se ejecuta en el navegador del usuario.
 *
 * Ejemplo de uso: un formulario de RSVP con un botón "Confirmar asistencia"
 * que el invitado pulsa desde su móvil.
 *
 * Usa la clave pública (publishable/anon), que está diseñada para
 * exponerse en el navegador. La seguridad real la aportan las políticas
 * de Row Level Security que definiremos en la base de datos, no el
 * secretismo de esta clave.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
