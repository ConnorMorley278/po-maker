'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const PREDEFINED_UOMS = ['EA', 'CS']

export default function NewItemPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [customUOM, setCustomUOM] = useState('')
  const [formData, setFormData] = useState({
    sku: '',
    description: '',
    uom: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (name === 'uom' && value !== 'OTHER') {
      setCustomUOM('')
    }
  }

  const handleCustomUOMChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomUOM(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const uomValue = formData.uom === 'OTHER' ? customUOM : formData.uom

      if (!uomValue) {
        alert('Please select or enter a UOM')
        setLoading(false)
        return
      }

      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku: formData.sku,
          description: formData.description,
          uom: uomValue,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to create item')
      }

      router.push('/items')
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to create item'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="text-3xl font-bold mb-6">Create New Item</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">SKU *</label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Description *</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Unit of Measure (UOM) *</label>
          <select
            name="uom"
            value={formData.uom}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select UOM</option>
            {PREDEFINED_UOMS.map(uom => (
              <option key={uom} value={uom}>
                {uom}
              </option>
            ))}
            <option value="OTHER">Other</option>
          </select>
        </div>

        {formData.uom === 'OTHER' && (
          <div>
            <label className="block mb-1">Enter Custom UOM *</label>
            <input
              type="text"
              value={customUOM}
              onChange={handleCustomUOMChange}
              className="w-full border p-2 rounded"
              placeholder="e.g., BOX, PALLET"
              required
            />
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Item'}
          </button>
          <Link
            href="/items"
            className="bg-gray-400 text-white px-6 py-2 rounded text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
