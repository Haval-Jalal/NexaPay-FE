// ============================================================
// components/ConfirmModal.jsx – snygg ja/nej-dialog
// ============================================================
// Ersätter window.confirm() med en kontextkänslig modal som
// stylas konsekvent. Färgklassen för Bekräfta-knappen kan bytas
// till t.ex. röd (för destruktiva åtgärder som stänga konto).
// ============================================================

// Bekräftelsedialog som ersätter webbläsarens inbyggda confirm()
export default function ConfirmModal({ title, message, confirmLabel = 'Bekräfta', confirmClass = 'bg-red-600 hover:bg-red-500', onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-sm space-y-4">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="text-gray-400 text-sm">{message}</p>
        <div className="flex gap-3 justify-end pt-1">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-700 rounded-lg transition"
          >
            Avbryt
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm text-white font-semibold rounded-lg transition ${confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
