import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'

import Login          from './pages/Login'
import Register       from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword  from './pages/ResetPassword'
import ConfirmEmail   from './pages/ConfirmEmail'

import Dashboard     from './pages/Dashboard'
import AccountDetail from './pages/AccountDetail'
import Transfer      from './pages/Transfer'
import Settings      from './pages/Settings'
import Admin         from './pages/Admin'

function AdminRoute() {
  const { user } = useAuth()
  if (user?.role !== 'Admin') return <Navigate to="/dashboard" replace />
  return <Admin />
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <div key={location.pathname} className="animate-fade-in">
      <Routes location={location}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login"           element={<Login />} />
        <Route path="/register"        element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password"  element={<ResetPassword />} />
        <Route path="/confirm-email"   element={<ConfirmEmail />} />

        <Route path="/dashboard"    element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/accounts/:id" element={<ProtectedRoute><AccountDetail /></ProtectedRoute>} />
        <Route path="/transfer"     element={<ProtectedRoute><Transfer /></ProtectedRoute>} />
        <Route path="/settings"     element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/admin"        element={<ProtectedRoute><AdminRoute /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}
