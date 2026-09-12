-- ============================================================
-- MIGRACIÓN 0012: Entrega programada a las 24h
-- ============================================================
-- Cuando alguien crea su boda desde el asistente (/crear), no le
-- mandamos el acceso al instante: lo dejamos preparado y programado
-- para 24h después. Esto da: (a) sensación de cuidado artesanal, y
-- (b) una ventana real para que el admin pueda revisarlo antes de
-- que salga, si quiere.
-- ============================================================

alter table bodas add column if not exists acceso_email text;
alter table bodas add column if not exists acceso_enlace text;
alter table bodas add column if not exists acceso_enviado boolean not null default false;
alter table bodas add column if not exists acceso_programado_en timestamptz;
