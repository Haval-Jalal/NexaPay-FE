// ============================================================
// components/account/AccountHeader.jsx
// ============================================================
// Toppkortet på AccountDetail: kontoinfo, saldo, åtgärdsknappar
// och inline-felmeddelande för konto-actions. Rollbehörigheter
// avgör vilka knappar som visas.
// ============================================================

import { formatCurrency } from '../../helpers/format'

const STATUS_LABELS = { Open: 'Öppen', Frozen: 'Fryst', Closed: 'Stängd' }
const STATUS_COLORS = { Open: 'text-green-400', Frozen: 'text-blue-400', Closed: 'text-red-400' }

export default function AccountHeader({
  account,
  isStaff,
  canWrite,
  canFreeze,
  canDel,
  actionError,
  onOpenModal,
  onFreeze,
  onUnfreeze,
  onDelete,
}) {
  return (
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
            {formatCurrency(account.balance, account.currency)}
          </p>
          <p className="text-xs text-gray-500 mt-1">{account.accountType}</p>
        </div>
      </div>

      {actionError && (
        <p
          role="alert"
          className="mt-4 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2"
        >
          {actionError}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mt-5">
        {canWrite && account.status === 'Open' && (
          <>
            <button onClick={() => onOpenModal('deposit')} className="bg-green-600 hover:bg-green-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition">Sätt in</button>
            <button onClick={() => onOpenModal('withdraw')} className="bg-red-600 hover:bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition">Ta ut</button>
          </>
        )}
        {canFreeze && account.status === 'Open' && (
          <button onClick={onFreeze} className="bg-blue-700 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition">Frys</button>
        )}
        {canFreeze && account.status === 'Frozen' && (
          <button onClick={onUnfreeze} className="bg-blue-700 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition">Avfrys</button>
        )}
        {canDel && account.status !== 'Closed' && (
          <button onClick={onDelete} className="text-red-400 hover:text-red-300 text-sm font-medium px-4 py-2 rounded-lg border border-red-400/20 hover:border-red-400/50 transition">
            Stäng konto
          </button>
        )}
      </div>
    </div>
  )
}
