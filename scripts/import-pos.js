// Script to import existing POs
// Run: node scripts/import-pos.js

// Update this with your vendor ID and PO data
const vendorId = "1dbc05c4-0bc6-46e3-89d3-b2392f8f7269" // Replace with your actual vendor UUID

const poData = [
  {
    po_number: 'PO-101',
    vendor_id: vendorId,
    date: '2024-01-15',
    ship_to_address: '123 Main St',
    delivery_address: '123 Main St',
    payment_terms: 'Net 30',
    total: 1500.00,
    tax_exempt_amount: 1500.00,
    line_items: [
      { description: 'Item 1', quantity: 5, unit_price: 300.00, amount: 1500.00 }
    ]
  },
  // Add your other 4 POs here in the same format
  // {
  //   po_number: 'PO-102',
  //   vendor_id: vendorId,
  //   date: '2024-01-20',
  //   ...
  // }
]

async function importPOs() {
  for (const po of poData) {
    try {
      const res = await fetch('http://localhost:3000/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(po)
      })
      const result = await res.json()
      console.log(`${po.po_number}: ${result.success ? 'Imported' : result.error}`)
    } catch (error) {
      console.error(`${po.po_number}: Failed -`, error.message)
    }
  }
}

importPOs()
