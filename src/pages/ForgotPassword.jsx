import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../api/auth'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await forgotPassword(email)
      setSent(true)
    } catch (e) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-white text-center mb-2">NexaPay</h1>
        <p className="text-gray-400 text-center mb-8">Återställ lösenord</p>

        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
          {sent ? (
            <div className="space-y-4 text-center">
              <p className="text-green-400 text-sm">Om e-postadressen finns registrerad skickas ett återställningsmail inom kort.</p>
              <Link to="/login" className="block text-indigo-400 hover:text-indigo-300 text-sm transition">Tillbaka till inloggning</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">{error}</p>}
              <div>
                <label className="block text-sm text-gray-400 mb-1">E-post</label>
                <input
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
                  placeholder="du@exempel.se"
                />
              </div>
              <button type="submit" disabled={submitting}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg py-2.5 transition disabled:opacity-60">
                {submitting ? 'Skickar...' : 'Skicka återställningslänk'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition">Tillbaka till inloggning</Link>
        </p>
      </div>
    </div>
  )
}
