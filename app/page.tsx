'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PO } from '@/types'

export default function Dashboard() {
  const [pos, setPos] = useState<PO[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPOs = async () => {
      const res = await fetch('/api/pos')
      const data = await res.json()
      setPos(data)
      setLoading(false)
    }

    fetchPOs()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Purchase Orders</h1>

      <Link
        href="/create"
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6 inline-block"
      >
        Create New PO
      </Link>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">PO Number</th>
            <th className="border p-2">Vendor</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Total</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pos.map(po => (
            <tr key={po.id} className="hover:bg-gray-100">
              <td className="border p-2">{po.po_number}</td>
              <td className="border p-2">{po.vendors?.name || 'N/A'}</td>
              <td className="border p-2">{new Date(po.date).toLocaleDateString()}</td>
              <td className="border p-2">${po.total.toFixed(2)}</td>
              <td className="border p-2">
                <Link href={`/po/${po.id}`} className="text-blue-600">View</Link>
                {' | '}
                <Link href={`/edit/${po.id}`} className="text-green-600">Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {pos.length === 0 && <p className="mt-4">No POs yet. Create one to get started.</p>}
    </div>
  )
}
