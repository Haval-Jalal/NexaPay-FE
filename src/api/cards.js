import { request, getToken } from './client'

const t = getToken

export const getCardsByAccount = (accountId) =>
  request(`/api/cards/account/${accountId}`, {}, t())

export const createCard = (accountId, cardHolderName) =>
  request('/api/cards', { method: 'POST', body: JSON.stringify({ accountId, cardHolderName }) }, t())

export const activateCard = (id) =>
  request(`/api/cards/${id}/activate`, { method: 'PUT' }, t())

export const blockCard = (id, reason) =>
  request(`/api/cards/${id}/block`, { method: 'PUT', body: JSON.stringify({ reason }) }, t())

export const unblockCard = (id) =>
  request(`/api/cards/${id}/unblock`, { method: 'PUT' }, t())
