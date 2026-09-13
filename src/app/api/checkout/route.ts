import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { REFERRAL_COOKIE_NAME } from '@/lib/referrals';

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    const supabase = await createClient();
    const stripe = getStripe();

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user || user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Handle Referral Attribution
    const cookieStore = await cookies();
    const referralCode = cookieStore.get(REFERRAL_COOKIE_NAME)?.value;
    let referralId: string | null = null;

    if (referralCode) {
      // Find the partner with this code
      const { data: partner } = await supabase
        .from('colaboradores')
        .select('id')
        .eq('codigo_referido', referralCode)
        .maybeSingle();

      if (partner) {
        // Create or find the referral record for this customer
        const { data: referral, error: refError } = await supabase
          .from('referrals')
          .upsert({
            partner_id: partner.id,
            customer_email: user.email!,
            status: 'lead',
            attribution_source: 'cookie',
          }, { onConflict: 'customer_email' }) // This assumes customer_email is unique or handled
          .select()
          .single();

        if (!refError && referral) {
          referralId = referral.id;
        }
      }
    }

    // 2. Check for existing pending order to avoid duplicates
    const { data: existingOrder, error: orderCheckError } = await supabase
      .from('orders')
      .select('id')
      .eq('customer_email', user.email!)
      .eq('status', 'pending')
      .maybeSingle();

    let orderId = existingOrder?.id;

    // 3. Create a new Order if none exists
    if (!orderId) {
      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_email: user.email!,
          total_amount: 1499.00,
          currency: 'USD',
          status: 'pending',
          referral_id: referralId,
        })
        .select()
        .single();

      if (orderError) {
        console.error('Order creation error:', orderError);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
      }
      orderId = newOrder.id;
    } else if (referralId) {
      // Update existing pending order with referral if found now
      await supabase
        .from('orders')
        .update({ referral_id: referralId })
        .eq('id', orderId);
    }

    // 4. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Luxury Wedding Website Experience',
              description: 'Full-service premium digital wedding experience with personalized curation.',
            },
            unit_amount: 149900, // $1,499.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      client_reference_id: orderId, // Use Order ID as reference
      metadata: {
        customer_email: user.email!,
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
