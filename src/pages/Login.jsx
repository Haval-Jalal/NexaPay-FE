// ============================================================
// Login.jsx – src/pages
// ============================================================
// Inloggningssida.
// Skickar e-post och lösenord till API:et och sparar
// JWT-token i AuthContext vid lyckad inloggning.
// ============================================================

// useState för formulärdata, felmeddelande och laddningsstatus
import { useState } from 'react'

// Link för navigeringslänkar, useNavigate för omdirigering efter inloggning
import { Link, useNavigate } from 'react-router-dom'

// API-funktion för inloggning
import { login } from '../api/auth'

// useAuth för att spara användaren i global context
import { useAuth } from '../context/AuthContext'

export default function Login() {
  // useNavigate – används för att skicka användaren till /dashboard efter inloggning
  const navigate = useNavigate()

  // Hämta saveUser-funktionen från AuthContext
  const { saveUser } = useAuth()

  // Formulärdata – e-post och lösenord
  const [form, setForm] = useState({ email: '', password: '' })

  // Felmeddelande från API:et – visas i rött om inloggning misslyckas
  const [error, setError] = useState('')

  // Laddningsstatus – true medan API-anropet pågår, inaktiverar knappen
  const [loading, setLoading] = useState(false)

  // Uppdaterar rätt fält i form-state när användaren skriver
  // e.target.name matchar name-attributet på input-fältet
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Hanterar formulärets submit-event
  async function handleSubmit(e) {
    // Förhindra att webbläsaren laddar om sidan
    e.preventDefault()

    // Rensa eventuellt gammalt felmeddelande
    setError('')

    // Sätt loading=true för att inaktivera formuläret under anropet
    setLoading(true)

    try {
      // Anropa login-endpointen med e-post och lösenord
      const res = await login(form.email, form.password)

      // Spara användaren (token, email, roll) i context och localStorage
      saveUser(res.data)

      // Skicka användaren till översiktssidan
      navigate('/dashboard')
    } catch (err) {
      // Visa felmeddelandet från API:et (t.ex. "Felaktigt lösenord")
      setError(err.message)
    } finally {
      // Återställ loading oavsett om anropet lyckades eller misslyckades
      setLoading(false)
    }
  }

  return (
    // Centrerat innehåll på hela skärmen med mörk bakgrund
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Rubrik */}
        <h1 className="text-3xl font-bold text-white text-center mb-2">NexaPay</h1>
        <p className="text-gray-400 text-center mb-8">Logga in på ditt konto</p>

        {/* Inloggningsformulär */}
        <form onSubmit={handleSubmit} className="bg-gray-900 rounded-2xl p-8 space-y-5 border border-gray-800">

          {/* Felmeddelande – visas bara om error inte är tom */}
          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2.5">
              {error}
            </p>
          )}

          {/* E-postfält */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">E-post</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={loading}                    // Inaktivera under inloggning
              placeholder="du@exempel.se"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition disabled:opacity-50"
            />
          </div>

          {/* Lösenordsfält */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Lösenord</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="••••••••"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition disabled:opacity-50"
            />
          </div>

          {/* Inloggningsknapp – disabled och visar text under pågående anrop */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg py-2.5 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Loggar in...' : 'Logga in'}
          </button>

          {/* Länk till glömt-lösenord-sidan */}
          <Link
            to="/forgot-password"
            className="block text-center text-xs text-gray-500 hover:text-gray-400 transition"
          >
            Glömt lösenordet?
          </Link>
        </form>

        {/* Länk till registreringssidan */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Inget konto?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 transition">
            Skapa ett konto
          </Link>
        </p>
      </div>
    </div>
  )
}
