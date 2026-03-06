'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [dateTime, setDateTime] = useState('')

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      const easternTime = now.toLocaleString('en-US', {
        timeZone: 'America/New_York',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })
      setDateTime(easternTime)
    }

    updateDateTime()
    const interval = setInterval(updateDateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex gap-6">
          <Link href="/" className="font-bold">PO Maker</Link>
          <Link href="/">Dashboard</Link>
          <Link href="/create">Create PO</Link>
          <Link href="/vendors">Vendors</Link>
          <Link href="/settings">Settings</Link>
        </div>
        <div className="text-sm">{dateTime}</div>
      </div>
    </nav>
  )
}
