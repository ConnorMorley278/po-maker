# SKU Line Items Design

## Overview
Add a SKU dropdown to the line items section in the PO form that auto-populates item details when selected.

## Requirements
- Add SKU column before Description in line items table
- SKU field is a required dropdown containing all created items
- When a SKU is selected, auto-populate: description and unit_price (both read-only)
- Quantity field remains editable by the user
- Unit price is locked based on the selected item

## Architecture

### Data Structure
Add `sku` field to `LineItemInput` interface:
```typescript
interface LineItemInput {
  id: string
  sku: string
  description: string
  quantity: number
  unit_price: number
}
```

### Component Changes
1. Fetch items on component mount (alongside vendors)
2. Update line item handler to accept SKU selection
3. When SKU changes, lookup item and auto-populate description and unit_price
4. Make description and unit_price fields disabled (read-only)
5. Keep quantity field enabled for user input

### Form Fields
- **SKU (dropdown)**: Required, shows all items by SKU
- **Description**: Auto-populated, disabled
- **Qty**: Editable by user, starts at 1
- **Rate**: Auto-populated from item.selling_price, disabled
- **Amount**: Calculated (qty × rate)
- **Delete**: Remove line item button

## Implementation Details
- Items fetched from `/api/items` endpoint (existing)
- Line item validation requires SKU selection
- On form submission, include SKU in line_items array
- Default quantity is 1 when a new SKU is selected
