import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

let stripeInstance: Stripe | null = null;

export function getStripe() {
  if (stripeInstance) return stripeInstance;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not defined in environment variables.');
  }

  stripeInstance = new Stripe(key, {
    apiVersion: '2026-08-26.dahlia',
  });

  return stripeInstance;
}
