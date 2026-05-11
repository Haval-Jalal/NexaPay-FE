// ============================================================
// Settings.jsx – src/pages
// ============================================================
// Inställningssida för den inloggade användaren.
// Visar kontoinformation och formulär för att byta lösenord.
// ============================================================

// useState för formulärdata och status
import { useState } from 'react'

// Layout-komponenten med sidebar
import Layout from '../components/Layout'

// API-funktion för att byta lösenord
import { changePassword } from '../api/auth'

// useAuth för att visa användarens e-post och roll
import { useAuth } from '../context/AuthContext'

export default function Settings() {
  // Hämta den inloggade användaren från context
  const { user } = useAuth()

  // Formulärdata – nuvarande och nytt lösenord
  const [form, setForm] = useState({
    currentPassword: '',   // Nuvarande lösenord (verifieras av servern)
    newPassword: '',       // Det nya lösenordet
    confirmPassword: '',   // Bekräftelse – jämförs lokalt innan API-anrop
  })

  // Laddningsstatus under API-anropet
  const [submitting, setSubmitting] = useState(false)

  // Felmeddelande (t.ex. felaktigt nuvarande lösenord)
  const [error, setError] = useState('')

  // Bekräftelsemeddelande efter lyckat byte
  const [success, setSuccess] = useState('')

  // Hanterar formulärets submit
  async function handleSubmit(e) {
    // Förhindra sidladdning
    e.preventDefault()

    // Rensa gamla meddelanden
    setError('')
    setSuccess('')

    // Validera att de nya lösenorden matchar
    if (form.newPassword !== form.confirmPassword) {
      setError('Nya lösenorden matchar inte.')
      return
    }

    // Starta laddning
    setSubmitting(true)

    try {
      // Anropa change-password-endpointen
      await changePassword(form.currentPassword, form.newPassword)

      // Visa bekräftelse och töm formuläret
      setSuccess('Lösenordet har bytts.')
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (e) {
      // Visa fel (t.ex. "Felaktigt nuvarande lösenord")
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-md">

        {/* Sidrubrik */}
        <h1 className="text-2xl font-bold text-white mb-8">Inställningar</h1>

        {/* Kontoinformation – visar e-post och roll */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <p className="text-sm text-gray-400">Inloggad som</p>
          <p className="text-white font-medium mt-1">{user?.email}</p>
          <p className="text-xs text-gray-500 mt-0.5">Roll: {user?.role}</p>
        </div>

        {/* Byt lösenord-formulär */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-5">Byt lösenord</h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Felmeddelande */}
            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
                {error}
              </p>
            )}

            {/* Bekräftelsemeddelande */}
            {success && (
              <p className="text-green-400 text-sm bg-green-400/10 border border-green-400/20 rounded-lg px-4 py-2">
                {success}
              </p>
            )}

            {/* Nuvarande lösenord */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nuvarande lösenord</label>
              <input
                type="password"
                required
                name="currentPassword"
                value={form.currentPassword}
                onChange={e => setForm({ ...form, currentPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* Nytt lösenord */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nytt lösenord</label>
              <input
                type="password"
                required
                name="newPassword"
                value={form.newPassword}
                onChange={e => setForm({ ...form, newPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* Bekräfta nytt lösenord */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Bekräfta nytt lösenord</label>
              <input
                type="password"
                required
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* Spara-knapp */}
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
