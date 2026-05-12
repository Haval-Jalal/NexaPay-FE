// ============================================================
// admin.js – src/api
// ============================================================
// API-anrop för admin-funktioner.
// Alla endpoints här kräver Admin-rollen.
// ============================================================

// Importera request och token-hämtare från klienten
import { request, getToken } from './client'

// Skapa en ny användare med valfri roll
// Personalroller (Admin, BankManager, Teller, Auditor) kräver @nexapay.com-epost
// role = 'User' | 'Teller' | 'Auditor' | 'BankManager' | 'Admin'
export function adminCreateUser(email, password, role) {
  return request('/api/admin/users', {
    method: 'POST',
    body: JSON.stringify({ email, password, role }),
  }, getToken())
}

export function listUsers() {
  return request('/api/admin/users', {}, getToken())
}

export function deleteUser(id) {
  return request(`/api/admin/users/${id}`, { method: 'DELETE' }, getToken())
}
