import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { resetPassword } from '../api/auth'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') ?? ''
  const token = searchParams.get('token') ?? ''

  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.newPassword !== form.confirmPassword) {
      setError('Lösenorden matchar inte.')
      return
    }
    setSubmitting(true)
    try {
      await resetPassword(email, token, form.newPassword)
      setDone(true)
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
        <p className="text-gray-400 text-center mb-8">Välj nytt lösenord</p>

        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
          {done ? (
            <div className="text-center space-y-4">
              <p className="text-green-400 text-sm">Lösenordet har återställts. Du kan nu logga in.</p>
              <Link to="/login" className="block bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg py-2.5 transition text-center">Logga in</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">{error}</p>}
              {[
                { name: 'newPassword', label: 'Nytt lösenord' },
                { name: 'confirmPassword', label: 'Bekräfta lösenord' },
              ].map(({ name, label }) => (
                <div key={name}>
                  <label className="block text-sm text-gray-400 mb-1">{label}</label>
                  <input
                    type="password" required name={name}
                    value={form[name]} onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
                    placeholder="••••••••"
                  />
                </div>
              ))}
              <button type="submit" disabled={submitting}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg py-2.5 transition disabled:opacity-60">
                {submitting ? 'Sparar...' : 'Spara nytt lösenord'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
