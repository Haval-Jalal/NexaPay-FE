import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import ConfirmModal from '../components/ConfirmModal'
import { adminCreateUser, listUsers, deleteUser } from '../api/admin'

const ROLES = ['User', 'Teller', 'Auditor', 'BankManager', 'Admin']

export default function Admin() {
  const [form, setForm]           = useState({ email: '', password: '', role: 'User' })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')

  const [users, setUsers]         = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [usersError, setUsersError] = useState('')

  const [confirm, setConfirm]     = useState(null)
  const [deleting, setDeleting]   = useState(false)

  async function loadUsers() {
    try {
      const res = await listUsers()
      setUsers(res.data ?? [])
    } catch (e) {
      setUsersError(e.message)
    } finally {
      setLoadingUsers(false)
    }
  }

  useEffect(() => { loadUsers() }, [])

  async function handleCreate(e) {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')
    setSubmitting(true)
    try {
      await adminCreateUser(form.email, form.password, form.role)
      setFormSuccess(`Användare "${form.email}" skapades med rollen ${form.role}.`)
      setForm({ email: '', password: '', role: 'User' })
      loadUsers()
    } catch (e) {
      setFormError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id) {
    setDeleting(true)
    try {
      await deleteUser(id)
      setUsers(prev => prev.filter(u => u.id !== id))
    } catch (e) {
      setUsersError(e.message)
    } finally {
      setDeleting(false)
      setConfirm(null)
    }
  }

  const ROLE_COLORS = {
    Admin: 'text-red-400',
    BankManager: 'text-orange-400',
    Teller: 'text-yellow-400',
    Auditor: 'text-blue-400',
    User: 'text-green-400',
  }

  return (
    <Layout>
      <div className="max-w-4xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Admin</h1>
          <p className="text-gray-400 text-sm">Hantera användare och roller.</p>
        </div>

        {/* Skapa användare */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-5">Skapa användare</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            {formError && (
              <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
                {formError}
              </p>
            )}
            {formSuccess && (
              <p className="text-green-400 text-sm bg-green-400/10 border border-green-400/20 rounded-lg px-4 py-2">
                {formSuccess}
              </p>
            )}
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">E-post</label>
                <input
                  type="email" required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="anvandare@nexapay.com"
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Lösenord</label>
                <input
                  type="password" required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
                />
                <p className="text-xs text-gray-500 mt-1">Min 8 tecken · Stor bokstav · Siffra · Specialtecken</p>
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
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg px-6 py-2.5 transition disabled:opacity-60"
            >
              {submitting ? 'Skapar...' : 'Skapa användare'}
            </button>
          </form>
        </div>

        {/* Användarlista */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-5">
            Alla användare
            {!loadingUsers && (
              <span className="ml-2 text-xs font-normal text-gray-500">({users.length})</span>
            )}
          </h2>

          {usersError && (
            <p className="text-red-400 text-sm mb-4">{usersError}</p>
          )}

          {loadingUsers ? (
            <div className="space-y-2">
              {[1,2,3].map(i => (
                <div key={i} className="h-10 bg-gray-800 rounded animate-pulse" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <p className="text-gray-500 text-sm">Inga användare hittades.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-xs border-b border-gray-800">
                    <th className="text-left py-2 pr-4 font-medium">E-post</th>
                    <th className="text-left py-2 pr-4 font-medium">Roll</th>
                    <th className="text-left py-2 pr-4 font-medium">Bekräftad</th>
                    <th className="text-left py-2 pr-4 font-medium">Spärrad till</th>
                    <th className="py-2" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-800/50 transition">
                      <td className="py-2.5 pr-4 text-white truncate max-w-[220px]" title={u.email}>
                        {u.email}
                      </td>
                      <td className={`py-2.5 pr-4 font-medium ${ROLE_COLORS[u.role] ?? 'text-gray-400'}`}>
                        {u.role}
                      </td>
                      <td className="py-2.5 pr-4">
                        {u.emailConfirmed
                          ? <span className="text-green-400">Ja</span>
                          : <span className="text-gray-500">Nej</span>}
                      </td>
                      <td className="py-2.5 pr-4 text-gray-400">
                        {u.lockoutEnd
                          ? new Date(u.lockoutEnd).toLocaleString('sv-SE')
                          : <span className="text-gray-600">—</span>}
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => setConfirm(u)}
                          className="text-xs text-red-400 hover:text-red-300 border border-red-400/30 hover:border-red-400/60 rounded px-2.5 py-1 transition"
                        >
                          Ta bort
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {confirm && (
        <ConfirmModal
          title="Ta bort användare"
          message={`Är du säker på att du vill ta bort "${confirm.email}"? Åtgärden kan inte ångras.`}
          confirmLabel={deleting ? 'Tar bort...' : 'Ta bort'}
          confirmClass="bg-red-600 hover:bg-red-500"
          onConfirm={() => handleDelete(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </Layout>
  )
}
