'use client'

import { useEffect, useState } from 'react'
import { Vendor } from '@/types'

interface LineItemInput {
  id: string
  description: string
  quantity: number
  unit_price: number
  tax_rate: number
}

interface POFormProps {
  onSubmit: (data: any) => void
  loading: boolean
  initialData?: any
}

export default function POForm({ onSubmit, loading, initialData }: POFormProps) {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [lineItems, setLineItems] = useState<LineItemInput[]>([
    { id: '1', description: '', quantity: 1, unit_price: 0, tax_rate: 0 },
  ])

  const [formData, setFormData] = useState({
    date: initialData?.date || new Date().toISOString().split('T')[0],
    vendor_id: initialData?.vendor_id || '',
    ship_to_address: initialData?.ship_to_address || '',
    delivery_address: initialData?.delivery_address || '',
    payment_terms: initialData?.payment_terms || '',
    notes: initialData?.notes || '',
  })

  useEffect(() => {
    const fetchVendors = async () => {
      const res = await fetch('/api/vendors')
      const data = await res.json()
      setVendors(data)
    }

    fetchVendors()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleLineItemChange = (id: string, field: string, value: any) => {
    setLineItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }

  const addLineItem = () => {
    const newId = Date.now().toString()
    setLineItems(prev => [...prev, { id: newId, description: '', quantity: 1, unit_price: 0, tax_rate: 0 }])
  }

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(prev => prev.filter(item => item.id !== id))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const data = {
      ...formData,
      line_items: lineItems.map(({ id, ...item }) => item),
    }

    onSubmit(data)
  }

  const subtotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
  const taxAmount = lineItems.reduce((sum, item) => {
    const itemAmount = item.quantity * item.unit_price
    return sum + (itemAmount * (item.tax_rate / 100))
  }, 0)
  const total = subtotal + taxAmount

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Date *</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Vendor *</label>
          <select
            name="vendor_id"
            value={formData.vendor_id}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select a vendor</option>
            {vendors.map(vendor => (
              <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
            ))}
          </select>
        </div>

        <div className="col-span-2">
          <label className="block mb-1">Ship To Address</label>
          <textarea
            name="ship_to_address"
            value={formData.ship_to_address}
            onChange={handleInputChange}
            className="w-full border p-2 rounded h-20"
          />
        </div>

        <div className="col-span-2">
          <label className="block mb-1">Delivery Address</label>
          <textarea
            name="delivery_address"
            value={formData.delivery_address}
            onChange={handleInputChange}
            className="w-full border p-2 rounded h-20"
          />
        </div>

        <div>
          <label className="block mb-1">Payment Terms</label>
          <input
            type="text"
            name="payment_terms"
            value={formData.payment_terms}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="col-span-2">
          <label className="block mb-1">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            className="w-full border p-2 rounded h-20"
          />
        </div>
      </div>

      <div className="border rounded p-4">
        <h3 className="text-lg font-bold mb-4">Line Items</h3>

        <table className="w-full border-collapse border mb-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Description</th>
              <th className="border p-2 w-20">Qty</th>
              <th className="border p-2 w-20">Rate</th>
              <th className="border p-2 w-20">Tax %</th>
              <th className="border p-2 w-24">Amount</th>
              <th className="border p-2 w-16">Delete</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map(item => {
              const amount = item.quantity * item.unit_price
              return (
                <tr key={item.id}>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleLineItemChange(item.id, 'description', e.target.value)}
                      className="w-full border p-1 rounded"
                      required
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleLineItemChange(item.id, 'quantity', parseFloat(e.target.value))}
                      className="w-full border p-1 rounded"
                      step="0.01"
                      required
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      value={item.unit_price}
                      onChange={(e) => handleLineItemChange(item.id, 'unit_price', parseFloat(e.target.value))}
                      className="w-full border p-1 rounded"
                      step="0.01"
                      required
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      value={item.tax_rate}
                      onChange={(e) => handleLineItemChange(item.id, 'tax_rate', parseFloat(e.target.value))}
                      className="w-full border p-1 rounded"
                      step="0.01"
                    />
                  </td>
                  <td className="border p-2 text-right">${amount.toFixed(2)}</td>
                  <td className="border p-2">
                    <button
                      type="button"
                      onClick={() => removeLineItem(item.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded text-sm"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <button
          type="button"
          onClick={addLineItem}
          className="bg-green-600 text-white px-4 py-2 rounded mb-4"
        >
          Add Line Item
        </button>

        <div className="space-y-2 text-right">
          <div>Subtotal: <span className="font-bold">${subtotal.toFixed(2)}</span></div>
          <div>Tax Amount: <span className="font-bold">${taxAmount.toFixed(2)}</span></div>
          <div className="text-lg">Total: <span className="font-bold">${total.toFixed(2)}</span></div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create PO'}
      </button>
    </form>
  )
}
