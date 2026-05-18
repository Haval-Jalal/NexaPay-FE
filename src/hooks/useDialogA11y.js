// ============================================================
// hooks/useDialogA11y.js – a11y-helper för modal/dialog
// ============================================================
// Centraliserar tre saker som varje dialog behöver men inte ska
// behöva implementera själv:
//   * Esc stänger dialogen
//   * Focus trap – Tab/Shift+Tab cyklar inom dialogen
//   * Focus återförs till triggande element när dialogen stängs
// ============================================================

import { useEffect, useRef } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function useDialogA11y(onClose) {
  const ref = useRef(null)
  const previouslyFocused = useRef(null)

  useEffect(() => {
    previouslyFocused.current = document.activeElement

    // Fokus in i dialogen så Esc/Tab fungerar direkt
    const node = ref.current
    if (node) {
      const first = node.querySelector(FOCUSABLE)
      ;(first ?? node).focus()
    }

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose?.()
        return
      }
      if (e.key !== 'Tab' || !node) return
      const focusable = node.querySelectorAll(FOCUSABLE)
      if (focusable.length === 0) {
        e.preventDefault()
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused.current?.focus?.()
    }
  }, [onClose])

  return ref
}
