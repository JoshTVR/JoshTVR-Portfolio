import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe/client'
import { createAdminClient } from '@/lib/supabase/admin'
import type Stripe from 'stripe'

// Stripe requires raw body — Next.js App Router uses Web API so body is already raw
export async function POST(request: Request) {
  const body      = await request.text()
  const signature = request.headers.get('stripe-signature') ?? ''

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('[stripe/webhook] signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      const supabase = createAdminClient()

      await supabase.from('orders').insert({
        stripe_session_id:     session.id,
        product_id:            session.metadata?.product_id ?? null,
        customer_email:        session.customer_details?.email ?? '',
        customer_name:         session.customer_details?.name ?? null,
        amount:                session.amount_total ?? 0,
        currency:              session.currency ?? 'usd',
        status:                'paid',
        stripe_payment_intent: typeof session.payment_intent === 'string'
          ? session.payment_intent
          : null,
        metadata: session.metadata ?? {},
      })

      // Decrement stock for physical products
      if (session.metadata?.product_id) {
        await supabase.rpc('decrement_stock', { product_id: session.metadata.product_id })
      }
    } catch (err) {
      console.error('[stripe/webhook] DB insert failed:', err)
      // Return 200 anyway — Stripe will not retry on 2xx
    }
  }

  return NextResponse.json({ received: true })
}
