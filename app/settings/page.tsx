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
