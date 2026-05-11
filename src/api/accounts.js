// ============================================================
// accounts.js – src/api
// ============================================================
// Alla API-anrop som rör bankkonton.
// Endpoints: hämta, skapa, frysa, avfrysa, stänga konton
// ============================================================

// Importera request och token-hämtare från klienten
import { request, getToken } from './client'

// Hämta alla konton som tillhör den inloggade användaren
// Personal (staff) ser alla konton i systemet
export function getAccounts() {
  return request('/api/accounts', {}, getToken())
}

// Hämta ett specifikt konto via dess ID (GUID)
export function getAccount(id) {
  return request(`/api/accounts/${id}`, {}, getToken())
}

// Skapa ett nytt bankkonto
// accountName = valfritt namn, accountType = 'Checking' | 'Savings' | 'ISK'
export function createAccount(accountName, accountType) {
  return request('/api/accounts', {
    method: 'POST',
    body: JSON.stringify({ accountName, accountType }),
  }, getToken())
}

// Frys ett konto – bara bankpersonal (Admin, BankManager, Teller) kan göra detta
// Frysta konton kan inte ta emot eller skicka transaktioner
export function freezeAccount(id) {
  return request(`/api/accounts/${id}/freeze`, { method: 'PUT' }, getToken())
}

// Avfrys ett fryst konto – återställer kontot till Open-status
export function unfreezeAccount(id) {
  return request(`/api/accounts/${id}/unfreeze`, { method: 'PUT' }, getToken())
}

// Stäng (radera) ett konto permanent
// Admin, BankManager och vanlig User kan stänga konton
export function deleteAccount(id) {
  return request(`/api/accounts/${id}`, { method: 'DELETE' }, getToken())
}
