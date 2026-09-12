-- ============================================================
-- MIGRACIÓN 0017: Storage Hardening (Isolation)
-- ============================================================
-- Corregimos la política de Storage para que un usuario autenticado
-- no pueda borrar o modificar fotos de bodas que no sean la suya.
-- ============================================================

-- 1. Borramos la política permisiva actual
drop policy if exists "admin_gestiona_bucket_bodas" on storage.objects;

-- 2. Creamos la política de Admin: acceso total
create policy "admin_gestiona_storage_bodas" on storage.objects
  for all to authenticated
  using (bucket_id = 'bodas' and mi_rol() = 'admin')
  with check (bucket_id = 'bodas' and mi_rol() = 'admin');

-- 3. Creamos la política de Novios: acceso solo a su propia carpeta
-- El nombre del archivo en el bucket "bodas" empieza por el ID de la boda: {wedding_id}/...
create policy "novios_gestiona_su_storage" on storage.objects
  for all to authenticated
  using (
    bucket_id = 'bodas'
    and mi_rol() = 'novios'
    and (storage.foldername(name))[1] = mi_boda_id()::text
  )
  with check (
    bucket_id = 'bodas'
    and mi_rol() = 'novios'
    and (storage.foldername(name))[1] = mi_boda_id()::text
  );
