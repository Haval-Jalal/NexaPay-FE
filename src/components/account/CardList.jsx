// ============================================================
// components/account/CardList.jsx
// ============================================================
// Visar kortlistan på AccountDetail. Korten har gradient om
// aktiva, gråton om utgångna/blockerade. Knappar för aktivera/
// blockera/avblockera visas beroende på roll och kortstatus.
// ============================================================

import { formatCardExpiry } from '../../helpers/format'

const CARD_STATUS_LABELS = { Active: 'Aktiv', Inactive: 'Inaktiv', Blocked: 'Blockerad', Expired: 'Utgången' }
const CARD_STATUS_COLORS = { Active: 'text-green-300', Inactive: 'text-yellow-300', Blocked: 'text-red-300', Expired: 'text-gray-400' }

export default function CardList({
  cards,
  cardsError,
  canWrite,
  canBlock,
  accountStatus,
  onOpenModal,
  onActivate,
  onUnblock,
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-white">Kort</h2>
        {canWrite && accountStatus === 'Open' && (
          <button onClick={() => onOpenModal('createCard')} className="text-sm text-indigo-400 hover:text-indigo-300 transition">
            + Nytt kort
          </button>
        )}
      </div>

      {cardsError && (
        <p role="alert" className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2 mb-3">{cardsError}</p>
      )}
      {!cardsError && cards.length === 0 && (
        <p className="text-gray-500 text-sm">Inga kort kopplade till detta konto.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map(card => {
          const isMuted = card.status === 'Expired' || card.status === 'Blocked'
          return (
            <div
              key={card.id}
              className={`relative rounded-2xl p-5 overflow-hidden
                ${isMuted ? 'bg-gray-800' : 'bg-gradient-to-br from-indigo-800 via-indigo-700 to-purple-800'}`}
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
                    <p className="text-white text-sm">{formatCardExpiry(card.expiryDate)}</p>
                  </div>
                </div>
                {(canWrite || canBlock) && (
                  <div className="flex gap-3 mt-4 pt-3 border-t border-white/10">
                    {canWrite && card.status === 'Inactive' && (
                      <button onClick={() => onActivate(card.id)} className="text-xs text-green-300 hover:text-green-200 transition font-medium">Aktivera</button>
                    )}
                    {canBlock && card.status === 'Active' && (
                      <button onClick={() => onOpenModal('blockCard', card.id)} className="text-xs text-red-300 hover:text-red-200 transition font-medium">Blockera</button>
                    )}
                    {canBlock && card.status === 'Blocked' && (
                      <button onClick={() => onUnblock(card.id)} className="text-xs text-blue-300 hover:text-blue-200 transition font-medium">Avblockera</button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
