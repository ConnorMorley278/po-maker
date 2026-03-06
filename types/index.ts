export interface Vendor {
  id: string
  name: string
  address?: string
  city?: string
  state?: string
  zip?: string
  phone?: string
  email?: string
  ship_to_address?: string
  created_at: string
}

export interface Item {
  id: string
  sku: string
  description: string
  uom: string
  selling_price: number
  created_at: string
}

export interface LineItem {
  id: string
  po_id: string
  description: string
  quantity: number
  unit_price: number
  amount: number
  created_at: string
}

export interface PO {
  id: string
  po_number: string
  date: string
  vendor_id: string
  vendor?: Vendor
  vendors?: Vendor
  ship_to_address?: string
  notes?: string
  tax_exempt_amount: number
  total: number
  line_items?: LineItem[]
  created_at: string
  updated_at: string
}

export interface CreatePOInput {
  date: string
  vendor_id: string
  ship_to_address?: string
  notes?: string
  line_items: {
    description: string
    quantity: number
    unit_price: number
  }[]
}
