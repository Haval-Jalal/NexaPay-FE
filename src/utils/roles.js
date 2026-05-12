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
  viewAll:       r => ['Admin', 'BankManager', 'Teller', 'Auditor'].includes(r),
}
