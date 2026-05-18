// ============================================================
// pages/ResetPassword.jsx – välj nytt lösenord
// ============================================================
// Nås via länken i återställningsmejlet med email+token i query.
// POST:ar till /api/auth/reset-password. Token är engångsbruk
// och giltigt i 24 timmar.
// ============================================================

import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { resetPassword } from '../api/auth'
import AuthLayout from '../components/AuthLayout'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') ?? ''
  const token = searchParams.get('token') ?? ''

  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { document.title = 'Välj nytt lösenord – NexaPay' }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.newPassword !== form.confirmPassword) {
      setError('Lösenorden matchar inte.')
      return
    }
    setLoading(true)
    try {
      await resetPassword(email, token, form.newPassword)
      setDone(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout subtitle="Välj nytt lösenord">
      <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
        {done ? (
          <div className="text-center space-y-4">
            <p className="text-green-400 text-sm">Lösenordet har återställts. Du kan nu logga in.</p>
            <Link
              to="/login"
              className="block bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg py-2.5 transition text-center"
            >
              Logga in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
                {error}
              </p>
            )}
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
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Bekräfta lösenord</label>
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
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg py-2.5 transition disabled:opacity-60"
            >
              {loading ? 'Sparar...' : 'Spara nytt lösenord'}
            </button>
          </form>
        )}
      </div>
    </AuthLayout>
  )
}
