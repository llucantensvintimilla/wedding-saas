-- ============================================================
-- MIGRACIÓN 0008: Sistema de afiliados (reutiliza colaboradores)
-- ============================================================

-- El check constraint de "rol" solo admitía admin/novios. Hay que
-- rehacerlo para añadir "afiliado".
alter table perfiles drop constraint perfiles_rol_check;
alter table perfiles add constraint perfiles_rol_check
  check (rol in ('admin', 'novios', 'afiliado'));

-- Un perfil de tipo "afiliado" se vincula a un colaborador, no a
-- una boda.
alter table perfiles add column if not exists colaborador_id uuid
  references colaboradores(id) on delete cascade;

-- Código corto que el colaborador comparte (ej: "MARIA10") para que
-- se le atribuya la venta.
alter table colaboradores add column if not exists codigo_referido text unique;

-- Cada fila es una boda vendida: cuánto se cobró, cuánta comisión
-- corresponde y si ya se ha pagado. Se crea manualmente desde el
-- panel de admin al dar de alta una boda (hasta que haya cobro
-- automatizado con Stripe, que es el siguiente paso del documento).
create table ventas (
  id uuid primary key default gen_random_uuid(),
  boda_id uuid not null references bodas(id) on delete cascade,
  colaborador_id uuid references colaboradores(id) on delete set null,
  importe numeric(10, 2) not null,
  comision numeric(10, 2) not null default 300,
  comision_pagada boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_ventas_colaborador on ventas(colaborador_id);

alter table ventas enable row level security;

-- Ayudante: "¿a qué colaborador pertenece quien pregunta?" (mismo
-- patrón que mi_rol() y mi_boda_id() de la migración 0006).
create or replace function mi_colaborador_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select colaborador_id from perfiles where id = auth.uid();
$$;

create policy "admin_acceso_total_ventas" on ventas
  for all to authenticated using (mi_rol() = 'admin') with check (mi_rol() = 'admin');

-- El afiliado solo VE (nunca edita) sus propias ventas y comisiones.
create policy "afiliado_ve_sus_ventas" on ventas
  for select to authenticated
  using (mi_rol() = 'afiliado' and colaborador_id = mi_colaborador_id());

-- El afiliado también puede leer su propia fila de colaboradores
-- (para ver su nombre y código de referido), pero ninguna otra.
create policy "afiliado_ve_su_colaborador" on colaboradores
  for select to authenticated
  using (mi_rol() = 'afiliado' and id = mi_colaborador_id());
