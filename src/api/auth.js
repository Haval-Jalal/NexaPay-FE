import { request, getToken } from './client'

export const login = (email, password) =>
  request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })

export const register = (email, password) =>
  request('/api/auth/register', { method: 'POST', body: JSON.stringify({ email, password, role: 'User' }) })

export const logout = () =>
  request('/api/auth/logout', { method: 'POST' }, getToken())

export const confirmEmail = (userId, token) =>
  request('/api/auth/confirm-email', { method: 'POST', body: JSON.stringify({ userId, token }) })

export const forgotPassword = (email) =>
  request('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) })

export const resetPassword = (email, token, newPassword) =>
  request('/api/auth/reset-password', { method: 'POST', body: JSON.stringify({ email, token, newPassword }) })

export const changePassword = (currentPassword, newPassword) =>
  request('/api/auth/change-password', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) }, getToken())
