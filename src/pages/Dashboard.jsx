// ============================================================
// pages/Dashboard.jsx – startsidan för inloggade
// ============================================================
// Visar:
//   * Lista över användarens konton (eller alla, för staff).
//   * Totalt saldo över öppna konton.
//   * Sök/filter på status (Öppen/Fryst/Stängd).
//   * "Nytt konto"-modal för Admin/BankManager/Teller/User.
//
// Använder useAccounts() (egen hook) istället för fetch-i-effekt.
// ============================================================

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import { createAccount } from '../api/accounts'
import { useAuth } from '../context/useAuth'
import { useAccounts } from '../hooks/useAccounts'
import { can } from '../utils/roles'
import { formatCurrency } from '../helpers/format'
import {
  ACCOUNT_TYPE_LABELS,
  ACCOUNT_TYPE_BAR,
  ACCOUNT_STATUS_LABELS,
  ACCOUNT_STATUS_COLORS,
  labelOf,
} from '../helpers/labels'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const role = user?.role
  const isStaff = can.isStaff(role)

  const { accounts, loading, error, refetch } = useAccounts()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ accountName: '', accountType: 'Checking', ownerEmail: '' })
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  useEffect(() => { document.title = 'Översikt – NexaPay' }, [])

  async function handleCreate(e) {
    e.preventDefault()
    setCreateError('')
    setCreating(true)
    try {
      await createAccount(form.accountName, form.accountType, isStaff ? form.ownerEmail.trim() : undefined)
      setShowCreate(false)
      setForm({ accountName: '', accountType: 'Checking', ownerEmail: '' })
      refetch()
    } catch (e) {
      setCreateError(e.message)
    } finally {
      setCreating(false)
    }
  }

  const filtered = accounts.filter(a => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      a.accountName.toLowerCase().includes(q) ||
      a.accountNumber.toLowerCase().includes(q) ||
      (isStaff && a.ownerId?.toLowerCase().includes(q))
    const matchStatus = statusFilter === 'all' || a.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalBalance = accounts
    .filter(a => a.status === 'Open')
    .reduce((sum, a) => sum + a.balance, 0)

  return (
    <Layout>
      <div className="max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {isStaff ? 'Alla konton' : 'Översikt'}
            </h1>
            {!isStaff && (
              <p className="text-gray-400 text-sm mt-1">
                Totalt saldo (öppna konton):{' '}
                <span className="text-white font-semibold">
                  {formatCurrency(totalBalance)}
                </span>
              </p>
            )}
            {isStaff && (
              <p className="text-gray-400 text-sm mt-1">
                {accounts.length} konton totalt
              </p>
            )}
          </div>
          {can.write(role) && (
            <button
              onClick={() => setShowCreate(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
            >
              + Nytt konto
            </button>
          )}
        </div>

        {/* Sök och filter – visas alltid men extra viktig för staff */}
        <div className="flex gap-3 mb-5">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={isStaff ? 'Sök på kontonamn, nummer eller ägar-ID…' : 'Sök konto…'}
            className="flex-1 bg-gray-900 border border-gray-800 text-white text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 transition"
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-gray-900 border border-gray-800 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 transition"
          >
            <option value="all">Alla statusar</option>
            <option value="Open">Öppna</option>
            <option value="Frozen">Frysta</option>
            <option value="Closed">Stängda</option>
          </select>
        </div>

        {loading && (
          <div className="grid gap-4 sm:grid-cols-2">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 animate-pulse">
                <div className="h-4 bg-gray-800 rounded w-1/2 mb-3" />
                <div className="h-7 bg-gray-800 rounded w-1/3 mb-2" />
                <div className="h-3 bg-gray-800 rounded w-1/4" />
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-red-400">{error}</p>}

        {!loading && (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map(account => (
              <button
                key={account.id}
                onClick={() => navigate(`/accounts/${account.id}`)}
                className="relative text-left bg-gray-900 border border-gray-800 rounded-2xl p-5 pl-6 hover:border-gray-700 transition overflow-hidden"
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${ACCOUNT_TYPE_BAR[account.accountType] ?? 'bg-indigo-500'} rounded-l-2xl`} />
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-white">{account.accountName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{account.accountNumber}</p>
                    {isStaff && account.ownerId && (
                      <p className="text-xs text-indigo-400 mt-0.5 truncate max-w-[160px]" title={account.ownerId}>
                        Ägare: {account.ownerId.slice(0, 8)}…
                      </p>
                    )}
                  </div>
                  <span className={`text-xs font-medium ${ACCOUNT_STATUS_COLORS[account.status] ?? 'text-gray-400'}`}>
                    {labelOf(ACCOUNT_STATUS_LABELS, account.status)}
                  </span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(account.balance, account.currency)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {labelOf(ACCOUNT_TYPE_LABELS, account.accountType)}
                </p>
              </button>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center text-2xl">
              💳
            </div>
            <p className="text-gray-400 font-medium mb-1">
              {search || statusFilter !== 'all' ? 'Inga konton matchar sökningen.' : 'Inga konton ännu.'}
            </p>
            {!search && statusFilter === 'all' && can.write(role) && (
              <button
                onClick={() => setShowCreate(true)}
                className="mt-3 text-indigo-400 hover:text-indigo-300 text-sm transition"
              >
                Skapa ditt första konto →
              </button>
            )}
          </div>
        )}
      </div>

      {showCreate && (
        <Modal title="Skapa konto" onClose={() => setShowCreate(false)}>
          <form onSubmit={handleCreate} className="space-y-4">
            {createError && (
              <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
                {createError}
              </p>
            )}
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
            {isStaff && (
              <div>
                <label className="block text-sm text-gray-400 mb-1">Kundens e-post (valfritt)</label>
                <input
                  type="email"
                  value={form.ownerEmail}
                  onChange={e => setForm({ ...form, ownerEmail: e.target.value })}
                  placeholder="Lämna tomt för att skapa åt dig själv"
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
                />
                <p className="text-xs text-gray-500 mt-1">Anges en e-post skapas kontot åt den användaren.</p>
              </div>
            )}
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
