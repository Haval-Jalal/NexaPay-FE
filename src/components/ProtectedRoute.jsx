// ============================================================
// ProtectedRoute.jsx – src/components
// ============================================================
// Skyddar sidor som kräver inloggning.
// Om användaren INTE är inloggad skickas den till /login.
// Används i App.jsx runt alla skyddade routes.
//
// Exempel:
//   <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
// ============================================================

// Importera Navigate för omdirigering
import { Navigate } from 'react-router-dom'

// Importera useAuth-hooken för att kontrollera inloggningsstatus
import { useAuth } from '../context/AuthContext'

// ProtectedRoute wrappas runt en sida för att skydda den
// children = den skyddade sidan som ska visas om användaren är inloggad
export default function ProtectedRoute({ children }) {
  // Hämta den inloggade användaren från AuthContext
  const { user } = useAuth()

  // Om ingen användare finns – omdirigera till inloggningssidan
  // replace=true ersätter historiken så att "tillbaka"-knappen inte går dit
  if (!user) return <Navigate to="/login" replace />

  // Användaren är inloggad – visa den skyddade sidan
  return children
}
