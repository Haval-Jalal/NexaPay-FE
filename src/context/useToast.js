// ============================================================
// context/useToast.js – hook + context-skapande
// ============================================================
// Splittas från ToastContext.jsx för React Refresh-kompatibilitet.
// ============================================================

import { createContext, useContext } from 'react'

export const ToastContext = createContext(null)

export function useToast() {
  return useContext(ToastContext)
}
