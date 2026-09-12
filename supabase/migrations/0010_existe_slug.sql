-- ============================================================
-- MIGRACIÓN 0010: Comprobación pública de slug disponible
-- ============================================================
-- El asistente de creación (público, sin sesión) necesita saber si
-- un slug ya está en uso, incluso entre bodas INACTIVAS, que las
-- políticas normales le ocultan a "anon". En vez de abrir la lectura
-- completa de la tabla (lo que sí expondría datos de bodas
-- inactivas), exponemos una función que SOLO devuelve true/false.
-- ============================================================

create or replace function existe_slug(p_slug text)
returns boolean
security definer
set search_path = public
language sql
as $$
  select exists(select 1 from bodas where slug = p_slug);
$$;

grant execute on function existe_slug(text) to anon;
