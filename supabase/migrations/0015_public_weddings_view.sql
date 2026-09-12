-- ============================================================
-- MIGRACIÓN 0015: Public Weddings View (Data Leak Prevention)
-- ============================================================
-- El objetivo es evitar que el frontend público acceda a la tabla
-- "bodas" directamente, exponiendo campos sensibles (emails, enlaces
-- de acceso, IDs de colaboradores).
-- ============================================================

-- 1. Creamos la Vista Pública con los campos estrictamente necesarios.
-- Usamos security_invoker = false para que la vista se ejecute con
-- los privilegios del creador (admin), permitiendo que el público vea
-- los datos sin tener acceso directo a la tabla base.
create view public_weddings with (security_invoker = false) as
select
  id,
  slug,
  nombre_novia,
  nombre_novio,
  fecha_boda,
  historia_pareja,
  imagen_portada_url,
  ubicacion_ceremonia,
  ubicacion_celebracion,
  lat,
  lng,
  dress_code,
  spotify_playlist_url,
  bizum_numero,
  datos_transferencia,
  configuracion,
  activa
from bodas
where activa = true;

-- 2. Quitamos el acceso público directo a la tabla "bodas".
-- Ahora el público NO puede hacer SELECT a la tabla, solo a la vista.
drop policy if exists "publico_lee_bodas_activas" on bodas;

-- 3. Damos permiso al rol "anon" para leer la vista.
grant select on table public_weddings to anon;
grant select on table public_weddings to authenticated;
