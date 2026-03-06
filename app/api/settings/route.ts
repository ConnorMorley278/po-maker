import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  const { data, error } = await supabase
    .from('company_settings')
    .select('*')
    .eq('id', 1)
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function POST(request: Request) {
  const body = await request.json()

  const { error } = await supabase
    .from('company_settings')
    .update({
      company_name: body.company_name,
      address: body.address,
      city: body.city,
      state: body.state,
      zip: body.zip,
      phone: body.phone,
      email: body.email,
      tax_id: body.tax_id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', 1)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}
