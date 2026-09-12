-- ============================================================
-- MIGRACIÓN 0014: Security Hardening - Custom Claims (JWT)
-- ============================================================
-- El objetivo es mover el rol y el boda_id al token JWT del usuario.
-- Esto evita consultas recursivas en RLS y mejora el performance.
-- ============================================================

-- 1. Función para actualizar los claims del usuario en auth.users
create or replace function public.handle_profile_claims_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update auth.users
  set raw_app_meta_data =
    coalesce(
      raw_app_meta_data::jsonb,
      '{}'::jsonb
    ) ||
    jsonb_build_object(
      'rol', new.rol,
      'boda_id', new.boda_id
    )
  where id = new.id;

  return new;
end;
$$;

-- 2. Trigger para que se ejecute automáticamente al crear o actualizar un perfil
drop trigger if exists on_profile_updated_claims on perfiles;
create trigger on_profile_updated_claims
  after insert or update on perfiles
  for each row
  execute function public.handle_profile_claims_update();

-- 3. Sincronización inicial: Actualizar todos los perfiles existentes
do $$
declare
  r record;
begin
  for r in select id, rol, boda_id from perfiles loop
    update auth.users
    set raw_app_meta_data =
      coalesce(
        raw_app_meta_data::jsonb,
        '{}'::jsonb
      ) ||
      jsonb_build_object(
        'rol', r.rol,
        'boda_id', r.boda_id
      )
    where id = r.id;
  end loop;
end $$;

-- 4. Actualización de las funciones ayudantes mi_rol() y mi_boda_id()
-- Ahora leerán directamente del JWT (auth.jwt()), que es instantáneo.
create or replace function mi_rol()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select nullif(current_setting('request.jwt.claims', true)::jsonb ->> 'rol', '')::text;
$$;

create or replace function mi_boda_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select nullif(current_setting('request.jwt.claims', true)::jsonb ->> 'boda_id', '')::uuid;
$$;
