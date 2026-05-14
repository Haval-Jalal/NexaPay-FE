import { request, getToken } from './client'

export function getCardsByAccount(accountId) {
  return request(`/api/cards/account/${accountId}`, {}, getToken())
}

// Svaret innehåller fullt kortnummer och CVV – visas bara en gång.
export function createCard(accountId, cardHolderName) {
  return request('/api/cards', {
    method: 'POST',
    body: JSON.stringify({ accountId, cardHolderName }),
  }, getToken())
}

export function activateCard(id) {
  return request(`/api/cards/${id}/activate`, { method: 'PUT' }, getToken())
}

export function blockCard(id, reason) {
  return request(`/api/cards/${id}/block`, {
    method: 'PUT',
    body: JSON.stringify({ reason }),
  }, getToken())
}

export function unblockCard(id) {
  return request(`/api/cards/${id}/unblock`, { method: 'PUT' }, getToken())
}
