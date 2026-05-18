// ============================================================
// api/transactions.js – endpoint-wrappers för /api/transactions/*
// ============================================================
// Alla muterande anrop (deposit/withdraw/transfer/pay-invoice)
// skickar automatiskt med en `Idempotency-Key`-header med en
// fräsch UUID. Skyddar mot att en användare som klickar två gånger
// (eller en flaky-nät-retry) skapar dubbla transaktioner.
// ============================================================

import api from './client'

const idempotencyHeader = () => ({ 'Idempotency-Key': crypto.randomUUID() })

export function getTransactions(accountId, page = 1, pageSize = 20) {
  return api.get(`/api/transactions/account/${accountId}`, {
    params: { page, pageSize },
  })
}

export function deposit(accountId, amount, description) {
  return api.post(
    '/api/transactions/deposit',
    { accountId, amount, description },
    { headers: idempotencyHeader() }
  )
}

export function withdraw(accountId, amount, description) {
  return api.post(
    '/api/transactions/withdraw',
    { accountId, amount, description },
    { headers: idempotencyHeader() }
  )
}

export function transfer(fromAccountId, toAccountId, amount, description) {
  return api.post(
    '/api/transactions/transfer',
    { fromAccountId, toAccountId, amount, description },
    { headers: idempotencyHeader() }
  )
}

export function payInvoice(accountId, amount, bankgiro, ocr, description) {
  return api.post(
    '/api/transactions/invoice-payment',
    { accountId, amount, bankgiro, ocr, description },
    { headers: idempotencyHeader() }
  )
}
