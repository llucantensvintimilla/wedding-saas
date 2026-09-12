-- ============================================================
-- MIGRACIÓN 20260830000002: Estados de Producción
-- ============================================================

-- Añadimos la columna de estado de producción a la tabla bodas.
-- Este estado es independiente del estado financiero (orders/payments).
alter table bodas
add column production_status text not null default 'awaiting_payment'
check (production_status in (
  'awaiting_payment',
  'awaiting_onboarding',
  'onboarding_in_progress',
  'onboarding_completed',
  'generating',
  'ready',
  'delivered',
  'published',
  'suspended',
  'archived'
));

-- Índice para optimizar la búsqueda de bodas pendientes de entrega
create index idx_bodas_production_status on bodas(production_status);
