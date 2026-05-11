import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const navigate = useNavigate()
  const { saveUser } = useAuth()
  const [form, setForm] = useState({ email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setInfo('')

    if (form.password !== form.confirm) {
      setError('Lösenorden matchar inte.')
      return
    }

    setLoading(true)
    try {
      const res = await register(form.email, form.password)

      if (res.data?.requiresEmailConfirmation) {
        setInfo('Konto skapat! Kontrollera din e-post och bekräfta kontot innan du loggar in.')
        return
      }

      saveUser(res.data)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-white text-center mb-2">NexaPay</h1>
        <p className="text-gray-400 text-center mb-8">Skapa ett konto</p>

        <form onSubmit={handleSubmit} className="bg-gray-900 rounded-2xl p-8 space-y-5 border border-gray-800">
          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2.5">
              {error}
            </p>
          )}
          {info && (
            <p className="text-green-400 text-sm bg-green-400/10 border border-green-400/20 rounded-lg px-4 py-2.5">
              {info}
            </p>
          )}

          <div>
            <label className="block text-sm text-gray-400 mb-1">E-post</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={loading || !!info}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition disabled:opacity-50"
              placeholder="du@exempel.se"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Lösenord</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              disabled={loading || !!info}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition disabled:opacity-50"
              placeholder="••••••••"
            />
            <p className="text-xs text-gray-500 mt-1">Min 8 tecken, stor bokstav, siffra och specialtecken.</p>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Bekräfta lösenord</label>
            <input
              type="password"
              name="confirm"
              value={form.confirm}
              onChange={handleChange}
              required
              disabled={loading || !!info}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          {!info && (
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg py-2.5 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Skapar konto...' : 'Skapa konto'}
            </button>
          )}

          {info && (
            <Link
              to="/login"
              className="block w-full text-center bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg py-2.5 transition"
            >
              Gå till inloggning
            </Link>
          )}
        </form>

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
