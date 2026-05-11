import { request, getToken } from './client'

const t = getToken

export const getTransactions = (accountId, page = 1, pageSize = 20) =>
  request(`/api/transactions/account/${accountId}?page=${page}&pageSize=${pageSize}`, {}, t())

export const deposit = (accountId, amount, description) =>
  request('/api/transactions/deposit', { method: 'POST', body: JSON.stringify({ accountId, amount, description }) }, t())

export const withdraw = (accountId, amount, description) =>
  request('/api/transactions/withdraw', { method: 'POST', body: JSON.stringify({ accountId, amount, description }) }, t())

export const transfer = (fromAccountId, toAccountId, amount, description) =>
  request('/api/transactions/transfer', { method: 'POST', body: JSON.stringify({ fromAccountId, toAccountId, amount, description }) }, t())
