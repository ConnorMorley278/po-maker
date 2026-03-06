'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Vendor } from '@/types'

export default function EditVendorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchVendor = async () => {
      const res = await fetch(`/api/vendors/${id}`)
      if (res.ok) {
        const data = await res.json()
        setVendor(data)
      } else {
        setError('Vendor not found')
      }
      setLoading(false)
    }

    fetchVendor()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (vendor) {
      setVendor({
        ...vendor,
        [e.target.name]: e.target.value,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vendor) return

    setSaving(true)
    setError('')

    try {
      const res = await fetch(`/api/vendors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendor),
      })

      if (res.ok) {
        router.push('/vendors')
      } else {
        setError('Error saving vendor')
      }
    } catch (err) {
      setError('Error saving vendor')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-600">{error}</div>
  if (!vendor) return <div>Vendor not found</div>

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Edit Vendor</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded border space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={vendor.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={vendor.address}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              type="text"
              name="city"
              value={vendor.city}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <input
              type="text"
              name="state"
              value={vendor.state}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">ZIP</label>
            <input
              type="text"
              name="zip"
              value={vendor.zip}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={vendor.phone}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="text"
              name="email"
              value={vendor.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ship To Address</label>
          <textarea
            name="ship_to_address"
            value={vendor.ship_to_address || ''}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Default shipping address for this vendor"
            rows={3}
          />
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <Link href="/vendors" className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
