// ============================================================
// helpers/format.js – formaterings-hjälpare för UI
// ============================================================
// Samlar all formatering på ett ställe så att samma valuta-,
// datum- och kortformat används överallt. Inga komponenter ska
// kalla toLocaleString direkt – då blir formatet inkonsekvent.
// ============================================================

// Centraliserade formaterings-helpers så samma format används överallt i appen.

// Formaterar belopp som svensk valuta. Default SEK om currency saknas.
export function formatCurrency(amount, currency = 'SEK') {
  const n = typeof amount === 'number' ? amount : Number(amount ?? 0)
  return n.toLocaleString('sv-SE', { style: 'currency', currency: currency || 'SEK' })
}

// Lång datum-formatering, t.ex. "14 mars".
export function formatDate(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('sv-SE', { day: 'numeric', month: 'long' })
}

// Tid HH:MM.
export function formatTime(date) {
  if (!date) return '—'
  return new Date(date).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
}

// Kortets utgångsdatum, t.ex. "03/28".
export function formatCardExpiry(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('sv-SE', { month: '2-digit', year: '2-digit' })
}

// Gruppera transaktioner efter datum med svenska etiketter (Idag/Igår/datum).
export function formatDateGroup(date) {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const d = new Date(date)
  if (d.toDateString() === today.toDateString()) return 'Idag'
  if (d.toDateString() === yesterday.toDateString()) return 'Igår'
  return d.toLocaleDateString('sv-SE', { day: 'numeric', month: 'long' })
}

// Maskar ett kortnummer till "**** **** **** 1234".
export function maskCardNumber(last4) {
  return `**** **** **** ${last4 ?? '????'}`
}
