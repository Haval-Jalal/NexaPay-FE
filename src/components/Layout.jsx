// ============================================================
// Layout.jsx – src/components
// ============================================================
// Sidlayout med sidebar-navigation.
// Wrappas runt alla skyddade sidor för enhetlig struktur.
//
// Navigeringslänkar:
//   - Översikt  → /dashboard
//   - Överföring → /transfer
//   - Inställningar → /settings
//   - Admin (visas bara för Admin-rollen) → /admin
// ============================================================

// Importera NavLink för navigering och useNavigate för omdirigering
import { NavLink, useNavigate } from 'react-router-dom'

// Importera useAuth för att hämta användarinfo och logout-funktion
import { useAuth } from '../context/AuthContext'

// Importera logout-anropet mot API:et
import { logout } from '../api/auth'

// Navigationslänkar som visas för alla inloggade användare
// icon = enkel textikon, to = sökväg, label = länktext
const NAV_ITEMS = [
  { to: '/dashboard',  label: 'Översikt',      icon: '▦' },
  { to: '/transfer',   label: 'Överföring',     icon: '⇄' },
  { to: '/settings',   label: 'Inställningar',  icon: '⚙' },
]

// Layout wrappas runt sidans innehåll i varje skyddad sida
// children = sidans unika innehåll
export default function Layout({ children }) {
  // Hämta inloggad användare och logout-funktion från context
  const { user, logout: clearUser } = useAuth()

  // useNavigate för att skicka användaren till /login efter utloggning
  const navigate = useNavigate()

  // Kontrollera om inloggad användare är Admin – används för att visa admin-länken
  const isAdmin = user?.role === 'Admin'

  // Hanterar utloggning – anropar API och rensar lokal session
  async function handleLogout() {
    // Försök informera servern om utloggning (token ogiltigförklaras)
    try { await logout() } catch { /* Ignorera nätverksfel */ }

    // Rensa user-state och localStorage via AuthContext
    clearUser()

    // Skicka användaren till inloggningssidan
    navigate('/login')
  }

  return (
    // Yttre wrapper – flexbox sida vid sida: sidebar + main
    <div className="flex min-h-screen bg-gray-950 text-white">

      {/* ---- Sidebar ---- */}
      <aside className="w-56 shrink-0 flex flex-col bg-gray-900 border-r border-gray-800">

        {/* Logotyp-area */}
        <div className="px-6 py-5 border-b border-gray-800">
          <span className="text-lg font-bold text-indigo-400">NexaPay</span>
        </div>

        {/* Navigeringslänkar */}
        <nav className="flex-1 px-3 py-4 space-y-1">

          {/* Rendera standardlänkarna från NAV_ITEMS */}
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              // NavLink ger isActive=true när sökvägen matchar – byt färg på aktiv länk
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                  isActive
                    ? 'bg-indigo-600 text-white'       // Aktiv sida: lila bakgrund
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white' // Övriga: grå
                }`
              }
            >
              <span className="text-base">{icon}</span>
              {label}
            </NavLink>
          ))}

          {/* Admin-länk – visas BARA om användaren har Admin-rollen */}
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
              {/* Sköldsymbol för admin-sektionen */}
              <span className="text-base">🛡</span>
              Admin
            </NavLink>
          )}
        </nav>

        {/* Användarprofil och utloggningsknapp längst ner */}
        <div className="px-4 py-4 border-t border-gray-800">
          {/* Visa e-postadressen – truncate om den är för lång */}
          <p className="text-xs text-gray-500 truncate mb-2">{user?.email}</p>

          {/* Utloggningsknapp – anropar handleLogout vid klick */}
          <button
            onClick={handleLogout}
            className="w-full text-left text-sm text-red-400 hover:text-red-300 transition px-2 py-1 rounded hover:bg-gray-800"
          >
            Logga ut
          </button>
        </div>
      </aside>

      {/* ---- Sidans innehåll ---- */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}
