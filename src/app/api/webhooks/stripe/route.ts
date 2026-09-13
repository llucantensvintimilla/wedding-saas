import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { calcularEnvioProgramado } from "@/lib/horario-envio";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") as string;
  const stripe = getStripe();

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.client_reference_id;
    const email = session.customer_details?.email;

    if (!orderId || !email) {
      return NextResponse.json({ error: "Missing essential metadata (Order ID or Email)" }, { status: 400 });
    }

    const admin = createAdminClient();

    // 1. IDEMPOTENCIA: Verificar estado de la orden
    const { data: order, error: orderFetchError } = await admin
      .from("orders")
      .select("status, referral_id")
      .eq("id", orderId)
      .single();

    if (orderFetchError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status === "paid") {
      return NextResponse.json({ message: "Order already processed" }, { status: 200 });
    }

    // 2. Actualizar Orden y crear Pago
    const { error: orderUpdateError } = await admin
      .from("orders")
      .update({ status: "paid" })
      .eq("id", orderId);

    if (orderUpdateError) {
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }

    const { error: paymentError } = await admin.from("payments").insert({
      order_id: orderId,
      stripe_payment_intent_id: session.payment_intent as string,
      amount: session.amount_total ?? 0,
      status: "succeeded",
      payment_method: session.payment_method_types?.[0] ?? "card",
    });

    if (paymentError) {
      console.error("Payment record error:", paymentError);
    }

    // 3. Crear Boda (Placeholder) para permitir el onboarding
    // Generamos un slug temporal basado en el email o un random
    const tempSlug = `wedding-${Math.random().toString(36).substring(2, 15)}`;

    const { data: boda, error: bodaError } = await admin
      .from("bodas")
      .insert({
        slug: tempSlug,
        nombre_novia: "Pending",
        nombre_novio: "Pending",
        activa: false,
        production_status: "awaiting_onboarding",
      })
      .select()
      .single();

    if (bodaError) {
      console.error("Boda placeholder creation error:", bodaError);
    } else if (boda) {
      // Actualizar la orden con la boda creada
      await admin.from("orders").update({ wedding_id: boda.id }).eq("id", orderId);
    }

    // 4. Gestión de Comisiones (Estimated)
    if (order.referral_id) {
      const { data: referral } = await admin
        .from("referrals")
        .select("partner_id")
        .eq("id", order.referral_id)
        .single();

      if (referral) {
        const { error: commError } = await admin.from("commission_ledger").insert({
          partner_id: referral.partner_id,
          order_id: orderId,
          amount: 300.00,
          status: "estimated",
          trigger_event: "payment_received",
        });

        if (commError) console.error("Commission ledger error:", commError);
      }
    }

    // 5. Provisioning de Cuenta (Acceso Novios)
    const { data: inviteData, error: inviteError } = await admin.auth.admin.generateLink({
      type: "invite",
      email,
    });

    if (!inviteError && inviteData.user) {
      await admin.from("perfiles").insert({
        id: inviteData.user.id,
        rol: "novios",
        boda_id: boda?.id,
      });

      const enlaceAcceso = inviteData.properties.action_link;
      const programadoPara = calcularEnvioProgramado().toISOString();

      if (boda) {
        await admin
          .from("bodas")
          .update({
            acceso_email: email,
            acceso_enlace: enlaceAcceso,
            acceso_programado_en: programadoPara,
          })
          .eq("id", boda.id);
      }
    } else if (inviteError) {
      console.error("Auth provisioning error:", inviteError.message);
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
