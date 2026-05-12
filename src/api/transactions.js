import { request, getToken } from './client'

export function getTransactions(accountId, page = 1, pageSize = 20) {
  return request(
    `/api/transactions/account/${accountId}?page=${page}&pageSize=${pageSize}`,
    {},
    getToken()
  )
}

export function deposit(accountId, amount, description) {
  return request('/api/transactions/deposit', {
    method: 'POST',
    body: JSON.stringify({ accountId, amount, description }),
    headers: { 'Idempotency-Key': crypto.randomUUID() },
  }, getToken())
}

export function withdraw(accountId, amount, description) {
  return request('/api/transactions/withdraw', {
    method: 'POST',
    body: JSON.stringify({ accountId, amount, description }),
    headers: { 'Idempotency-Key': crypto.randomUUID() },
  }, getToken())
}

export function transfer(fromAccountId, toAccountId, amount, description) {
  return request('/api/transactions/transfer', {
    method: 'POST',
    body: JSON.stringify({ fromAccountId, toAccountId, amount, description }),
    headers: { 'Idempotency-Key': crypto.randomUUID() },
  }, getToken())
}
