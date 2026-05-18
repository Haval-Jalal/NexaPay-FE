// ============================================================
// components/Modal.jsx – generisk modal-overlay
// ============================================================
// Återanvänds av formulär (skapa konto, skapa kort, etc.).
// A11y: role=dialog, aria-modal, Esc-stängning, focus trap och
// focus return till triggande element via useDialogA11y.
// ============================================================

import { useId } from 'react'
import { useDialogA11y } from '../hooks/useDialogA11y'

export default function Modal({ title, onClose, children }) {
  const titleId = useId()
  const ref = useDialogA11y(onClose)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.() }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6 outline-none"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 id={titleId} className="text-lg font-semibold text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Stäng dialog"
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
