'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import POForm from '@/components/POForm'

export default function CreatePOPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: any) => {
    setLoading(true)

    try {
      const res = await fetch('/api/pos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        const { id } = await res.json()
        router.push(`/po/${id}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Create Purchase Order</h1>
      <POForm onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}
