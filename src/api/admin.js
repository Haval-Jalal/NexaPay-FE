import { request, getToken } from './client'

// Alla endpoints kräver Admin-rollen. Personalroller kräver @nexapay.com-epost.
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
