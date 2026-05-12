import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { confirmEmail } from '../api/auth'
import AuthLayout from '../components/AuthLayout'

export default function ConfirmEmail() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('loading')
  const [error, setError]   = useState('')
  const hasRun = useRef(false)

  useEffect(() => { document.title = 'E-postbekräftelse – NexaPay' }, [])

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    const userId = searchParams.get('userId')
    const token  = searchParams.get('token')

    if (!userId || !token) {
      setStatus('pending')
      return
    }

    confirmEmail(userId, token)
      .then(() => setStatus('success'))
      .catch(err => {
        setStatus('error')
        setError(err.message)
      })
  }, [searchParams])

  return (
    <AuthLayout>
      <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 text-center">
        {status === 'pending' && (
          <>
            <p className="text-indigo-400 font-semibold mb-2">Kontrollera din e-post</p>
            <p className="text-gray-400 text-sm mb-6">
              Vi har skickat en bekräftelselänk till din e-postadress. Klicka på länken för att aktivera ditt konto.
            </p>
            <Link to="/login" className="inline-block text-indigo-400 hover:text-indigo-300 text-sm transition">
              Tillbaka till inloggning
            </Link>
          </>
        )}

        {status === 'loading' && (
          <p className="text-gray-400">Bekräftar din e-postadress...</p>
        )}

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

        {status === 'error' && (
          <>
            <p className="text-red-400 font-semibold mb-2">Bekräftelsen misslyckades</p>
            <p className="text-gray-400 text-sm mb-6">{error}</p>
            <Link to="/login" className="inline-block text-indigo-400 hover:text-indigo-300 text-sm transition">
              Tillbaka till inloggning
            </Link>
          </>
        )}
      </div>
    </AuthLayout>
  )
}
