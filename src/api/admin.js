import { request, getToken } from './client'

export const adminCreateUser = (email, password, role) =>
  request('/api/admin/users', { method: 'POST', body: JSON.stringify({ email, password, role }) }, getToken())
