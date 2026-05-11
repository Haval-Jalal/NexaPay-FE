// ============================================================
// ConfirmEmail.jsx – src/pages
// ============================================================
// Hanterar e-postbekräftelse via länk från bekräftelsemailet.
// Läser userId och token från URL-parametrarna och anropar
// POST /api/auth/confirm-email automatiskt vid sidladdning.
// ============================================================

// useState för status, useEffect för att anropa API vid mount
import { useState, useEffect, useRef } from 'react'

// Link för länk tillbaka till inloggning
import { Link, useSearchParams } from 'react-router-dom'

// API-funktion för e-postbekräftelse
import { confirmEmail } from '../api/auth'

export default function ConfirmEmail() {
  // Läs userId och token från URL-parametrarna
  const [searchParams] = useSearchParams()

  // Status – 'loading', 'success' eller 'error'
  const [status, setStatus] = useState('loading')

  // Felmeddelande om bekräftelsen misslyckas
  const [error, setError] = useState('')

  // Förhindra dubbelt anrop – React 18 StrictMode kör useEffect två gånger i dev
  const hasRun = useRef(false)

  // Anropa bekräftelse-endpointen direkt när sidan laddas
  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    const userId = searchParams.get('userId')
    const token  = searchParams.get('token')

    // Om parametrar saknas – visa felmeddelande direkt
    if (!userId || !token) {
      setStatus('error')
      setError('Ogiltig bekräftelselänk – userId eller token saknas.')
      return
    }

    // Anropa API:et med userId och token
    confirmEmail(userId, token)
      .then(() => setStatus('success'))
      .catch(err => {
        setStatus('error')
        setError(err.message)
      })
  }, [searchParams])

  return (
    // Centrerat innehåll på hela skärmen
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">

        {/* Rubrik */}
        <h1 className="text-3xl font-bold text-white mb-8">NexaPay</h1>

        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">

          {/* Laddning */}
          {status === 'loading' && (
            <p className="text-gray-400">Bekräftar din e-postadress...</p>
          )}

          {/* Lyckad bekräftelse */}
          {status === 'success' && (
            <>
              <p className="text-green-400 font-semibold mb-2">E-postadressen bekräftad!</p>
              <p className="text-gray-400 text-sm mb-6">Du kan nu logga in på ditt konto.</p>
              <Link
                to="/login"
                className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg px-6 py-2.5 transition"
              >
                Gå till inloggning
              </Link>
            </>
          )}

          {/* Felmeddelande */}
          {status === 'error' && (
            <>
              <p className="text-red-400 font-semibold mb-2">Bekräftelsen misslyckades</p>
              <p className="text-gray-400 text-sm mb-6">{error}</p>
              <Link
                to="/login"
                className="inline-block text-indigo-400 hover:text-indigo-300 text-sm transition"
              >
                Tillbaka till inloggning
              </Link>
            </>
          )}

        </div>
      </div>
    </div>
  )
}
