// ============================================================
// helpers/labels.js – enum → svenska etiketter + Tailwind-färger
// ============================================================
// Backend skickar enum-namn ("Open", "Checking", "Deposit") och
// frontend översätter till svenska + färgkodning här. Genom att
// hålla mappningarna centralt blir det enkelt att uppdatera språk
// eller färgschema utan att leta i komponenterna.
// ============================================================

// Översättning från backend-enum-värden till svenska etiketter och Tailwind-klasser.
// Hålls centralt så samma värden används på Dashboard, AccountDetail, etc.

// Kontotyper
export const ACCOUNT_TYPE_LABELS = {
  Checking: 'Lönekonto',
  Savings: 'Sparkonto',
  ISK: 'ISK',
}

export const ACCOUNT_TYPE_BAR = {
  Checking: 'bg-green-500',
  Savings: 'bg-blue-500',
  ISK: 'bg-purple-500',
}

// Kontostatus
export const ACCOUNT_STATUS_LABELS = {
  Open: 'Öppen',
  Frozen: 'Fryst',
  Closed: 'Stängd',
}

export const ACCOUNT_STATUS_COLORS = {
  Open: 'text-green-400',
  Frozen: 'text-blue-400',
  Closed: 'text-red-400',
}

// Kortstatus
export const CARD_STATUS_LABELS = {
  Active: 'Aktiv',
  Inactive: 'Inaktiv',
  Blocked: 'Blockerad',
  Expired: 'Utgången',
}

export const CARD_STATUS_COLORS = {
  Active: 'text-green-300',
  Inactive: 'text-yellow-300',
  Blocked: 'text-red-300',
  Expired: 'text-gray-400',
}

// Transaktionstyper
export const TX_TYPE_LABELS = {
  All: 'Alla',
  Deposit: 'Insättning',
  Withdrawal: 'Uttag',
  Transfer: 'Överföring',
  InvoicePayment: 'Faktura',
}

export const TX_TYPE_COLORS = {
  Deposit: 'text-green-400',
  Withdrawal: 'text-red-400',
  Transfer: 'text-blue-400',
  InvoicePayment: 'text-red-400',
}

// Generisk uppslagning med fallback till råvärdet.
export function labelOf(map, value) {
  return map?.[value] ?? value ?? '—'
}
