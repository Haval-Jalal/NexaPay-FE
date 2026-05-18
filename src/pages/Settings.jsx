// ============================================================
// pages/Settings.jsx – profil + lösenordsbyte
// ============================================================
// Visar inloggad användares e-post och roll och tillåter byte
// av lösenord via POST /api/auth/change-password. Nuvarande
// lösenord krävs som extra säkerhet (skydd mot session-hijack).
// ============================================================

import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { changePassword } from '../api/auth'
import { useAuth } from '../context/useAuth'
import { useToast } from '../context/useToast'

const STRENGTH_LEVELS = [
  { label: '',      bar: 'bg-gray-700', text: '' },
  { label: 'Svag',  bar: 'bg-red-500',    text: 'text-red-400' },
  { label: 'Medel', bar: 'bg-yellow-500', text: 'text-yellow-400' },
  { label: 'Bra',   bar: 'bg-blue-500',   text: 'text-blue-400' },
  { label: 'Stark', bar: 'bg-green-500',  text: 'text-green-400' },
]

function getPasswordStrength(pw) {
  if (!pw) return 0
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}

export default function Settings() {
  const { user } = useAuth()
  const toast = useToast()
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { document.title = 'Inställningar – NexaPay' }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.newPassword !== form.confirmPassword) {
      setError('Nya lösenorden matchar inte.')
      return
    }
    setSubmitting(true)
    try {
      await changePassword(form.currentPassword, form.newPassword)
      toast('Lösenordet har bytts.')
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (e) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-md">
        <h1 className="text-2xl font-bold text-white mb-8">Inställningar</h1>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <p className="text-sm text-gray-400">Inloggad som</p>
          <p className="text-white font-medium mt-1">{user?.email}</p>
          <p className="text-xs text-gray-500 mt-0.5">Roll: {user?.role}</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-5">Byt lösenord</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
                {error}
              </p>
            )}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nuvarande lösenord</label>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={form.currentPassword}
                onChange={e => setForm({ ...form, currentPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nytt lösenord</label>
              <input
                type="password"
                autoComplete="new-password"
                required
                value={form.newPassword}
                onChange={e => setForm({ ...form, newPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
              />
              {form.newPassword ? (() => {
                const lvl = getPasswordStrength(form.newPassword)
                const s   = STRENGTH_LEVELS[lvl]
                return (
                  <div className="mt-1.5 space-y-1">
                    <div className="flex gap-1">
                      {[1,2,3,4].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= lvl ? s.bar : 'bg-gray-700'}`} />
                      ))}
                    </div>
                    <p className={`text-xs ${s.text}`}>{s.label}</p>
                  </div>
                )
              })() : null}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Bekräfta nytt lösenord</label>
              <input
                type="password"
                autoComplete="new-password"
                required
                value={form.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg py-2.5 transition disabled:opacity-60"
            >
              {submitting ? 'Sparar...' : 'Byt lösenord'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}
