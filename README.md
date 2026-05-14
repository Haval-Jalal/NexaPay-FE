# NexaPay – Frontend

React-frontenden för **NexaPay**, ett modernt bank-API byggt med .NET 8 Clean Architecture. Frontenden är en SPA byggd med React 19 + Vite + Tailwind CSS som kommunicerar med backend via Axios och visar konton, kort och transaktioner i ett rollanpassat gränssnitt.

> **Backend-repo:** https://github.com/b1-loop/NexaPay
> **Frontend-repo:** https://github.com/Haval-Jalal/NexaPay-FE

---

## Innehåll

- [Vad NexaPay-FE gör](#vad-nexapay-fe-gör)
- [Tech stack](#tech-stack)
- [Mappstruktur](#mappstruktur)
- [Kom igång](#kom-igång)
- [Miljövariabler](#miljövariabler)
- [Sidor och funktioner](#sidor-och-funktioner)
- [Rollbaserad UI](#rollbaserad-ui)
- [API-kommunikation](#api-kommunikation)
- [Felhantering](#felhantering)
- [Komponenter](#komponenter)
- [Tillgängliga script](#tillgängliga-script)
- [Bygg och deploy](#bygg-och-deploy)

---

## Vad NexaPay-FE gör

NexaPay-FE är klienten som vanliga kunder och bankpersonal använder för att:

- **Registrera sig**, bekräfta e-post, logga in, återställa lösenord och ändra lösenord
- Se en **översikt** över sina bankkonton (saldo, status, kontotyp)
- **Skapa nya konton** (Lönekonto, Sparkonto, ISK)
- Göra **insättningar**, **uttag** och **överföringar** mellan konton
- Betala **fakturor** med bankgiro och OCR-referens
- Hantera **kort**: skapa, aktivera, blockera och avblockera
- **Frysa** och **avfrysa** konton (bankpersonal)
- För **Admin**: skapa personalkonton och hantera användare

Hela UI:t är rollanpassat – Auditor ser bara läsbehörighet, Teller kan inte överföra, User kan bara se sina egna konton, osv.

---

## Tech stack

| Område | Teknik |
|---|---|
| Ramverk | **React 19** |
| Bundler | **Vite 8** |
| HTTP-klient | **Axios** med interceptors |
| Routing | **React Router v7** |
| Styling | **Tailwind CSS 4** |
| Ikoner | **lucide-react** |
| Lint | ESLint 10 + `react-hooks`/`react-refresh` |
| State | React Context (Auth + Toast) + lokal state |

---

## Mappstruktur

```
NexaPay-FE/
├── public/                 – favicon, ikoner
├── src/
│   ├── api/                – Axios-instans + endpoint-funktioner per resurs
│   │   ├── client.js          – Axios-instans, interceptors, token-hämtning
│   │   ├── auth.js            – login, register, forgot/reset/change password, me, logout
│   │   ├── accounts.js        – CRUD + freeze/unfreeze + lookup
│   │   ├── cards.js           – CRUD + activate/block/unblock
│   │   ├── transactions.js    – deposit/withdraw/transfer/pay-invoice + idempotency
│   │   └── admin.js           – admin user management
│   ├── components/         – Återanvändbara UI-komponenter
│   │   ├── Layout.jsx         – Sidebar + topbar (rollanpassad navigation)
│   │   ├── AuthLayout.jsx     – Centrerad layout för login/register/reset
│   │   ├── Modal.jsx          – Generisk modal med titel + stäng-knapp
│   │   ├── ConfirmModal.jsx   – Bekräftelse-dialog (ersätter window.confirm)
│   │   └── ProtectedRoute.jsx – Redirectar oinloggade till /login
│   ├── context/            – React Context för app-state
│   │   ├── AuthContext.jsx    – Inloggad användare + saveUser/logout
│   │   ├── useAuth.js         – useAuth() hook + context-skapande
│   │   ├── ToastContext.jsx   – Globalt toast-system
│   │   └── useToast.js        – useToast() hook + context-skapande
│   ├── pages/              – Sidor (routed)
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── ConfirmEmail.jsx
│   │   ├── Dashboard.jsx       – Kontolista
│   │   ├── AccountDetail.jsx   – Saldo, transaktioner, kort, in/uttag
│   │   ├── Transfer.jsx        – Överföring med sök-mottagare
│   │   ├── PayInvoice.jsx      – Fakturabetalning (bankgiro + OCR)
│   │   ├── Settings.jsx        – Profil + lösenordsbyte
│   │   └── Admin.jsx           – Admin-panel (Admin-only)
│   ├── utils/              – Hjälpfunktioner
│   │   └── roles.js           – ROLES-konstanter + can.*-behörighetskontroll
│   ├── App.jsx             – Router-uppsättning
│   ├── main.jsx            – React-rot + global CSS
│   ├── App.css / index.css – Tailwind + globala stilar
│   └── assets/             – Bilder
├── .env.development        – Lokal API-URL
├── .env.production         – Produktions-API-URL
├── eslint.config.js        – ESLint-konfiguration
├── vite.config.js          – Vite-konfiguration
└── package.json
```

---

## Kom igång

### Förutsättningar

- **Node.js 20+** (testat med 20 och 22)
- **npm 10+** (följer med Node)
- **NexaPay-backend igång** – se [backend-repot](https://github.com/b1-loop/NexaPay) för instruktioner. Standard är `http://localhost:5190`.

### Installation

```bash
git clone https://github.com/Haval-Jalal/NexaPay-FE.git
cd NexaPay-FE
npm install
```

### Konfigurera miljövariabler

Kopiera `.env.development` (eller skapa en `.env.local`) och peka mot din backend:

```env
VITE_API_URL=http://localhost:5190
```

### Starta dev-servern

```bash
npm run dev
```

Appen körs på `http://localhost:5173`. HMR (Hot Module Reload) är aktiv.

### Snabbstart – testa hela flödet

1. Starta backend (`dotnet run` i `NexaPay.API`)
2. Starta frontend (`npm run dev`)
3. Gå till `http://localhost:5173`
4. Klicka på **Skapa ett konto** → registrera dig med valfri e-post
5. Bekräfta e-post (länk loggas av backend)
6. Logga in → skapa ett bankkonto → gör en insättning
7. Klart!

För att testa personalflödet: skapa en Admin-användare direkt i SQL och använd sedan `/admin`-sidan för att skapa BankManager/Teller/Auditor-användare (kräver `@nexapay.com`-epost).

---

## Miljövariabler

| Variabel | Beskrivning | Standardvärde |
|---|---|---|
| `VITE_API_URL` | URL till NexaPay-backend | `http://localhost:5190` |

Variabler måste börja med `VITE_` för att vara åtkomliga i klienten (Vite-krav).

---

## Sidor och funktioner

| Route | Sida | Vad användaren gör |
|---|---|---|
| `/login` | Login | Logga in med e-post + lösenord |
| `/register` | Register | Skapa nytt User-konto |
| `/forgot-password` | ForgotPassword | Begär lösenordsåterställning |
| `/reset-password` | ResetPassword | Ange nytt lösenord via mejllänk |
| `/confirm-email` | ConfirmEmail | Bekräfta e-postadress via mejllänk |
| `/dashboard` | Dashboard | Lista bankkonton + skapa nytt konto |
| `/accounts/:id` | AccountDetail | Saldo, transaktioner, kort, in-/uttag, freeze, close |
| `/transfer` | Transfer | Överföring med live-sök på mottagarkontonummer |
| `/pay-invoice` | PayInvoice | Fakturabetalning till bankgiro/plusgiro med OCR |
| `/settings` | Settings | Visa profil + byt lösenord |
| `/admin` | Admin | Skapa personal + lista/ta bort användare (Admin-only) |

Alla skyddade sidor wrappas i `<ProtectedRoute>` som redirectar till `/login` om JWT saknas. `/admin` har ytterligare ett rollkontroll-lager (`<AdminRoute>`).

---

## Rollbaserad UI

Frontenden speglar backend-RBAC och döljer/visar knappar och navigation utifrån användarens roll.

| Roll | Ser alla konton | Skapa | Skriv | Överför | Blockera kort | Admin-panel |
|---|---|---|---|---|---|---|
| **Admin** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **BankManager** | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| **Teller** | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| **Auditor** | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| **User** | bara egna | ✓ | egna | egna | ✗ | ✗ |

Rolllogiken är centraliserad i `src/utils/roles.js`:

```js
import { can } from './utils/roles'

can.write(user.role)        // Skriv-behörighet?
can.transfer(user.role)     // Får överföra?
can.blockCard(user.role)    // Får blockera kort?
can.isStaff(user.role)      // Är bankpersonal?
```

Auditors ser en "Skrivskyddad vy"-badge i sidopanelen.

---

## API-kommunikation

All HTTP-kommunikation går via en central Axios-instans i `src/api/client.js`:

```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Request-interceptor: lägger automatiskt på Bearer-token
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response-interceptor: returnerar response.data direkt + normaliserar fel
api.interceptors.response.use(
  (response) => response.data,
  (error) => { /* skapar Error med .status och .data */ }
)
```

Varje resurs har en egen fil med funktioner som returnerar Promises:

```js
// src/api/accounts.js
import api from './client'

export function getAccounts()          { return api.get('/api/accounts') }
export function getAccount(id)         { return api.get(`/api/accounts/${id}`) }
export function createAccount(name, type, ownerEmail) { return api.post('/api/accounts', { ... }) }
export function freezeAccount(id)      { return api.put(`/api/accounts/${id}/freeze`) }
export function deleteAccount(id)      { return api.delete(`/api/accounts/${id}`) }
```

Idempotency-Key skickas automatiskt på alla financial commands (deposit, withdraw, transfer, pay-invoice) – `crypto.randomUUID()` i `src/api/transactions.js`.

---

## Felhantering

Varje anrop är inkapslat i `try/catch` med inline-felmeddelanden:

```jsx
const [error, setError] = useState('')

async function handleSubmit(e) {
  e.preventDefault()
  setError('')
  setLoading(true)
  try {
    await deposit(accountId, amount, description)
    toast('Insättning genomförd!')
  } catch (e) {
    setError(e.message)        // ← från backend ApiResponse.message
  } finally {
    setLoading(false)
  }
}
```

Fel visas som röda inline-banners ovanför formuläret – inga `alert()`-popups. 401-fel rensar tokenen och redirectar till login (via `AuthContext`).

---

## Komponenter

### Återanvändbara

| Komponent | Användning |
|---|---|
| `Layout` | Sidebar + topbar med rollanpassad navigation – wrappar alla inloggade sidor |
| `AuthLayout` | Centrerad layout för Login/Register/Reset – titel + barn |
| `Modal` | Generisk modal med titel, stäng-knapp och children |
| `ConfirmModal` | Bekräftelse-dialog – ersätter `window.confirm` |
| `ProtectedRoute` | Routes-wrapper som redirectar till `/login` utan JWT |

### Context

| Context | Hook | Innehåll |
|---|---|---|
| `AuthContext` | `useAuth()` | `{ user, saveUser, logout }` – autom. sync via `GET /api/auth/me` vid app-start |
| `ToastContext` | `useToast()` | `toast(message)` – globalt notifierings-system |

---

## Tillgängliga script

```bash
npm run dev       # Starta dev-server på http://localhost:5173
npm run build     # Bygg produktionsversion till dist/
npm run preview   # Preview produktionsbygget lokalt
npm run lint      # Kör ESLint
```

---

## Bygg och deploy

```bash
npm run build
```

Producerar en statisk SPA i `dist/`. Servera med valfri statisk hosting (Vercel, Netlify, Azure Static Web Apps, nginx, etc.).

Sätt rätt `VITE_API_URL` vid build-tid:

```bash
VITE_API_URL=https://api.nexapay.example.com npm run build
```

Eftersom routern är `BrowserRouter` ska hostingen rewrita alla 404 till `/index.html` (Vercel/Netlify gör det automatiskt; för nginx behövs `try_files`).

---

## Bidragsguider för gruppen

- Skapa feature-branch: `feature/<kort-beskrivning>` eller `fix/<kort-beskrivning>`
- Skapa PR mot `master` – minst en granskning krävs
- Använd issues från GitHub Project Board för planering
- Kör `npm run lint` innan PR

---

## Licens

Skoluppgift – inte avsedd för produktionsbruk.
