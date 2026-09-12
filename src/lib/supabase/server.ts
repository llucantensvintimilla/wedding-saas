import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cliente de Supabase para usarse en Server Components,
 * es decir, código que se ejecuta en el servidor (no en el navegador).
 *
 * Ejemplo de uso: la página app/[slug]/page.tsx, que necesita cargar
 * los datos de una boda concreta ANTES de enviar el HTML al visitante.
 *
 * Gestiona las cookies de sesión para que, cuando tú (admin) inicies
 * sesión en el panel, el servidor sepa quién eres en cada petición.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Se puede ignorar si esto se llama desde un Server Component.
            // Next.js refresca la sesión automáticamente en el middleware.
          }
        },
      },
    }
  );
}
