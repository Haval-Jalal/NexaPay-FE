# NexaPay – Frontend (React 19 + Vite + Tailwind)

React-klienten för **NexaPay**, ett modernt bank-API byggt med .NET 8 Clean Architecture. Frontenden är en SPA byggd med React 19, Vite, Tailwind CSS och kommunicerar med backend via Axios. UI:t är rollanpassat – kunder och fyra olika personalroller (Admin, BankManager, Teller, Auditor) ser olika delar av appen.

> **Frontend-repo:** https://github.com/Haval-Jalal/NexaPay-FE
> **Backend-repo:** https://github.com/b1-loop/NexaPay

---

## Innehåll

- [Vad NexaPay-FE gör](#vad-nexapay-fe-gör)
- [Snabbstart](#snabbstart)
- [Tech stack](#tech-stack)
- [Mappstruktur](#mappstruktur)
- [Förutsättningar](#förutsättningar)
- [Installation](#installation)
- [Miljövariabler](#miljövariabler)
- [Tillgängliga script](#tillgängliga-script)
- [Sidor och routes](#sidor-och-routes)
- [Rollbaserad UI](#rollbaserad-ui)
- [API-kommunikation](#api-kommunikation)
- [Custom hooks](#custom-hooks)
- [Helpers](#helpers)
- [Återanvändbara komponenter](#återanvändbara-komponenter)
- [Context och state](#context-och-state)
- [Felhantering](#felhantering)
- [Stilar och tema](#stilar-och-tema)
- [Bygg och deploy](#bygg-och-deploy)
- [Felsökning](#felsökning)
- [Bidra till projektet](#bidra-till-projektet)
- [Licens och författare](#licens-och-författare)

---

## Vad NexaPay-FE gör

NexaPay-FE är klienten som kunder och bankpersonal använder för att:

- **Registrera sig**, bekräfta e-post, logga in, återställa och ändra lösenord.
- Se en **översikt** över bankkonton (saldo, status, kontotyp) – med sök och filter.
- **Skapa nya konton** (Lönekonto, Sparkonto, ISK) – personal kan skapa åt kunder.
- Göra **insättningar**, **uttag** och **överföringar** mellan konton.
- Betala **fakturor** med bankgiro + mod-10-validerat OCR.
- Hantera **kort**: skapa, aktivera, blockera, avblockera.
- **Frysa** och **avfrysa** konton (bankpersonal).
- **Admin-panel**: skapa personal- och kundkonton, lista och radera användare.

Hela UI:t är rollanpassat – Auditor ser bara skrivskyddade vyer, Teller kan hjälpa kunder men inte överföra, User ser bara sina egna konton, osv.

---

## Snabbstart

```bash
# 1. Klona
git clone https://github.com/Haval-Jalal/NexaPay-FE.git
cd NexaPay-FE

# 2. Installera paket
npm install

# 3. Kopiera env-mall + sätt API-URL (default fungerar för lokal backend)
cp .env.example .env.development

# 4. Starta dev-servern (kräver att backend körs)
npm run dev

# 5. Öppna http://localhost:5173 och logga in med en seedad användare
#    admin@nexapay.com / NexaPay1!
```

---

## Tech stack

| Område | Teknik | Version |
|---|---|---|
| Ramverk | **React** | 19 |
| Bundler | **Vite** | 8 |
| HTTP-klient | **Axios** | 1.16+ (med interceptors) |
| Routing | **React Router** | v7 |
| Styling | **Tailwind CSS** | 4 |
| Ikoner | **lucide-react** | — |
| Lint | **ESLint 10** + react-hooks + react-refresh | — |
| State | React Context (Auth + Toast) + lokal `useState` | — |
| Node | **Node 20+** rekommenderas | — |

Inga state-management-bibliotek (Redux/Zustand) används – Context räcker för appens storlek.

---

## Mappstruktur

```
NexaPay-FE/
├── public/                       Statiska filer (favicon, ikoner)
├── src/
│   ├── api/                      Axios-instans + endpoint-funktioner per resurs
│   │   ├── client.js             Axios-instans, JWT-interceptor, felnormalisering
│   │   ├── auth.js               login, register, forgot/reset/change/confirm password, me, logout
│   │   ├── accounts.js           CRUD + freeze/unfreeze + lookup
│   │   ├── cards.js              CRUD + activate/block/unblock
│   │   ├── transactions.js       deposit/withdraw/transfer/pay-invoice + idempotency-headers
│   │   └── admin.js              Admin-only user management
│   ├── components/               Återanvändbara UI-komponenter
│   │   ├── Layout.jsx            Sidebar + topbar med rollanpassad navigation
│   │   ├── AuthLayout.jsx        Centrerad layout för login/register/reset
│   │   ├── Modal.jsx             Generisk modal med titel + stäng-knapp
│   │   ├── ConfirmModal.jsx      Bekräftelsedialog (ersätter window.confirm)
│   │   └── ProtectedRoute.jsx    Wrapper som redirectar oinloggade
│   ├── context/                  Globala React contexts
│   │   ├── AuthContext.jsx       Inloggad user + saveUser + logout
│   │   ├── useAuth.js            useAuth() hook + context-skapande
│   │   ├── ToastContext.jsx      Globalt toast-notifikationssystem
│   │   └── useToast.js           useToast() hook + context-skapande
│   ├── helpers/                  Återanvändbar affärslogik utanför komponenter
│   │   ├── format.js             formatCurrency, formatDate, formatTime, maskCardNumber...
│   │   ├── labels.js             Enum → svensk etikett + Tailwind-färg
│   │   └── validators.js         isValidOcr (Luhn), isValidEmail, isStrongPassword...
│   ├── hooks/                    Egna React-hooks
│   │   ├── useFetch.js           Generisk GET-hook (data/loading/error/refetch)
│   │   ├── useAccounts.js        Hämtar konton + filtrering på status
│   │   └── useDebouncedValue.js  Fördröjt värde för live-sök
│   ├── pages/                    Sidor (en per route)
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── ConfirmEmail.jsx
│   │   ├── Dashboard.jsx          Kontolista, sök, filter, skapa-modal
│   │   ├── AccountDetail.jsx      Saldo, transaktioner, kort, in-/uttag, frys, stäng
│   │   ├── Transfer.jsx           Överföring med live-sök på kontonummer
│   │   ├── PayInvoice.jsx         Fakturabetalning (bankgiro + OCR mod-10)
│   │   ├── Settings.jsx           Profil + lösenordsbyte
│   │   └── Admin.jsx              Admin-panel (Admin-only)
│   ├── utils/
│   │   └── roles.js               ROLES-konstanter + can.*-behörighetskontroll
│   ├── App.jsx                    Router + providers
│   ├── main.jsx                   React-rot
│   ├── App.css / index.css        Tailwind + globala stilar
│   └── assets/                    Bilder
├── .env.development              Lokal API-URL
├── .env.production               Produktions-API-URL
├── .env.example                  Mall – kopiera till .env.local
├── eslint.config.js              ESLint-konfiguration
├── vite.config.js                Vite-konfiguration (Tailwind plugin)
├── index.html                    Vite entry-HTML
└── package.json
```

---

## Förutsättningar

- **Node.js 20+** (testat med 20 och 22)
- **npm 10+** (följer med Node)
- **NexaPay-backend igång** på `http://localhost:5190` – se [backend-repot](https://github.com/b1-loop/NexaPay)

---

## Installation

```bash
git clone https://github.com/Haval-Jalal/NexaPay-FE.git
cd NexaPay-FE
npm install
```

### Konfigurera miljövariabler

Kopiera `.env.example` till `.env.development` (eller `.env.local`) och anpassa:

```env
VITE_API_URL=http://localhost:5190
```

Variabler MÅSTE börja med `VITE_` för att exponeras i klientkoden (Vite-krav).

### Starta dev-servern

```bash
npm run dev
```

Appen körs på `http://localhost:5173` med HMR (Hot Module Reload).

### Snabbstart – testa hela flödet

1. Starta backend (`cd ../NexaPay/NexaPay.API && dotnet run`).
2. Starta frontend (`npm run dev`).
3. Öppna `http://localhost:5173`.
4. Logga in med en seedad användare (lösenord `NexaPay1!`):
   - `admin@nexapay.com` → Admin
   - `bankmanager@nexapay.com` → BankManager
   - `teller@nexapay.com` → Teller
   - `auditor@nexapay.com` → Auditor
   - `user@test.com` → vanlig User
5. Skapa ett konto → gör en insättning → se transaktion i historiken.
6. Logga ut → registrera ett nytt User-konto från `/register` (kräver bekräftelse via mejl, om SMTP konfigurerats).

---

## Miljövariabler

| Variabel | Beskrivning | Default |
|---|---|---|
| `VITE_API_URL` | URL till NexaPay-backend | `http://localhost:5190` |

Två env-filer används:

- `.env.development` – läses automatiskt av `npm run dev`.
- `.env.production` – läses automatiskt av `npm run build`.

För lokala overrides (inte committas), använd `.env.local`.

---

## Tillgängliga script

| Kommando | Beskrivning |
|---|---|
| `npm run dev` | Startar dev-server på `http://localhost:5173` med HMR |
| `npm run build` | Bygger produktionsversion till `dist/` |
| `npm run preview` | Förhandsgranskar produktionsbygget lokalt |
| `npm run lint` | Kör ESLint med projektets regler |

---

## Sidor och routes

| Route | Sida | Skydd | Beskrivning |
|---|---|---|---|
| `/` | – | – | Redirect till `/login` |
| `/login` | `Login.jsx` | – | Logga in med e-post + lösenord |
| `/register` | `Register.jsx` | – | Skapa nytt User-konto (med lösenordsstyrka-mätare) |
| `/forgot-password` | `ForgotPassword.jsx` | – | Begär lösenordsåterställning |
| `/reset-password` | `ResetPassword.jsx` | – | Sätt nytt lösenord via mejllänk |
| `/confirm-email` | `ConfirmEmail.jsx` | – | Bekräfta e-postadress via mejllänk |
| `/dashboard` | `Dashboard.jsx` | Bearer | Kontolista, sök, filter, skapa konto |
| `/accounts/:id` | `AccountDetail.jsx` | Bearer | Saldo, transaktioner, kort, in/uttag, frys, stäng |
| `/transfer` | `Transfer.jsx` | Bearer | Överföring med live-sök på kontonummer |
| `/pay-invoice` | `PayInvoice.jsx` | Bearer | Fakturabetalning (bankgiro + OCR) |
| `/settings` | `Settings.jsx` | Bearer | Profil + lösenordsbyte |
| `/admin` | `Admin.jsx` | Bearer + Admin | Hantera användare (Admin-only) |

Skyddade routes wrappas i `<ProtectedRoute>` som redirectar till `/login` om JWT saknas. `/admin` har ytterligare en `<AdminRoute>` som kollar rollen.

---

## Rollbaserad UI

Frontenden speglar backend-RBAC och döljer/visar knappar och navigation utifrån användarens roll.

| Roll | Ser alla konton | Skapa konto | Skriv | Överför | Blockera kort | Admin-panel |
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
can.delete(user.role)       // Får stänga konto?
can.isStaff(user.role)      // Är bankpersonal?
```

Auditors ser en "Skrivskyddad vy"-indikator i sidopanelen.

---

## API-kommunikation

All HTTP-kommunikation går via en central Axios-instans i `src/api/client.js`:

```js
import axios from 'axios'

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

// Response-interceptor: returnerar response.data + normaliserar fel
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status
    const message = error.response?.data?.message ?? error.message
    const normalized = new Error(message)
    normalized.status = status
    normalized.data = error.response?.data
    return Promise.reject(normalized)
  }
)
```

Varje resurs har en egen fil med tunna funktioner:

```js
// src/api/accounts.js
export function getAccounts()                                        { return api.get('/api/accounts') }
export function getAccount(id)                                       { return api.get(`/api/accounts/${id}`) }
export function createAccount(accountName, accountType, ownerEmail)  { return api.post('/api/accounts', { ... }) }
export function freezeAccount(id)                                    { return api.put(`/api/accounts/${id}/freeze`) }
export function deleteAccount(id)                                    { return api.delete(`/api/accounts/${id}`) }
```

### Idempotency

Alla muterande financial commands skickar automatiskt en `Idempotency-Key` header med en UUID:

```js
// src/api/transactions.js
const idempotencyHeader = () => ({ 'Idempotency-Key': crypto.randomUUID() })

export function deposit(accountId, amount, description) {
  return api.post(
    '/api/transactions/deposit',
    { accountId, amount, description },
    { headers: idempotencyHeader() }
  )
}
```

Detta skyddar mot dubbla transaktioner om användaren klickar två gånger eller nätet behöver retry:a.

---

## Custom hooks

Tre egna hooks som inkapslar återkommande mönster (ersätter duplicerad fetch+state-kod i sidorna):

| Hook | Användning |
|---|---|
| `useFetch(fetchFn, deps)` | Generisk GET-hook med data/loading/error/refetch. Hanterar stale-state via en lokal `active`-flagga. |
| `useAccounts({ onlyOpen })` | Wrapper runt `useFetch(getAccounts)`. `onlyOpen = true` filtrerar bort frysta/stängda. |
| `useDebouncedValue(value, delay)` | Returnerar `value` fördröjt – används av Transfer-sidans live-sök. |

Exempel:

```jsx
function Dashboard() {
  const { accounts, loading, error, refetch } = useAccounts()
  // ...
}

function Transfer() {
  const { accounts } = useAccounts({ onlyOpen: true })
  const [search, setSearch] = useState('')
  const debounced = useDebouncedValue(search, 400)

  useEffect(() => {
    if (debounced.length >= 4) lookupAccount(debounced)
  }, [debounced])
}
```

---

## Helpers

Återanvändbar logik utan UI – funktioner som inte hör hemma i komponenter:

| Fil | Funktioner |
|---|---|
| `format.js` | `formatCurrency`, `formatDate`, `formatTime`, `formatCardExpiry`, `formatDateGroup`, `maskCardNumber` |
| `labels.js` | `ACCOUNT_TYPE_LABELS`, `ACCOUNT_STATUS_LABELS`, `CARD_STATUS_LABELS`, `TX_TYPE_LABELS` + färg-mappar + `labelOf()` |
| `validators.js` | `isValidOcr` (mod-10/Luhn), `isValidEmail`, `isStrongPassword`, `passwordStrengthError`, `isPositiveAmount`, `isPlausibleAccountNumber` |

Klient-validatorerna **speglar** backend-reglerna (FluentValidation + OcrPolicy). Backend är auktoritativ, men UI:t använder dem för snabb inline-feedback.

---

## Återanvändbara komponenter

| Komponent | Användning |
|---|---|
| `Layout` | Sidebar + topbar med rollanpassad navigation – wrappar alla inloggade sidor |
| `AuthLayout` | Centrerad layout för Login/Register/Reset – titel + barn |
| `Modal` | Generisk modal med titel, stäng-knapp och children |
| `ConfirmModal` | Bekräftelsedialog – ersätter `window.confirm` |
| `ProtectedRoute` | Routes-wrapper som redirectar till `/login` utan JWT |

---

## Context och state

| Context | Hook | Innehåll |
|---|---|---|
| `AuthContext` | `useAuth()` | `{ user, saveUser, logout }` – autom. sync via `GET /api/auth/me` vid app-start |
| `ToastContext` | `useToast()` | `toast(message, type)` – globalt notifierings-system |

Användardata persisteras i `localStorage` under nyckeln `nexapay_user` så att sidan kan refreshas utan att tappa inloggningen. Vid app-start synkas roll och e-post från backend ifall användaren ändrats.

---

## Felhantering

Varje anrop wrappas i `try/catch` med inline-felmeddelanden:

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

- Fel visas som röda inline-banners ovanför formulär – **inga** `alert()`-popups.
- 401-fel (utgången/ogiltig token) loggar ut användaren och redirectar till `/login` via `AuthContext`.
- 429-fel (rate limit) visar ett vänligt meddelande "Försök igen om en stund".
- Nätverksfel hanteras av axios response-interceptorn och normaliseras till `Error` med `.status` och `.message`.

---

## Stilar och tema

NexaPay-FE använder **Tailwind CSS 4** med ett mörkt tema:

- Bakgrund: `bg-gray-950` / `bg-gray-900`
- Primärfärg: `indigo-600` (knappar, accenter)
- Status-färger: grön (Open), blå (Frozen), röd (Closed/Blocked), gul (Inactive)
- Inga animeringar förutom `animate-fade-in` (för toast-notifikationer och dialogrutor)
- Responsiv via Tailwinds breakpoints (`sm:`, `md:`, `lg:`)
- Mobil sidebar med hamburgermeny

---

## Bygg och deploy

```bash
npm run build
```

Producerar en statisk SPA i `dist/`. Servera med valfri statisk hosting:

- **Vercel / Netlify / Azure Static Web Apps**: SPA-routing fungerar automatiskt
- **nginx**: behövs `try_files $uri /index.html` för att React Router ska fungera

Sätt rätt `VITE_API_URL` vid build-tid:

```bash
VITE_API_URL=https://api.nexapay.example.com npm run build
```

Bundle-storlek (aktuellt): ~346 kB JS / ~105 kB gzipped, ~31 kB CSS / ~6 kB gzipped.

---

## Felsökning

| Problem | Lösning |
|---|---|
| `Network Error` / CORS-fel | Kolla att backend är igång på `VITE_API_URL`. Verifiera att frontend-origin finns i backend `Cors:AllowedOrigins`. |
| `401 Unauthorized` direkt vid login | Kontrollera att Identity är seedad. För dev: `admin@nexapay.com` / `NexaPay1!` ska fungera. |
| `429 Too Many Requests` | Du har slagit i rate limit. I `appsettings.Development.json` är gränserna 100/1000 per minut – om du fortfarande träffar, sätt ännu högre värden. |
| `E-postadressen är inte bekräftad` | I dev är `admin@nexapay.com` med flera redan bekräftade. Egen-registrering kräver SMTP-konfig eller manuell databasredigering. |
| `Tailwind classes appliceras inte` | Kontrollera att Vite-servern startas om efter att en ny klass läggs till. Tailwind 4 genererar CSS on-the-fly. |
| `lucide-react` ikon visas inte | Importera korrekt namn från https://lucide.dev (case-sensitive). |
| Token försvinner vid sidladdning | Kolla att browsern tillåter `localStorage` (vissa privata fönster gör inte). |

---

## Bidra till projektet

1. **Branch-namn:** `feature/<kort-beskrivning>` eller `fix/<kort-beskrivning>`.
2. **Pull request:** mot `master`. Branch protection är aktivt – inga direktpushar.
3. **Lint:** kör `npm run lint` innan PR.
4. **Build:** kör `npm run build` för att verifiera att produktionsbygget fungerar.
5. **Project board:** https://github.com/users/b1-loop/projects/12

### Kodstandard

- Komponentnamn i PascalCase, filer i samma format som komponenten.
- Hooks börjar alltid med `use*` och bor i `src/hooks/`.
- Helpers utan UI ligger i `src/helpers/` – inga JSX-imports där.
- API-anrop görs aldrig direkt från en komponent – alltid via `src/api/*`.
- Filhuvuden i svenska kommentarer förklarar varför filen finns.

---

## Licens och författare

Skoluppgift – inte avsedd för produktionsbruk.

**Författare:**
- [@Haval-Jalal](https://github.com/Haval-Jalal)
- [@b1-loop](https://github.com/b1-loop) (Bozhidar N. Ivanov)

**Relaterade repos:**
- Backend (.NET 8): https://github.com/b1-loop/NexaPay
