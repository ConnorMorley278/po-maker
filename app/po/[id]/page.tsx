'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { PO } from '@/types'

export default function POViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [po, setPO] = useState<(PO & { vendors: any }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    const fetchPO = async () => {
      const res = await fetch(`/api/pos/${id}`)
      const data = await res.json()
      setPO(data)
      setLoading(false)
    }

    fetchPO()
  }, [id])

  const handleDownloadPDF = async () => {
    setExporting(true)
    try {
      const { jsPDF } = await import('jspdf')
      const pdf = new jsPDF('p', 'mm', 'letter')

      let yPos = 20

      // Company header
      pdf.setFontSize(14)
      pdf.text('C Morley Tech Services', 20, yPos)
      yPos += 5
      pdf.setFontSize(10)
      pdf.text('130 N Hamilton St, STE B102', 20, yPos)
      yPos += 4
      pdf.text('Georgetown, KY 40324', 20, yPos)
      yPos += 4
      pdf.text('(502) 497-1812', 20, yPos)

      // Title and PO number
      pdf.setFontSize(28)
      pdf.text('PURCHASE ORDER', 120, 25)
      pdf.setFontSize(11)
      pdf.text(`# ${po?.po_number}`, 120, 40)

      yPos = 55

      // Vendor section
      pdf.setFontSize(10)
      pdf.setFont(undefined, 'bold')
      pdf.text('Vendor:', 20, yPos)
      pdf.setFont(undefined, 'normal')
      yPos += 5
      pdf.text(po?.vendors?.name || '', 20, yPos)
      yPos += 4
      pdf.text(po?.vendors?.address || '', 20, yPos)
      yPos += 4
      pdf.text(`${po?.vendors?.city}, ${po?.vendors?.state} ${po?.vendors?.zip}`, 20, yPos)

      // Ship To section
      yPos = 55
      pdf.setFont(undefined, 'bold')
      pdf.text('Ship To:', 120, yPos)
      pdf.setFont(undefined, 'normal')
      yPos += 5
      pdf.text(po?.ship_to_address || '', 120, yPos, { maxWidth: 80 })

      yPos += 20
      pdf.setFont(undefined, 'bold')
      pdf.text('Date:', 120, yPos)
      pdf.setFont(undefined, 'normal')
      yPos += 5
      pdf.text(new Date(po?.date || '').toLocaleDateString(), 120, yPos)

      yPos = 100

      // Table headers
      pdf.setFillColor(50, 50, 50)
      pdf.setTextColor(255, 255, 255)
      pdf.setFont(undefined, 'bold')
      pdf.rect(20, yPos, 170, 6, 'F')
      pdf.text('Item & Description', 22, yPos + 4)
      pdf.text('Qty', 130, yPos + 4)
      pdf.text('Rate', 150, yPos + 4)
      pdf.text('Amount', 170, yPos + 4)

      yPos += 8
      pdf.setTextColor(0, 0, 0)
      pdf.setFont(undefined, 'normal')

      // Line items
      po?.line_items?.forEach((item: any) => {
        pdf.text(item.description, 22, yPos)
        pdf.text(item.quantity.toString(), 130, yPos)
        pdf.text(`$${parseFloat(item.unit_price).toFixed(2)}`, 150, yPos)
        pdf.text(`$${parseFloat(item.amount).toFixed(2)}`, 170, yPos)
        yPos += 6
      })

      yPos += 5

      // Totals
      pdf.setFont(undefined, 'normal')
      pdf.text('Tax Exempt Amount:', 120, yPos)
      pdf.text(`$${parseFloat(po?.tax_exempt_amount || 0).toFixed(2)}`, 170, yPos)
      yPos += 8
      pdf.setFont(undefined, 'bold')
      pdf.setFontSize(12)
      pdf.text('Total:', 120, yPos)
      pdf.text(`$${parseFloat(po?.total || 0).toFixed(2)}`, 170, yPos)

      pdf.save(`${po?.po_number}.pdf`)
    } catch (error) {
      console.error('Error downloading PDF:', error)
      alert('Error downloading PDF')
    } finally {
      setExporting(false)
    }
  }

  if (loading) return <div>Loading...</div>
  if (!po) return <div>PO not found</div>

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{po.po_number}</h1>
        <div className="space-x-2">
          <button
            onClick={handleDownloadPDF}
            disabled={exporting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {exporting ? 'Saving...' : 'Save as PDF'}
          </button>
          <Link href={`/edit/${po.id}`} className="bg-green-600 text-white px-4 py-2 rounded inline-block">
            Edit
          </Link>
          <Link href="/" className="bg-gray-600 text-white px-4 py-2 rounded inline-block">
            Back
          </Link>
        </div>
      </div>

      <div className="space-y-6 border rounded p-6 bg-white">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Vendor</p>
            <p className="font-bold">{po.vendors?.name}</p>
            <p className="text-sm">{po.vendors?.address}</p>
          </div>
          <div>
            <p className="text-gray-600">Date</p>
            <p className="font-bold">{new Date(po.date).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-600">Ship To</p>
            <p className="text-sm whitespace-pre">{po.ship_to_address}</p>
          </div>
          <div>
            <p className="text-gray-600">Payment Terms</p>
            <p className="font-bold">{po.payment_terms}</p>
          </div>
        </div>

        <div>
          <p className="text-gray-600">Delivery Address</p>
          <p className="text-sm whitespace-pre">{po.delivery_address}</p>
        </div>

        <div>
          <p className="text-gray-600">Notes</p>
          <p className="text-sm whitespace-pre">{po.notes}</p>
        </div>

        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-left">Description</th>
              <th className="border p-2 w-20">Qty</th>
              <th className="border p-2 w-20">Rate</th>
              <th className="border p-2 w-24">Amount</th>
            </tr>
          </thead>
          <tbody>
            {po.line_items?.map(item => (
              <tr key={item.id}>
                <td className="border p-2">{item.description}</td>
                <td className="border p-2 text-right">{item.quantity}</td>
                <td className="border p-2 text-right">${item.unit_price.toFixed(2)}</td>
                <td className="border p-2 text-right">${item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right space-y-2">
          <div>Tax Exempt Amount: <span className="font-bold">${po.tax_exempt_amount.toFixed(2)}</span></div>
          <div className="text-lg border-t pt-2">Total: <span className="font-bold">${po.total.toFixed(2)}</span></div>
        </div>
      </div>
    </div>
  )
}
