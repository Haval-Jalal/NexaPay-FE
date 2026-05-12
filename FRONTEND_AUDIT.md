# NexaPay Frontend – Granskningsrapport & Åtgärdsstatus

## Status: Alla punkter åtgärdade ✅

---

## 1. Sidor

| Sida | Status |
|---|---|
| Login | ✅ |
| Register | ✅ |
| ForgotPassword | ✅ |
| ResetPassword | ✅ |
| ConfirmEmail | ✅ |
| Dashboard | ✅ Omskriven med staff-vy, sökning, filter, skeleton |
| AccountDetail | ✅ Omskriven med rollbaserade knappar, inline-fel, ConfirmModal |
| Transfer | ✅ Omskriven med kontonummer-sökning och rollspärr |
| Settings | ✅ |
| Admin | ✅ Utbyggd med användarlista och ta-bort-funktion |

---

## 2. Åtgärdade problem

### 2.1 Personal-dashboard ✅
- Sökfält för kontonamn, kontonummer och ägar-ID
- Visar ägare (OwnerId) på varje kontokort
- Filter på kontostatus (Open / Frozen / Closed)
- Backend: `AccountDto.OwnerId` tillagd

### 2.2 Admin – Användarlista ✅
- Tabell med alla användare: e-post, roll, bekräftad, spärrtid
- Ta bort användare med ConfirmModal
- Backend: `GET /api/admin/users` och `DELETE /api/admin/users/{id}` tillagda

### 3.1 Felaktiga rollkontroller i AccountDetail ✅
Alla knappar visas nu enbart för korrekta roller via `src/utils/roles.js`:
- Sätt in / Ta ut: `canWrite && status === 'Open'`
- Frys: `canFreeze && status === 'Open'`
- Avfrys: `canFreeze && status === 'Frozen'`
- Stäng konto: `canDel && status !== 'Closed'`
- Blockera kort: `canBlock && card.status === 'Active'`
- Avblockera kort: `canBlock && card.status === 'Blocked'`
- Aktivera kort: `canWrite && card.status === 'Inactive'`

### 3.2 Navigering – Överföring för Teller/Auditor ✅
`Layout.jsx` döljer "Överföring" via `can.transfer(role)`.

### 3.3 Transfer-sidan åtkomst ✅
`Transfer.jsx` visar ett tydligt behörighetsmeddelande om rollen inte får överföra.

### 5.1 alert() ersatt ✅
Alla `alert()` i AccountDetail ersatta med inline `actionError`-state.

### 5.2 Transfer kräver GUID ✅
- Användaren skriver kontonummer (t.ex. `SE1234567890`)
- Frontend debouncar och anropar `GET /api/accounts/lookup?number=...`
- Visar mottagarens kontonamn som grön bekräftelse innan man skickar
- Backend: ny `LookupAccountByNumberQuery` + handler + controller-endpoint

### 5.3 confirm() ersatt ✅
`ConfirmModal`-komponent skapad och används i AccountDetail och Admin.

### 5.4 Loading-skeletons ✅
Skeleton-laddning tillagd i Dashboard och AccountDetail.

---

## 3. Buggfixar utanför ursprunglig audit

| Bugg | Fix |
|---|---|
| 400 vid skapa konto | `JsonStringEnumConverter` tillagd – backend accepterar nu `"Checking"` istället för `0` |
| Vit sida / modul-cache | Vite konfigurerad med `no-store` headers + `optimizeDeps.force: true` |
| CORS / Failed to fetch | `UseCors` flyttad före `UseHttpsRedirection` |
| Tom 401/429 body | `JsonStringEnumConverter`, JWT `OnChallenge` och rate-limiter `OnRejected` returnerar JSON |
| ConfirmEmail kraschar (StrictMode) | `useRef`-guard + idempotent backend |

---

## 4. Nya filer

| Fil | Beskrivning |
|---|---|
| `src/utils/roles.js` | Centrala `can.*`-behörighetsfunktioner |
| `src/components/ConfirmModal.jsx` | Ersätter webbläsarens `confirm()` |
| `NexaPay.Application/.../LookupAccountByNumberQuery.cs` | Query för kontonummer-sökning |
| `NexaPay.Application/.../LookupAccountByNumberHandler.cs` | Handler för kontonummer-sökning |
