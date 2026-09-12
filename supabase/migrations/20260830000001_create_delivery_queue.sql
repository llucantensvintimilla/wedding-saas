-- Create delivery queue for automated emails
CREATE TABLE IF NOT EXISTS public.delivery_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  boda_id UUID REFERENCES public.bodas(id) ON DELETE CASCADE,
  scheduled_for TIMESTAMPTZ NOT NULL,
  delivered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for the scheduler
CREATE INDEX IF NOT EXISTS idx_delivery_queue_scheduled_delivered
ON public.delivery_queue (scheduled_for, delivered);
