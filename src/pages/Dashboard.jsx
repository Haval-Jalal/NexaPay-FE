import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import { getAccounts, createAccount } from '../api/accounts'

const TYPE_LABELS = { Checking: 'Lönekonto', Savings: 'Sparkonto', ISK: 'ISK' }
const STATUS_COLORS = {
  Open: 'text-green-400',
  Frozen: 'text-blue-400',
  Closed: 'text-red-400',
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ accountName: '', accountType: 'Checking' })
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  async function load() {
    try {
      const res = await getAccounts()
      setAccounts(res.data ?? [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleCreate(e) {
    e.preventDefault()
    setCreateError('')
    setCreating(true)
    try {
      await createAccount(form.accountName, form.accountType)
      setShowCreate(false)
      setForm({ accountName: '', accountType: 'Checking' })
      load()
    } catch (e) {
      setCreateError(e.message)
    } finally {
      setCreating(false)
    }
  }

  const totalBalance = accounts
    .filter(a => a.status === 'Open')
    .reduce((sum, a) => sum + a.balance, 0)

  return (
    <Layout>
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Översikt</h1>
            <p className="text-gray-400 text-sm mt-1">
              Totalt saldo (öppna konton):{' '}
              <span className="text-white font-semibold">
                {totalBalance.toLocaleString('sv-SE', { style: 'currency', currency: 'SEK' })}
              </span>
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            + Nytt konto
          </button>
        </div>

        {loading && <p className="text-gray-400">Laddar konton...</p>}
        {error && <p className="text-red-400">{error}</p>}

        <div className="grid gap-4 sm:grid-cols-2">
          {accounts.map(account => (
            <button
              key={account.id}
              onClick={() => navigate(`/accounts/${account.id}`)}
              className="text-left bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-indigo-500 transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-white">{account.accountName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{account.accountNumber}</p>
                </div>
                <span className={`text-xs font-medium ${STATUS_COLORS[account.status] ?? 'text-gray-400'}`}>
                  {account.status}
                </span>
              </div>
              <p className="text-2xl font-bold text-white">
                {account.balance.toLocaleString('sv-SE', { style: 'currency', currency: account.currency || 'SEK' })}
              </p>
              <p className="text-xs text-gray-500 mt-1">{TYPE_LABELS[account.accountType] ?? account.accountType}</p>
            </button>
          ))}
        </div>

        {!loading && accounts.length === 0 && !error && (
          <p className="text-gray-500 mt-8">Inga konton ännu. Skapa ditt första konto!</p>
        )}
      </div>

      {showCreate && (
        <Modal title="Skapa konto" onClose={() => setShowCreate(false)}>
          <form onSubmit={handleCreate} className="space-y-4">
            {createError && (
              <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">{createError}</p>
            )}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Kontonamn</label>
              <input
                value={form.accountName}
                onChange={e => setForm({ ...form, accountName: e.target.value })}
                required
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
                placeholder="T.ex. Mitt sparkonto"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Kontotyp</label>
              <select
                value={form.accountType}
                onChange={e => setForm({ ...form, accountType: e.target.value })}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
              >
                <option value="Checking">Lönekonto</option>
                <option value="Savings">Sparkonto</option>
                <option value="ISK">ISK</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={creating}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg py-2.5 transition disabled:opacity-60"
            >
              {creating ? 'Skapar...' : 'Skapa konto'}
            </button>
          </form>
        </Modal>
      )}
    </Layout>
  )
}
