'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Vendor } from '@/types'

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    const fetchVendors = async () => {
      const res = await fetch('/api/vendors')
      const data = await res.json()
      setVendors(data)
      setLoading(false)
    }

    fetchVendors()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vendor?')) return

    setDeleting(id)
    try {
      const res = await fetch(`/api/vendors/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setVendors(vendors.filter(v => v.id !== id))
      } else {
        alert('Error deleting vendor')
      }
    } catch (error) {
      alert('Error deleting vendor')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Vendors</h1>

      <Link
        href="/vendors/new"
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6 inline-block"
      >
        Add Vendor
      </Link>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 w-56">Name</th>
            <th className="border p-2">Address</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Email</th>
            <th className="border p-2 w-40">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map(vendor => (
            <tr key={vendor.id} className="hover:bg-gray-100">
              <td className="border p-2">{vendor.name}</td>
              <td className="border p-2">{vendor.address}<br/>{vendor.city}, {vendor.state} {vendor.zip}</td>
              <td className="border p-2">{vendor.phone}</td>
              <td className="border p-2">{vendor.email}</td>
              <td className="border p-2 flex gap-2">
                <Link
                  href={`/vendors/${vendor.id}/edit`}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(vendor.id)}
                  disabled={deleting === vendor.id}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:bg-gray-400"
                >
                  {deleting === vendor.id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {vendors.length === 0 && <p className="mt-4">No vendors yet. Add one to get started.</p>}
    </div>
  )
}
