-- ============================================================
-- MIGRACIÓN 0005: foto secundaria para la sección "Historia"
-- ============================================================
-- Es contenido real (una fotografía), no un ajuste de estilo, así
-- que le corresponde ser una columna propia de "bodas" -- igual que
-- imagen_portada_url -- en vez de vivir dentro del JSON de
-- "configuracion", que reservamos para colores, tipografía y
-- ajustes de presentación.
-- ============================================================

alter table bodas add column if not exists foto_secundaria_url text;
