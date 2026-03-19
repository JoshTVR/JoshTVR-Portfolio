'use client'

import { useState } from 'react'

interface CheckoutButtonProps {
  productId:    string
  label:        string
  outOfStock?:  boolean
  disabled?:    boolean
}

export function CheckoutButton({ productId, label, outOfStock = false, disabled = false }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  async function handleBuy() {
    if (outOfStock || disabled || loading) return
    setLoading(true)
    setError(null)

    try {
      const res  = await fetch('/api/stripe/checkout', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ productId }),
      })
      const json = await res.json() as { url?: string; error?: string }
      if (!res.ok || !json.url) throw new Error(json.error ?? 'Checkout failed')
      window.location.href = json.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleBuy}
        disabled={outOfStock || disabled || loading}
        className="btn btn-primary"
        style={{
          fontSize: '0.88rem',
          padding:  '10px 22px',
          opacity:  outOfStock || disabled ? 0.5 : 1,
          cursor:   outOfStock || disabled ? 'not-allowed' : 'pointer',
          width:    '100%',
        }}
      >
        {loading ? 'Redirecting…' : outOfStock ? 'Out of Stock' : label}
      </button>
      {error && (
        <p style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '8px', textAlign: 'center' }}>
          {error}
        </p>
      )}
    </div>
  )
}
