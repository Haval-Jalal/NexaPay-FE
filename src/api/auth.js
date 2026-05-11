// ============================================================
// auth.js – src/api
// ============================================================
// Alla API-anrop som rör autentisering.
// Endpoints: login, register, logout, lösenord, e-postbekräftelse
// ============================================================

// Importera request-hjälpfunktionen och token-hämtaren från klienten
import { request, getToken } from './client'

// Logga in med e-post och lösenord
// Returnerar ApiResponse<AuthDto> med token, email, roll och utgångsdatum
export function login(email, password) {
  return request('/api/auth/login', {
    method: 'POST',
    // Skicka email och lösenord som JSON i request-bodyn
    body: JSON.stringify({ email, password }),
  })
}

// Registrera ett nytt användarkonto
// Rollen sätts alltid till 'User' – bara Admin kan skapa personalroller
export function register(email, password) {
  return request('/api/auth/register', {
    method: 'POST',
    // Skicka email, lösenord och roll som JSON
    body: JSON.stringify({ email, password, role: 'User' }),
  })
}

// Logga ut den inloggade användaren
// Skickar med JWT-token så att servern kan ogiltigförklara den
export function logout() {
  return request('/api/auth/logout', { method: 'POST' }, getToken())
}

// Bekräfta e-postadress via länk i bekräftelsemail
// userId och token hämtas från länkens query-parametrar
export function confirmEmail(userId, token) {
  return request('/api/auth/confirm-email', {
    method: 'POST',
    body: JSON.stringify({ userId, token }),
  })
}

// Begär ett återställningsmail för glömt lösenord
// API:et avslöjar aldrig om e-posten finns – svarar alltid med success
export function forgotPassword(email) {
  return request('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

// Återställ lösenord med token från återställningsmail
// email och token hämtas från länkens query-parametrar
export function resetPassword(email, token, newPassword) {
  return request('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, token, newPassword }),
  })
}

// Byt lösenord för den inloggade användaren
// Kräver nuvarande lösenord som verifiering
export function changePassword(currentPassword, newPassword) {
  return request(
    '/api/auth/change-password',
    { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) },
    // Skicka med JWT-token – endpointen kräver inloggning
    getToken()
  )
}
