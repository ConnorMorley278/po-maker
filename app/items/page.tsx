'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Item } from '@/types'

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch('/api/items')
        if (!res.ok) {
          throw new Error('Failed to fetch items')
        }
        const data = await res.json()
        if (Array.isArray(data)) {
          setItems(data)
        } else {
          setError('Unexpected response format')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch items')
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    setDeleting(id)
    try {
      const res = await fetch(`/api/items/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setItems(items.filter(i => i.id !== id))
      } else {
        alert('Error deleting item')
      }
    } catch (error) {
      alert('Error deleting item')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-600">Error: {error}</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Items</h1>

      <Link
        href="/items/new"
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6 inline-block"
      >
        Add Item
      </Link>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">SKU</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">UOM</th>
            <th className="border p-2 w-40">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className="hover:bg-gray-100">
              <td className="border p-2">{item.sku}</td>
              <td className="border p-2">{item.description}</td>
              <td className="border p-2">{item.uom}</td>
              <td className="border p-2 flex gap-2">
                <Link
                  href={`/items/${item.id}/edit`}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deleting === item.id}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:bg-gray-400"
                >
                  {deleting === item.id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {items.length === 0 && <p className="mt-4">No items yet. Add one to get started.</p>}
    </div>
  )
}
