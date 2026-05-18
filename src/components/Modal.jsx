// ============================================================
// components/Modal.jsx – generisk modal-overlay
// ============================================================
// Återanvänds av formulär (skapa konto, skapa kort, etc.).
// Backdropen täcker hela skärmen med svart 60% opacitet och
// modalen centreras vertikalt. Stänger via X-knappen i headern.
// ============================================================

export default function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition text-xl leading-none"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
