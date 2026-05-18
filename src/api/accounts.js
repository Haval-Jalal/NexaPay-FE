// ============================================================
// api/accounts.js – endpoint-wrappers för /api/accounts/*
// ============================================================
// CRUD + freeze/unfreeze + konto-lookup. `lookupAccount` används
// av Transfer-sidan för att hitta mottagarkonto via kontonummer.
// ============================================================

import api from './client'

export function getAccounts() {
  return api.get('/api/accounts')
}

export function getAccount(id) {
  return api.get(`/api/accounts/${id}`)
}

export function createAccount(accountName, accountType, ownerEmail) {
  const body = { accountName, accountType }
  if (ownerEmail) body.ownerEmail = ownerEmail
  return api.post('/api/accounts', body)
}

export function freezeAccount(id) {
  return api.put(`/api/accounts/${id}/freeze`)
}

export function unfreezeAccount(id) {
  return api.put(`/api/accounts/${id}/unfreeze`)
}

export function deleteAccount(id) {
  return api.delete(`/api/accounts/${id}`)
}

export function lookupAccount(accountNumber) {
  return api.get('/api/accounts/lookup', { params: { number: accountNumber } })
}
