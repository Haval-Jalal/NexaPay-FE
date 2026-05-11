import { useState } from 'react'
import Layout from '../components/Layout'
import { adminCreateUser } from '../api/admin'

const ROLES = ['User', 'Teller', 'Auditor', 'BankManager', 'Admin']

export default function Admin() {
  const [form, setForm] = useState({ email: '', password: '', role: 'User' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setSuccess('')
    setSubmitting(true)
    try {
      await adminCreateUser(form.email, form.password, form.role)
      setSuccess(`Användare "${form.email}" skapades med rollen ${form.role}.`)
      setForm({ email: '', password: '', role: 'User' })
    } catch (e) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-md">
        <h1 className="text-2xl font-bold text-white mb-2">Admin</h1>
        <p className="text-gray-400 text-sm mb-8">Skapa användare med valfri roll. Personalroller kräver @nexapay.com-epost.</p>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-5">Skapa användare</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">{error}</p>}
            {success && <p className="text-green-400 text-sm bg-green-400/10 border border-green-400/20 rounded-lg px-4 py-2">{success}</p>}

            <div>
              <label className="block text-sm text-gray-400 mb-1">E-post</label>
              <input
                type="email" required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
                placeholder="användare@nexapay.com"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Lösenord</label>
              <input
                type="password" required
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Roll</label>
              <select
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
              >
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg py-2.5 transition disabled:opacity-60"
            >
              {submitting ? 'Skapar...' : 'Skapa användare'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}
