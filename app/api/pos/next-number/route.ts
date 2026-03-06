import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('pos')
      .select('po_number')
      .order('po_number', { ascending: false })
      .limit(1)

    if (error) throw error

    let nextNumber = 107

    if (data && data.length > 0) {
      const lastPONumber = parseInt(data[0].po_number.split('-')[1])
      nextNumber = lastPONumber + 1
    }

    return NextResponse.json({
      po_number: `PO-${nextNumber}`
    })
  } catch (error) {
    console.error('Error generating PO number:', error)
    return NextResponse.json({ error: 'Failed to generate PO number' }, { status: 500 })
  }
}
