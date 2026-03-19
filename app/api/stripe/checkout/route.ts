import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe/client'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const { productId } = await request.json() as { productId?: string }

    if (!productId) {
      return NextResponse.json({ error: 'Missing productId' }, { status: 400 })
    }

    // Fetch product from Supabase
    const supabase = createAdminClient()
    const { data: product, error } = await supabase
      .from('products')
      .select('id,name_en,stripe_price_id,price,currency,type,stock')
      .eq('id', productId)
      .eq('is_active', true)
      .single()

    if (error || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Check stock for physical products
    if (product.type === 'physical' && product.stock !== null && product.stock <= 0) {
      return NextResponse.json({ error: 'Out of stock' }, { status: 400 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

    let session
    const stripe = getStripe()

    if (product.stripe_price_id) {
      // Use existing Stripe Price ID
      session = await stripe.checkout.sessions.create({
        mode:        'payment',
        line_items:  [{ price: product.stripe_price_id, quantity: 1 }],
        success_url: `${siteUrl}/en/store/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url:  `${siteUrl}/en/store`,
        metadata:    { product_id: productId },
      })
    } else {
      // Create price on the fly (no Stripe product set up yet)
      session = await stripe.checkout.sessions.create({
        mode:       'payment',
        line_items: [
          {
            price_data: {
              currency:     product.currency ?? 'usd',
              unit_amount:  product.price,
              product_data: { name: product.name_en },
            },
            quantity: 1,
          },
        ],
        success_url: `${siteUrl}/en/store/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url:  `${siteUrl}/en/store`,
        metadata:    { product_id: productId },
      })
    }

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[stripe/checkout]', err)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
