// ============================================================
// components/account/TransactionList.jsx
// ============================================================
// Transaktionshistorik på AccountDetail. Filterar lokalt på sidan
// och grupperar per datum med svenska etiketter (Idag/Igår/datum).
// Pagineringen är server-driven via onPageChange.
// ============================================================

import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight, Receipt } from 'lucide-react'
import { formatCurrency, formatTime, formatDateGroup } from '../../helpers/format'

const TX_COLORS = { Deposit: 'text-green-400', Withdrawal: 'text-red-400', Transfer: 'text-blue-400', InvoicePayment: 'text-red-400' }
const TX_ICONS  = { Deposit: ArrowDownLeft, Withdrawal: ArrowUpRight, Transfer: ArrowLeftRight, InvoicePayment: Receipt }
const TX_FILTERS = [
  ['All', 'Alla'],
  ['Deposit', 'Insättning'],
  ['Withdrawal', 'Uttag'],
  ['Transfer', 'Överföring'],
  ['InvoicePayment', 'Faktura'],
]

function groupByDate(txList) {
  const groups = new Map()
  txList.forEach(tx => {
    const label = formatDateGroup(tx.createdAt)
    if (!groups.has(label)) groups.set(label, [])
    groups.get(label).push(tx)
  })
  return Array.from(groups.entries())
}

export default function TransactionList({
  transactions,
  txError,
  txFilter,
  setTxFilter,
  pagination,
  onPageChange,
}) {
  const filtered = txFilter === 'All' ? transactions : transactions.filter(tx => tx.type === txFilter)

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
        <h2 className="text-lg font-semibold text-white">
          Transaktioner
          {pagination.totalCount != null && (
            <span className="ml-2 text-xs font-normal text-gray-500">({pagination.totalCount} totalt)</span>
          )}
        </h2>
        <div className="flex gap-1">
          {TX_FILTERS.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTxFilter(key)}
              className={`text-xs px-3 py-1 rounded-lg transition ${txFilter === key ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {txError && (
        <p role="alert" className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2 mb-3">{txError}</p>
      )}
      {!txError && transactions.length === 0 && (
        <p className="text-gray-500 text-sm">Inga transaktioner ännu.</p>
      )}
      {transactions.length > 0 && filtered.length === 0 && (
        <p className="text-gray-500 text-sm">Inga transaktioner av den typen på denna sida.</p>
      )}

      {filtered.length > 0 && (
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
                        tx.type === 'Deposit' ? 'bg-green-500/15' : tx.type === 'Transfer' ? 'bg-blue-500/15' : 'bg-red-500/15'
                      }`}>
                        {Icon && <Icon size={14} className={TX_COLORS[tx.type]} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm truncate">{tx.description || tx.type}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{formatTime(tx.createdAt)}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`font-semibold text-sm ${TX_COLORS[tx.type]}`}>
                          {tx.type === 'Deposit' ? '+' : tx.type === 'Transfer' ? '⇄' : '−'}{formatCurrency(tx.amount, tx.currency)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatCurrency(tx.balanceAfterTransaction, tx.currency)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-4">
          <button disabled={pagination.page <= 1} onClick={() => onPageChange(pagination.page - 1)} className="text-sm text-gray-400 hover:text-white disabled:opacity-40 transition">← Föregående</button>
          <span className="text-sm text-gray-500">{pagination.page} / {pagination.totalPages}</span>
          <button disabled={pagination.page >= pagination.totalPages} onClick={() => onPageChange(pagination.page + 1)} className="text-sm text-gray-400 hover:text-white disabled:opacity-40 transition">Nästa →</button>
        </div>
      )}
    </div>
  )
}
