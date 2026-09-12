-- ============================================================
-- MIGRACIÓN 0007: Corregir RLS para el nuevo rol "novios"
-- ============================================================
-- Sustituimos las políticas "authenticated = acceso total" (que
-- ahora incluirían por error a los novios) por "admin = acceso
-- total", y añadimos políticas nuevas para que los novios solo
-- puedan tocar los datos DE SU PROPIA boda.
-- ============================================================

-- ---- BODAS ----
drop policy "admin_acceso_total_bodas" on bodas;
create policy "admin_acceso_total_bodas" on bodas
  for all to authenticated using (mi_rol() = 'admin') with check (mi_rol() = 'admin');

create policy "novios_ve_su_boda" on bodas
  for select to authenticated using (mi_rol() = 'novios' and id = mi_boda_id());
create policy "novios_edita_su_boda" on bodas
  for update to authenticated
  using (mi_rol() = 'novios' and id = mi_boda_id())
  with check (mi_rol() = 'novios' and id = mi_boda_id());

-- ---- COLABORADORES: sin cambios, los novios nunca acceden aquí ----
drop policy "admin_acceso_total_colaboradores" on colaboradores;
create policy "admin_acceso_total_colaboradores" on colaboradores
  for all to authenticated using (mi_rol() = 'admin') with check (mi_rol() = 'admin');

-- ---- Tablas satélite: mismo patrón para todas ----
drop policy "admin_acceso_total_invitados" on invitados;
create policy "admin_acceso_total_invitados" on invitados
  for all to authenticated using (mi_rol() = 'admin') with check (mi_rol() = 'admin');
create policy "novios_gestiona_invitados" on invitados
  for all to authenticated
  using (mi_rol() = 'novios' and boda_id = mi_boda_id())
  with check (mi_rol() = 'novios' and boda_id = mi_boda_id());

drop policy "admin_acceso_total_rsvp" on rsvp;
create policy "admin_acceso_total_rsvp" on rsvp
  for all to authenticated using (mi_rol() = 'admin') with check (mi_rol() = 'admin');
create policy "novios_ve_rsvp" on rsvp
  for select to authenticated using (mi_rol() = 'novios' and boda_id = mi_boda_id());

drop policy "admin_acceso_total_cronograma" on cronograma;
create policy "admin_acceso_total_cronograma" on cronograma
  for all to authenticated using (mi_rol() = 'admin') with check (mi_rol() = 'admin');
create policy "novios_gestiona_cronograma" on cronograma
  for all to authenticated
  using (mi_rol() = 'novios' and boda_id = mi_boda_id())
  with check (mi_rol() = 'novios' and boda_id = mi_boda_id());

drop policy "admin_acceso_total_faqs" on faqs;
create policy "admin_acceso_total_faqs" on faqs
  for all to authenticated using (mi_rol() = 'admin') with check (mi_rol() = 'admin');
create policy "novios_gestiona_faqs" on faqs
  for all to authenticated
  using (mi_rol() = 'novios' and boda_id = mi_boda_id())
  with check (mi_rol() = 'novios' and boda_id = mi_boda_id());

drop policy "admin_acceso_total_hoteles" on hoteles;
create policy "admin_acceso_total_hoteles" on hoteles
  for all to authenticated using (mi_rol() = 'admin') with check (mi_rol() = 'admin');
create policy "novios_gestiona_hoteles" on hoteles
  for all to authenticated
  using (mi_rol() = 'novios' and boda_id = mi_boda_id())
  with check (mi_rol() = 'novios' and boda_id = mi_boda_id());

drop policy "admin_acceso_total_transporte" on transporte;
create policy "admin_acceso_total_transporte" on transporte
  for all to authenticated using (mi_rol() = 'admin') with check (mi_rol() = 'admin');
create policy "novios_gestiona_transporte" on transporte
  for all to authenticated
  using (mi_rol() = 'novios' and boda_id = mi_boda_id())
  with check (mi_rol() = 'novios' and boda_id = mi_boda_id());

drop policy "admin_acceso_total_galeria" on galeria_oficial;
create policy "admin_acceso_total_galeria" on galeria_oficial
  for all to authenticated using (mi_rol() = 'admin') with check (mi_rol() = 'admin');
create policy "novios_gestiona_galeria" on galeria_oficial
  for all to authenticated
  using (mi_rol() = 'novios' and boda_id = mi_boda_id())
  with check (mi_rol() = 'novios' and boda_id = mi_boda_id());

drop policy "admin_acceso_total_fotos_invitados" on fotos_invitados;
create policy "admin_acceso_total_fotos_invitados" on fotos_invitados
  for all to authenticated using (mi_rol() = 'admin') with check (mi_rol() = 'admin');
create policy "novios_modera_fotos_invitados" on fotos_invitados
  for all to authenticated
  using (mi_rol() = 'novios' and boda_id = mi_boda_id())
  with check (mi_rol() = 'novios' and boda_id = mi_boda_id());

drop policy "admin_acceso_total_mensajes" on mensajes;
create policy "admin_acceso_total_mensajes" on mensajes
  for all to authenticated using (mi_rol() = 'admin') with check (mi_rol() = 'admin');
create policy "novios_modera_mensajes" on mensajes
  for all to authenticated
  using (mi_rol() = 'novios' and boda_id = mi_boda_id())
  with check (mi_rol() = 'novios' and boda_id = mi_boda_id());

drop policy "admin_acceso_total_regalos" on regalos;
create policy "admin_acceso_total_regalos" on regalos
  for all to authenticated using (mi_rol() = 'admin') with check (mi_rol() = 'admin');
create policy "novios_gestiona_regalos" on regalos
  for all to authenticated
  using (mi_rol() = 'novios' and boda_id = mi_boda_id())
  with check (mi_rol() = 'novios' and boda_id = mi_boda_id());
