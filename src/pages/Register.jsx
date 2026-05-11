// ============================================================
// Register.jsx – src/pages
// ============================================================
// Registreringssida för nya användare.
// Hanterar två scenarion efter lyckad registrering:
//   1. E-postbekräftelse krävs – visa informationsmeddelande
//   2. Direkt inloggning – spara token och gå till dashboard
// ============================================================

// useState för formulärdata, fel- och infomeddelanden
import { useState } from 'react'

// Link för navigation, useNavigate för omdirigering
import { Link, useNavigate } from 'react-router-dom'

// API-funktion för registrering
import { register } from '../api/auth'

// useAuth för att spara användaren i global context vid direkt inloggning
import { useAuth } from '../context/AuthContext'

export default function Register() {
  // useNavigate – omdirigerar till /dashboard om direkt inloggning sker
  const navigate = useNavigate()

  // Hämta saveUser-funktionen från AuthContext
  const { saveUser } = useAuth()

  // Formulärdata – e-post, lösenord och bekräftat lösenord
  const [form, setForm] = useState({ email: '', password: '', confirm: '' })

  // Felmeddelande – visas i rött (t.ex. lösenord matchar inte)
  const [error, setError] = useState('')

  // Infomeddelande – visas i grönt när e-postbekräftelse krävs
  const [info, setInfo] = useState('')

  // Laddningsstatus – inaktiverar formuläret under API-anropet
  const [loading, setLoading] = useState(false)

  // Uppdaterar rätt fält i form-state när användaren skriver
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Hanterar formulärets submit
  async function handleSubmit(e) {
    // Förhindra sidladdning
    e.preventDefault()

    // Rensa gamla meddelanden
    setError('')
    setInfo('')

    // Validera att båda lösenordsfälten matchar innan API-anrop
    if (form.password !== form.confirm) {
      setError('Lösenorden matchar inte.')
      return
    }

    // Starta laddning
    setLoading(true)

    try {
      // Anropa register-endpointen
      const res = await register(form.email, form.password)

      // Kontrollera om servern kräver e-postbekräftelse
      if (res.data?.requiresEmailConfirmation) {
        // Visa informationsmeddelande – användaren kan inte logga in ännu
        setInfo('Konto skapat! Kontrollera din e-post och bekräfta kontot innan du loggar in.')
        return
      }

      // Direkt inloggning – spara token och skicka till dashboard
      saveUser(res.data)
      navigate('/dashboard')
    } catch (err) {
      // Visa felmeddelande från API:et (t.ex. "E-posten används redan")
      setError(err.message)
    } finally {
      // Återställ laddningsstatus
      setLoading(false)
    }
  }

  return (
    // Centrerat innehåll på hela skärmen
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Rubrik */}
        <h1 className="text-3xl font-bold text-white text-center mb-2">NexaPay</h1>
        <p className="text-gray-400 text-center mb-8">Skapa ett konto</p>

        {/* Registreringsformulär */}
        <form onSubmit={handleSubmit} className="bg-gray-900 rounded-2xl p-8 space-y-5 border border-gray-800">

          {/* Felmeddelande i rött */}
          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2.5">
              {error}
            </p>
          )}

          {/* Infomeddelande i grönt – visas när e-postbekräftelse krävs */}
          {info && (
            <p className="text-green-400 text-sm bg-green-400/10 border border-green-400/20 rounded-lg px-4 py-2.5">
              {info}
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
              disabled={loading || !!info}          // Inaktivera om info visas (konto skapat)
              placeholder="du@exempel.se"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition disabled:opacity-50"
            />
          </div>

          {/* Lösenordsfält med kravtext */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Lösenord</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              disabled={loading || !!info}
              placeholder="••••••••"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition disabled:opacity-50"
            />
            {/* Lösenordskrav från backenden */}
            <p className="text-xs text-gray-500 mt-1">
              Min 8 tecken, stor bokstav, siffra och specialtecken.
            </p>
          </div>

          {/* Bekräftelsefält för lösenord */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Bekräfta lösenord</label>
            <input
              type="password"
              name="confirm"
              value={form.confirm}
              onChange={handleChange}
              required
              disabled={loading || !!info}
              placeholder="••••••••"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition disabled:opacity-50"
            />
          </div>

          {/* Skapa konto-knapp – visas bara om info-meddelande INTE visas */}
          {!info && (
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg py-2.5 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Skapar konto...' : 'Skapa konto'}
            </button>
          )}

          {/* Länk till inloggning – visas när e-postbekräftelse har skickats */}
          {info && (
            <Link
              to="/login"
              className="block w-full text-center bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg py-2.5 transition"
            >
              Gå till inloggning
            </Link>
          )}
        </form>

        {/* Länk till inloggningssidan */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Har du redan ett konto?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition">
            Logga in
          </Link>
        </p>
      </div>
    </div>
  )
}
