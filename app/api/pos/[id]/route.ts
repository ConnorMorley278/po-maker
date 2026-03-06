import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { data, error } = await supabase
      .from('pos')
      .select(`
        *,
        vendors(*),
        line_items(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching PO:', error)
    return NextResponse.json({ error: 'Failed to fetch PO' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await supabase
      .from('line_items')
      .delete()
      .eq('po_id', id)

    const { error } = await supabase
      .from('pos')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting PO:', error)
    return NextResponse.json({ error: 'Failed to delete PO' }, { status: 500 })
  }
}
