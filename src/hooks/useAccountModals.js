// ============================================================
// hooks/useAccountModals.js – modal- och form-state för AccountDetail
// ============================================================
// Samlar de fyra modalernas state (deposit, withdraw, createCard,
// blockCard) + submit-handlers på ett ställe så att AccountDetail
// inte själv behöver hålla 6+ useState för formulärlogik.
//
// Returnerar ett "modals"-objekt som skickas vidare till
// <AccountModals /> som renderar UI:t.
// ============================================================

import { useState, useCallback } from 'react'
import { createCard, blockCard } from '../api/cards'
import { deposit, withdraw } from '../api/transactions'

const EMPTY_FORM = { amount: '', description: '', cardHolderName: '', blockReason: '' }

export function useAccountModals({ accountId, toast, reloadAccount, reloadCards, reloadTransactions }) {
  const [modal, setModal] = useState(null)
  const [selectedCardId, setSelectedCardId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [newCard, setNewCard] = useState(null)
  const [copied, setCopied] = useState(null)

  const openModal = useCallback((name, cardId = null) => {
    setModal(name)
    setSelectedCardId(cardId)
    setForm(EMPTY_FORM)
    setFormError('')
    setNewCard(null)
  }, [])

  const closeModal = useCallback(() => {
    setModal(null)
    setSelectedCardId(null)
  }, [])

  const copyToClipboard = useCallback((text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label)
      setTimeout(() => setCopied(null), 2000)
    })
  }, [])

  async function runSubmit(fn) {
    setSubmitting(true)
    setFormError('')
    try {
      await fn()
    } catch (e) {
      setFormError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeposit(e) {
    e.preventDefault()
    await runSubmit(async () => {
      await deposit(accountId, parseFloat(form.amount), form.description)
      toast('Insättning genomförd.')
      closeModal()
      reloadAccount()
      reloadTransactions()
    })
  }

  async function handleWithdraw(e) {
    e.preventDefault()
    await runSubmit(async () => {
      await withdraw(accountId, parseFloat(form.amount), form.description)
      toast('Uttag genomfört.')
      closeModal()
      reloadAccount()
      reloadTransactions()
    })
  }

  async function handleCreateCard(e) {
    e.preventDefault()
    await runSubmit(async () => {
      const res = await createCard(accountId, form.cardHolderName)
      setNewCard(res.data)
      reloadCards()
    })
  }

  async function handleBlock(e) {
    e.preventDefault()
    await runSubmit(async () => {
      await blockCard(selectedCardId, form.blockReason)
      closeModal()
      reloadCards()
    })
  }

  return {
    modal,
    openModal,
    closeModal,
    form,
    setForm,
    submitting,
    formError,
    newCard,
    copied,
    copyToClipboard,
    handleDeposit,
    handleWithdraw,
    handleCreateCard,
    handleBlock,
  }
}
