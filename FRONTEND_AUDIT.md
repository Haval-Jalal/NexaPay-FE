# NexaPay Frontend – Granskningsrapport & Åtgärdsstatus

## Status: Alla punkter åtgärdade ✅
**Täckning: 23/23 backend-endpoints (100%)**

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
| GET /me | `auth.getMe()` | AuthContext.jsx (auto-sync vid start) | ✅ |
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

| `can.*` | Frontend | Backend (`Roles.cs`) | Match |
|---|---|---|---|
| `blockCard` | Admin, BankManager | Admin, BankManager | ✅ |
| `freezeAccount` | Admin, BankManager, Teller | Admin, BankManager, Teller | ✅ |
| `write` | Admin, BankManager, Teller, User | Admin, BankManager, Teller, User | ✅ |
| `delete` | Admin, BankManager, User | Admin, BankManager, User | ✅ |
| `transfer` | Admin, BankManager, User | Admin, BankManager, User | ✅ |
| `isStaff` | Admin, BankManager, Teller, Auditor | — (används för UI-logik) | ✅ |

---

## 3. Route-skydd

| Route | Skyddad | Rollkontroll | Status |
|---|---|---|---|
| /dashboard | ✅ ProtectedRoute | — | ✅ |
| /accounts/:id | ✅ ProtectedRoute | — | ✅ |
| /transfer | ✅ ProtectedRoute | `can.transfer()` i sidan | ✅ |
| /settings | ✅ ProtectedRoute | — | ✅ |
| /admin | ✅ ProtectedRoute | ✅ AdminRoute (role === 'Admin') | ✅ |

---

## 4. Alla åtgärdade punkter (kronologisk ordning)

### Ursprunglig frontend-audit
- ✅ Rollkontroller i AccountDetail — rätt knappar per roll
- ✅ Överföring dold i nav för Teller/Auditor
- ✅ Transfer-sidan visar "otillräcklig behörighet" för fel roller
- ✅ Personal-dashboard med sökning, ägar-ID, statusfilter
- ✅ Admin: användarlista med ta-bort och bekräftelsedialog
- ✅ `alert()` ersatt med inline-felmeddelanden
- ✅ `confirm()` ersatt med ConfirmModal
- ✅ Loading-skeletons i Dashboard och AccountDetail
- ✅ Transfer: sök på kontonummer (live lookup) istället för GUID

### Feature parity-gaps (audit runda 2)
- ✅ `GET /api/auth/me` — anropas vid app-start i AuthContext för att synka roll
- ✅ Oanvänd `transfer`-import borttagen från AccountDetail

### Säkerhets- och kvalitetsfixar (audit runda 3)
- ✅ Admin-route rollskyddad: `AdminRoute`-komponent i App.jsx omdirigerar icke-admins
- ✅ Idempotency-Key header tillagd på deposit, withdraw och transfer

---

## 5. Buggfixar utanför audit

| Bugg | Fix |
|---|---|
| 400 vid skapa konto | `JsonStringEnumConverter` — backend accepterar `"Checking"` |
| Vit sida / modul-cache | Vite `transformIndexHtml` lägger till `?t=timestamp` på entry point |
| CORS / Failed to fetch | `UseCors` flyttad före `UseHttpsRedirection` |
| Tom 401/429 body | JWT `OnChallenge` och rate-limiter `OnRejected` returnerar JSON |
| ConfirmEmail kraschar (StrictMode) | `useRef`-guard + idempotent backend |
| Valideringsfel på insättning | Beskrivningsfält ändrat till `required` |

---

## 6. Nya filer

| Fil | Beskrivning |
|---|---|
| `src/utils/roles.js` | Centrala `can.*`-behörighetsfunktioner |
| `src/components/ConfirmModal.jsx` | Ersätter webbläsarens `confirm()` |
| `NexaPay.Application/.../LookupAccountByNumberQuery.cs` | Query för kontonummer-sökning |
| `NexaPay.Application/.../LookupAccountByNumberHandler.cs` | Handler för kontonummer-sökning |
