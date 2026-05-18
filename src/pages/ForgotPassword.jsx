// ============================================================
// pages/ForgotPassword.jsx – begär lösenordsåterställning
// ============================================================
// Skickar e-postadress till POST /api/auth/forgot-password.
// Backend returnerar ALLTID 200 (även för okänd e-post) för att
// inte avslöja vilka adresser som är registrerade – så UI:t visar
// alltid samma bekräftelse "kolla din inkorg".
// ============================================================

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../api/auth'
import AuthLayout from '../components/AuthLayout'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { document.title = 'Återställ lösenord – NexaPay' }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await forgotPassword(email)
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout subtitle="Återställ lösenord">
      <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
        {sent ? (
          <div className="space-y-4 text-center">
            <p className="text-green-400 text-sm">
              Om e-postadressen finns registrerad skickas ett återställningsmail inom kort.
            </p>
            <Link to="/login" className="block text-indigo-400 hover:text-indigo-300 text-sm transition">
              Tillbaka till inloggning
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
              <label className="block text-sm text-gray-400 mb-1">E-post</label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="du@exempel.se"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg py-2.5 transition disabled:opacity-60"
            >
              {loading ? 'Skickar...' : 'Skicka återställningslänk'}
            </button>
          </form>
        )}
      </div>
      <p className="text-center text-gray-500 text-sm mt-6">
        <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition">
          Tillbaka till inloggning
        </Link>
      </p>
    </AuthLayout>
  )
}
