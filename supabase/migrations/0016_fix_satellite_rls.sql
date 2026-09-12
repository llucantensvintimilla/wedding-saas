-- ============================================================
-- MIGRACIÓN 0016: Satellite RLS Fix (Security Definer Function)
-- ============================================================
-- Debido a que hemos quitado el acceso público a la tabla "bodas",
-- las políticas de las tablas satélite (cronograma, faqs, etc.)
-- han dejado de funcionar porque no pueden validar si la boda está activa.
-- Solucionamos esto con una función 'security definer'.
-- ============================================================

-- 1. Función que verifica si una boda está activa.
-- Se ejecuta con privilegios de Admin, saltándose la RLS de la tabla "bodas".
create or replace function public.is_boda_activa(boda_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from bodas
    where id = boda_id and activa = true
  );
$$;

-- 2. Actualización de políticas en todas las tablas satélite.
-- Sustituimos la consulta directa a "bodas" por la función is_boda_activa().

-- Cronograma
drop policy if exists "publico_lee_cronograma" on cronograma;
create policy "publico_lee_cronograma" on cronograma
  for select to anon
  using (is_boda_activa(boda_id));

-- FAQs
drop policy if exists "publico_lee_faqs" on faqs;
create policy "publico_lee_faqs" on faqs
  for select to anon
  using (is_boda_activa(boda_id));

-- Hoteles
drop policy if exists "publico_lee_hoteles" on hoteles;
create policy "publico_lee_hoteles" on hoteles
  for select to anon
  using (is_boda_activa(boda_id));

-- Transporte
drop policy if exists "publico_lee_transporte" on transporte;
create policy "publico_lee_transporte" on transporte
  for select to anon
  using (is_boda_activa(boda_id));

-- Galería Oficial
drop policy if exists "publico_lee_galeria" on galeria_oficial;
create policy "publico_lee_galeria" on galeria_oficial
  for select to anon
  using (is_boda_activa(boda_id));

-- Regalos
drop policy if exists "publico_lee_regalos" on regalos;
create policy "publico_lee_regalos" on regalos
  for select to anon
  using (is_boda_activa(boda_id));
