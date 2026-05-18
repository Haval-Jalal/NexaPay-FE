// ============================================================
// components/ConfirmModal.jsx – snygg ja/nej-dialog
// ============================================================
// Ersätter window.confirm() med en kontextkänslig modal som
// stylas konsekvent. Färgklassen för Bekräfta-knappen kan bytas
// till t.ex. röd (för destruktiva åtgärder som stänga konto).
// A11y: role=alertdialog (kräver användarens uppmärksamhet),
// Esc avbryter, focus trap, focus return.
// ============================================================

import { useId } from 'react'
import { useDialogA11y } from '../hooks/useDialogA11y'

export default function ConfirmModal({
  title,
  message,
  confirmLabel = 'Bekräfta',
  confirmClass = 'bg-red-600 hover:bg-red-500',
  onConfirm,
  onCancel,
}) {
  const titleId = useId()
  const descId = useId()
  const ref = useDialogA11y(onCancel)

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel?.() }}
    >
      <div
        ref={ref}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        tabIndex={-1}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-sm space-y-4 outline-none"
      >
        <h2 id={titleId} className="text-lg font-semibold text-white">{title}</h2>
        <p id={descId} className="text-gray-400 text-sm">{message}</p>
        <div className="flex gap-3 justify-end pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-700 rounded-lg transition"
          >
            Avbryt
          </button>
          <button
            type="button"
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
