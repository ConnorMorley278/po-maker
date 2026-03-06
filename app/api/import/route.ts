import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.po_number || !body.vendor_id || !body.date) {
      return Response.json(
        { error: 'Missing required fields: po_number, vendor_id, date' },
        { status: 400 }
      )
    }

    // Create PO
    const { data: po, error: poError } = await supabase
      .from('pos')
      .insert({
        po_number: body.po_number,
        vendor_id: body.vendor_id,
        date: body.date,
        ship_to_address: body.ship_to_address || '',
        delivery_address: body.delivery_address || '',
        payment_terms: body.payment_terms || '',
        notes: body.notes || '',
        tax_exempt_amount: body.tax_exempt_amount || 0,
        total: body.total || 0,
      })
      .select()
      .single()

    if (poError) {
      return Response.json({ error: poError.message }, { status: 500 })
    }

    // Insert line items if provided
    if (body.line_items && Array.isArray(body.line_items)) {
      const { error: itemsError } = await supabase
        .from('line_items')
        .insert(
          body.line_items.map((item: any) => ({
            po_id: po.id,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
            amount: item.amount,
          }))
        )

      if (itemsError) {
        return Response.json({ error: itemsError.message }, { status: 500 })
      }
    }

    return Response.json({ success: true, po_id: po.id })
  } catch (error) {
    return Response.json(
      { error: 'Failed to import PO: ' + (error as any).message },
      { status: 500 }
    )
  }
}
