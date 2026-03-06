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
      const html2canvas = (await import('html2canvas')).default

      // Create a printable version of the PO
      const element = document.createElement('div')
      element.style.padding = '40px'
      element.style.backgroundColor = 'white'
      element.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
          <div>
            <div style="font-weight: bold;">C Morley Tech Services</div>
            <div>130 N Hamilton St, STE B102</div>
            <div>Georgetown, KY 40324</div>
            <div>(502) 497-1812</div>
          </div>
          <div>
            <div style="font-size: 32px; font-weight: bold;">PURCHASE ORDER</div>
            <div style="font-size: 14px;"># ${po?.po_number}</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
          <div>
            <div style="font-weight: bold;">Vendor:</div>
            <div>${po?.vendors?.name}</div>
            <div>${po?.vendors?.address}</div>
            <div>${po?.vendors?.city}, ${po?.vendors?.state} ${po?.vendors?.zip}</div>
          </div>
          <div>
            <div style="font-weight: bold;">Ship To:</div>
            <div>${po?.ship_to_address}</div>
            <div style="margin-top: 20px;">
              <div style="font-weight: bold;">Date:</div>
              <div>${new Date(po?.date || '').toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #333; color: white;">
              <th style="padding: 12px; text-align: left;">Item & Description</th>
              <th style="padding: 12px; text-align: center;">Qty</th>
              <th style="padding: 12px; text-align: right;">Rate</th>
              <th style="padding: 12px; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${po?.line_items?.map((item: any) => `
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #ddd;">${item.description}</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right;">$${parseFloat(item.unit_price).toFixed(2)}</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right;">$${parseFloat(item.amount).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="text-align: right; margin-top: 20px;">
          <div>Tax Exempt Amount: <span style="font-weight: bold;">$${parseFloat(po?.tax_exempt_amount || 0).toFixed(2)}</span></div>
          <div style="margin-top: 10px; font-size: 18px;">
            Total <span style="font-weight: bold;">$${parseFloat(po?.total || 0).toFixed(2)}</span>
          </div>
        </div>
      `

      const canvas = await html2canvas(element, { scale: 2 })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'letter')

      const imgWidth = 190
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight)

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
