// ============================================================
// ForgotPassword.jsx – src/pages
// ============================================================
// Sida för glömt lösenord.
// Användaren anger sin e-post och får ett återställningsmail.
// API:et avslöjar aldrig om e-posten finns i systemet.
// ============================================================

// useState för e-postfält, laddning, skickat-status och fel
import { useState } from 'react'

// Link för navigation tillbaka till inloggning
import { Link } from 'react-router-dom'

// API-funktion för att begära återställningsmail
import { forgotPassword } from '../api/auth'

export default function ForgotPassword() {
  // E-postadressen som användaren fyller i
  const [email, setEmail] = useState('')

  // Laddningsstatus – inaktiverar knappen under API-anropet
  const [loading, setLoading] = useState(false)

  // Satt till true när mailet skickats – byter ut formuläret mot bekräftelse
  const [sent, setSent] = useState(false)

  // Felmeddelande om API-anropet misslyckas
  const [error, setError] = useState('')

  // Hanterar formulärets submit
  async function handleSubmit(e) {
    // Förhindra sidladdning
    e.preventDefault()

    // Rensa gamla fel
    setError('')

    // Starta laddning
    setLoading(true)

    try {
      // Anropa forgot-password-endpointen
      await forgotPassword(email)

      // Visa bekräftelsemeddelande – formuläret byts ut
      setSent(true)
    } catch (err) {
      // Visa felmeddelande
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
        <p className="text-gray-400 text-center mb-8">Återställ lösenord</p>

        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">

          {/* Bekräftelsevy – visas när mailet har skickats */}
          {sent ? (
            <div className="space-y-4 text-center">
              {/* Bekräftelsetext från API:et */}
              <p className="text-green-400 text-sm">
                Om e-postadressen finns registrerad skickas ett återställningsmail inom kort.
              </p>
              {/* Länk tillbaka till inloggning */}
              <Link to="/login" className="block text-indigo-400 hover:text-indigo-300 text-sm transition">
                Tillbaka till inloggning
              </Link>
            </div>
          ) : (
            // Formulärvy – visas innan mailet skickats
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Felmeddelande */}
              {error && (
                <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
                  {error}
                </p>
              )}

              {/* E-postfält */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">E-post</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="du@exempel.se"
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              {/* Skicka-knapp */}
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

        {/* Länk tillbaka till inloggning */}
        <p className="text-center text-gray-500 text-sm mt-6">
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition">
            Tillbaka till inloggning
          </Link>
        </p>
      </div>
    </div>
  )
}
