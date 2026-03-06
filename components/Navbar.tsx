import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex gap-6">
        <Link href="/" className="font-bold">PO Maker</Link>
        <Link href="/">Dashboard</Link>
        <Link href="/create">Create PO</Link>
        <Link href="/vendors">Vendors</Link>
      </div>
    </nav>
  )
}
