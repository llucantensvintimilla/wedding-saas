"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { generarSlugUnico } from "@/lib/slug";
import { getStripe } from "@/lib/stripe";


export async function crearBodaDesdeAsistente(formData: FormData) {
  const nombreNovia = formData.get("nombreNovia") as string;
  const nombreNovio = formData.get("nombreNovio") as string;
  const email = formData.get("email") as string;

  if (!nombreNovia || !nombreNovio || !email) {
    return { ok: false as const, error: "Faltan datos obligatorios." };
  }

  const admin = createAdminClient();

  // 1. Gestión de Atribución (Referrals)
  const codigoReferido = (formData.get("ref") as string | null)?.trim().toUpperCase();
  let referralId: string | null = null;

  if (codigoReferido) {
    const { data: colaborador } = await admin
      .from("colaboradores")
      .select("id")
      .eq("codigo_referido", codigoReferido)
      .maybeSingle();

    if (colaborador) {
      // Creamos o recuperamos el registro de referral para este email
      const { data: existingReferral } = await admin
        .from("referrals")
        .select("id")
        .eq("customer_email", email)
        .eq("partner_id", colaborador.id)
        .maybeSingle();

      if (existingReferral) {
        referralId = existingReferral.id;
      } else {
        const { data: newReferral, error: refError } = await admin
          .from("referrals")
          .insert({
            partner_id: colaborador.id,
            customer_email: email,
            attribution_source: "assistant_wizard",
          })
          .select("id")
          .single();

        if (!refError) referralId = newReferral.id;
      }
    }
  }

  const slug = await generarSlugUnico(nombreNovia, nombreNovio);

  // 2. Creación de la Boda (Entidad Digital)
  const { data: boda, error: bodaError } = await admin
    .from("bodas")
    .insert({
      slug,
      nombre_novia: nombreNovia,
      nombre_novio: nombreNovio,
      fecha_boda: (formData.get("fechaBoda") as string) || null,
      historia_pareja: (formData.get("historiaPareja") as string) || null,
      ubicacion_ceremonia: (formData.get("ubicacionCeremonia") as string) || null,
      ubicacion_celebracion: (formData.get("ubicacionCelebracion") as string) || null,
      dress_code: (formData.get("dressCode") as string) || null,
      spotify_playlist_url: (formData.get("spotifyUrl") as string) || null,
      bizum_numero: (formData.get("venmo") as string) || null,
      configuracion: {
        tipografia: formData.get("tipografia") as string,
        color_primario: formData.get("colorPrimario") as string,
        color_secundario: formData.get("colorSecundario") as string,
        forma: formData.get("forma") as string,
      },
      activa: false,
      pagada: false,
    })
    .select("id, slug")
    .single();

  if (bodaError || !boda) {
    return { ok: false as const, error: "No se pudo crear la boda." };
  }

  // 3. Creación de la Orden (Entidad Comercial)
  const finalPrice = referralId ? 1499.00 : 1999.00;

  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      customer_email: email,
      total_amount: finalPrice,
      currency: "USD",
      status: "pending",
      wedding_id: boda.id,
      referral_id: referralId,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    // Si falla la orden, borramos la boda para no dejar basura
    await admin.from("bodas").delete().eq("id", boda.id);
    return { ok: false as const, error: "Error al procesar la orden comercial." };
  }

  // 4. Subida de Fotos (Pre-onboarding)
  const fotos = formData.getAll("foto") as File[];
  const indicePortada = Number(formData.get("indicePortada") ?? -1);

  for (let i = 0; i < fotos.length; i++) {
    const foto = fotos[i];
    if (!foto || foto.size === 0) continue;

    const nombreArchivo = `${crypto.randomUUID()}-${foto.name}`;
    const ruta = `${boda.id}/oficial/${nombreArchivo}`;

    const { error: uploadError } = await admin.storage
      .from("bodas")
      .upload(ruta, foto);

    if (uploadError) continue;

    const { data: urlData } = admin.storage.from("bodas").getPublicUrl(ruta);

    await admin.from("galeria_oficial").insert({
      boda_id: boda.id,
      url: urlData.publicUrl,
      orden: i,
    });

    if (i === indicePortada) {
      await admin
        .from("bodas")
        .update({ imagen_portada: urlData.publicUrl })
        .eq("id", boda.id);
    }
  }

  // 5. Sesión de Stripe
  try {
    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Premium Wedding Website",
              description: `Website for ${nombreNovia} & ${nombreNovio}`,
            },
            unit_amount: Math.round(finalPrice * 100), // Dynamic price based on referral
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      client_reference_id: order.id, // El centro de verdad es la ORDER
      metadata: {
        wedding_id: boda.id,
        email: email,
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/crear/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/crear`,
    });

    return { ok: true as const, url: session.url };
  } catch (e: any) {
    console.error("Stripe session error:", e);
    return { ok: false as const, error: `Stripe Error: ${e.message || "Unknown error"}` };
  }
}
