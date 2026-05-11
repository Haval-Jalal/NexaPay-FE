// ============================================================
// Transfer.jsx – src/pages
// ============================================================
// Sida för att överföra pengar mellan konton.
// Användaren väljer från-konto, anger till-kontots ID (GUID),
// belopp och ett valfritt meddelande.
// ============================================================

// useState för formulär och status, useEffect för att ladda konton
import { useState, useEffect } from 'react'

// Layout-komponenten med sidebar
import Layout from '../components/Layout'

// API-funktion för att hämta konton (för from-dropdown)
import { getAccounts } from '../api/accounts'

// API-funktion för överföring
import { transfer } from '../api/transactions'

export default function Transfer() {
  // Användarens egna konton – används för "Från konto"-dropdown
  const [accounts, setAccounts] = useState([])

  // Formulärdata för överföringen
  const [form, setForm] = useState({
    fromAccountId: '',   // ID på avsändarkontot
    toAccountId: '',     // ID på mottagarkontot (matas in manuellt)
    amount: '',          // Belopp att överföra
    description: '',     // Valfritt meddelande
  })

  // Laddningsstatus under överföringen
  const [submitting, setSubmitting] = useState(false)

  // Felmeddelande (t.ex. otillräckligt saldo)
  const [error, setError] = useState('')

  // Bekräftelsemeddelande efter lyckad överföring
  const [success, setSuccess] = useState('')

  // Hämta användarens öppna konton för dropdown vid mount
  useEffect(() => {
    getAccounts().then(res => {
      // Filtrera bort frysta och stängda konton
      const openAccounts = (res.data ?? []).filter(a => a.status === 'Open')
      setAccounts(openAccounts)

      // Förvälj det första kontot om det finns konton
      if (openAccounts.length > 0) {
        setForm(f => ({ ...f, fromAccountId: openAccounts[0].id }))
      }
    }).catch(() => {
      // Ignorera fel – användaren ser inga konton i dropdown
    })
  }, [])

  // Hanterar överföringen
  async function handleSubmit(e) {
    // Förhindra sidladdning
    e.preventDefault()

    // Rensa gamla meddelanden
    setError('')
    setSuccess('')

    // Validera att från- och till-konto inte är samma
    if (form.fromAccountId === form.toAccountId) {
      setError('Från- och till-konto kan inte vara samma.')
      return
    }

    // Starta laddning
    setSubmitting(true)

    try {
      // Anropa transfer-endpointen
      await transfer(form.fromAccountId, form.toAccountId, parseFloat(form.amount), form.description)

      // Visa bekräftelse
      setSuccess('Överföringen genomfördes!')

      // Återställ to-fälten men behåll from-konto
      setForm(f => ({ ...f, toAccountId: '', amount: '', description: '' }))
    } catch (e) {
      // Visa felmeddelande (t.ex. "Otillräckligt saldo")
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  // Hitta det valda från-kontot för att visa kontonummer under dropdown
  const fromAccount = accounts.find(a => a.id === form.fromAccountId)

  return (
    <Layout>
      <div className="max-w-lg">

        {/* Sidrubrik */}
        <h1 className="text-2xl font-bold text-white mb-8">Överföring</h1>

        {/* Överföringsformulär */}
        <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">

          {/* Felmeddelande */}
          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2.5">
              {error}
            </p>
          )}

          {/* Bekräftelsemeddelande */}
          {success && (
            <p className="text-green-400 text-sm bg-green-400/10 border border-green-400/20 rounded-lg px-4 py-2.5">
              {success}
            </p>
          )}

          {/* Från konto – dropdown med användarens öppna konton */}
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
                  {/* Visa kontonamn och saldo i dropdown-alternativet */}
                  {a.accountName} — {a.balance.toLocaleString('sv-SE', { style: 'currency', currency: a.currency || 'SEK' })}
                </option>
              ))}
            </select>
            {/* Visa kontonumret under dropdown som hjälptext */}
            {fromAccount && (
              <p className="text-xs text-gray-500 mt-1">{fromAccount.accountNumber}</p>
            )}
          </div>

          {/* Till konto – manuell inmatning av mottagarens konto-ID (GUID) */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Till konto-ID</label>
            <input
              required
              value={form.toAccountId}
              onChange={e => setForm({ ...form, toAccountId: e.target.value })}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Mottagarens konto-ID (GUID)</p>
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

          {/* Valfritt meddelande till mottagaren */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Meddelande (valfritt)</label>
            <input
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="T.ex. Hyra mars"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Skicka-knapp – disabled om inga konton finns eller under överföring */}
          <button
            type="submit"
            disabled={submitting || accounts.length === 0}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg py-2.5 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Genomför...' : 'Skicka'}
          </button>
        </form>
      </div>
    </Layout>
  )
}
