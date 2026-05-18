// ============================================================
// pages/Transfer.jsx – flytta pengar mellan konton
// ============================================================
// Användaren väljer ett från-konto (egna eller alla för staff) och
// skriver in mottagarens kontonummer. När fältet stabiliserats
// (debounce 400 ms) körs lookupAccount() för att visa mottagar-
// namnet. Submit POST:ar till /api/transactions/transfer med
// Idempotency-Key.
// ============================================================

import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { lookupAccount } from '../api/accounts'
import { transfer } from '../api/transactions'
import { useAuth } from '../context/useAuth'
import { useAccounts } from '../hooks/useAccounts'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { can } from '../utils/roles'
import { useToast } from '../context/useToast'
import { formatCurrency } from '../helpers/format'

export default function Transfer() {
  const { user } = useAuth()
  const role = user?.role
  const toast = useToast()

  const { accounts } = useAccounts({ onlyOpen: true })
  const [form, setForm] = useState({ fromAccountId: '', amount: '', description: '' })

  // Härlett från-konto: använd valt om finns, annars första kontot.
  // Aldrig setState i effect = ingen onödig rerender och inget lint-fel.
  const fromAccountId = form.fromAccountId || accounts[0]?.id || ''

  const [toNumber, setToNumber] = useState('')
  const debouncedNumber = useDebouncedValue(toNumber, 500)

  // Resultatet från senaste lookup – inkl. *vilket värde* det är för
  // så att vi kan ignorera stale resultat när användaren skriver vidare.
  const [lookupResult, setLookupResult] = useState({
    value: '',
    recipient: null,
    status: 'idle', // 'idle' | 'found' | 'notfound' | 'error'
  })

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { document.title = 'Överföring – NexaPay' }, [])

  useEffect(() => {
    const val = debouncedNumber.trim()
    if (!val) return
    let active = true
    lookupAccount(val)
      .then(res => {
        if (active) setLookupResult({ value: val, recipient: res.data, status: 'found' })
      })
      .catch(e => {
        if (active) setLookupResult({
          value: val,
          recipient: null,
          status: e.status === 404 ? 'notfound' : 'error',
        })
      })
    return () => { active = false }
  }, [debouncedNumber])

  // Härled UI-state från råvärdena – ingen synkron setState i effect.
  const trimmedTo = toNumber.trim()
  const trimmedDebounced = debouncedNumber.trim()
  const isPendingDebounce = trimmedTo !== '' && trimmedTo !== trimmedDebounced
  const resultMatches = lookupResult.value !== '' && lookupResult.value === trimmedDebounced

  const lookupState =
    trimmedTo === '' ? 'idle' :
    isPendingDebounce ? 'loading' :
    resultMatches ? lookupResult.status : 'loading'

  const recipient = resultMatches && lookupResult.status === 'found'
    ? lookupResult.recipient
    : null

  async function handleSubmit(e) {
    e.preventDefault()
    if (!recipient) return
    setError('')
    if (fromAccountId === recipient.id) {
      setError('Från- och till-konto kan inte vara samma.')
      return
    }
    setSubmitting(true)
    try {
      const amount = parseFloat(form.amount)
      await transfer(fromAccountId, recipient.id, amount, form.description)
      toast(`Överföring på ${formatCurrency(amount)} till ${recipient.accountName} genomförd!`)
      setToNumber('')
      setLookupResult({ value: '', recipient: null, status: 'idle' })
      setForm(f => ({ ...f, amount: '', description: '' }))
    } catch (e) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const fromAccount = accounts.find(a => a.id === fromAccountId)

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
            <p role="alert" className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2.5">
              {error}
            </p>
          )}

          {/* Från konto */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Från konto</label>
            <select
              required
              value={fromAccountId}
              onChange={e => setForm({ ...form, fromAccountId: e.target.value })}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
            >
              {accounts.map(a => (
                <option key={a.id} value={a.id}>
                  {a.accountName} — {formatCurrency(a.balance, a.currency)}
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
              onChange={e => setToNumber(e.target.value)}
              placeholder="T.ex. SE1234567890"
              className={`w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border transition focus:outline-none
                ${lookupState === 'found'    ? 'border-green-500 focus:border-green-500' :
                  lookupState === 'notfound' || lookupState === 'error' ? 'border-red-500 focus:border-red-500' :
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
            {lookupState === 'error' && (
              <p className="text-xs text-red-400 mt-1">Sökningen misslyckades. Kontrollera anslutningen.</p>
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
