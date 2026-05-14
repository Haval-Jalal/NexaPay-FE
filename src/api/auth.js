import api from './client'

export function login(email, password) {
  return api.post('/api/auth/login', { email, password })
}

// Självregistrering ger alltid rollen 'User' – personalroller skapas av Admin.
export function register(email, password) {
  return api.post('/api/auth/register', { email, password, role: 'User' })
}

export function logout() {
  return api.post('/api/auth/logout')
}

export function confirmEmail(userId, token) {
  return api.post('/api/auth/confirm-email', { userId, token })
}

export function forgotPassword(email) {
  return api.post('/api/auth/forgot-password', { email })
}

export function resetPassword(email, token, newPassword) {
  return api.post('/api/auth/reset-password', { email, token, newPassword })
}

export function changePassword(currentPassword, newPassword) {
  return api.post('/api/auth/change-password', { currentPassword, newPassword })
}

export function getMe() {
  return api.get('/api/auth/me')
}
