// ============================================================
// ResetPassword.jsx – src/pages
// ============================================================
// Sida för att välja nytt lösenord.
// Email och token hämtas från URL:ens query-parametrar,
// som skickas med i återställningslänken i mailet.
//
// Exempel-URL:
//   /reset-password?email=user@ex.se&token=abc123
// ============================================================

// useState för formulärdata, laddning och status
import { useState } from 'react'

// Link för navigation, useSearchParams för att läsa query-parametrar
import { Link, useSearchParams } from 'react-router-dom'

// API-funktion för lösenordsåterställning
import { resetPassword } from '../api/auth'

export default function ResetPassword() {
  // Läs query-parametrar från URL:en (email och token från återställningslänken)
  const [searchParams] = useSearchParams()

  // Hämta email från URL:en – behövs för API-anropet
  const email = searchParams.get('email') ?? ''

  // Hämta token från URL:en – verifieras av servern
  const token = searchParams.get('token') ?? ''

  // Formulärdata – nytt lösenord och bekräftelse
  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' })

  // Laddningsstatus
  const [loading, setLoading] = useState(false)

  // Satt till true när lösenordet har bytts – byter ut formuläret
  const [done, setDone] = useState(false)

  // Felmeddelande (t.ex. lösenorden matchar inte, eller ogiltig token)
  const [error, setError] = useState('')

  // Hanterar formulärets submit
  async function handleSubmit(e) {
    // Förhindra sidladdning
    e.preventDefault()

    // Rensa gamla fel
    setError('')

    // Kontrollera att båda lösenordsfälten matchar
    if (form.newPassword !== form.confirmPassword) {
      setError('Lösenorden matchar inte.')
      return
    }

    // Starta laddning
    setLoading(true)

    try {
      // Anropa reset-password-endpointen med email, token och nytt lösenord
      await resetPassword(email, token, form.newPassword)

      // Visa bekräftelse – formuläret ersätts med länk till inloggning
      setDone(true)
    } catch (err) {
      // Visa fel (t.ex. "Länken har gått ut")
      setError(err.message)
    } finally {
      // Återställ laddning
      setLoading(false)
    }
  }

  return (
    // Centrerat innehåll på hela skärmen
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Rubrik */}
        <h1 className="text-3xl font-bold text-white text-center mb-2">NexaPay</h1>
        <p className="text-gray-400 text-center mb-8">Välj nytt lösenord</p>

        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">

          {/* Bekräftelsevy – visas när lösenordet har bytts */}
          {done ? (
            <div className="text-center space-y-4">
              <p className="text-green-400 text-sm">
                Lösenordet har återställts. Du kan nu logga in.
              </p>
              {/* Länk till inloggning */}
              <Link
                to="/login"
                className="block bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg py-2.5 transition text-center"
              >
                Logga in
              </Link>
            </div>
          ) : (
            // Formulärvy
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Felmeddelande */}
              {error && (
                <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
                  {error}
                </p>
              )}

              {/* Nytt lösenord */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nytt lösenord</label>
                <input
                  type="password"
                  required
                  value={form.newPassword}
                  onChange={e => setForm({ ...form, newPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              {/* Bekräfta nytt lösenord */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">Bekräfta lösenord</label>
                <input
                  type="password"
                  required
                  value={form.confirmPassword}
                  onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              {/* Spara-knapp */}
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
      </div>
    </div>
  )
}
