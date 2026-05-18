// ============================================================
// api/cards.js – endpoint-wrappers för /api/cards/*
// ============================================================
// Kort-CRUD och tillståndshanterande operationer (activate/block/
// unblock). createCard returnerar fullt kortnummer + CVV – visas
// EN gång i UI och sparas aldrig på klienten.
// ============================================================

import api from './client'

export function getCardsByAccount(accountId) {
  return api.get(`/api/cards/account/${accountId}`)
}

// Svaret innehåller fullt kortnummer och CVV – visas bara en gång.
export function createCard(accountId, cardHolderName) {
  return api.post('/api/cards', { accountId, cardHolderName })
}

export function activateCard(id) {
  return api.put(`/api/cards/${id}/activate`)
}

export function blockCard(id, reason) {
  return api.put(`/api/cards/${id}/block`, { reason })
}

export function unblockCard(id) {
  return api.put(`/api/cards/${id}/unblock`)
}
