// ============================================================
// transactions.js – src/api
// ============================================================
// Alla API-anrop som rör transaktioner.
// Endpoints: hämta (paginerat), insättning, uttag, överföring
// ============================================================

// Importera request och token-hämtare från klienten
import { request, getToken } from './client'

// Hämta transaktioner för ett konto med paginering
// page     = sidnummer (börjar på 1)
// pageSize = antal transaktioner per sida (max 100)
export function getTransactions(accountId, page = 1, pageSize = 20) {
  return request(
    `/api/transactions/account/${accountId}?page=${page}&pageSize=${pageSize}`,
    {},
    getToken()
  )
}

// Gör en insättning på ett konto
// amount      = beloppet i SEK (positivt tal)
// description = valfri beskrivning, t.ex. "Lön"
export function deposit(accountId, amount, description) {
  return request('/api/transactions/deposit', {
    method: 'POST',
    body: JSON.stringify({ accountId, amount, description }),
  }, getToken())
}

// Gör ett uttag från ett konto
// Misslyckas om saldot är otillräckligt eller kontot är fryst
export function withdraw(accountId, amount, description) {
  return request('/api/transactions/withdraw', {
    method: 'POST',
    body: JSON.stringify({ accountId, amount, description }),
  }, getToken())
}

// Överför pengar mellan två konton
// fromAccountId = konto att ta från
// toAccountId   = mottagarens konto-ID (GUID)
export function transfer(fromAccountId, toAccountId, amount, description) {
  return request('/api/transactions/transfer', {
    method: 'POST',
    body: JSON.stringify({ fromAccountId, toAccountId, amount, description }),
  }, getToken())
}
