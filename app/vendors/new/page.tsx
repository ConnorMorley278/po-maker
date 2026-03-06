'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddVendorPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    email: '',
    ship_to_address: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/vendors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      router.push('/vendors')
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="text-3xl font-bold mb-6">Add Vendor</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            maxLength={2}
          />
        </div>

        <div>
          <label className="block mb-1">Zip</label>
          <input
            type="text"
            name="zip"
            value={formData.zip}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Ship To Address</label>
          <textarea
            name="ship_to_address"
            value={formData.ship_to_address}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Default shipping address for this vendor"
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Vendor
        </button>
      </form>
    </div>
  )
}
