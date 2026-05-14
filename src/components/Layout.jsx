import { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { logout } from '../api/auth'
import { can } from '../utils/roles'
import { LayoutDashboard, ArrowLeftRight, Cog, Shield, Menu, X } from 'lucide-react'

export default function Layout({ children }) {
  const { user, logout: clearUser } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const role      = user?.role
  const isAdmin   = role === 'Admin'

  const [sidebarOpen, setSidebarOpen]   = useState(false)
  const [loggingOut, setLoggingOut]     = useState(false)

  const navItems = [
    { to: '/dashboard', label: 'Översikt',     Icon: LayoutDashboard, show: true },
    { to: '/transfer',  label: 'Överföring',    Icon: ArrowLeftRight,  show: can.transfer(role) },
    { to: '/settings',  label: 'Inställningar', Icon: Cog,             show: true },
  ]

  async function handleLogout() {
    setLoggingOut(true)
    try { await logout() } catch { /* ignorera nätverksfel */ }
    clearUser()
    navigate('/login')
  }

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
      isActive ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
    }`

  const sidebar = (
    <aside className={`
      fixed md:static inset-y-0 left-0 z-40 w-56 shrink-0 flex flex-col bg-gray-900 border-r border-gray-800
      transition-transform duration-200 ease-in-out
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between">
        <span className="text-lg font-bold text-indigo-400">NexaPay</span>
        <button className="md:hidden text-gray-400 hover:text-white transition" onClick={() => setSidebarOpen(false)}>
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.filter(i => i.show).map(({ to, label, Icon }) => (
          <NavLink key={to} to={to} className={navLinkClass} onClick={() => setSidebarOpen(false)}>
            <Icon size={16} />
            {label}
          </NavLink>
        ))}

        {isAdmin && (
          <NavLink to="/admin" className={navLinkClass} onClick={() => setSidebarOpen(false)}>
            <Shield size={16} />
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
          disabled={loggingOut}
          className="w-full text-left text-sm text-red-400 hover:text-red-300 transition px-2 py-1 rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {loggingOut ? 'Loggar ut...' : 'Logga ut'}
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/60"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {sidebar}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800 shrink-0">
          <span className="text-base font-bold text-indigo-400">NexaPay</span>
          <button onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-white transition">
            <Menu size={20} />
          </button>
        </div>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div key={location.pathname} className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
