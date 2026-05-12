# NexaPay Frontend – Granskningsrapport & Åtgärdsstatus

## Status: Komplett ✅
**Täckning: 23/23 backend-endpoints · Alla roller korrekt · Alla routes skyddade**

---

## 1. Backend-endpoints vs frontend

### Auth (`/api/auth`)
| Endpoint | Frontend-funktion | Sida | Status |
|---|---|---|---|
| POST /register | `auth.register()` | Register.jsx | ✅ |
| POST /login | `auth.login()` | Login.jsx | ✅ |
| POST /confirm-email | `auth.confirmEmail()` | ConfirmEmail.jsx | ✅ |
| POST /forgot-password | `auth.forgotPassword()` | ForgotPassword.jsx | ✅ |
| POST /reset-password | `auth.resetPassword()` | ResetPassword.jsx | ✅ |
| POST /change-password | `auth.changePassword()` | Settings.jsx | ✅ |
| GET /me | `auth.getMe()` | AuthContext (auto-sync vid start) | ✅ |
| POST /logout | `auth.logout()` | Layout.jsx | ✅ |

### Konton (`/api/accounts`)
| Endpoint | Frontend-funktion | Sida | Status |
|---|---|---|---|
| GET / | `accounts.getAccounts()` | Dashboard.jsx, Transfer.jsx | ✅ |
| GET /{id} | `accounts.getAccount()` | AccountDetail.jsx | ✅ |
| GET /lookup?number= | `accounts.lookupAccount()` | Transfer.jsx | ✅ |
| POST / | `accounts.createAccount()` | Dashboard.jsx | ✅ |
| PUT /{id}/freeze | `accounts.freezeAccount()` | AccountDetail.jsx | ✅ |
| PUT /{id}/unfreeze | `accounts.unfreezeAccount()` | AccountDetail.jsx | ✅ |
| DELETE /{id} | `accounts.deleteAccount()` | AccountDetail.jsx | ✅ |

### Transaktioner (`/api/transactions`)
| Endpoint | Frontend-funktion | Sida | Status |
|---|---|---|---|
| GET /account/{id} | `transactions.getTransactions()` | AccountDetail.jsx | ✅ |
| POST /deposit | `transactions.deposit()` | AccountDetail.jsx | ✅ |
| POST /withdraw | `transactions.withdraw()` | AccountDetail.jsx | ✅ |
| POST /transfer | `transactions.transfer()` | Transfer.jsx | ✅ |

### Kort (`/api/cards`)
| Endpoint | Frontend-funktion | Sida | Status |
|---|---|---|---|
| GET /account/{id} | `cards.getCardsByAccount()` | AccountDetail.jsx | ✅ |
| POST / | `cards.createCard()` | AccountDetail.jsx | ✅ |
| PUT /{id}/activate | `cards.activateCard()` | AccountDetail.jsx | ✅ |
| PUT /{id}/block | `cards.blockCard()` | AccountDetail.jsx | ✅ |
| PUT /{id}/unblock | `cards.unblockCard()` | AccountDetail.jsx | ✅ |

### Admin (`/api/admin`)
| Endpoint | Frontend-funktion | Sida | Status |
|---|---|---|---|
| POST /users | `admin.adminCreateUser()` | Admin.jsx | ✅ |
| GET /users | `admin.listUsers()` | Admin.jsx | ✅ |
| DELETE /users/{id} | `admin.deleteUser()` | Admin.jsx | ✅ |

---

## 2. Rollkontroller – frontend vs backend

| `can.*` | Roller | Backend (`Roles.cs`) | Match |
|---|---|---|---|
| `blockCard` | Admin, BankManager | CanBlockCard | ✅ |
| `freezeAccount` | Admin, BankManager, Teller | CanWriteAccounts | ✅ |
| `write` | Admin, BankManager, Teller, User | CanWrite | ✅ |
| `delete` | Admin, BankManager, User | CanDelete | ✅ |
| `transfer` | Admin, BankManager, User | CanTransfer | ✅ |
| `isStaff` | Admin, BankManager, Teller, Auditor | (UI-logik) | ✅ |

---

## 3. Route-skydd

| Route | Inloggad krävs | Rollkrav | Status |
|---|---|---|---|
| /dashboard | ✅ ProtectedRoute | — | ✅ |
| /accounts/:id | ✅ ProtectedRoute | — | ✅ |
| /transfer | ✅ ProtectedRoute | `can.transfer()` i sidan | ✅ |
| /settings | ✅ ProtectedRoute | — | ✅ |
| /admin | ✅ ProtectedRoute | ✅ AdminRoute: role === 'Admin' | ✅ |

---

## 4. Alla genomförda åtgärder

### Runda 1 – Ursprunglig frontend-audit
- ✅ Rollkontroller i AccountDetail (rätt knappar per roll)
- ✅ Överföring dold i nav för Teller/Auditor
- ✅ Transfer-sidan visar behörighetsmeddelande för fel roller
- ✅ Personal-dashboard: sökning, ägar-ID, statusfilter, skeleton-loader
- ✅ Admin: användarlista med ta-bort och ConfirmModal
- ✅ `alert()` ersatt med inline-felmeddelanden
- ✅ `confirm()` ersatt med ConfirmModal
- ✅ Loading-skeletons (Dashboard, AccountDetail)
- ✅ Transfer: sök på kontonummer med live-feedback

### Runda 2 – Feature parity
- ✅ `GET /api/auth/me` anropas vid app-start, synkar roll och e-post
- ✅ Oanvänd `transfer`-import borttagen från AccountDetail

### Runda 3 – Säkerhet och kvalitet
- ✅ Admin-route rollskyddad: `AdminRoute` omdirigerar icke-admins till /dashboard
- ✅ Idempotency-Key header på deposit, withdraw och transfer

### Runda 4 – Finslipning (senaste)
- ✅ AuthContext: striktare null-check på `getMe`-svar (kräver email + role)
- ✅ Admin.jsx: lösenordstips tillagd (min 8 tecken, stor bokstav, siffra, specialtecken)
- ✅ Transfer lookup: skiljer på "konto hittades inte" (404) vs serverfel

---

## 5. Buggfixar utanför audit

| Bugg | Fix |
|---|---|
| 400 vid skapa konto | `JsonStringEnumConverter` — backend accepterar `"Checking"` etc. |
| Vit sida / modul-cache | Vite `transformIndexHtml` lägger till `?t=timestamp` på entry-URL |
| CORS / Failed to fetch | `UseCors` flyttad före `UseHttpsRedirection` |
| Tom 401/429 body | JWT `OnChallenge` + rate-limiter `OnRejected` returnerar JSON |
| ConfirmEmail kraschar | `useRef`-guard (React StrictMode) + idempotent backend |
| Valideringsfel på insättning | Beskrivningsfält ändrat till `required` |

---

## 6. Nya filer (branch: feature/frontend-improvements)

| Fil | Beskrivning |
|---|---|
| `src/utils/roles.js` | Centrala `can.*`-behörighetsfunktioner |
| `src/components/ConfirmModal.jsx` | Ersätter webbläsarens `confirm()` |
| `NexaPay.Application/.../LookupAccountByNumberQuery.cs` | Query för kontonummer-sökning |
| `NexaPay.Application/.../LookupAccountByNumberHandler.cs` | Handler för kontonummer-sökning |
