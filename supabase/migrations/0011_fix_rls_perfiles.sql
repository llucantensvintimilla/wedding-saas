-- ============================================================
-- MIGRACIÓN 0011: Falta la política de ESCRITURA en "perfiles"
-- ============================================================
-- La migración 0006 solo dejó una política de LECTURA ("cada uno
-- lee su propio perfil"). Nadie podía escribir ahí -- ni siquiera
-- el admin -- por eso invitar novios y afiliados daba el error
-- "new row violates row-level security policy".
-- ============================================================

create policy "admin_gestiona_perfiles" on perfiles
  for all to authenticated using (mi_rol() = 'admin') with check (mi_rol() = 'admin');
