import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente con la clave SECRETA (service_role). Se salta todas las
 * políticas de RLS, así que solo se usa para una cosa muy concreta:
 * crear la cuenta de Supabase Auth de unos novios cuando tú los
 * invitas desde el panel.
 *
 * El paquete "server-only" (primera línea) hace que, si alguien por
 * error importa este archivo desde un componente de cliente, el
 * propio proceso de build de Next.js falle con un mensaje claro —
 * una red de seguridad extra para que esta clave nunca llegue al
 * navegador.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
