// ============================================================
// Dashboard.jsx – src/pages
// ============================================================
// Översiktssida – visar alla användares bankkonton.
// Härifrån kan man:
//   - Se alla konton med saldo och status
//   - Klicka på ett konto för att öppna detaljvyn
//   - Skapa ett nytt bankkonto via en modal
// ============================================================

// useState för kontolista, laddning, fel och modal-state
// useEffect för att hämta konton när sidan laddas
import { useState, useEffect } from 'react'

// useNavigate för att navigera till kontots detaljsida vid klick
import { useNavigate } from 'react-router-dom'

// Layout-komponenten med sidebar och navigation
import Layout from '../components/Layout'

// Modal-komponenten för skapa-konto-formuläret
import Modal from '../components/Modal'

// API-funktioner för konton
import { getAccounts, createAccount } from '../api/accounts'

// Mappning från engelska kontotyper till svenska etiketter
const TYPE_LABELS = {
  Checking: 'Lönekonto',
  Savings:  'Sparkonto',
  ISK:      'ISK',
}

// Färgklass per kontostatus – grön=öppet, blå=fryst, röd=stängt
const STATUS_COLORS = {
  Open:   'text-green-400',
  Frozen: 'text-blue-400',
  Closed: 'text-red-400',
}

export default function Dashboard() {
  // useNavigate – navigerar till /accounts/:id vid klick på ett konto
  const navigate = useNavigate()

  // Lista med konton från API:et
  const [accounts, setAccounts] = useState([])

  // Laddningsstatus – visas medans API-anropet pågår
  const [loading, setLoading] = useState(true)

  // Felmeddelande om hämtning misslyckas
  const [error, setError] = useState('')

  // Styr om "Skapa konto"-modalen är öppen
  const [showCreate, setShowCreate] = useState(false)

  // Formulärdata för det nya kontot
  const [form, setForm] = useState({ accountName: '', accountType: 'Checking' })

  // Laddningsstatus under skapande av konto
  const [creating, setCreating] = useState(false)

  // Felmeddelande i skapa-konto-modalen
  const [createError, setCreateError] = useState('')

  // Hämtar alla konton från API:et
  // Kallas vid mount och efter att ett konto skapats
  async function loadAccounts() {
    try {
      const res = await getAccounts()
      // res.data är en array med AccountDto-objekt
      setAccounts(res.data ?? [])
    } catch (e) {
      setError(e.message)
    } finally {
      // Dölj laddningsindikator oavsett resultat
      setLoading(false)
    }
  }

  // Kör loadAccounts när komponenten mountas (tom array = bara en gång)
  useEffect(() => {
    loadAccounts()
  }, [])

  // Hanterar skapande av nytt konto
  async function handleCreate(e) {
    // Förhindra sidladdning
    e.preventDefault()

    // Rensa gamla fel
    setCreateError('')

    // Starta laddning för skapa-knappen
    setCreating(true)

    try {
      // Skicka kontots namn och typ till API:et
      await createAccount(form.accountName, form.accountType)

      // Stäng modalen och återställ formuläret
      setShowCreate(false)
      setForm({ accountName: '', accountType: 'Checking' })

      // Uppdatera kontolistan
      loadAccounts()
    } catch (e) {
      setCreateError(e.message)
    } finally {
      setCreating(false)
    }
  }

  // Beräkna totalt saldo för alla öppna konton
  // filter = bara öppna konton, reduce = summera balansen
  const totalBalance = accounts
    .filter(a => a.status === 'Open')
    .reduce((sum, a) => sum + a.balance, 0)

  return (
    <Layout>
      <div className="max-w-4xl">

        {/* Sidans header med totalt saldo och knapp för att skapa konto */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Översikt</h1>
            {/* Visa totalt saldo formaterat som SEK */}
            <p className="text-gray-400 text-sm mt-1">
              Totalt saldo (öppna konton):{' '}
              <span className="text-white font-semibold">
                {totalBalance.toLocaleString('sv-SE', { style: 'currency', currency: 'SEK' })}
              </span>
            </p>
          </div>

          {/* Knapp för att öppna skapa-konto-modalen */}
          <button
            onClick={() => setShowCreate(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            + Nytt konto
          </button>
        </div>

        {/* Laddningsindikator */}
        {loading && <p className="text-gray-400">Laddar konton...</p>}

        {/* Felmeddelande */}
        {error && <p className="text-red-400">{error}</p>}

        {/* Rutnät med kontokort – 2 kolumner på breda skärmar */}
        <div className="grid gap-4 sm:grid-cols-2">
          {accounts.map(account => (
            // Klickbart kort – navigerar till kontots detaljsida
            <button
              key={account.id}
              onClick={() => navigate(`/accounts/${account.id}`)}
              className="text-left bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-indigo-500 transition"
            >
              {/* Kontonamn, nummer och status */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-white">{account.accountName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{account.accountNumber}</p>
                </div>
                {/* Status med rätt färg */}
                <span className={`text-xs font-medium ${STATUS_COLORS[account.status] ?? 'text-gray-400'}`}>
                  {account.status}
                </span>
              </div>

              {/* Saldo formaterat som valuta */}
              <p className="text-2xl font-bold text-white">
                {account.balance.toLocaleString('sv-SE', { style: 'currency', currency: account.currency || 'SEK' })}
              </p>

              {/* Kontotyp på svenska */}
              <p className="text-xs text-gray-500 mt-1">
                {TYPE_LABELS[account.accountType] ?? account.accountType}
              </p>
            </button>
          ))}
        </div>

        {/* Tom-state – visas om inga konton finns */}
        {!loading && accounts.length === 0 && !error && (
          <p className="text-gray-500 mt-8">Inga konton ännu. Skapa ditt första konto!</p>
        )}
      </div>

      {/* Skapa konto-modal – visas när showCreate är true */}
      {showCreate && (
        <Modal title="Skapa konto" onClose={() => setShowCreate(false)}>
          <form onSubmit={handleCreate} className="space-y-4">

            {/* Felmeddelande i modalen */}
            {createError && (
              <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
                {createError}
              </p>
            )}

            {/* Kontonamn */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Kontonamn</label>
              <input
                value={form.accountName}
                onChange={e => setForm({ ...form, accountName: e.target.value })}
                required
                placeholder="T.ex. Mitt sparkonto"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* Kontotyp – dropdown med tre alternativ */}
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

            {/* Skapa-knapp */}
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
