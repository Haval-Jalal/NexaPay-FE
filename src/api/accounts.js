import { request, getToken } from './client'

export function getAccounts() {
  return request('/api/accounts', {}, getToken())
}

export function getAccount(id) {
  return request(`/api/accounts/${id}`, {}, getToken())
}

export function createAccount(accountName, accountType, ownerEmail) {
  const body = { accountName, accountType }
  if (ownerEmail) body.ownerEmail = ownerEmail
  return request('/api/accounts', {
    method: 'POST',
    body: JSON.stringify(body),
  }, getToken())
}

export function freezeAccount(id) {
  return request(`/api/accounts/${id}/freeze`, { method: 'PUT' }, getToken())
}

export function unfreezeAccount(id) {
  return request(`/api/accounts/${id}/unfreeze`, { method: 'PUT' }, getToken())
}

export function deleteAccount(id) {
  return request(`/api/accounts/${id}`, { method: 'DELETE' }, getToken())
}

export function lookupAccount(accountNumber) {
  return request(`/api/accounts/lookup?number=${encodeURIComponent(accountNumber)}`, {}, getToken())
}
