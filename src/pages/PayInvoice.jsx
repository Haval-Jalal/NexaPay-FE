// ============================================================
// pages/PayInvoice.jsx – betala faktura (bankgiro + OCR)
// ============================================================
// Användaren anger från-konto, belopp, bankgironummer och OCR.
// OCR valideras klient-sida med mod-10 (Luhn) via isValidOcr()
// – samma regel som backend tillämpar i OcrPolicy. Submit POST:ar
// till /api/transactions/invoice-payment med Idempotency-Key.
// ============================================================

import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { payInvoice } from '../api/transactions'
import { useAuth } from '../context/useAuth'
import { useAccounts } from '../hooks/useAccounts'
import { can } from '../utils/roles'
import { useToast } from '../context/useToast'
import { formatCurrency } from '../helpers/format'
import { isValidOcr } from '../helpers/validators'

export default function PayInvoice() {
  const { user } = useAuth()
  const role = user?.role
  const toast = useToast()

  const { accounts } = useAccounts({ onlyOpen: true })
  const [form, setForm] = useState({ fromAccountId: '', bankgiro: '', ocr: '', amount: '', description: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { document.title = 'Betala faktura – NexaPay' }, [])

  // Härlett från-konto: använd valt om finns, annars första kontot.
  const fromAccountId = form.fromAccountId || accounts[0]?.id || ''

  const ocrTouched = form.ocr.trim().length > 0
  const ocrValid   = isValidOcr(form.ocr)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!ocrValid) {
      setError('OCR-numret är ogiltigt – kontrollera siffrorna.')
      return
    }
    setSubmitting(true)
    try {
      const amount = parseFloat(form.amount)
      await payInvoice(
        fromAccountId,
        amount,
        form.bankgiro.trim(),
        form.ocr.trim(),
        form.description,
      )
      toast(`Faktura på ${formatCurrency(amount)} betald.`)
      setForm(f => ({ ...f, bankgiro: '', ocr: '', amount: '', description: '' }))
    } catch (e) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!can.write(role)) {
    return (
      <Layout>
        <div className="max-w-lg">
          <h1 className="text-2xl font-bold text-white mb-4">Betala faktura</h1>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 text-yellow-300 text-sm">
            Din roll ({role}) har inte behörighet att betala fakturor.
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-lg">
        <h1 className="text-2xl font-bold text-white mb-8">Betala faktura</h1>

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
          </div>

          {/* Bankgiro/plusgiro */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Bankgiro / plusgiro</label>
            <input
              required
              inputMode="numeric"
              value={form.bankgiro}
              onChange={e => setForm({ ...form, bankgiro: e.target.value })}
              placeholder="T.ex. 12345678"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* OCR-nummer */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">OCR-nummer</label>
            <input
              required
              inputMode="numeric"
              value={form.ocr}
              onChange={e => setForm({ ...form, ocr: e.target.value })}
              placeholder="Referensnummer från fakturan"
              className={`w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border transition focus:outline-none
                ${!ocrTouched ? 'border-gray-700 focus:border-indigo-500' :
                  ocrValid    ? 'border-green-500 focus:border-green-500' :
                                'border-red-500 focus:border-red-500'}`}
            />
            {ocrTouched && !ocrValid && (
              <p className="text-xs text-red-400 mt-1">Ogiltigt OCR-nummer – fel kontrollsiffra eller format.</p>
            )}
            {ocrTouched && ocrValid && (
              <p className="text-xs text-green-400 mt-1">OCR-numret ser giltigt ut.</p>
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
            <label className="block text-sm text-gray-400 mb-1">Beskrivning</label>
            <input
              required
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="T.ex. Elräkning mars"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || accounts.length === 0 || !ocrValid}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg py-2.5 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Betalar…' : 'Betala faktura'}
          </button>
        </form>
      </div>
    </Layout>
  )
}
