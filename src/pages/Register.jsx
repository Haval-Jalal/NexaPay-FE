import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/auth'
import { useAuth } from '../context/useAuth'
import AuthLayout from '../components/AuthLayout'

const STRENGTH_LEVELS = [
  { label: '',      bar: 'bg-gray-700', text: '' },
  { label: 'Svag',  bar: 'bg-red-500',    text: 'text-red-400' },
  { label: 'Medel', bar: 'bg-yellow-500', text: 'text-yellow-400' },
  { label: 'Bra',   bar: 'bg-blue-500',   text: 'text-blue-400' },
  { label: 'Stark', bar: 'bg-green-500',  text: 'text-green-400' },
]

function getPasswordStrength(pw) {
  if (!pw) return 0
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}

export default function Register() {
  const navigate = useNavigate()
  const { saveUser } = useAuth()
  const [form, setForm] = useState({ email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { document.title = 'Skapa konto – NexaPay' }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('Lösenorden matchar inte.')
      return
    }
    setLoading(true)
    try {
      const res = await register(form.email, form.password)
      if (res.data?.requiresEmailConfirmation) {
        navigate('/confirm-email')
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
    <AuthLayout subtitle="Skapa ett konto">
      <form onSubmit={handleSubmit} className="bg-gray-900 rounded-2xl p-8 space-y-5 border border-gray-800">
        {error && (
          <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2.5">
            {error}
          </p>
        )}
        <div>
          <label className="block text-sm text-gray-400 mb-1">E-post</label>
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
            disabled={loading}
            placeholder="du@exempel.se"
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Lösenord</label>
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
            disabled={loading}
            placeholder="••••••••"
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition disabled:opacity-50"
          />
          {form.password ? (() => {
            const lvl = getPasswordStrength(form.password)
            const s   = STRENGTH_LEVELS[lvl]
            return (
              <div className="mt-1.5 space-y-1">
                <div className="flex gap-1">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= lvl ? s.bar : 'bg-gray-700'}`} />
                  ))}
                </div>
                <p className={`text-xs ${s.text}`}>{s.label}</p>
              </div>
            )
          })() : (
            <p className="text-xs text-gray-500 mt-1">Min 8 tecken, stor bokstav, siffra och specialtecken.</p>
          )}
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Bekräfta lösenord</label>
          <input
            type="password"
            name="confirm"
            autoComplete="new-password"
            value={form.confirm}
            onChange={e => setForm({ ...form, confirm: e.target.value })}
            required
            disabled={loading}
            placeholder="••••••••"
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg py-2.5 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Skapar konto...' : 'Skapa konto'}
        </button>
      </form>
      <p className="text-center text-gray-500 text-sm mt-6">
        Har du redan ett konto?{' '}
        <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition">
          Logga in
        </Link>
      </p>
    </AuthLayout>
  )
}
