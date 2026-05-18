// ============================================================
// components/ProtectedRoute.jsx – wrapper för skyddade routes
// ============================================================
// Om ingen användare finns i AuthContext omdirigeras besökaren
// till /login. Backend gör den auktoritativa kontrollen (JWT)
// men denna wrapper hindrar besökare från att ens se UI:t.
// ============================================================

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}
