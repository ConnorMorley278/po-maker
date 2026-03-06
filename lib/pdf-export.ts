import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import { PO, Vendor } from '@/types'

declare module 'jspdf' {
  interface jsPDF {
    autoTable: any
    lastAutoTable: any
  }
}

export function generatePOPDF(po: PO & { vendors: Vendor }) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  let yPos = 20

  // Header
  doc.setFontSize(10)
  doc.text('C Morley Tech Services', 20, yPos)
  doc.setFontSize(8)
  doc.text('130 N Hamilton St, STE B102, Georgetown, KY 40324', 20, yPos + 5)
  doc.text('(502) 497-1812', 20, yPos + 10)

  // PO Title
  doc.setFontSize(24)
  doc.setFont('', 'bold')
  doc.text('PURCHASE ORDER', pageWidth - 20, yPos + 15, { align: 'right' })

  // PO Number
  doc.setFontSize(12)
  doc.text(`# ${po.po_number}`, pageWidth - 20, yPos + 25, { align: 'right' })

  yPos += 40

  // Vendor & Ship To
  doc.setFontSize(10)
  doc.setFont('', 'bold')
  doc.text('Vendor:', 20, yPos)
  doc.setFont('', 'normal')
  doc.text(po.vendors.name, 20, yPos + 5)
  doc.text(po.vendors.address || '', 20, yPos + 10)
  doc.text(`${po.vendors.city}, ${po.vendors.state} ${po.vendors.zip}`, 20, yPos + 15)

  doc.setFont('', 'bold')
  doc.text('Ship To:', 20, yPos + 25)
  doc.setFont('', 'normal')
  const shipToLines = po.ship_to_address?.split('\n') || []
  shipToLines.forEach((line, i) => {
    doc.text(line, 20, yPos + 30 + (i * 5))
  })

  // Date
  doc.setFont('', 'bold')
  doc.text('Date:', pageWidth - 50, yPos)
  doc.setFont('', 'normal')
  doc.text(new Date(po.date).toLocaleDateString(), pageWidth - 50, yPos + 5)

  yPos += 60

  // Line Items Table
  const tableData: (string | number)[][] = []
  tableData.push(['Item & Description', 'Qty', 'Rate', 'Amount'])

  if (po.line_items) {
    po.line_items.forEach(item => {
      tableData.push([
        item.description,
        item.quantity.toString(),
        `$${item.unit_price.toFixed(2)}`,
        `$${item.amount.toFixed(2)}`,
      ])
    })
  }

  doc.autoTable({
    startY: yPos,
    head: [tableData[0]],
    body: tableData.slice(1),
    headStyles: { fillColor: [50, 50, 50], textColor: [255, 255, 255] },
    margin: 20,
  })

  yPos = (doc as any).lastAutoTable.finalY + 10

  // Totals
  doc.setFont('', 'bold')
  doc.text(`Tax Exempt Amount:`, pageWidth - 80, yPos)
  doc.text(`$${po.tax_exempt_amount.toFixed(2)}`, pageWidth - 20, yPos, { align: 'right' })

  doc.setFontSize(12)
  doc.text('Total', pageWidth - 80, yPos + 10)
  doc.text(`$${po.total.toFixed(2)}`, pageWidth - 20, yPos + 10, { align: 'right' })

  return doc
}
