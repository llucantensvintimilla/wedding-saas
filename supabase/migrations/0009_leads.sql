-- ============================================================
-- MIGRACIÓN 0009: Lista de espera / leads de la landing
-- ============================================================
-- Mientras no tengamos Stripe conectado, el botón principal de la
-- landing no cobra nada: solo guarda el interés del visitante para
-- que le hagas seguimiento manual. Es una tabla deliberadamente
-- simple porque es temporal — cuando conectemos pagos de verdad,
-- "leads" seguirá siendo útil para la gente que no llegó a comprar.
-- ============================================================

create table leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  nombre_pareja text,
  mensaje text,
  contactado boolean not null default false,
  created_at timestamptz not null default now()
);

alter table leads enable row level security;

-- Cualquier visitante puede dejar sus datos (insertar), pero nadie
-- público puede leer la lista de leads de otras personas.
create policy "publico_deja_lead" on leads
  for insert to anon
  with check (true);

create policy "admin_gestiona_leads" on leads
  for all to authenticated using (mi_rol() = 'admin') with check (mi_rol() = 'admin');
