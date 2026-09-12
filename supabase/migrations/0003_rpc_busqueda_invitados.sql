-- ============================================================
-- MIGRACIÓN 0003: Búsqueda segura de invitados para el RSVP
-- ============================================================
-- Recordatorio de la Fase 4: la tabla "invitados" no tiene ninguna
-- política pública de lectura, precisamente para que nadie pueda
-- descargar la lista completa (con emails y teléfonos).
--
-- Esta función resuelve el problema de otra forma: en vez de abrir
-- la tabla entera, exponemos una "puerta estrecha" que solo permite
-- buscar por nombre, y solo devuelve el mínimo imprescindible
-- (id, nombre, cuántos acompañantes tiene permitidos) — nunca el
-- email ni el teléfono.
--
-- "security definer" significa que la función se ejecuta con los
-- permisos de quien la creó (tú, el propietario de la base de
-- datos), no con los del visitante anónimo que la llama. Es lo que
-- le permite "asomarse" a la tabla invitados aunque el rol "anon"
-- no tenga permiso directo sobre ella.
-- ============================================================

create or replace function buscar_invitado(p_boda_id uuid, p_busqueda text)
returns table (
  id uuid,
  nombre_completo text,
  num_acompanantes_permitidos int
)
security definer
set search_path = public
language sql
as $$
  select id, nombre_completo, num_acompanantes_permitidos
  from invitados
  where boda_id = p_boda_id
    and nombre_completo ilike '%' || p_busqueda || '%'
  limit 8;
$$;

-- Permitimos que cualquier visitante público (anon) ejecute esta
-- función concreta, aunque no tenga acceso directo a la tabla.
grant execute on function buscar_invitado(uuid, text) to anon;
