import { createClient } from '@supabase/supabase-js'
import html2pdf from 'html-pdf'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function generateHTML(po: any): string {
  const lineItemsHTML = po.line_items
    ?.map(
      (item: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #ddd;">${item.description}</td>
      <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right;">$${parseFloat(item.unit_price).toFixed(2)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right;">$${parseFloat(item.amount).toFixed(2)}</td>
    </tr>
  `
    )
    .join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
        .company { font-weight: bold; }
        .title { font-size: 32px; font-weight: bold; text-align: right; }
        .po-number { text-align: right; font-size: 14px; }
        .section { margin-bottom: 20px; }
        .section-title { font-weight: bold; margin-bottom: 8px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background-color: #333; color: white; padding: 12px; text-align: left; }
        td { padding: 12px; border-bottom: 1px solid #ddd; }
        .totals { margin-top: 20px; text-align: right; }
        .total-label { font-weight: bold; }
        .total-amount { font-weight: bold; font-size: 16px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company">
          C Morley Tech Services<br>
          130 N Hamilton St, STE B102<br>
          Georgetown, KY 40324<br>
          (502) 497-1812
        </div>
        <div>
          <div class="title">PURCHASE ORDER</div>
          <div class="po-number"># ${po.po_number}</div>
        </div>
      </div>

      <div class="info-grid">
        <div>
          <div class="section-title">Vendor:</div>
          <div>${po.vendors?.name || ''}</div>
          <div>${po.vendors?.address || ''}</div>
          <div>${po.vendors?.city || ''}, ${po.vendors?.state || ''} ${po.vendors?.zip || ''}</div>
        </div>
        <div>
          <div class="section-title">Ship To:</div>
          <div>${po.ship_to_address}</div>
          <div style="margin-top: 20px;">
            <div class="section-title">Date:</div>
            <div>${new Date(po.date).toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Item & Description</th>
            <th style="text-align: center;">Qty</th>
            <th style="text-align: right;">Rate</th>
            <th style="text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${lineItemsHTML}
        </tbody>
      </table>

      <div class="totals">
        <div>Tax Exempt Amount: <span class="total-label">$${parseFloat(po.tax_exempt_amount).toFixed(2)}</span></div>
        <div style="margin-top: 10px; font-size: 18px;">
          Total <span class="total-amount">$${parseFloat(po.total).toFixed(2)}</span>
        </div>
      </div>

      <div style="margin-top: 60px; text-align: left; color: #999; font-size: 10px;">POWERED BY</div>
    </body>
    </html>
  `
}

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

    // Generate HTML
    const html = generateHTML(po)

    // Generate PDF from HTML
    return new Promise((resolve) => {
      html2pdf.create(html, { format: 'Letter' }).toBuffer((err: any, buffer: Buffer) => {
        if (err) {
          resolve(new Response('Error generating PDF', { status: 500 }))
        } else {
          resolve(
            new Response(buffer, {
              headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${po.po_number}.pdf"`,
              },
            })
          )
        }
      })
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return new Response('Error generating PDF', { status: 500 })
  }
}
