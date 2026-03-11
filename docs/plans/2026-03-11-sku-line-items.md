# SKU Line Items Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add SKU dropdown to line items that auto-populates item details (description, unit price) when selected, with quantity remaining editable.

**Architecture:** Fetch items on component mount, update LineItemInput interface to include sku field, modify the line items table to show SKU dropdown first, and auto-populate other fields when SKU is selected.

**Tech Stack:** React, TypeScript, Tailwind CSS, existing `/api/items` endpoint

---

## Task 1: Update LineItemInput Interface

**Files:**
- Modify: `components/POForm.tsx:6-11`

**Step 1: View current interface**

Current code at line 6-11:
```typescript
interface LineItemInput {
  id: string
  description: string
  quantity: number
  unit_price: number
}
```

**Step 2: Add sku field**

Replace with:
```typescript
interface LineItemInput {
  id: string
  sku: string
  description: string
  quantity: number
  unit_price: number
}
```

**Step 3: Test in browser**

- No test needed - TypeScript compilation will catch issues
- Browser should load without errors

**Step 4: Commit**

```bash
git add components/POForm.tsx
git commit -m "feat: add sku field to LineItemInput interface"
```

---

## Task 2: Fetch Items on Component Mount

**Files:**
- Modify: `components/POForm.tsx:19-40`

**Step 1: Add items state**

After line 20 `const [vendors, setVendors] = useState<Vendor[]>([])`, add:
```typescript
const [items, setItems] = useState<any[]>([])
```

**Step 2: Fetch items in useEffect**

Update the useEffect hook (lines 32-40) to also fetch items:

```typescript
useEffect(() => {
  const fetchVendors = async () => {
    const res = await fetch('/api/vendors')
    const data = await res.json()
    setVendors(data)
  }

  const fetchItems = async () => {
    const res = await fetch('/api/items')
    const data = await res.json()
    setItems(data)
  }

  fetchVendors()
  fetchItems()
}, [])
```

**Step 3: Test in browser**

- Open PO create form
- Open browser DevTools Network tab
- Verify `/api/items` request succeeds and returns items
- No console errors

**Step 4: Commit**

```bash
git add components/POForm.tsx
git commit -m "feat: fetch items on POForm component mount"
```

---

## Task 3: Update addLineItem to Include SKU

**Files:**
- Modify: `components/POForm.tsx:66-69`

**Step 1: View current addLineItem**

Current code at line 66-69:
```typescript
const addLineItem = () => {
  const newId = Date.now().toString()
  setLineItems(prev => [...prev, { id: newId, description: '', quantity: 1, unit_price: 0 }])
}
```

**Step 2: Add sku field**

Replace with:
```typescript
const addLineItem = () => {
  const newId = Date.now().toString()
  setLineItems(prev => [...prev, { id: newId, sku: '', description: '', quantity: 1, unit_price: 0 }])
}
```

**Step 3: Test in browser**

- Click "Add Line Item" button
- New row should appear with empty SKU field (will add UI in next task)

**Step 4: Commit**

```bash
git add components/POForm.tsx
git commit -m "feat: initialize sku field when adding line items"
```

---

## Task 4: Add SKU Dropdown Column to Line Items Table

**Files:**
- Modify: `components/POForm.tsx:147-155` (table header)
- Modify: `components/POForm.tsx:158-202` (table body)

**Step 1: Update table header**

Replace lines 148-155 header with:
```typescript
<thead>
  <tr className="bg-gray-200">
    <th className="border p-2">SKU</th>
    <th className="border p-2">Description</th>
    <th className="border p-2 w-20">Qty</th>
    <th className="border p-2 w-20">Rate</th>
    <th className="border p-2 w-24">Amount</th>
    <th className="border p-2 w-16">Delete</th>
  </tr>
</thead>
```

**Step 2: Add SKU column to table body (before Description)**

Replace the table body (lines 157-204) with:
```typescript
<tbody>
  {lineItems.map(item => {
    const amount = item.quantity * item.unit_price
    return (
      <tr key={item.id}>
        <td className="border p-2">
          <select
            value={item.sku}
            onChange={(e) => {
              const selectedItem = items.find(i => i.sku === e.target.value)
              if (selectedItem) {
                handleLineItemChange(item.id, 'sku', selectedItem.sku)
                handleLineItemChange(item.id, 'description', selectedItem.description)
                handleLineItemChange(item.id, 'unit_price', selectedItem.selling_price)
                handleLineItemChange(item.id, 'quantity', 1)
              }
            }}
            className="w-full border p-1 rounded"
            required
          >
            <option value="">Select SKU</option>
            {items.map(it => (
              <option key={it.id} value={it.sku}>{it.sku}</option>
            ))}
          </select>
        </td>
        <td className="border p-2">
          <input
            type="text"
            value={item.description}
            disabled
            className="w-full border p-1 rounded bg-gray-100"
          />
        </td>
        <td className="border p-2">
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => handleLineItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
            className="w-full border p-1 rounded"
            step="0.01"
            required
          />
        </td>
        <td className="border p-2">
          <input
            type="number"
            value={item.unit_price}
            disabled
            className="w-full border p-1 rounded bg-gray-100"
            step="0.01"
          />
        </td>
        <td className="border p-2 text-right">${amount.toFixed(2)}</td>
        <td className="border p-2">
          <button
            type="button"
            onClick={() => removeLineItem(item.id)}
            className="bg-red-600 text-white px-2 py-1 rounded text-sm"
          >
            Remove
          </button>
        </td>
      </tr>
    )
  })}
</tbody>
```

**Step 3: Test in browser**

- Open PO create form
- Click "Add Line Item"
- Verify SKU dropdown appears with item SKUs
- Select an SKU
- Verify description and unit_price populate automatically
- Verify quantity defaults to 1 and is editable
- Try changing quantity, verify amount updates
- Click Add Line Item again, verify new row has empty SKU

**Step 4: Commit**

```bash
git add components/POForm.tsx
git commit -m "feat: add SKU dropdown column and auto-populate item details"
```

---

## Task 5: Initialize Line Items with SKU Field

**Files:**
- Modify: `components/POForm.tsx:21-23`

**Step 1: Update initial line items state**

Replace lines 21-23:
```typescript
const [lineItems, setLineItems] = useState<LineItemInput[]>([
  { id: '1', description: '', quantity: 1, unit_price: 0 },
])
```

With:
```typescript
const [lineItems, setLineItems] = useState<LineItemInput[]>([
  { id: '1', sku: '', description: '', quantity: 1, unit_price: 0 },
])
```

**Step 2: Test in browser**

- Load PO create form
- Verify first line item row appears with empty SKU dropdown
- Verify form still loads without errors

**Step 3: Commit**

```bash
git add components/POForm.tsx
git commit -m "feat: initialize first line item with sku field"
```

---

## Task 6: Verify Form Submission Includes SKU

**Files:**
- Review: `components/POForm.tsx:77-86`

**Step 1: Check handleSubmit**

Current code should already include SKU because we're storing it in lineItems state. Verify lines 77-86:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  const data = {
    ...formData,
    line_items: lineItems.map(({ id, ...item }) => item),
  }

  onSubmit(data)
}
```

This is already correct - it spreads all item properties (including sku) when mapping.

**Step 2: Test in browser**

- Fill out PO form with:
  - Date
  - Vendor
  - Ship to address (auto-filled)
  - Add line item with SKU selection
- Open browser DevTools Network tab
- Click "Create PO"
- Inspect the POST request body in Network tab
- Verify `line_items` array includes `sku` field for each item
- Verify form submission works (should see success or expected API response)

**Step 3: Commit**

```bash
git add -A
git commit -m "test: verify sku field is included in form submission"
```

---

## Summary

All changes are in `components/POForm.tsx`:
- Add `sku` field to `LineItemInput` interface
- Fetch items on component mount
- Add SKU dropdown column before Description
- Auto-populate description and unit_price when SKU selected
- Keep quantity editable
- Make description and unit_price fields read-only (disabled)
- Form submission already includes SKU in line_items

No changes needed to API, database schema, or other components.
