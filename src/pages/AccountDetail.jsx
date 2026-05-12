import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import ConfirmModal from '../components/ConfirmModal'
import { getAccount, freezeAccount, unfreezeAccount, deleteAccount } from '../api/accounts'
import { getCardsByAccount, createCard, activateCard, blockCard, unblockCard } from '../api/cards'
import { getTransactions, deposit, withdraw } from '../api/transactions'
import { can } from '../utils/roles'
import { useToast } from '../context/ToastContext'
import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight } from 'lucide-react'

const STATUS_LABELS      = { Open: 'Öppen', Frozen: 'Fryst', Closed: 'Stängd' }
const STATUS_COLORS      = { Open: 'text-green-400', Frozen: 'text-blue-400', Closed: 'text-red-400' }
const CARD_STATUS_LABELS = { Active: 'Aktiv', Inactive: 'Inaktiv', Blocked: 'Blockerad', Expired: 'Utgången' }
const CARD_STATUS_COLORS = { Active: 'text-green-300', Inactive: 'text-yellow-300', Blocked: 'text-red-300', Expired: 'text-gray-400' }
const TX_COLORS          = { Deposit: 'text-green-400', Withdrawal: 'text-red-400', Transfer: 'text-blue-400' }
const TX_ICONS           = { Deposit: ArrowDownLeft, Withdrawal: ArrowUpRight, Transfer: ArrowLeftRight }

function groupByDate(txList) {
  const today     = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const groups = new Map()
  txList.forEach(tx => {
    const d = new Date(tx.createdAt)
    let label
    if (d.toDateString() === today.toDateString())          label = 'Idag'
    else if (d.toDateString() === yesterday.toDateString()) label = 'Igår'
    else label = d.toLocaleDateString('sv-SE', { day: 'numeric', month: 'long' })
    if (!groups.has(label)) groups.set(label, [])
    groups.get(label).push(tx)
  })
  return Array.from(groups.entries())
}

function formatExpiry(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('sv-SE', { month: '2-digit', year: '2-digit' })
}

export default function AccountDetail() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const { user }     = useAuth()
  const role         = user?.role
  const toast        = useToast()

  useEffect(() => { document.title = 'Kontoöversikt – NexaPay' }, [])

  // Rollbehörigheter
  const isStaff      = can.isStaff(role)
  const canWrite     = can.write(role)
  const canFreeze    = can.freezeAccount(role)
  const canBlock     = can.blockCard(role)
  const canDel       = can.delete(role)

  // Data
  const [account, setAccount]         = useState(null)
  const [cards, setCards]             = useState([])
  const [transactions, setTransactions] = useState([])
  const [pagination, setPagination]   = useState({ page: 1, totalPages: 1, totalCount: null })
  const [txFilter, setTxFilter]       = useState('All')
  const [copied, setCopied]           = useState(null)
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState('')

  // Modal state
  const [modal, setModal]             = useState(null)
  const [selectedCardId, setSelectedCardId] = useState(null)
  const [form, setForm]               = useState({ amount: '', description: '', cardHolderName: '', blockReason: '' })
  const [submitting, setSubmitting]   = useState(false)
  const [formError, setFormError]     = useState('')
  const [newCard, setNewCard]         = useState(null)

  // Bekräftelsedialog state
  const [confirm, setConfirm]         = useState(null)

  // Inline action errors
  const [actionError, setActionError] = useState('')

  function copyToClipboard(text, label) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  async function loadAccount() {
    try {
      const res = await getAccount(id)
      setAccount(res.data)
    } catch (e) {
      setError(e.message)
    }
  }

  async function loadCards() {
    try {
      const res = await getCardsByAccount(id)
      setCards(res.data ?? [])
    } catch { /* sekundär info */ }
  }

  async function loadTransactions(page = 1) {
    try {
      const res = await getTransactions(id, page)
      setTransactions(res.data.items ?? [])
      setPagination({ page: res.data.page, totalPages: res.data.totalPages, totalCount: res.data.totalCount ?? null })
    } catch { /* sekundär info */ }
  }

  useEffect(() => {
    Promise.all([loadAccount(), loadCards(), loadTransactions()])
      .finally(() => setLoading(false))
  }, [id])

  function openModal(name, cardId = null) {
    setModal(name)
    setSelectedCardId(cardId)
    setForm({ amount: '', description: '', cardHolderName: '', blockReason: '' })
    setFormError('')
    setNewCard(null)
    setActionError('')
  }

  function closeModal() {
    setModal(null)
    setSelectedCardId(null)
  }

  async function handleDeposit(e) {
    e.preventDefault()
    setSubmitting(true)
    setFormError('')
    try {
      await deposit(id, parseFloat(form.amount), form.description)
      toast('Insättning genomförd.')
      closeModal()
      loadAccount()
      loadTransactions()
    } catch (e) {
      setFormError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleWithdraw(e) {
    e.preventDefault()
    setSubmitting(true)
    setFormError('')
    try {
      await withdraw(id, parseFloat(form.amount), form.description)
      toast('Uttag genomfört.')
      closeModal()
      loadAccount()
      loadTransactions()
    } catch (e) {
      setFormError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleCreateCard(e) {
    e.preventDefault()
    setSubmitting(true)
    setFormError('')
    try {
      const res = await createCard(id, form.cardHolderName)
      setNewCard(res.data)
      loadCards()
    } catch (e) {
      setFormError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleActivate(cardId) {
    setActionError('')
    try {
      await activateCard(cardId)
      loadCards()
    } catch (e) {
      setActionError(e.message)
    }
  }

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

  async function handleUnblock(cardId) {
    setConfirm({
      title:        'Avblockera kort',
      message:      'Vill du avblockera kortet?',
      confirmLabel: 'Avblockera',
      confirmClass: 'bg-blue-600 hover:bg-blue-500',
      onConfirm: async () => {
        setConfirm(null)
        setActionError('')
        try {
          await unblockCard(cardId)
          loadCards()
        } catch (e) {
          setActionError(e.message)
        }
      }
    })
  }

  async function handleFreeze() {
    setConfirm({
      title:        'Frys konto',
      message:      'Kontot kan inte ta emot eller skicka transaktioner när det är fryst. Fortsätta?',
      confirmLabel: 'Frys konto',
      onConfirm: async () => {
        setConfirm(null)
        setActionError('')
        try {
          await freezeAccount(id)
          loadAccount()
        } catch (e) {
          setActionError(e.message)
        }
      }
    })
  }

  async function handleUnfreeze() {
    setConfirm({
      title:        'Avfrys konto',
      message:      'Kontot återgår till öppet läge. Fortsätta?',
      confirmLabel: 'Avfrys',
      confirmClass: 'bg-blue-600 hover:bg-blue-500',
      onConfirm: async () => {
        setConfirm(null)
        setActionError('')
        try {
          await unfreezeAccount(id)
          loadAccount()
        } catch (e) {
          setActionError(e.message)
        }
      }
    })
  }

  async function handleDelete() {
    setConfirm({
      title:        'Stäng konto',
      message:      'Kontot stängs permanent. Det går inte att ångra. Saldot måste vara 0 kr.',
      confirmLabel: 'Stäng konto',
      onConfirm: async () => {
        setConfirm(null)
        setActionError('')
        try {
          await deleteAccount(id)
          navigate('/dashboard')
        } catch (e) {
          setActionError(e.message)
        }
      }
    })
  }

  if (loading) return (
    <Layout>
      <div className="max-w-3xl space-y-4 animate-pulse">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="h-6 bg-gray-800 rounded w-1/3 mb-3" />
          <div className="h-10 bg-gray-800 rounded w-1/4 mb-4" />
          <div className="flex gap-2">
            <div className="h-9 bg-gray-800 rounded w-24" />
            <div className="h-9 bg-gray-800 rounded w-24" />
          </div>
        </div>
      </div>
    </Layout>
  )

  if (error) return <Layout><p className="text-red-400">{error}</p></Layout>
  if (!account) return null

  return (
    <Layout>
      <div className="max-w-3xl space-y-8">

        {/* Kontoheader */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{account.accountName}</h1>
              <p className="text-gray-500 text-sm mt-1">{account.accountNumber}</p>
              {isStaff && account.ownerId && (
                <p className="text-xs text-indigo-400 mt-1">Ägare-ID: {account.ownerId}</p>
              )}
              <p className={`text-sm mt-2 font-medium ${STATUS_COLORS[account.status]}`}>
                {STATUS_LABELS[account.status] ?? account.status}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-white">
                {account.balance.toLocaleString('sv-SE', { style: 'currency', currency: account.currency || 'SEK' })}
              </p>
              <p className="text-xs text-gray-500 mt-1">{account.accountType}</p>
            </div>
          </div>

          {/* Inline action error */}
          {actionError && (
            <p className="mt-4 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
              {actionError}
            </p>
          )}

          {/* Åtgärdsknappar — visas bara för rätt roller */}
          <div className="flex flex-wrap gap-2 mt-5">
            {canWrite && account.status === 'Open' && (
              <>
                <button onClick={() => openModal('deposit')}  className="bg-green-600 hover:bg-green-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition">Sätt in</button>
                <button onClick={() => openModal('withdraw')} className="bg-red-600 hover:bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition">Ta ut</button>
              </>
            )}
            {canFreeze && account.status === 'Open' && (
              <button onClick={handleFreeze} className="bg-blue-700 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition">Frys</button>
            )}
            {canFreeze && account.status === 'Frozen' && (
              <button onClick={handleUnfreeze} className="bg-blue-700 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition">Avfrys</button>
            )}
            {canDel && account.status !== 'Closed' && (
              <button onClick={handleDelete} className="text-red-400 hover:text-red-300 text-sm font-medium px-4 py-2 rounded-lg border border-red-400/20 hover:border-red-400/50 transition">
                Stäng konto
              </button>
            )}
          </div>
        </div>

        {/* Kort */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-white">Kort</h2>
            {canWrite && account.status === 'Open' && (
              <button onClick={() => openModal('createCard')} className="text-sm text-indigo-400 hover:text-indigo-300 transition">
                + Nytt kort
              </button>
            )}
          </div>

          {cards.length === 0 && (
            <p className="text-gray-500 text-sm">Inga kort kopplade till detta konto.</p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {cards.map(card => (
              <div
                key={card.id}
                className={`relative rounded-2xl p-5 overflow-hidden
                  ${card.status === 'Expired' || card.status === 'Blocked'
                    ? 'bg-gray-800'
                    : 'bg-gradient-to-br from-indigo-800 via-indigo-700 to-purple-800'}`}
              >
                <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/5" />
                <div className="absolute -right-2 -bottom-6 w-20 h-20 rounded-full bg-white/5" />
                <div className="relative">
                  <div className="flex justify-between items-start mb-5">
                    <p className="text-white/60 text-xs font-semibold tracking-widest">NEXAPAY</p>
                    <span className={`text-xs font-semibold ${CARD_STATUS_COLORS[card.status]}`}>
                      {CARD_STATUS_LABELS[card.status] ?? card.status}
                    </span>
                  </div>
                  <p className="text-white font-mono text-base tracking-widest mb-5">
                    {card.maskedCardNumber}
                  </p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-white/40 text-xs uppercase tracking-wide mb-0.5">Innehavare</p>
                      <p className="text-white text-sm font-medium">{card.cardHolderName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/40 text-xs uppercase tracking-wide mb-0.5">Utgår</p>
                      <p className="text-white text-sm">{formatExpiry(card.expiryDate)}</p>
                    </div>
                  </div>
                  {(canWrite || canBlock) && (
                    <div className="flex gap-3 mt-4 pt-3 border-t border-white/10">
                      {canWrite && card.status === 'Inactive' && (
                        <button onClick={() => handleActivate(card.id)} className="text-xs text-green-300 hover:text-green-200 transition font-medium">Aktivera</button>
                      )}
                      {canBlock && card.status === 'Active' && (
                        <button onClick={() => openModal('blockCard', card.id)} className="text-xs text-red-300 hover:text-red-200 transition font-medium">Blockera</button>
                      )}
                      {canBlock && card.status === 'Blocked' && (
                        <button onClick={() => handleUnblock(card.id)} className="text-xs text-blue-300 hover:text-blue-200 transition font-medium">Avblockera</button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaktioner */}
        <div>
          <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
            <h2 className="text-lg font-semibold text-white">
              Transaktioner
              {pagination.totalCount != null && (
                <span className="ml-2 text-xs font-normal text-gray-500">({pagination.totalCount} totalt)</span>
              )}
            </h2>
            <div className="flex gap-1">
              {['All', 'Deposit', 'Withdrawal', 'Transfer'].map(f => (
                <button
                  key={f}
                  onClick={() => setTxFilter(f)}
                  className={`text-xs px-3 py-1 rounded-lg transition ${txFilter === f ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                >
                  {{ All: 'Alla', Deposit: 'Insättning', Withdrawal: 'Uttag', Transfer: 'Överföring' }[f]}
                </button>
              ))}
            </div>
          </div>

          {transactions.length === 0 && (
            <p className="text-gray-500 text-sm">Inga transaktioner ännu.</p>
          )}

          {(() => {
            const filtered = txFilter === 'All' ? transactions : transactions.filter(tx => tx.type === txFilter)
            if (transactions.length > 0 && filtered.length === 0) {
              return <p className="text-gray-500 text-sm">Inga transaktioner av den typen på denna sida.</p>
            }
            return (
              <div className="space-y-6">
                {groupByDate(filtered).map(([date, txs]) => (
                  <div key={date}>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">{date}</p>
                    <div className="space-y-2">
                      {txs.map(tx => {
                        const Icon = TX_ICONS[tx.type]
                        return (
                          <div key={tx.id} className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex items-center gap-3">
                            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              tx.type === 'Deposit' ? 'bg-green-500/15' : tx.type === 'Withdrawal' ? 'bg-red-500/15' : 'bg-blue-500/15'
                            }`}>
                              {Icon && <Icon size={14} className={TX_COLORS[tx.type]} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm truncate">{tx.description || tx.type}</p>
                              <p className="text-gray-500 text-xs mt-0.5">{new Date(tx.createdAt).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className={`font-semibold text-sm ${TX_COLORS[tx.type]}`}>
                                {tx.type === 'Deposit' ? '+' : tx.type === 'Withdrawal' ? '−' : '⇄'}{tx.amount.toLocaleString('sv-SE', { style: 'currency', currency: tx.currency || 'SEK' })}
                              </p>
                              <p className="text-xs text-gray-500">
                                {tx.balanceAfterTransaction.toLocaleString('sv-SE', { style: 'currency', currency: tx.currency || 'SEK' })}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )
          })()}

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-4">
              <button disabled={pagination.page <= 1} onClick={() => loadTransactions(pagination.page - 1)} className="text-sm text-gray-400 hover:text-white disabled:opacity-40 transition">← Föregående</button>
              <span className="text-sm text-gray-500">{pagination.page} / {pagination.totalPages}</span>
              <button disabled={pagination.page >= pagination.totalPages} onClick={() => loadTransactions(pagination.page + 1)} className="text-sm text-gray-400 hover:text-white disabled:opacity-40 transition">Nästa →</button>
            </div>
          )}
        </div>
      </div>

      {/* Modaler */}
      {modal === 'deposit' && (
        <Modal title="Sätt in pengar" onClose={closeModal}>
          <form onSubmit={handleDeposit} className="space-y-4">
            {formError && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">{formError}</p>}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Belopp (SEK)</label>
              <input type="number" min="1" step="0.01" required value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0.00" className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Beskrivning</label>
              <input required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="T.ex. Lön" className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition" />
            </div>
            <button type="submit" disabled={submitting} className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg py-2.5 transition disabled:opacity-60">{submitting ? 'Genomför...' : 'Sätt in'}</button>
          </form>
        </Modal>
      )}

      {modal === 'withdraw' && (
        <Modal title="Ta ut pengar" onClose={closeModal}>
          <form onSubmit={handleWithdraw} className="space-y-4">
            {formError && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">{formError}</p>}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Belopp (SEK)</label>
              <input type="number" min="1" step="0.01" required value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0.00" className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Beskrivning</label>
              <input required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="T.ex. Hyra" className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition" />
            </div>
            <button type="submit" disabled={submitting} className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg py-2.5 transition disabled:opacity-60">{submitting ? 'Genomför...' : 'Ta ut'}</button>
          </form>
        </Modal>
      )}

      {modal === 'createCard' && (
        <Modal title="Skapa kort" onClose={closeModal}>
          {newCard ? (
            <div className="space-y-4">
              <p className="text-green-400 text-sm">Kort skapat! Spara uppgifterna nu — de visas bara en gång.</p>
              <div className="bg-gray-800 rounded-xl p-4 space-y-3 font-mono text-sm">
                <div>
                  <p className="text-gray-400 mb-1">Kortnummer</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-white text-lg tracking-widest">{newCard.cardNumber}</p>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(newCard.cardNumber, 'cardNumber')}
                      className="text-xs text-indigo-400 hover:text-indigo-300 transition shrink-0"
                    >
                      {copied === 'cardNumber' ? 'Kopierat!' : 'Kopiera'}
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">CVV</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-white">{newCard.cvv}</p>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(newCard.cvv, 'cvv')}
                      className="text-xs text-indigo-400 hover:text-indigo-300 transition shrink-0"
                    >
                      {copied === 'cvv' ? 'Kopierat!' : 'Kopiera'}
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Utgångsdatum</p>
                  <p className="text-white">
                    {newCard.card?.expiryDate
                      ? new Date(newCard.card.expiryDate).toLocaleDateString('sv-SE', { month: '2-digit', year: '2-digit' })
                      : '—'}
                  </p>
                </div>
              </div>
              <button onClick={closeModal} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg py-2.5 transition">Stäng</button>
            </div>
          ) : (
            <form onSubmit={handleCreateCard} className="space-y-4">
              {formError && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">{formError}</p>}
              <div>
                <label className="block text-sm text-gray-400 mb-1">Kortinnehavarens namn</label>
                <input required value={form.cardHolderName} onChange={e => setForm({ ...form, cardHolderName: e.target.value })} placeholder="FÖRNAMN EFTERNAMN" className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition" />
              </div>
              <button type="submit" disabled={submitting} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg py-2.5 transition disabled:opacity-60">{submitting ? 'Skapar...' : 'Skapa kort'}</button>
            </form>
          )}
        </Modal>
      )}

      {modal === 'blockCard' && (
        <Modal title="Blockera kort" onClose={closeModal}>
          <form onSubmit={handleBlock} className="space-y-4">
            {formError && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">{formError}</p>}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Anledning</label>
              <input required value={form.blockReason} onChange={e => setForm({ ...form, blockReason: e.target.value })} placeholder="T.ex. Stulet kort" className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition" />
            </div>
            <button type="submit" disabled={submitting} className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg py-2.5 transition disabled:opacity-60">{submitting ? 'Blockerar...' : 'Blockera kort'}</button>
          </form>
        </Modal>
      )}

      {confirm && (
        <ConfirmModal
          title={confirm.title}
          message={confirm.message}
          confirmLabel={confirm.confirmLabel}
          confirmClass={confirm.confirmClass}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
    </Layout>
  )
}
