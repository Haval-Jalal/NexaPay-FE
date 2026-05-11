import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { logout } from '../api/auth'

const navItems = [
  { to: '/dashboard', label: 'Översikt', icon: '▦' },
  { to: '/transfer', label: 'Överföring', icon: '⇄' },
  { to: '/settings', label: 'Inställningar', icon: '⚙' },
]

export default function Layout({ children }) {
  const { user, logout: clearUser } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    try { await logout() } catch { /* ignorera */ }
    clearUser()
    navigate('/login')
  }

  const isAdmin = user?.role === 'Admin'

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 flex flex-col bg-gray-900 border-r border-gray-800">
        <div className="px-6 py-5 border-b border-gray-800">
          <span className="text-lg font-bold text-indigo-400">NexaPay</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <span className="text-base">{icon}</span>
              {label}
            </NavLink>
          ))}

          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <span className="text-base">🛡</span>
              Admin
            </NavLink>
          )}
        </nav>

        <div className="px-4 py-4 border-t border-gray-800">
          <p className="text-xs text-gray-500 truncate mb-2">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="w-full text-left text-sm text-red-400 hover:text-red-300 transition px-2 py-1 rounded hover:bg-gray-800"
          >
            Logga ut
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}
