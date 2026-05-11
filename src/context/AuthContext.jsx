import { createContext, useContext, useState } from 'react'
import { logout as apiLogout } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('nexapay_user')
    return stored ? JSON.parse(stored) : null
  })

  function saveUser(data) {
    localStorage.setItem('nexapay_user', JSON.stringify(data))
    setUser(data)
  }

  async function logout() {
    if (user?.token) {
      try { await apiLogout(user.token) } catch { /* ignorera fel vid utloggning */ }
    }
    localStorage.removeItem('nexapay_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, saveUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
