// ============================================================
// context/useAuth.js – hook + context-skapande
// ============================================================
// Splittas från AuthContext.jsx för att tillåta att Vite/React
// Refresh fungerar korrekt (en fil måste exportera endast
// komponenter, en annan endast hooks/context).
// ============================================================

import { createContext, useContext } from 'react'

export const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}
