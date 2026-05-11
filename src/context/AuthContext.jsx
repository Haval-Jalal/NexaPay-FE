// ============================================================
// AuthContext.jsx – src/context
// ============================================================
// Hanterar inloggningsstatus globalt i hela appen.
// Sparar användaren i localStorage så att inloggningen
// överlever en omladdning av sidan.
//
// Används så här:
//   const { user, saveUser, logout } = useAuth()
// ============================================================

// Importera React-verktyg för att skapa och använda context
import { createContext, useContext, useState } from 'react'

// Importera logout-funktionen från api-lagret
import { logout as apiLogout } from '../api/auth'

// Skapa context-objektet – null som startvärde tills Provider mountas
const AuthContext = createContext(null)

// Provider-komponent som wrappas runt hela appen i App.jsx
// Alla komponenter under denna kan anropa useAuth()
export function AuthProvider({ children }) {

  // Läs in användaren från localStorage vid start
  // Om ingen användare finns returneras null (= ej inloggad)
  const [user, setUser] = useState(() => {
    // Försök hämta sparad användare från localStorage
    const stored = localStorage.getItem('nexapay_user')

    // Om hittad, parsa JSON och returnera – annars null
    return stored ? JSON.parse(stored) : null
  })

  // Spara inloggad användare i state och localStorage
  // Kallas efter lyckad login eller register
  function saveUser(data) {
    // Spara i localStorage så att sessionen överlever omladdning
    localStorage.setItem('nexapay_user', JSON.stringify(data))

    // Uppdatera React-state så att UI:t uppdateras direkt
    setUser(data)
  }

  // Logga ut användaren – anropar API och rensar lokal data
  async function logout() {
    // Försök anropa logout-endpointen för att ogiltigförklara token på servern
    try {
      await apiLogout()
    } catch {
      // Ignorera nätverksfel – vi loggar ut lokalt oavsett
    }

    // Ta bort sparad användare från localStorage
    localStorage.removeItem('nexapay_user')

    // Nollställ React-state – UI:t uppdateras och ProtectedRoute omdirigerar
    setUser(null)
  }

  // Tillhandahåll user, saveUser och logout till alla barn-komponenter
  return (
    <AuthContext.Provider value={{ user, saveUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Anpassad hook – gör det enkelt att hämta auth-data i valfri komponent
// Exempel: const { user } = useAuth()
export function useAuth() {
  return useContext(AuthContext)
}
