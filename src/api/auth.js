import { request, getToken } from './client'

export function login(email, password) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

// Självregistrering ger alltid rollen 'User' – personalroller skapas av Admin.
export function register(email, password) {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, role: 'User' }),
  })
}

export function logout() {
  return request('/api/auth/logout', { method: 'POST' }, getToken())
}

export function confirmEmail(userId, token) {
  return request('/api/auth/confirm-email', {
    method: 'POST',
    body: JSON.stringify({ userId, token }),
  })
}

export function forgotPassword(email) {
  return request('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export function resetPassword(email, token, newPassword) {
  return request('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, token, newPassword }),
  })
}

export function changePassword(currentPassword, newPassword) {
  return request(
    '/api/auth/change-password',
    { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) },
    getToken()
  )
}

export function getMe() {
  return request('/api/auth/me', {}, getToken())
}
