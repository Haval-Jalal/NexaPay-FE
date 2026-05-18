// ============================================================
// helpers/validators.js – klientvalidatorer (speglar backend)
// ============================================================
// Backend är den auktoritativa valideringen, men UI vill ge snabb
// feedback (röda fält, disablade submit-knappar) utan att slå mot
// servern. Reglerna här MÅSTE matcha backend (FluentValidation,
// OcrPolicy och Identity-lösenordskraven) – annars säger UI:t att
// allt ser bra ut men servern returnerar 400.
// ============================================================

// Klient-validatorer som speglar reglerna i backend (FluentValidation + policies).
// Används för snabb feedback i formulär innan request skickas.

// Mod-10 (Luhn). Speglar OcrPolicy i backend.
export function isValidOcr(ocr) {
  const v = (ocr ?? '').trim()
  if (!/^\d{2,25}$/.test(v)) return false
  let sum = 0
  let doubleNext = false
  for (let i = v.length - 1; i >= 0; i--) {
    let n = v.charCodeAt(i) - 48
    if (doubleNext) {
      n *= 2
      if (n > 9) n -= 9
    }
    sum += n
    doubleNext = !doubleNext
  }
  return sum % 10 === 0
}

// Enkel e-postvalidering – inte komplett RFC 5322, men fångar de vanligaste felen.
export function isValidEmail(email) {
  const v = (email ?? '').trim()
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

// Speglar Identity-konfigurationen: 8+ tecken, gemen, versal, siffra, specialtecken.
export function isStrongPassword(password) {
  const v = password ?? ''
  if (v.length < 8) return false
  if (!/[a-z]/.test(v)) return false
  if (!/[A-Z]/.test(v)) return false
  if (!/[0-9]/.test(v)) return false
  if (!/[^A-Za-z0-9]/.test(v)) return false
  return true
}

// Returnerar ett användarvänligt felmeddelande för svaga lösenord, eller null om OK.
export function passwordStrengthError(password) {
  const v = password ?? ''
  if (v.length < 8) return 'Lösenordet måste vara minst 8 tecken.'
  if (!/[a-z]/.test(v)) return 'Lösenordet måste innehålla en gemen.'
  if (!/[A-Z]/.test(v)) return 'Lösenordet måste innehålla en versal.'
  if (!/[0-9]/.test(v)) return 'Lösenordet måste innehålla en siffra.'
  if (!/[^A-Za-z0-9]/.test(v)) return 'Lösenordet måste innehålla ett specialtecken.'
  return null
}

// Belopp > 0 och numeriskt.
export function isPositiveAmount(value) {
  const n = Number(value)
  return Number.isFinite(n) && n > 0
}

// Kontonummer – minst 4 siffror (lookup är snäll, backend slår mot regex).
export function isPlausibleAccountNumber(value) {
  return /^\d{4,}$/.test((value ?? '').trim())
}
