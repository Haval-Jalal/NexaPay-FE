// ============================================================
// utils/roles.js – frontend-spegling av backend-RBAC
// ============================================================
// Backend gör den autoritativa kontrollen – men UI behöver veta
// vilka knappar/sidor som ska visas/döljas för respektive roll.
// `can.*`-funktionerna håller all rollogik på ETT ställe så att
// vi inte duplicerar listor i komponenterna.
//
// Tabellen MÅSTE matcha NexaPay.Application.Common.Constants.Roles
// och de [Authorize(Roles=…)]-attribut som finns på controllers.
// ============================================================

// Rollkonstanter och hjälpfunktioner för behörighetskontroll i UI
export const ROLES = {
  Admin:       'Admin',
  BankManager: 'BankManager',
  Teller:      'Teller',
  Auditor:     'Auditor',
  User:        'User',
}

export const can = {
  blockCard:     r => ['Admin', 'BankManager'].includes(r),
  freezeAccount: r => ['Admin', 'BankManager', 'Teller'].includes(r),
  write:         r => ['Admin', 'BankManager', 'Teller', 'User'].includes(r),
  delete:        r => ['Admin', 'BankManager', 'User'].includes(r),
  transfer:      r => ['Admin', 'BankManager', 'User'].includes(r),
  isStaff:       r => ['Admin', 'BankManager', 'Teller', 'Auditor'].includes(r),
}
