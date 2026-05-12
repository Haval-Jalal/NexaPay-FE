import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { logout } from '../api/auth'
import { can } from '../utils/roles'

export default function Layout({ children }) {
  const { user, logout: clearUser } = useAuth()
  const navigate = useNavigate()
  const role    = user?.role
  const isAdmin = role === 'Admin'

  const navItems = [
    { to: '/dashboard', label: 'Översikt',     icon: '▦', show: true },
    { to: '/transfer',  label: 'Överföring',    icon: '⇄', show: can.transfer(role) },
    { to: '/settings',  label: 'Inställningar', icon: '⚙', show: true },
  ]

  async function handleLogout() {
    try { await logout() } catch { /* ignorera nätverksfel */ }
    clearUser()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <aside className="w-56 shrink-0 flex flex-col bg-gray-900 border-r border-gray-800">
        <div className="px-6 py-5 border-b border-gray-800">
          <span className="text-lg font-bold text-indigo-400">NexaPay</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.filter(i => i.show).map(({ to, label, icon }) => (
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

        {role === 'Auditor' && (
          <div className="mx-3 mb-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-xs text-blue-400 font-medium">Skrivskyddad vy</p>
            <p className="text-xs text-gray-500 mt-0.5">Auditor – enbart läsbehörighet</p>
          </div>
        )}

        <div className="px-4 py-4 border-t border-gray-800">
          <p className="text-xs text-gray-500 truncate mb-0.5">{user?.email}</p>
          <p className="text-xs text-indigo-400 mb-2">{role}</p>
          <button
            onClick={handleLogout}
            className="w-full text-left text-sm text-red-400 hover:text-red-300 transition px-2 py-1 rounded hover:bg-gray-800"
          >
            Logga ut
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}
