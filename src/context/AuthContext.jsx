/* @refresh reset */
import { createContext, useContext, useState, useEffect } from 'react'
import { logout as apiLogout, getMe } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('nexapay_user')
    return stored ? JSON.parse(stored) : null
  })

  // Synka roll och e-post från servern vid app-start
  // Fångar upp rolländringar gjorda av Admin utan att användaren behöver logga ut
  useEffect(() => {
    if (!user?.token) return
    getMe()
      .then(res => {
        if (!res?.data?.email || !res?.data?.role) return
        const updated = { ...user, email: res.data.email, role: res.data.role }
        localStorage.setItem('nexapay_user', JSON.stringify(updated))
        setUser(updated)
      })
      .catch(() => {
        // Token ogiltig – logga ut
        localStorage.removeItem('nexapay_user')
        setUser(null)
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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

export function useAuth() {
  return useContext(AuthContext)
}
