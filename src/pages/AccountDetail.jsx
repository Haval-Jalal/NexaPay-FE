// ============================================================
// AccountDetail.jsx – src/pages
// ============================================================
// Detaljsida för ett specifikt bankkonto.
// Visar: kontoinformation, kort och transaktioner.
//
// Åtgärder tillgängliga härifrån:
//   - Sätt in / Ta ut pengar (alla inloggade)
//   - Skapa, aktivera, blockera/avblockera kort
//   - Frys / avfrys konto (bara staff)
//   - Stäng konto permanent
// ============================================================

// useState för all lokal data, useEffect för att hämta vid mount
import { useState, useEffect } from 'react'

// useParams för att läsa konto-ID från URL:en, useNavigate för tillbaka-navigering
import { useParams, useNavigate } from 'react-router-dom'

// useAuth för att kontrollera om användaren är staff
import { useAuth } from '../context/AuthContext'

// Layout och Modal-komponenter
import Layout from '../components/Layout'
import Modal from '../components/Modal'

// API-funktioner för konton
import { getAccount, freezeAccount, unfreezeAccount, deleteAccount } from '../api/accounts'

// API-funktioner för kort
import { getCardsByAccount, createCard, activateCard, blockCard, unblockCard } from '../api/cards'

// API-funktioner för transaktioner
import { getTransactions, deposit, withdraw } from '../api/transactions'

// Färg per kontostatus
const STATUS_COLORS = { Open: 'text-green-400', Frozen: 'text-blue-400', Closed: 'text-red-400' }

// Färg per kortstatus
const CARD_STATUS_COLORS = { Active: 'text-green-400', Inactive: 'text-yellow-400', Blocked: 'text-red-400', Expired: 'text-gray-500' }

// Färg per transaktionstyp
const TX_COLORS = { Deposit: 'text-green-400', Withdrawal: 'text-red-400', Transfer: 'text-blue-400' }

// Tecken som visas före beloppet per transaktionstyp
const TX_SIGNS = { Deposit: '+', Withdrawal: '-', Transfer: '⇄' }

export default function AccountDetail() {
  // Hämta konto-ID från URL:en (t.ex. /accounts/abc-123)
  const { id } = useParams()

  // useNavigate för att gå tillbaka till dashboard om kontot stängs
  const navigate = useNavigate()

  // Hämta inloggad användare – används för att kolla om användaren är staff
  const { user } = useAuth()

  // Staff = ej vanlig User (Admin, BankManager, Teller, Auditor)
  const isStaff = user?.role !== 'User'

  // ---- State för data ----

  // Kontoinformation (AccountDto)
  const [account, setAccount] = useState(null)

  // Lista med kort kopplade till kontot (CardDto[])
  const [cards, setCards] = useState([])

  // Lista med transaktioner för aktuell sida (TransactionDto[])
  const [transactions, setTransactions] = useState([])

  // Pagineringsinformation – aktuell sida och totalt antal sidor
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 })

  // Övergripande laddningsstatus för första inladdningen
  const [loading, setLoading] = useState(true)

  // Felmeddelande om initial laddning misslyckas
  const [error, setError] = useState('')

  // ---- State för modaler ----

  // Vilken modal som är öppen: null | 'deposit' | 'withdraw' | 'createCard' | 'blockCard'
  const [modal, setModal] = useState(null)

  // ID på det kort som ska blockeras (används av blockCard-modalen)
  const [selectedCardId, setSelectedCardId] = useState(null)

  // Formulärdata för alla modaler – återanvänds för enkelhetens skull
  const [form, setForm] = useState({ amount: '', description: '', cardHolderName: '', blockReason: '' })

  // Laddning inuti en modal (under API-anrop)
  const [submitting, setSubmitting] = useState(false)

  // Felmeddelande inuti en modal
  const [formError, setFormError] = useState('')

  // Fullständiga kortuppgifter (PAN + CVV) – visas bara en gång vid skapande
  const [newCard, setNewCard] = useState(null)

  // ---- Datahämtning ----

  // Hämtar kontoinformation
  async function loadAccount() {
    try {
      const res = await getAccount(id)
      setAccount(res.data)
    } catch (e) {
      setError(e.message)
    }
  }

  // Hämtar alla kort kopplade till kontot
  async function loadCards() {
    try {
      const res = await getCardsByAccount(id)
      setCards(res.data ?? [])
    } catch {
      // Ignorera fel – kortlistan är sekundär information
    }
  }

  // Hämtar transaktioner för en specifik sida
  async function loadTransactions(page = 1) {
    try {
      const res = await getTransactions(id, page)
      // items = transaktionerna på denna sida
      setTransactions(res.data.items ?? [])
      // Spara pagineringsinformation
      setPagination({ page: res.data.page, totalPages: res.data.totalPages })
    } catch {
      // Ignorera fel – transaktionslistan är sekundär information
    }
  }

  // Kör alla tre hämtningar parallellt när sidan laddas
  useEffect(() => {
    // Promise.all väntar tills alla tre är klara
    Promise.all([loadAccount(), loadCards(), loadTransactions()])
      .finally(() => setLoading(false)) // Dölj laddning när allt är klart
  }, [id]) // Kör om id ändras (t.ex. navigering mellan konton)

  // ---- Modal-hjälpfunktioner ----

  // Öppnar en modal och återställer formulärstate
  function openModal(name, cardId = null) {
    setModal(name)
    setSelectedCardId(cardId)                                           // Spara vilket kort om det gäller ett kort
    setForm({ amount: '', description: '', cardHolderName: '', blockReason: '' })
    setFormError('')
    setNewCard(null)                                                    // Rensa gamla kortuppgifter
  }

  // Stänger modalen och nollställer kort-ID
  function closeModal() {
    setModal(null)
    setSelectedCardId(null)
  }

  // ---- Formulärhanterare ----

  // Hanterar insättning
  async function handleDeposit(e) {
    e.preventDefault()
    setSubmitting(true)
    setFormError('')
    try {
      // Skicka beloppet som ett tal (inte sträng)
      await deposit(id, parseFloat(form.amount), form.description)
      closeModal()
      // Uppdatera saldo och transaktionslista
      loadAccount()
      loadTransactions()
    } catch (e) {
      setFormError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  // Hanterar uttag
  async function handleWithdraw(e) {
    e.preventDefault()
    setSubmitting(true)
    setFormError('')
    try {
      await withdraw(id, parseFloat(form.amount), form.description)
      closeModal()
      loadAccount()
      loadTransactions()
    } catch (e) {
      setFormError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  // Hanterar skapande av nytt kort
  async function handleCreateCard(e) {
    e.preventDefault()
    setSubmitting(true)
    setFormError('')
    try {
      const res = await createCard(id, form.cardHolderName)
      // Spara fullständiga kortuppgifter – visas bara en gång
      setNewCard(res.data)
      // Uppdatera kortlistan
      loadCards()
    } catch (e) {
      setFormError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  // Aktiverar ett inaktivt kort direkt (ingen modal)
  async function handleActivate(cardId) {
    try {
      await activateCard(cardId)
      loadCards()
    } catch (e) {
      alert(e.message)
    }
  }

  // Hanterar blockering av kort (via modal med anledning)
  async function handleBlock(e) {
    e.preventDefault()
    setSubmitting(true)
    setFormError('')
    try {
      await blockCard(selectedCardId, form.blockReason)
      closeModal()
      loadCards()
    } catch (e) {
      setFormError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  // Avblockerar ett blockerat kort direkt (ingen modal)
  async function handleUnblock(cardId) {
    try {
      await unblockCard(cardId)
      loadCards()
    } catch (e) {
      alert(e.message)
    }
  }

  // Fryser kontot (bara staff) – frågar om bekräftelse
  async function handleFreeze() {
    if (!confirm('Vill du frysa kontot?')) return
    try {
      await freezeAccount(id)
      loadAccount()
    } catch (e) {
      alert(e.message)
    }
  }

  // Avfryser kontot (bara staff)
  async function handleUnfreeze() {
    try {
      await unfreezeAccount(id)
      loadAccount()
    } catch (e) {
      alert(e.message)
    }
  }

  // Stänger kontot permanent – frågar om bekräftelse och navigerar bort
  async function handleDelete() {
    if (!confirm('Stäng kontot permanent? Det går inte att ångra.')) return
    try {
      await deleteAccount(id)
      navigate('/dashboard')
    } catch (e) {
      alert(e.message)
    }
  }

  // Visa laddningsindikator medan data hämtas
  if (loading) return <Layout><p className="text-gray-400">Laddar...</p></Layout>

  // Visa felmeddelande om hämtningen misslyckades
  if (error) return <Layout><p className="text-red-400">{error}</p></Layout>

  // Visa ingenting om kontot inte hittades
  if (!account) return null

  return (
    <Layout>
      <div className="max-w-3xl space-y-8">

        {/* ---- Kontoheader ---- */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

          {/* Kontonamn, nummer, status och saldo */}
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{account.accountName}</h1>
              <p className="text-gray-500 text-sm mt-1">{account.accountNumber}</p>
              {/* Status med rätt färg */}
              <p className={`text-sm mt-2 font-medium ${STATUS_COLORS[account.status]}`}>
                {account.status}
              </p>
            </div>
            <div className="text-right">
              {/* Saldo formaterat som valuta */}
              <p className="text-3xl font-bold text-white">
                {account.balance.toLocaleString('sv-SE', { style: 'currency', currency: account.currency || 'SEK' })}
              </p>
              <p className="text-xs text-gray-500 mt-1">{account.accountType}</p>
            </div>
          </div>

          {/* Åtgärdsknappar */}
          <div className="flex flex-wrap gap-2 mt-5">
            {/* Sätt in och Ta ut – bara om kontot är öppet */}
            {account.status === 'Open' && (
              <>
                <button onClick={() => openModal('deposit')} className="bg-green-600 hover:bg-green-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
                  Sätt in
                </button>
                <button onClick={() => openModal('withdraw')} className="bg-red-600 hover:bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
                  Ta ut
                </button>
              </>
            )}

            {/* Frys – bara staff och om kontot är öppet */}
            {isStaff && account.status === 'Open' && (
              <button onClick={handleFreeze} className="bg-blue-700 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
                Frys
              </button>
            )}

            {/* Avfrys – bara staff och om kontot är fryst */}
            {isStaff && account.status === 'Frozen' && (
              <button onClick={handleUnfreeze} className="bg-blue-700 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
                Avfrys
              </button>
            )}

            {/* Stäng konto – om kontot inte redan är stängt */}
            {account.status !== 'Closed' && (
              <button onClick={handleDelete} className="text-red-400 hover:text-red-300 text-sm font-medium px-4 py-2 rounded-lg border border-red-400/20 hover:border-red-400/50 transition">
                Stäng konto
              </button>
            )}
          </div>
        </div>

        {/* ---- Kort ---- */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-white">Kort</h2>
            {/* Skapa kort-knapp – bara om kontot är öppet */}
            {account.status === 'Open' && (
              <button onClick={() => openModal('createCard')} className="text-sm text-indigo-400 hover:text-indigo-300 transition">
                + Nytt kort
              </button>
            )}
          </div>

          {/* Tom-state för kort */}
          {cards.length === 0 && (
            <p className="text-gray-500 text-sm">Inga kort kopplade till detta konto.</p>
          )}

          {/* Kortlista */}
          <div className="space-y-3">
            {cards.map(card => (
              <div key={card.id} className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
                <div>
                  {/* Maskerat kortnummer (t.ex. **** **** **** 1234) */}
                  <p className="text-white font-mono text-sm">{card.maskedCardNumber}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{card.cardHolderName} · {card.expiryDate}</p>
                </div>

                {/* Kortstatus och åtgärdsknappar */}
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium ${CARD_STATUS_COLORS[card.status]}`}>
                    {card.status}
                  </span>

                  {/* Aktivera – om kortet är inaktivt */}
                  {card.status === 'Inactive' && (
                    <button onClick={() => handleActivate(card.id)} className="text-xs text-green-400 hover:text-green-300 transition">
                      Aktivera
                    </button>
                  )}

                  {/* Blockera – om kortet är aktivt och användaren är staff */}
                  {card.status === 'Active' && isStaff && (
                    <button onClick={() => openModal('blockCard', card.id)} className="text-xs text-red-400 hover:text-red-300 transition">
                      Blockera
                    </button>
                  )}

                  {/* Avblockera – om kortet är blockerat och användaren är staff */}
                  {card.status === 'Blocked' && isStaff && (
                    <button onClick={() => handleUnblock(card.id)} className="text-xs text-blue-400 hover:text-blue-300 transition">
                      Avblockera
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ---- Transaktioner ---- */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Transaktioner</h2>

          {/* Tom-state för transaktioner */}
          {transactions.length === 0 && (
            <p className="text-gray-500 text-sm">Inga transaktioner ännu.</p>
          )}

          {/* Transaktionslista */}
          <div className="space-y-2">
            {transactions.map(tx => (
              <div key={tx.id} className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-3 flex items-center justify-between">
                <div>
                  {/* Beskrivning eller transaktionstyp */}
                  <p className="text-white text-sm">{tx.description || tx.type}</p>
                  {/* Datum och tid formaterat för svenska */}
                  <p className="text-gray-500 text-xs mt-0.5">{new Date(tx.createdAt).toLocaleString('sv-SE')}</p>
                </div>
                <div className="text-right">
                  {/* Belopp med rätt tecken och färg */}
                  <p className={`font-semibold ${TX_COLORS[tx.type]}`}>
                    {TX_SIGNS[tx.type]}{tx.amount.toLocaleString('sv-SE', { style: 'currency', currency: tx.currency || 'SEK' })}
                  </p>
                  {/* Saldo efter transaktionen */}
                  <p className="text-xs text-gray-500">
                    Saldo: {tx.balanceAfterTransaction.toLocaleString('sv-SE', { style: 'currency', currency: tx.currency || 'SEK' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagineringsknappar – visas bara om det finns mer än en sida */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-4">
              {/* Föregående sida */}
              <button
                disabled={pagination.page <= 1}
                onClick={() => loadTransactions(pagination.page - 1)}
                className="text-sm text-gray-400 hover:text-white disabled:opacity-40 transition"
              >
                ← Föregående
              </button>

              {/* Sidnummer */}
              <span className="text-sm text-gray-500">{pagination.page} / {pagination.totalPages}</span>

              {/* Nästa sida */}
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => loadTransactions(pagination.page + 1)}
                className="text-sm text-gray-400 hover:text-white disabled:opacity-40 transition"
              >
                Nästa →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ---- Modal: Insättning ---- */}
      {modal === 'deposit' && (
        <Modal title="Sätt in pengar" onClose={closeModal}>
          <form onSubmit={handleDeposit} className="space-y-4">
            {formError && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">{formError}</p>}
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
            <div>
              <label className="block text-sm text-gray-400 mb-1">Beskrivning (valfri)</label>
              <input
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="T.ex. Lön"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            <button type="submit" disabled={submitting} className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg py-2.5 transition disabled:opacity-60">
              {submitting ? 'Genomför...' : 'Sätt in'}
            </button>
          </form>
        </Modal>
      )}

      {/* ---- Modal: Uttag ---- */}
      {modal === 'withdraw' && (
        <Modal title="Ta ut pengar" onClose={closeModal}>
          <form onSubmit={handleWithdraw} className="space-y-4">
            {formError && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">{formError}</p>}
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
            <div>
              <label className="block text-sm text-gray-400 mb-1">Beskrivning (valfri)</label>
              <input
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="T.ex. Hyra"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            <button type="submit" disabled={submitting} className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg py-2.5 transition disabled:opacity-60">
              {submitting ? 'Genomför...' : 'Ta ut'}
            </button>
          </form>
        </Modal>
      )}

      {/* ---- Modal: Skapa kort ---- */}
      {modal === 'createCard' && (
        <Modal title="Skapa kort" onClose={closeModal}>
          {/* Visa kortuppgifter en gång efter skapande */}
          {newCard ? (
            <div className="space-y-4">
              <p className="text-green-400 text-sm">
                Kort skapat! Spara uppgifterna nu — de visas bara en gång.
              </p>
              {/* Kortuppgifter i monospace-font */}
              <div className="bg-gray-800 rounded-xl p-4 space-y-2 font-mono text-sm">
                <p className="text-gray-400">Kortnummer</p>
                <p className="text-white text-lg tracking-widest">{newCard.cardNumber}</p>
                <p className="text-gray-400 mt-2">CVV</p>
                <p className="text-white">{newCard.cvv}</p>
                <p className="text-gray-400 mt-2">Utgångsdatum</p>
                <p className="text-white">{newCard.card.expiryDate}</p>
              </div>
              <button onClick={closeModal} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg py-2.5 transition">
                Stäng
              </button>
            </div>
          ) : (
            // Formulär för att skapa kortet
            <form onSubmit={handleCreateCard} className="space-y-4">
              {formError && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">{formError}</p>}
              <div>
                <label className="block text-sm text-gray-400 mb-1">Kortinnehavarens namn</label>
                <input
                  required
                  value={form.cardHolderName}
                  onChange={e => setForm({ ...form, cardHolderName: e.target.value })}
                  placeholder="FÖRNAMN EFTERNAMN"
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
              <button type="submit" disabled={submitting} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg py-2.5 transition disabled:opacity-60">
                {submitting ? 'Skapar...' : 'Skapa kort'}
              </button>
            </form>
          )}
        </Modal>
      )}

      {/* ---- Modal: Blockera kort ---- */}
      {modal === 'blockCard' && (
        <Modal title="Blockera kort" onClose={closeModal}>
          <form onSubmit={handleBlock} className="space-y-4">
            {formError && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">{formError}</p>}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Anledning</label>
              <input
                required
                value={form.blockReason}
                onChange={e => setForm({ ...form, blockReason: e.target.value })}
                placeholder="T.ex. Stulet kort"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            <button type="submit" disabled={submitting} className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg py-2.5 transition disabled:opacity-60">
              {submitting ? 'Blockerar...' : 'Blockera kort'}
            </button>
          </form>
        </Modal>
      )}
    </Layout>
  )
}
