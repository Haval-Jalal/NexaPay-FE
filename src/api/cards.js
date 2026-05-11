// ============================================================
// cards.js – src/api
// ============================================================
// Alla API-anrop som rör betalkort.
// Endpoints: hämta, skapa, aktivera, blockera, avblockera kort
// ============================================================

// Importera request och token-hämtare från klienten
import { request, getToken } from './client'

// Hämta alla kort kopplade till ett specifikt konto
export function getCardsByAccount(accountId) {
  return request(`/api/cards/account/${accountId}`, {}, getToken())
}

// Skapa ett nytt kort kopplat till ett konto
// Returnerar CreateCardResponse med fullt kortnummer och CVV – visas bara en gång
export function createCard(accountId, cardHolderName) {
  return request('/api/cards', {
    method: 'POST',
    body: JSON.stringify({ accountId, cardHolderName }),
  }, getToken())
}

// Aktivera ett inaktivt kort
// Kortets ägare, Admin, BankManager och Teller kan aktivera kort
export function activateCard(id) {
  return request(`/api/cards/${id}/activate`, { method: 'PUT' }, getToken())
}

// Blockera ett aktivt kort – bara Admin och BankManager kan göra detta
// reason = anledning till blockeringen, t.ex. "Stulet kort"
export function blockCard(id, reason) {
  return request(`/api/cards/${id}/block`, {
    method: 'PUT',
    body: JSON.stringify({ reason }),
  }, getToken())
}

// Avblockera ett blockerat kort – bara Admin och BankManager kan göra detta
export function unblockCard(id) {
  return request(`/api/cards/${id}/unblock`, { method: 'PUT' }, getToken())
}
