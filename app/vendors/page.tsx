'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Vendor } from '@/types'

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVendors = async () => {
      const res = await fetch('/api/vendors')
      const data = await res.json()
      setVendors(data)
      setLoading(false)
    }

    fetchVendors()
  }, [])

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
            <th className="border p-2">Name</th>
            <th className="border p-2">City, State</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map(vendor => (
            <tr key={vendor.id} className="hover:bg-gray-100">
              <td className="border p-2">{vendor.name}</td>
              <td className="border p-2">{vendor.city}, {vendor.state}</td>
              <td className="border p-2">{vendor.phone}</td>
              <td className="border p-2">{vendor.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {vendors.length === 0 && <p className="mt-4">No vendors yet. Add one to get started.</p>}
    </div>
  )
}
