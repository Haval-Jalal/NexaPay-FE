import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { getAccounts } from '../api/accounts'
import { payInvoice } from '../api/transactions'
import { useAuth } from '../context/useAuth'
import { can } from '../utils/roles'
import { useToast } from '../context/useToast'

// Mod-10 (Luhn) – speglar OcrPolicy i backend för snabb klientfeedback.
function isValidOcr(ocr) {
  const v = (ocr ?? '').trim()
  if (!/^\d{2,25}$/.test(v)) return false
  let sum = 0
  let doubleNext = false
  for (let i = v.length - 1; i >= 0; i--) {
    let n = v.charCodeAt(i) - 48
    if (doubleNext) {
      n *= 2
      if (n > 9) n -= 9
    }
    sum += n
    doubleNext = !doubleNext
  }
  return sum % 10 === 0
}

export default function PayInvoice() {
  const { user } = useAuth()
  const role = user?.role
  const toast = useToast()

  const [accounts, setAccounts]     = useState([])
  const [form, setForm]             = useState({ fromAccountId: '', bankgiro: '', ocr: '', amount: '', description: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]           = useState('')

  useEffect(() => { document.title = 'Betala faktura – NexaPay' }, [])

  useEffect(() => {
    if (!can.write(role)) return
    getAccounts().then(res => {
      const open = (res.data ?? []).filter(a => a.status === 'Open')
      setAccounts(open)
      if (open.length > 0) setForm(f => ({ ...f, fromAccountId: open[0].id }))
    }).catch(e => setError(e.message))
  }, [role])

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
      await payInvoice(
        form.fromAccountId,
        parseFloat(form.amount),
        form.bankgiro.trim(),
        form.ocr.trim(),
        form.description,
      )
      toast(`Faktura på ${parseFloat(form.amount).toLocaleString('sv-SE', { style: 'currency', currency: 'SEK' })} betald.`)
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
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2.5">
              {error}
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
