import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { CreatePOInput } from '@/types'

export async function POST(request: Request) {
  try {
    const body: CreatePOInput = await request.json()

    // Get next PO number
    const { data: poData } = await supabase
      .from('pos')
      .select('po_number')
      .order('po_number', { ascending: false })
      .limit(1)

    let nextNumber = 107
    if (poData && poData.length > 0) {
      const lastPONumber = parseInt(poData[0].po_number.split('-')[1])
      nextNumber = lastPONumber + 1
    }

    const poNumber = `PO-${nextNumber}`

    // Calculate totals
    let subtotal = 0
    let taxAmount = 0
    body.line_items.forEach(item => {
      const itemAmount = item.quantity * item.unit_price
      subtotal += itemAmount
      if (item.tax_rate > 0) {
        taxAmount += itemAmount * (item.tax_rate / 100)
      }
    })

    const total = subtotal + taxAmount
    const taxExemptAmount = subtotal - (subtotal * 0.15)

    // Create PO
    const { data: po, error: poError } = await supabase
      .from('pos')
      .insert({
        po_number: poNumber,
        date: body.date,
        vendor_id: body.vendor_id,
        ship_to_address: body.ship_to_address,
        delivery_address: body.delivery_address,
        payment_terms: body.payment_terms,
        notes: body.notes,
        tax_exempt_amount: taxExemptAmount,
        total: total,
      })
      .select()

    if (poError) throw poError

    // Create line items
    const lineItemsData = body.line_items.map(item => ({
      po_id: po[0].id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      tax_rate: item.tax_rate,
      amount: item.quantity * item.unit_price,
    }))

    const { error: itemsError } = await supabase
      .from('line_items')
      .insert(lineItemsData)

    if (itemsError) throw itemsError

    return NextResponse.json({ po_number: poNumber, id: po[0].id })
  } catch (error) {
    console.error('Error creating PO:', error)
    return NextResponse.json({ error: 'Failed to create PO' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('pos')
      .select(`
        *,
        vendors(*),
        line_items(*)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching POs:', error)
    return NextResponse.json({ error: 'Failed to fetch POs' }, { status: 500 })
  }
}
