-- ============================================================
-- MIGRACIÓN 0006: Sistema de roles (admin / novios)
-- ============================================================

-- Cada fila conecta un usuario de Supabase Auth con un rol y,
-- si es "novios", con la boda a la que pertenece.
create table perfiles (
  id uuid primary key references auth.users(id) on delete cascade,
  rol text not null check (rol in ('admin', 'novios')),
  boda_id uuid references bodas(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table perfiles enable row level security;

-- Cualquier usuario autenticado puede leer SU PROPIO perfil (para
-- que el middleware sepa qué rol tiene) pero no el de los demás.
create policy "leer_propio_perfil" on perfiles
  for select to authenticated
  using (id = auth.uid());

-- ============================================================
-- Funciones ayudantes: "¿qué rol tiene quien pregunta?" y
-- "¿a qué boda pertenece?". Se usan dentro de las políticas RLS
-- de TODAS las demás tablas.
-- ============================================================
create or replace function mi_rol()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select rol from perfiles where id = auth.uid();
$$;

create or replace function mi_boda_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select boda_id from perfiles where id = auth.uid();
$$;
