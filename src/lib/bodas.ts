import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/**
 * Concepto nuevo: `cache()` de React.
 *
 * Tanto el layout como la página de una boda necesitan los mismos
 * datos (nombre, colores, etc.). Sin este envoltorio, harían dos
 * consultas idénticas a Supabase para la misma petición del navegador.
 * `cache()` hace que, DENTRO DE LA MISMA PETICIÓN, la segunda llamada
 * con el mismo slug reutilice el resultado de la primera en vez de
 * volver a preguntar a la base de datos. Es memoria de corto plazo,
 * se olvida en la siguiente petición.
 */
export const getBodaPorSlug = cache(async (slug: string) => {
  const supabase = await createClient();

  // Intentamos obtener el usuario actual para decidir qué tabla consultar
  const { data: { user } } = await supabase.auth.getUser();

  // Si no hay usuario, o es un usuario cualquiera, usamos la vista pública.
  // Si es admin o novio, la política RLS de la tabla "bodas" nos permitirá leerla.
  const table = user ? "bodas" : "public_weddings";

  const { data } = await supabase
    .from(table)
    .select("*")
    .eq("slug", slug)
    .eq("activa", true)
    .single();

  return data;
});
