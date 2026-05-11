// ============================================================
// Admin.jsx – src/pages
// ============================================================
// Admin-sida för att skapa användare med valfri roll.
// Tillgänglig BARA för användare med Admin-rollen.
//
// Roller:
//   User        = vanlig bankkund
//   Teller      = bankpersonal, kan hantera insättningar/uttag
//   Auditor     = skrivskyddad åtkomst, bara läsa
//   BankManager = kan hantera konton och kort
//   Admin       = full åtkomst, kräver @nexapay.com-epost
// ============================================================

// useState för formulärdata och status
import { useState } from 'react'

// Layout-komponenten med sidebar
import Layout from '../components/Layout'

// API-funktion för att skapa användare som Admin
import { adminCreateUser } from '../api/admin'

// Tillgängliga roller som Admin kan tilldela
const ROLES = ['User', 'Teller', 'Auditor', 'BankManager', 'Admin']

export default function Admin() {
  // Formulärdata – e-post, lösenord och roll
  const [form, setForm] = useState({ email: '', password: '', role: 'User' })

  // Laddningsstatus under API-anropet
  const [submitting, setSubmitting] = useState(false)

  // Felmeddelande (t.ex. "E-posten används redan")
  const [error, setError] = useState('')

  // Bekräftelsemeddelande efter lyckat skapande
  const [success, setSuccess] = useState('')

  // Hanterar formulärets submit
  async function handleSubmit(e) {
    // Förhindra sidladdning
    e.preventDefault()

    // Rensa gamla meddelanden
    setError('')
    setSuccess('')

    // Starta laddning
    setSubmitting(true)

    try {
      // Skicka e-post, lösenord och roll till admin-endpointen
      await adminCreateUser(form.email, form.password, form.role)

      // Visa bekräftelse med e-postadressen och rollen
      setSuccess(`Användare "${form.email}" skapades med rollen ${form.role}.`)

      // Töm formuläret inför nästa skapande
      setForm({ email: '', password: '', role: 'User' })
    } catch (e) {
      // Visa felmeddelande (t.ex. "Personalroller kräver @nexapay.com")
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-md">

        {/* Sidrubrik */}
        <h1 className="text-2xl font-bold text-white mb-2">Admin</h1>
        <p className="text-gray-400 text-sm mb-8">
          Skapa användare med valfri roll. Personalroller kräver @nexapay.com-epost.
        </p>

        {/* Skapa användare-formulär */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-5">Skapa användare</h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Felmeddelande */}
            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
                {error}
              </p>
            )}

            {/* Bekräftelsemeddelande */}
            {success && (
              <p className="text-green-400 text-sm bg-green-400/10 border border-green-400/20 rounded-lg px-4 py-2">
                {success}
              </p>
            )}

            {/* E-post */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">E-post</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="användare@nexapay.com"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* Lösenord */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Lösenord</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* Roll – dropdown med alla tillgängliga roller */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Roll</label>
              <select
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
              >
                {/* Rendera ett alternativ per roll från ROLES-konstanten */}
                {ROLES.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Skapa-knapp */}
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
