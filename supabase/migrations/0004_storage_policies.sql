-- ============================================================
-- MIGRACIÓN 0004: Seguridad del Storage (fotos)
-- ============================================================
-- Antes de ejecutar esto, crea manualmente un bucket llamado "bodas"
-- desde el dashboard de Supabase: Storage -> New bucket -> nombre
-- "bodas" -> marca "Public bucket". Que sea público solo afecta a la
-- LECTURA (cualquiera puede ver la foto con su URL) — la escritura
-- (subir/borrar) la controlan estas políticas de aquí abajo.
--
-- Organizamos los archivos en carpetas así:
--   bodas/{id-de-la-boda}/oficial/foto1.jpg     <- solo el admin sube aquí
--   bodas/{id-de-la-boda}/invitados/foto2.jpg   <- cualquier invitado puede subir aquí
--
-- storage.foldername(name) descompone la ruta en un array de
-- carpetas. Por ejemplo, para "abc123/invitados/foto2.jpg" devuelve
-- ['abc123', 'invitados']. Usamos la posición 2 para saber en qué
-- subcarpeta se está intentando escribir.
-- ============================================================

-- El admin (tú) puede hacer lo que quiera dentro del bucket "bodas"
create policy "admin_gestiona_bucket_bodas" on storage.objects
  for all to authenticated
  using (bucket_id = 'bodas')
  with check (bucket_id = 'bodas');

-- El público solo puede SUBIR (insertar) dentro de la subcarpeta
-- "invitados" de cualquier boda — nunca en "oficial", y nunca
-- sobrescribir o borrar nada ya subido.
create policy "publico_sube_a_invitados" on storage.objects
  for insert to anon
  with check (
    bucket_id = 'bodas'
    and (storage.foldername(name))[2] = 'invitados'
  );
