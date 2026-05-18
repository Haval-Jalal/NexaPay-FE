// ============================================================
// pages/AccountDetail.jsx – detaljsida för ett enskilt konto
// ============================================================
// Hämtar data (konto, kort, transaktioner) och komponerar
// subkomponenterna i components/account/. Hela formulär- och
// modallogiken bor i useAccountModals(). Detta är medvetet en
// "skal-sida" som bara orkestrerar — UI-detaljer ligger i barnen.
// ============================================================

import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import Layout from '../components/Layout'
import ConfirmModal from '../components/ConfirmModal'
import AccountHeader from '../components/account/AccountHeader'
import CardList from '../components/account/CardList'
import TransactionList from '../components/account/TransactionList'
import AccountModals from '../components/account/AccountModals'
import { getAccount, freezeAccount, unfreezeAccount, deleteAccount } from '../api/accounts'
import { getCardsByAccount, activateCard, unblockCard } from '../api/cards'
import { getTransactions } from '../api/transactions'
import { can } from '../utils/roles'
import { useToast } from '../context/useToast'
import { useAccountModals } from '../hooks/useAccountModals'

export default function AccountDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const role = user?.role
  const toast = useToast()

  useEffect(() => { document.title = 'Kontoöversikt – NexaPay' }, [])

  const isStaff = can.isStaff(role)
  const canWrite = can.write(role)
  const canFreeze = can.freezeAccount(role)
  const canBlock = can.blockCard(role)
  const canDel = can.delete(role)

  const [account, setAccount] = useState(null)
  const [cards, setCards] = useState([])
  const [transactions, setTransactions] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalCount: null })
  const [txFilter, setTxFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cardsError, setCardsError] = useState('')
  const [txError, setTxError] = useState('')
  const [confirm, setConfirm] = useState(null)

  const loadAccount = useCallback(() => {
    return getAccount(id)
      .then(res => setAccount(res.data))
      .catch(e => setError(e.message))
  }, [id])

  const loadCards = useCallback(() => {
    return getCardsByAccount(id)
      .then(res => { setCards(res.data ?? []); setCardsError('') })
      .catch(e => setCardsError(e.message))
  }, [id])

  const loadTransactions = useCallback((page = 1) => {
    return getTransactions(id, page)
      .then(res => {
        setTransactions(res.data.items ?? [])
        setPagination({ page: res.data.page, totalPages: res.data.totalPages, totalCount: res.data.totalCount ?? null })
        setTxError('')
      })
      .catch(e => setTxError(e.message))
  }, [id])

  useEffect(() => {
    Promise.all([loadAccount(), loadCards(), loadTransactions()])
      .finally(() => setLoading(false))
  }, [loadAccount, loadCards, loadTransactions])

  const modals = useAccountModals({
    accountId: id,
    toast,
    reloadAccount: loadAccount,
    reloadCards: loadCards,
    reloadTransactions: loadTransactions,
  })

  // Konto- och kort-actions som triggas direkt (utan modal): nås från
  // header/cards-komponenterna och visar fel via toast istället för
  // inline-banner (kortlivade åtgärder utan formulärkontext).
  async function handleActivate(cardId) {
    try {
      await activateCard(cardId)
      loadCards()
    } catch (e) {
      toast(e.message, 'error')
    }
  }

  function handleUnblock(cardId) {
    setConfirm({
      title: 'Avblockera kort',
      message: 'Vill du avblockera kortet?',
      confirmLabel: 'Avblockera',
      confirmClass: 'bg-blue-600 hover:bg-blue-500',
      onConfirm: async () => {
        setConfirm(null)
        try { await unblockCard(cardId); loadCards() }
        catch (e) { toast(e.message, 'error') }
      },
    })
  }

  function handleFreeze() {
    setConfirm({
      title: 'Frys konto',
      message: 'Kontot kan inte ta emot eller skicka transaktioner när det är fryst. Fortsätta?',
      confirmLabel: 'Frys konto',
      onConfirm: async () => {
        setConfirm(null)
        try { await freezeAccount(id); loadAccount() }
        catch (e) { toast(e.message, 'error') }
      },
    })
  }

  function handleUnfreeze() {
    setConfirm({
      title: 'Avfrys konto',
      message: 'Kontot återgår till öppet läge. Fortsätta?',
      confirmLabel: 'Avfrys',
      confirmClass: 'bg-blue-600 hover:bg-blue-500',
      onConfirm: async () => {
        setConfirm(null)
        try { await unfreezeAccount(id); loadAccount() }
        catch (e) { toast(e.message, 'error') }
      },
    })
  }

  function handleDelete() {
    setConfirm({
      title: 'Stäng konto',
      message: 'Kontot stängs permanent. Det går inte att ångra. Saldot måste vara 0 kr.',
      confirmLabel: 'Stäng konto',
      onConfirm: async () => {
        setConfirm(null)
        try { await deleteAccount(id); navigate('/dashboard') }
        catch (e) { toast(e.message, 'error') }
      },
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
        <AccountHeader
          account={account}
          isStaff={isStaff}
          canWrite={canWrite}
          canFreeze={canFreeze}
          canDel={canDel}
          actionError=""
          onOpenModal={modals.openModal}
          onFreeze={handleFreeze}
          onUnfreeze={handleUnfreeze}
          onDelete={handleDelete}
        />

        <CardList
          cards={cards}
          cardsError={cardsError}
          canWrite={canWrite}
          canBlock={canBlock}
          accountStatus={account.status}
          onOpenModal={modals.openModal}
          onActivate={handleActivate}
          onUnblock={handleUnblock}
        />

        <TransactionList
          transactions={transactions}
          txError={txError}
          txFilter={txFilter}
          setTxFilter={setTxFilter}
          pagination={pagination}
          onPageChange={loadTransactions}
        />
      </div>

      <AccountModals modals={modals} />

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
