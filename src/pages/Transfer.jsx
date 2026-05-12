import { useState, useEffect, useRef } from 'react'
import Layout from '../components/Layout'
import { getAccounts, lookupAccount } from '../api/accounts'
import { transfer } from '../api/transactions'
import { useAuth } from '../context/AuthContext'
import { can } from '../utils/roles'

export default function Transfer() {
  const { user } = useAuth()
  const role = user?.role

  const [accounts, setAccounts]       = useState([])
  const [form, setForm]               = useState({ fromAccountId: '', amount: '', description: '' })
  const [toNumber, setToNumber]       = useState('')
  const [recipient, setRecipient]     = useState(null)   // { id, accountName, accountNumber }
  const [lookupState, setLookupState] = useState('idle') // idle | loading | found | notfound
  const [submitting, setSubmitting]   = useState(false)
  const [error, setError]             = useState('')
  const [success, setSuccess]         = useState('')
  const debounceRef = useRef(null)

  useEffect(() => {
    if (!can.transfer(role)) return
    getAccounts().then(res => {
      const open = (res.data ?? []).filter(a => a.status === 'Open')
      setAccounts(open)
      if (open.length > 0) setForm(f => ({ ...f, fromAccountId: open[0].id }))
    }).catch(() => {})
  }, [role])

  function handleToNumberChange(e) {
    const val = e.target.value
    setToNumber(val)
    setRecipient(null)
    setError('')
    setSuccess('')

    clearTimeout(debounceRef.current)

    if (!val.trim()) {
      setLookupState('idle')
      return
    }

    setLookupState('loading')
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await lookupAccount(val.trim())
        setRecipient(res.data)
        setLookupState('found')
      } catch {
        setLookupState('notfound')
      }
    }, 500)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!recipient) return
    setError('')
    setSuccess('')
    if (form.fromAccountId === recipient.id) {
      setError('Från- och till-konto kan inte vara samma.')
      return
    }
    setSubmitting(true)
    try {
      await transfer(form.fromAccountId, recipient.id, parseFloat(form.amount), form.description)
      setSuccess(`Överföring på ${parseFloat(form.amount).toLocaleString('sv-SE', { style: 'currency', currency: 'SEK' })} till ${recipient.accountName} genomfördes!`)
      setToNumber('')
      setRecipient(null)
      setLookupState('idle')
      setForm(f => ({ ...f, amount: '', description: '' }))
    } catch (e) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const fromAccount = accounts.find(a => a.id === form.fromAccountId)

  if (!can.transfer(role)) {
    return (
      <Layout>
        <div className="max-w-lg">
          <h1 className="text-2xl font-bold text-white mb-4">Överföring</h1>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 text-yellow-300 text-sm">
            Din roll ({role}) har inte behörighet att göra överföringar.
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-lg">
        <h1 className="text-2xl font-bold text-white mb-8">Överföring</h1>

        <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2.5">
              {error}
            </p>
          )}
          {success && (
            <p className="text-green-400 text-sm bg-green-400/10 border border-green-400/20 rounded-lg px-4 py-2.5">
              {success}
            </p>
          )}

          {/* Från konto */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Från konto</label>
            <select
              required
              value={form.fromAccountId}
              onChange={e => setForm({ ...form, fromAccountId: e.target.value })}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
            >
              {accounts.map(a => (
                <option key={a.id} value={a.id}>
                  {a.accountName} — {a.balance.toLocaleString('sv-SE', { style: 'currency', currency: a.currency || 'SEK' })}
                </option>
              ))}
            </select>
            {fromAccount && (
              <p className="text-xs text-gray-500 mt-1">{fromAccount.accountNumber}</p>
            )}
          </div>

          {/* Till konto – sök på kontonummer */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Till kontonummer</label>
            <input
              required
              value={toNumber}
              onChange={handleToNumberChange}
              placeholder="T.ex. SE1234567890"
              className={`w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border transition focus:outline-none
                ${lookupState === 'found'    ? 'border-green-500 focus:border-green-500' :
                  lookupState === 'notfound' ? 'border-red-500 focus:border-red-500' :
                                               'border-gray-700 focus:border-indigo-500'}`}
            />

            {lookupState === 'loading' && (
              <p className="text-xs text-gray-500 mt-1">Söker konto…</p>
            )}
            {lookupState === 'found' && recipient && (
              <div className="mt-2 flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2">
                <span className="text-green-400 text-sm">✓</span>
                <div>
                  <p className="text-sm text-white font-medium">{recipient.accountName}</p>
                  <p className="text-xs text-gray-400">{recipient.accountNumber}</p>
                </div>
              </div>
            )}
            {lookupState === 'notfound' && (
              <p className="text-xs text-red-400 mt-1">Inget konto hittades med det numret.</p>
            )}
          </div>

          {/* Belopp */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Belopp (SEK)</label>
            <input
              type="number" min="1" step="0.01" required
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
              placeholder="0.00"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Meddelande */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Meddelande (valfritt)</label>
            <input
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="T.ex. Hyra mars"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !recipient || accounts.length === 0}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg py-2.5 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Genomför…' : 'Skicka'}
          </button>
        </form>
      </div>
    </Layout>
  )
}
