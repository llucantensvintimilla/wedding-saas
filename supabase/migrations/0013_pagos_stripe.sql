-- ============================================================
-- MIGRACIÓN 0013: Control de pagos (Stripe)
-- ============================================================

-- Añadimos la columna pagada para diferenciar bodas creadas
-- a través del asistente que aún no han sido abonadas.
alter table bodas add column pagada boolean not null default false;
