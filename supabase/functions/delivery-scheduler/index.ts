import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') || '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  )

  // 1. Fetch pending deliveries
  const { data: queue, error: queueError } = await supabase
    .from('delivery_queue')
    .select('*, profiles(email), bodas(slug)')
    .eq('delivered', false)
    .lte('scheduled_for', new Date().toISOString())

  if (queueError) return new Response(`Queue error: ${queueError.message}`, { status: 500 })

  // 2. Send emails via Resend
  const resend = new Request("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${Deno.env.get('RESEND_API_KEY') || ''}`
    }
  })

  for (const item of queue) {
    const email = item.profiles?.email
    const slug = item.bodas?.slug
    const bodaId = item.boda_id
    if (!email || !slug) continue

    const emailBody = {
      from: Deno.env.get('RESEND_FROM_EMAIL') || 'concierge@weddingatelier.com',
      to: [email],
      subject: 'Your Digital Wedding Experience is Ready',
      html: `
        <div style="font-family: serif; max-width: 600px; margin: 0 auto; text-align: center; padding: 40px; color: #2e2e2e;">
          <h1 style="font-style: italic; font-weight: normal; margin-bottom: 30px;">The Atelier is Complete</h1>
          <p style="line-height: 1.6; font-size: 16px;">
            We are pleased to inform you that your curated digital experience has been finalized.
            Your guests can now explore your union and confirm their attendance.
          </p>
          <div style="margin: 40px 0;">
            <a href="${Deno.env.get('NEXT_PUBLIC_SITE_URL')}/${slug}"
               style="background-color: #b08d57; color: white; padding: 15px 30px; text-decoration: none; border-radius: 50px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
               Enter Your Experience
            </a>
          </div>
          <p style="font-size: 14px; color: #888; margin-top: 40px;">
            If you wish to make further refinements, please visit your Couple's Studio.
          </p>
        </div>
      `
    }

    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Deno.env.get('RESEND_API_KEY') || ''}`
        },
        body: JSON.stringify(emailBody)
      })

      // Mark as delivered in queue
      await supabase
        .from('delivery_queue')
        .update({ delivered: true })
        .eq('id', item.id)

      // Update Wedding Production Status to 'delivered'
      if (bodaId) {
        await supabase
          .from('bodas')
          .update({
            production_status: 'delivered',
            activa: true
          })
          .eq('id', bodaId)
      }
    } catch (e) {
      console.error(`Failed to send email to ${email}:`, e)
    }
  }

  return new Response(JSON.stringify({ processed: queue.length }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
