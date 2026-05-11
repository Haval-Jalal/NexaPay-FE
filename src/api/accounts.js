import { request, getToken } from './client'

const t = getToken

export const getAccounts = () =>
  request('/api/accounts', {}, t())

export const getAccount = (id) =>
  request(`/api/accounts/${id}`, {}, t())

export const createAccount = (accountName, accountType) =>
  request('/api/accounts', { method: 'POST', body: JSON.stringify({ accountName, accountType }) }, t())

export const freezeAccount = (id) =>
  request(`/api/accounts/${id}/freeze`, { method: 'PUT' }, t())

export const unfreezeAccount = (id) =>
  request(`/api/accounts/${id}/unfreeze`, { method: 'PUT' }, t())

export const deleteAccount = (id) =>
  request(`/api/accounts/${id}`, { method: 'DELETE' }, t())
