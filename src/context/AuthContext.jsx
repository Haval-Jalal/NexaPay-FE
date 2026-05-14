import { useState, useEffect } from 'react'
import { logout as apiLogout, getMe } from '../api/auth'
import { AuthContext } from './useAuth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('nexapay_user')
    return stored ? JSON.parse(stored) : null
  })

  // Synka roll och e-post från servern vid app-start. Läser localStorage
  // direkt (inte user-state) så effekten saknar reaktiva beroenden och
  // bara körs vid mount.
  useEffect(() => {
    const stored = localStorage.getItem('nexapay_user')
    const current = stored ? JSON.parse(stored) : null
    if (!current?.token) return
    getMe()
      .then(res => {
        if (!res?.data?.email || !res?.data?.role) return
        const updated = { ...current, email: res.data.email, role: res.data.role }
        localStorage.setItem('nexapay_user', JSON.stringify(updated))
        setUser(updated)
      })
      .catch(() => {
        // Token ogiltig – logga ut
        localStorage.removeItem('nexapay_user')
        setUser(null)
      })
  }, [])

  function saveUser(data) {
    localStorage.setItem('nexapay_user', JSON.stringify(data))
    setUser(data)
  }

  async function logout() {
    try { await apiLogout() } catch { /* ignorera nätverksfel */ }
    localStorage.removeItem('nexapay_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, saveUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
