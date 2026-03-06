import { createClient } from '@supabase/supabase-js'
import PDFDocument from 'pdfkit'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    // Fetch PO with vendor and line items
    const { data: po, error } = await supabase
      .from('pos')
      .select('*, vendors(*), line_items(*)')
      .eq('id', id)
      .single()

    if (error || !po) {
      return new Response('PO not found', { status: 404 })
    }

    // Create PDF
    const doc = new PDFDocument()

    // Set response headers
    const filename = `${po.po_number}.pdf`
    const response = new Response(doc as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })

    // Pipe to response
    doc.pipe(response as any)

    // Company header
    doc.fontSize(14).font('Helvetica-Bold').text('C Morley Tech Services', 50, 50)
    doc.fontSize(10).font('Helvetica').text('130 N Hamilton St, STE B102,', 50, 72)
    doc.text('Georgetown, KY 40324', 50, 87)
    doc.text('(502) 497-1812', 50, 102)

    // Title and PO number
    doc.fontSize(32).font('Helvetica-Bold').text('PURCHASE ORDER', 350, 50)
    doc.fontSize(12).text(`# ${po.po_number}`, 350, 110)

    // Vendor section
    doc.fontSize(10).font('Helvetica-Bold').text('Vendor:', 50, 150)
    doc.fontSize(10).font('Helvetica').text(po.vendors?.name || '', 50, 168)
    doc.text(po.vendors?.address || '', 50, 183)
    doc.text(`${po.vendors?.city || ''}, ${po.vendors?.state || ''} ${po.vendors?.zip || ''}`, 50, 198)

    // Ship To section
    doc.fontSize(10).font('Helvetica-Bold').text('Ship To:', 50, 235)
    doc.fontSize(10).font('Helvetica').text(po.ship_to_address, 50, 253, { width: 250 })

    // Date on right side
    doc.fontSize(10).font('Helvetica-Bold').text('Date :', 380, 235)
    doc.fontSize(10).font('Helvetica').text(new Date(po.date).toLocaleDateString(), 450, 235)

    // Line items table
    const tableTop = 310
    const col1X = 50
    const col2X = 420
    const col3X = 480
    const col4X = 540

    // Header row
    doc.rect(col1X, tableTop, 550, 25).fill('#333333')
    doc.fillColor('#ffffff')
    doc.fontSize(10).font('Helvetica-Bold')
    doc.text('Item & Description', col1X + 5, tableTop + 5, { width: 360 })
    doc.text('Qty', col2X, tableTop + 5)
    doc.text('Rate', col3X, tableTop + 5)
    doc.text('Amount', col4X, tableTop + 5)

    // Data rows
    doc.fillColor('#000000')
    doc.font('Helvetica')
    let currentY = tableTop + 30

    po.line_items?.forEach((item: any) => {
      doc.fontSize(9)
      doc.text(item.description, col1X + 5, currentY, { width: 360 })
      doc.text(item.quantity.toString(), col2X, currentY)
      doc.text(`$${parseFloat(item.unit_price).toFixed(2)}`, col3X, currentY)
      doc.text(`$${parseFloat(item.amount).toFixed(2)}`, col4X, currentY)
      currentY += 40
    })

    // Totals section
    const totalsTop = currentY + 20
    doc.fontSize(10).font('Helvetica')
    doc.text('Tax Exempt Amount:', 380, totalsTop)
    doc.text(`$${parseFloat(po.tax_exempt_amount).toFixed(2)}`, 520, totalsTop)

    doc.fontSize(12).font('Helvetica-Bold')
    doc.text('Total', 420, totalsTop + 25)
    doc.text(`$${parseFloat(po.total).toFixed(2)}`, 520, totalsTop + 25)

    // Footer
    doc.fontSize(9).font('Helvetica').fillColor('#666666')
    doc.text('POWERED BY', 50, 750)

    doc.end()

    return response
  } catch (error) {
    console.error('PDF generation error:', error)
    return new Response('Error generating PDF', { status: 500 })
  }
}
