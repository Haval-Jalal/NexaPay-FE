import { useState } from 'react'
import Layout from '../components/Layout'
import { changePassword } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function Settings() {
  const { user } = useAuth()
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setSuccess('')
    if (form.newPassword !== form.confirmPassword) {
      setError('Nya lösenorden matchar inte.')
      return
    }
    setSubmitting(true)
    try {
      await changePassword(form.currentPassword, form.newPassword)
      setSuccess('Lösenordet har bytts.')
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (e) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-md">
        <h1 className="text-2xl font-bold text-white mb-8">Inställningar</h1>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <p className="text-sm text-gray-400">Inloggad som</p>
          <p className="text-white font-medium mt-1">{user?.email}</p>
          <p className="text-xs text-gray-500 mt-0.5">Roll: {user?.role}</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-5">Byt lösenord</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">{error}</p>}
            {success && <p className="text-green-400 text-sm bg-green-400/10 border border-green-400/20 rounded-lg px-4 py-2">{success}</p>}

            {[
              { name: 'currentPassword', label: 'Nuvarande lösenord' },
              { name: 'newPassword', label: 'Nytt lösenord' },
              { name: 'confirmPassword', label: 'Bekräfta nytt lösenord' },
            ].map(({ name, label }) => (
              <div key={name}>
                <label className="block text-sm text-gray-400 mb-1">{label}</label>
                <input
                  type="password"
                  required
                  value={form[name]}
                  onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                  name={name}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
                  placeholder="••••••••"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg py-2.5 transition disabled:opacity-60"
            >
              {submitting ? 'Sparar...' : 'Byt lösenord'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}
