-- ============================================================
-- MIGRACIÓN 0018: Core Comercial (Orders, Payments, Referrals, Commissions)
-- ============================================================
-- Sustituimos el modelo simple de "pagada" por un sistema de
-- trazabilidad financiera profesional.
-- ============================================================

-- 1. REFERRALS (Trazabilidad de adquisición)
create table referrals (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid references colaboradores(id) on delete cascade,
  customer_email text not null,
  order_id uuid, -- Se vincula cuando el lead convierte en compra
  status text not null default 'lead' check (status in ('lead', 'converted')),
  attribution_source text, -- 'cookie', 'coupon_code', 'direct_link'
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. ORDERS (La entidad maestra de compra)
create table orders (
  id uuid primary key default gen_random_uuid(),
  customer_email text not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'cancelled', 'refunded')),
  total_amount numeric(10, 2) not null,
  currency text not null default 'USD',
  stripe_session_id text unique,
  wedding_id uuid references bodas(id) on delete set null,
  referral_id uuid references referrals(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. PAYMENTS (Registro de transacciones reales)
create table payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  stripe_payment_intent_id text unique,
  amount numeric(10, 2) not null,
  status text not null check (status in ('succeeded', 'failed', 'refunded')),
  payment_method text,
  created_at timestamptz not null default now()
);

-- 4. COMMISSION LEDGER (Libro contable de partners)
create table commission_ledger (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references colaboradores(id) on delete cascade,
  order_id uuid not null references orders(id) on delete cascade,
  amount numeric(10, 2) not null,
  status text not null default 'estimated' check (status in ('estimated', 'pending', 'confirmed', 'paid', 'reversed')),
  trigger_event text, -- 'payment_received', 'refund', 'admin_confirmed'
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================================
create index idx_orders_customer on orders(customer_email);
create index idx_orders_stripe_session on orders(stripe_session_id);
create index idx_payments_order on payments(order_id);
create index idx_referrals_partner on referrals(partner_id);
create index idx_commissions_partner on commission_ledger(partner_id);
create index idx_commissions_order on commission_ledger(order_id);

-- ============================================================
-- SEGURIDAD RLS (Tenant Isolation)
-- ============================================================

alter table referrals enable row level security;
alter table orders enable row level security;
alter table payments enable row level security;
alter table commission_ledger enable row level security;

-- ADMIN: Acceso total
create policy "admin_total_referrals" on referrals for all to authenticated using (mi_rol() = 'admin');
create policy "admin_total_orders" on orders for all to authenticated using (mi_rol() = 'admin');
create policy "admin_total_payments" on payments for all to authenticated using (mi_rol() = 'admin');
create policy "admin_total_commissions" on commission_ledger for all to authenticated using (mi_rol() = 'admin');

-- PARTNERS: Solo ven sus propios referrals y comisiones
create policy "partner_ve_sus_referrals" on referrals
  for select to authenticated
  using (mi_rol() = 'afiliado' and partner_id = mi_colaborador_id());

create policy "partner_ve_sus_comisiones" on commission_ledger
  for select to authenticated
  using (mi_rol() = 'afiliado' and partner_id = mi_colaborador_id());

-- NOVIOS: Solo ven su orden y sus pagos
create policy "novios_ve_su_orden" on orders
  for select to authenticated
  using (mi_rol() = 'novios' and wedding_id = mi_boda_id());

create policy "novios_ve_sus_pagos" on payments
  for select to authenticated
  using (mi_rol() = 'novios' and order_id in (select id from orders where wedding_id = mi_boda_id()));
