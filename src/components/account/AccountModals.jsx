// ============================================================
// components/account/AccountModals.jsx
// ============================================================
// Renderar de fyra modalerna på AccountDetail (deposit, withdraw,
// createCard, blockCard) baserat på modals-objektet från
// useAccountModals(). Lyfts ur sidan så att AccountDetail.jsx
// kan fokusera på datahämtning och layout.
// ============================================================

import Modal from '../Modal'
import { formatCardExpiry } from '../../helpers/format'

export default function AccountModals({ modals }) {
  const {
    modal,
    closeModal,
    form,
    setForm,
    submitting,
    formError,
    newCard,
    copied,
    copyToClipboard,
    handleDeposit,
    handleWithdraw,
    handleCreateCard,
    handleBlock,
  } = modals

  if (!modal) return null

  if (modal === 'deposit') {
    return (
      <Modal title="Sätt in pengar" onClose={closeModal}>
        <form onSubmit={handleDeposit} className="space-y-4">
          {formError && <p role="alert" className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">{formError}</p>}
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
    )
  }

  if (modal === 'withdraw') {
    return (
      <Modal title="Ta ut pengar" onClose={closeModal}>
        <form onSubmit={handleWithdraw} className="space-y-4">
          {formError && <p role="alert" className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">{formError}</p>}
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
    )
  }

  if (modal === 'createCard') {
    return (
      <Modal title="Skapa kort" onClose={closeModal}>
        {newCard ? (
          <div className="space-y-4">
            <p className="text-green-400 text-sm">Kort skapat! Spara uppgifterna nu — de visas bara en gång.</p>
            <div className="bg-gray-800 rounded-xl p-4 space-y-3 font-mono text-sm">
              <div>
                <p className="text-gray-400 mb-1">Kortnummer</p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-white text-lg tracking-widest">{newCard.cardNumber}</p>
                  <button type="button" onClick={() => copyToClipboard(newCard.cardNumber, 'cardNumber')} className="text-xs text-indigo-400 hover:text-indigo-300 transition shrink-0">
                    {copied === 'cardNumber' ? 'Kopierat!' : 'Kopiera'}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-gray-400 mb-1">CVV</p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-white">{newCard.cvv}</p>
                  <button type="button" onClick={() => copyToClipboard(newCard.cvv, 'cvv')} className="text-xs text-indigo-400 hover:text-indigo-300 transition shrink-0">
                    {copied === 'cvv' ? 'Kopierat!' : 'Kopiera'}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Utgångsdatum</p>
                <p className="text-white">{formatCardExpiry(newCard.card?.expiryDate)}</p>
              </div>
            </div>
            <button onClick={closeModal} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg py-2.5 transition">Stäng</button>
          </div>
        ) : (
          <form onSubmit={handleCreateCard} className="space-y-4">
            {formError && <p role="alert" className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">{formError}</p>}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Kortinnehavarens namn</label>
              <input required value={form.cardHolderName} onChange={e => setForm({ ...form, cardHolderName: e.target.value })} placeholder="FÖRNAMN EFTERNAMN" className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition" />
            </div>
            <button type="submit" disabled={submitting} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg py-2.5 transition disabled:opacity-60">{submitting ? 'Skapar...' : 'Skapa kort'}</button>
          </form>
        )}
      </Modal>
    )
  }

  if (modal === 'blockCard') {
    return (
      <Modal title="Blockera kort" onClose={closeModal}>
        <form onSubmit={handleBlock} className="space-y-4">
          {formError && <p role="alert" className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">{formError}</p>}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Anledning</label>
            <input required value={form.blockReason} onChange={e => setForm({ ...form, blockReason: e.target.value })} placeholder="T.ex. Stulet kort" className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition" />
          </div>
          <button type="submit" disabled={submitting} className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg py-2.5 transition disabled:opacity-60">{submitting ? 'Blockerar...' : 'Blockera kort'}</button>
        </form>
      </Modal>
    )
  }

  return null
}
