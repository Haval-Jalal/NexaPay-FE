// ============================================================
// App.jsx – src
// ============================================================
// Appens rot-komponent.
// Sätter upp:
//   - AuthProvider  → global inloggningsstatus
//   - BrowserRouter → URL-baserad navigering
//   - Routes        → vilken sida som visas per URL
//
// Alla skyddade sidor wrappas i <ProtectedRoute> som
// omdirigerar till /login om användaren inte är inloggad.
// ============================================================

// Importera routing-komponenter
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// AuthProvider wrappas runt hela appen för global inloggningsstatus
import { AuthProvider } from './context/AuthContext'

// ProtectedRoute skyddar sidor som kräver inloggning
import ProtectedRoute from './components/ProtectedRoute'

// ---- Publika sidor (ingen inloggning krävs) ----
import Login          from './pages/Login'           // Inloggning
import Register       from './pages/Register'         // Registrering
import ForgotPassword from './pages/ForgotPassword'   // Glömt lösenord
import ResetPassword  from './pages/ResetPassword'    // Återställ lösenord
import ConfirmEmail   from './pages/ConfirmEmail'     // Bekräfta e-post via länk

// ---- Skyddade sidor (kräver inloggning) ----
import Dashboard     from './pages/Dashboard'        // Kontoöversikt
import AccountDetail from './pages/AccountDetail'    // Kontodetaljer, kort, transaktioner
import Transfer      from './pages/Transfer'         // Överföring
import Settings      from './pages/Settings'         // Inställningar, byt lösenord
import Admin         from './pages/Admin'            // Admin – skapa användare (Admin-roll)

export default function App() {
  return (
    // AuthProvider gör user, saveUser och logout tillgängliga i hela appen
    <AuthProvider>

      {/* BrowserRouter aktiverar URL-baserad navigering */}
      <BrowserRouter>
        <Routes>

          {/* ---- Publika routes ---- */}

          {/* Rot-URL omdirigerar direkt till inloggningssidan */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Inloggningssida */}
          <Route path="/login" element={<Login />} />

          {/* Registreringssida */}
          <Route path="/register" element={<Register />} />

          {/* Glömt lösenord – anger e-post för återställningsmail */}
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Återställ lösenord – länk från e-post med ?email=&token= */}
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Bekräfta e-post – länk från bekräftelsemailet med ?userId=&token= */}
          <Route path="/confirm-email" element={<ConfirmEmail />} />

          {/* ---- Skyddade routes – kräver inloggning ---- */}

          {/* Kontoöversikt – listning av alla konton */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />

          {/* Kontodetaljer – visar kort och transaktioner för ett specifikt konto */}
          <Route path="/accounts/:id" element={
            <ProtectedRoute><AccountDetail /></ProtectedRoute>
          } />

          {/* Överföring – skicka pengar mellan konton */}
          <Route path="/transfer" element={
            <ProtectedRoute><Transfer /></ProtectedRoute>
          } />

          {/* Inställningar – visa kontoinformation och byt lösenord */}
          <Route path="/settings" element={
            <ProtectedRoute><Settings /></ProtectedRoute>
          } />

          {/* Admin – bara tillgänglig för Admin-rollen (kontrolleras i Layout) */}
          <Route path="/admin" element={
            <ProtectedRoute><Admin /></ProtectedRoute>
          } />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
