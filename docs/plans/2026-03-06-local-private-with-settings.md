# Local-Only Private PO Maker with Settings Page

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Convert the PO Maker from public Railway deployment to private local-only application with company settings page.

**Architecture:** Remove Railway deployment and create a settings system to store company information (name, address, tax ID, etc.) in Supabase. Settings are stored in a new `company_settings` table and displayed on a settings page accessible from the navbar. The app runs locally via `npm run dev` and is only accessible at `http://localhost:3000`.

**Tech Stack:** Next.js, Supabase, React, TypeScript, Tailwind CSS

---

## Task 1: Create Supabase company_settings table

**Files:**
- Manual Supabase setup (no code file)

**Step 1: Access Supabase console**

Go to: https://app.supabase.com → Select your project → SQL Editor

**Step 2: Create company_settings table**

Run this SQL:

```sql
CREATE TABLE company_settings (
  id BIGINT PRIMARY KEY DEFAULT 1,
  company_name TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  phone TEXT,
  email TEXT,
  tax_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO company_settings (id) VALUES (1);
```

**Step 3: Verify table created**

Expected: Table appears in Supabase left sidebar under `company_settings`

---

## Task 2: Create company settings API endpoint

**Files:**
- Create: `app/api/settings/route.ts`

**Step 1: Write the API route**

```typescript
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
```

**Step 2: Test the endpoint**

Run: `npm run dev`

Visit: `http://localhost:3000/api/settings` in browser

Expected: Returns empty/null company_settings object

---

## Task 3: Create settings page component

**Files:**
- Create: `app/settings/page.tsx`

**Step 1: Write the settings page**

```typescript
'use client'

import { useEffect, useState } from 'react'

interface Settings {
  id: number
  company_name: string | null
  address: string | null
  city: string | null
  state: string | null
  zip: string | null
  phone: string | null
  email: string | null
  tax_id: string | null
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchSettings = async () => {
      const res = await fetch('/api/settings')
      const data = await res.json()
      setSettings(data)
      setLoading(false)
    }
    fetchSettings()
  }, [])

  const handleChange = (field: string, value: string) => {
    if (settings) {
      setSettings({ ...settings, [field]: value })
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')

    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })

    if (res.ok) {
      setMessage('Settings saved successfully!')
      setTimeout(() => setMessage(''), 3000)
    } else {
      setMessage('Failed to save settings')
    }
    setSaving(false)
  }

  if (loading) return <div>Loading...</div>
  if (!settings) return <div>Error loading settings</div>

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Company Settings</h1>

      <div className="bg-white p-6 rounded border">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <input
              type="text"
              value={settings.company_name || ''}
              onChange={(e) => handleChange('company_name', e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Your Company Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              value={settings.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Street Address"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                value={settings.city || ''}
                onChange={(e) => handleChange('city', e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="City"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <input
                type="text"
                value={settings.state || ''}
                onChange={(e) => handleChange('state', e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="State"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ZIP</label>
              <input
                type="text"
                value={settings.zip || ''}
                onChange={(e) => handleChange('zip', e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="ZIP"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="text"
                value={settings.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="Phone"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="text"
                value={settings.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="Email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tax ID</label>
            <input
              type="text"
              value={settings.tax_id || ''}
              onChange={(e) => handleChange('tax_id', e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Tax ID / EIN"
            />
          </div>
        </div>

        {message && (
          <div className={`mt-4 p-3 rounded ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
```

**Step 2: Test the settings page**

Visit: `http://localhost:3000/settings`

Expected: Form displays with empty fields, can type in fields

---

## Task 4: Update navbar to include Settings link

**Files:**
- Modify: `components/Navbar.tsx`

**Step 1: Add Settings link**

Find the existing navbar component and add this link among the existing ones:

```typescript
<Link href="/settings" className="text-gray-700 hover:text-gray-900">
  Settings
</Link>
```

Complete navbar should look like:

```typescript
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-white border-b p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          PO Maker
        </Link>
        <div className="space-x-6">
          <Link href="/" className="text-gray-700 hover:text-gray-900">
            Dashboard
          </Link>
          <Link href="/create" className="text-gray-700 hover:text-gray-900">
            Create PO
          </Link>
          <Link href="/vendors" className="text-gray-700 hover:text-gray-900">
            Vendors
          </Link>
          <Link href="/settings" className="text-gray-700 hover:text-gray-900">
            Settings
          </Link>
        </div>
      </div>
    </nav>
  )
}
```

**Step 2: Verify navbar renders**

Visit: `http://localhost:3000`

Expected: Settings link appears in navbar

---

## Task 5: Test settings save functionality

**Files:**
- Testing only (no new files)

**Step 1: Open settings page**

Visit: `http://localhost:3000/settings`

**Step 2: Fill in company information**

Enter:
- Company Name: "Your Company"
- Address: "123 Main St"
- City: "Lexington"
- State: "KY"
- ZIP: "40507"
- Phone: "555-1234"
- Email: "info@company.com"
- Tax ID: "12-3456789"

**Step 3: Click Save Settings**

Expected: Green "Settings saved successfully!" message appears

**Step 4: Refresh page**

Press F5 to reload

Expected: All fields still populated with saved data

---

## Task 6: Create local setup documentation

**Files:**
- Create: `LOCAL_SETUP.md`

**Step 1: Write setup instructions**

```markdown
# Running PO Maker Locally

This application runs privately on your computer only. It is NOT accessible from the internet.

## Prerequisites

- Node.js 18+ installed
- Your Supabase project URL and anon key in `.env.local`

## Starting the Application

1. Open Command Prompt or PowerShell
2. Navigate to the project folder:
   ```
   cd C:\Users\javan\po-maker
   ```

3. Install dependencies (first time only):
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and go to:
   ```
   http://localhost:3000
   ```

The application is now running on your computer only. Close the Command Prompt window to stop the application.

## What You Can Do

- Create, view, and manage purchase orders
- Manage vendors
- Store company information in Settings
- Everything is saved to your Supabase database

## Database

Your data is stored in Supabase (cloud database). As long as you have internet, your data syncs.

## Stopping the Application

Press `Ctrl+C` in the Command Prompt window where `npm run dev` is running.

## Restarting

Repeat the steps above, starting from step 4.
```

**Step 2: Verify file created**

Expected: File exists at `C:\Users\javan\po-maker\LOCAL_SETUP.md`

---

## Task 7: Add data import API endpoint

**Files:**
- Create: `app/api/import/route.ts`

**Step 1: Write import endpoint**

```typescript
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
```

**Step 2: Test endpoint with curl**

Run from Command Prompt:

```bash
curl -X POST http://localhost:3000/api/import ^
  -H "Content-Type: application/json" ^
  -d "{ \"po_number\": \"PO-101\", \"vendor_id\": 1, \"date\": \"2024-01-15\", \"total\": 1500.00, \"tax_exempt_amount\": 1500.00 }"
```

Expected: Returns `{"success":true,"po_id":<number>}`

---

## Task 8: Create import helper script

**Files:**
- Create: `scripts/import-pos.js`

**Step 1: Write import script**

```javascript
// Quick script to import the 5 existing POs
// Run: node scripts/import-pos.js

const poData = [
  {
    po_number: 'PO-101',
    vendor_id: 1,
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
```

**Step 2: Document in LOCAL_SETUP.md**

Add this section to LOCAL_SETUP.md:

```markdown
## Importing Existing Purchase Orders

To import your 5 existing POs (PO-101 through PO-106):

1. Edit `scripts/import-pos.js` with your PO details
2. In Command Prompt (with app still running in another window):
   ```
   node scripts/import-pos.js
   ```
3. Refresh your browser - POs will appear on the dashboard
```

---

## Task 9: Commit all changes

**Files:**
- All new files created above

**Step 1: Run git status**

```bash
git status
```

Expected: Shows all new files ready to commit

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add local-only app with company settings page and import functionality"
```

Expected: Commit succeeds with message

---

## Task 10: Verify complete setup

**Files:**
- Testing only

**Step 1: Ensure dev server is running**

Terminal should show: `▲ Next.js 16.1.6`

**Step 2: Test each page**

Visit:
- `http://localhost:3000` - Dashboard
- `http://localhost:3000/create` - Create PO
- `http://localhost:3000/vendors` - Vendors
- `http://localhost:3000/settings` - Settings (NEW)

Expected: All pages load, Settings page has form

**Step 3: Test settings save**

Fill in company name and click Save

Expected: Success message appears, data persists on refresh

---

## Notes for Implementation

- The app is now completely private - only accessible at `http://localhost:3000`
- No Railway deployment exists anymore (the public URL is no longer needed)
- Company settings are stored in Supabase and can be edited anytime
- Import functionality allows bulk-adding the 5 existing POs
- User needs to provide the actual data for PO-101 through PO-106 to complete the import
