import api from './client'

// Alla endpoints kräver Admin-rollen. Personalroller kräver @nexapay.com-epost.
export function adminCreateUser(email, password, role) {
  return api.post('/api/admin/users', { email, password, role })
}

export function listUsers() {
  return api.get('/api/admin/users')
}

export function deleteUser(id) {
  return api.delete(`/api/admin/users/${id}`)
}
