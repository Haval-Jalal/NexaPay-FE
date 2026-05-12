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

### Runda 4 – Finslipning
- ✅ AuthContext: striktare null-check på `getMe`-svar (kräver email + role)
- ✅ Admin.jsx: lösenordstips tillagd (min 8 tecken, stor bokstav, siffra, specialtecken)
- ✅ Transfer lookup: skiljer på "konto hittades inte" (404) vs serverfel

### Runda 6 – Senior design-granskning (senaste)
- ✅ lucide-react installerat; Unicode-ikoner i Layout ersatta med Lucide
- ✅ Layout.jsx: responsiv sidebar med hamburgermeny på mobil + overlay
- ✅ Layout.jsx: `loggingOut`-state på logout-knappen
- ✅ index.css: `@keyframes fadeIn` + `.animate-fade-in` utility
- ✅ App.jsx: `AnimatedRoutes` med `key={location.pathname}` för sidövergångar
- ✅ AuthLayout.jsx: ny delad komponent för alla auth-sidor
- ✅ Login/Register/ForgotPassword/ResetPassword/ConfirmEmail: refaktorerade till AuthLayout, `autoComplete`-attribut, inga pedagogiska kommentarer, `document.title`
- ✅ Settings.jsx: toast ersätter inline success, `autoComplete`, rensade kommentarer, `document.title`
- ✅ Transfer.jsx: toast ersätter inline success, `document.title`
- ✅ Admin.jsx: toast ersätter inline success, `document.title`
- ✅ Dashboard.jsx: svenska statusetiketter, färgad vänsterkantlinje per kontotyp, visuellt tomt tillstånd, `document.title`
- ✅ AccountDetail.jsx: svenska status/kortstatus-etiketter, visuell kortdesign (gradient), transaktionsgruppering per datum med Lucide-ikoner, toast för insättning/uttag, `document.title`
- ✅ ToastContext.jsx: global toast-hook, 4 sekunder, fade-in animation

### Runda 5 – Slutaudit-åtgärder
- ✅ Register.jsx: automatisk omdirigering till `/confirm-email` efter registrering
- ✅ ConfirmEmail.jsx: hanterar parameterless-läge med "kolla din e-post"-meddelande
- ✅ Register.jsx, Settings.jsx: realtids lösenordsstyrkeindikator (4-segment, färgad)
- ✅ AccountDetail.jsx (kortmodal): kopiera-till-urklipp för kortnummer och CVV
- ✅ AccountDetail.jsx: `totalCount` visas i transaktionsrubriken
- ✅ Admin.jsx: infobanner om att e-postbekräftelse kringgås vid adminskapad användare
- ✅ Transfer.jsx: "Försök igen"-knapp vid serverfel i kontonummersökning
- ✅ AccountDetail.jsx: typfilter för transaktionslistan (Alla/Insättning/Uttag/Överföring)
- ✅ AccountDetail.jsx: `ExpiryDate` lokaliserad (`MM/YY`-format) i kortlista och kortmodal
- ✅ Layout.jsx: blå "Skrivskyddad vy"-banner för Auditor-rollen i sidebaren

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

---

## 7. Slutlig audit – observationer (åtgärdade i Runda 5)

Alla 23 endpoints är täckta. Nedanstående förbättringar identifierades i slutauditen och har nu genomförts.

### Åtgärdade

| # | Sida / Fil | Observation | Åtgärd |
|---|---|---|---|
| 1 | `Register.jsx` | Ingen automatisk omdirigering till `/confirm-email` efter registrering | `navigate('/confirm-email')` vid `requiresEmailConfirmation`; `ConfirmEmail.jsx` visar "kolla din e-post" när userId/token saknas |
| 2 | `Register.jsx`, `Settings.jsx` | Inget realtidsindikator för lösenordsstyrka | `getPasswordStrength()` + 4-segment färgbar styrkeindikator visas direkt vid inmatning |
| 3 | `AccountDetail.jsx` (kortmodal) | Kortnummer och CVV saknade kopiera-till-urklipp-knapp | Kopiera-knapp med "Kopierat!"-feedback (2 sek) tillagd för både kortnummer och CVV |
| 4 | `AccountDetail.jsx` (transaktioner) | `totalCount` från backend visades inte | `totalCount` sparas i pagination-state och visas i rubriken som "(X totalt)" |
| 5 | `Admin.jsx` (skapa användare) | Ingen information om att e-postbekräftelse kringgås | Gul infobanner tillagd: "Konton skapade här bekräftas automatiskt — EmailConfirmed = true" |
| 6 | `Transfer.jsx` | Ingen retry-knapp vid serverfel | "Försök igen"-knapp visas när `lookupState === 'error'`; anropar `doLookup()` direkt |
| 7 | `AccountDetail.jsx` | Transaktionslistan saknade filter på typ | Filterknappar (Alla / Insättning / Uttag / Överföring) — klientsidefiltrering på nuvarande sida |
| 8 | `AccountDetail.jsx` (kort) | `ExpiryDate` visades i råformat | `toLocaleDateString('sv-SE', { month: '2-digit', year: '2-digit' })` på både kortlista och kortmodal |
| 9 | Layout (sidebar) | Auditor-rollen saknade "read-only"-indikator | Blå "Skrivskyddad vy / Auditor – enbart läsbehörighet"-banner i sidebaren för Auditor-rollen |

---

## 8. Senior frontend-granskning – designbedömning

> Skriven ur perspektivet av en senior frontend-utvecklare med erfarenhet av finansiella produkter.
> Syftet är att peka på vad som skiljer en fungerande intern prototyp från en produkt man kan visa upp.
> **Ingen av punkterna nedan kräver backend-ändringar.**

---

### Sammanfattning

Fundamenten är solida. Clean Architecture lyser igenom ända upp till React-lagret — CQRS-querys speglas i API-moduler, rollstyrningen är centraliserad, idempotency-nycklar sitter på plats. Det är mer disciplin än de flesta bankappar jag sett i tidiga stadier. Men just nu är det en **korrekt app** snarare än en **upplevd bankapp**. Gapet mellan de två är nästan uteslutande visuellt och interaktionsmässigt — inte arkitekturellt.

---

### Kritiska förbättringar (påverkar trovärdigheten mest)

**1. ✅ Ikonerna i sidonavigationen är Unicode-tecken**
`lucide-react` installerat. `LayoutDashboard`, `ArrowLeftRight`, `Cog`, `Shield`, `Menu`, `X` används i `Layout.jsx`. Konsekvent storlek, CSS-stylebar, träd-skakbar.

**2. ✅ Kontostatus visas på engelska**
`STATUS_LABELS` och `CARD_STATUS_LABELS` maps tillagda i `Dashboard.jsx` och `AccountDetail.jsx`. Alla statusetiketter visas nu på svenska (Öppen, Fryst, Stängd, Aktiv, Blockerad m.fl.).

**3. ✅ Kortvisning saknar kortdesign**
Korten visas nu som visuella bankkort med indigo/lila gradient, dekorativa cirklar, maskerat kortnummer, innehavare och utgångsdatum i `AccountDetail.jsx`. Blockerade/utgångna kort får neutral grå bakgrund.

**4. ✅ Transaktioner saknar gruppering och ikoner**
Transaktionslistan i `AccountDetail.jsx` grupperas nu per datum ("Idag", "Igår", datumstämpel). Varje transaktion har en färgad ikon-cirkel med `ArrowDownLeft`/`ArrowUpRight`/`ArrowLeftRight` från Lucide.

**5. ✅ Inga toast-notifikationer**
`ToastContext.jsx` skapad — global `useToast()` hook. Toasts används i `Settings.jsx` (lösenordsbyte), `Transfer.jsx` (överföring), `AccountDetail.jsx` (insättning/uttag), `Admin.jsx` (skapa användare). Inline success-state borttaget från dessa sidor.

---

### Viktiga förbättringar (UX-poäng)

**6. ✅ Ingen mobillayout**
`Layout.jsx` omskriven med responsiv sidebar: fast overlay med hamburgermeny på mobil (`md:hidden` top bar + `Menu`/`X`-ikoner), stationär sidebar på desktop. Overlay-backdrop stänger sidebaren vid klick.

**7. ✅ Inga sidövergångar**
`@keyframes fadeIn` tillagd i `index.css`. `animate-fade-in`-klass appliceras via `key={location.pathname}` på content-wrapper i `Layout.jsx` (interna sidor) och direkt på `AuthLayout`-wrapper (auth-sidor). `AnimatedRoutes`-komponent i `App.jsx` hanterar location-tracking.

**8. ✅ Auth-sidorna delar duplicerad layout**
`AuthLayout.jsx` skapad. Alla auth-sidor (`Login`, `Register`, `ForgotPassword`, `ResetPassword`, `ConfirmEmail`) använder nu komponenten — boilerplate eliminerad.

**9. ✅ `autocomplete`-attribut saknas på formulär**
`autoComplete="email"` på alla e-postfält, `autoComplete="current-password"` på befintliga lösenordsfält, `autoComplete="new-password"` på nya/bekräftade lösenordsfält. Tillagt i samtliga auth- och inställningssidor.

**10. ✅ Tomt tillstånd utan visuell feedback**
`Dashboard.jsx`: tomt tillstånd visar nu en ikon-box + `text-gray-400`-rubrik + CTA-länk "Skapa ditt första konto →" för användare med skrivbehörighet.

---

### Finslipning (proffsiga detaljer)

**11. ✅ Login.jsx och Settings.jsx har pedagogiska kommentarer**
Alla pedagogiska rad-för-rad-kommentarer borttagna från `Login.jsx`, `Register.jsx`, `ForgotPassword.jsx`, `ResetPassword.jsx`, `ConfirmEmail.jsx` och `Settings.jsx`. Filerna omskrivna utan onödiga kommentarer.

**12. ✅ ExpiryDate visas som ISO-sträng**
Åtgärdat i Runda 5. `formatExpiry()` helper i `AccountDetail.jsx` — används i kortlista och kortmodal.

**13. ✅ Sidtiteln uppdateras aldrig**
`useEffect(() => { document.title = '... – NexaPay' }, [])` tillagd i alla sidor: Dashboard, AccountDetail, Transfer, Settings, Admin, Login, Register, ForgotPassword, ResetPassword, ConfirmEmail.

**14. ✅ Logout-knappen har ingen laddningsstatus**
`loggingOut`-state tillagd i `Layout.jsx`. Knappen är `disabled` och visar "Loggar ut..." under API-anropet.

**15. ✅ Kontokortet på Dashboard visar inte kontotyp med visuell distinktion**
`TYPE_BAR`-map tillagd (`Checking → bg-green-500`, `Savings → bg-blue-500`, `ISK → bg-purple-500`). Absolut positionerad 4px vänsterkantlinje per kontotyp på varje kontokort i `Dashboard.jsx`.

---

### Vad som redan är bra (behåll)

- Skeleton-loaders på Dashboard och AccountDetail — professionellt
- `ConfirmModal` istället för `window.confirm()` — korrekt
- Konsekvent fel/lyckad-banner-mönster (`bg-*/10 border border-*/20`) — känslan är enhetlig
- Rollstyrning centraliserad i `utils/roles.js` — underhållbart
- Idempotency-nycklar på finansiella operationer — säkerhetsmedvetet
- Debounce på kontonummersökning — visar förståelse för UX-kostnad av API-anrop
- `getMe()` vid app-start — korrekt server-side state sync

---

### Prioritetsordning om man bara ska göra ett par saker

| Prio | Åtgärd | Status |
|---|---|---|
| 1 | Byt Unicode-ikoner → Lucide React | ✅ Klar (Runda 6) |
| 2 | Översätt statusetiketter till svenska | ✅ Klar (Runda 6) |
| 3 | Visuell kortdesign i AccountDetail | ✅ Klar (Runda 6) |
| 4 | Toast-notifikationer | ✅ Klar (Runda 6) |
| 5 | Transaktionsgruppering + ikoner | ✅ Klar (Runda 6) |
| 6 | Ta bort pedagogiska kommentarer | ✅ Klar (Runda 6) |

---

## 9. Fullstack-audit – Backend & Frontend genomgång

> Genomförd 2026-05-12. Läge: **enbart kontroll, inga kodändringar**.
> Syfte: verifiera att alla kopplingar, endpoints, DTO-kontrakt, databasmodell, NuGet-paket och hela frontend↔backend-flödet stämmer.
> Backend-sökväg: `C:\Users\haval\Desktop\NexaPay`

---

### 9.1 Verifierade kopplingar (inga fel hittades)

#### Endpoints – alla 23 st matchar

| Grupp | Verifierat |
|---|---|
| `POST/GET /api/auth/*` (8 endpoints) | ✅ Sökväg, HTTP-verb, auth-krav, request/response-format |
| `GET/POST/PUT/DELETE /api/accounts/*` (7 endpoints) | ✅ |
| `GET/POST /api/transactions/*` (4 endpoints) | ✅ |
| `GET/POST/PUT /api/cards/*` (5 endpoints) | ✅ |
| `GET/POST/DELETE /api/admin/users` (3 endpoints) | ✅ |

#### DTO-fält – backend vs frontend

| DTO | Fält | Status |
|---|---|---|
| `AccountDto` | id, accountNumber, accountName, balance (decimal), currency (string), accountType (string), status (string), createdAt, ownerId | ✅ Alla fält används korrekt i Dashboard.jsx och AccountDetail.jsx |
| `CardDto` | id, maskedCardNumber (`"**** **** **** XXXX"`), cardType, status, expiryDate, createdAt | ✅ Matchar AccountDetail.jsx |
| `CreateCardResponse` | card (CardDto), cardNumber (plain), cvv | ✅ Frontend läser `res.data.cardNumber`, `res.data.cvv`, `res.data.card?.expiryDate` |
| `TransactionDto` | id, amount, currency, type (string), description, balanceAfterTransaction, receiverAccountId, accountId, createdAt | ✅ Alla fält används i AccountDetail.jsx |
| `PagedResult<T>` | items, totalCount, page, pageSize, totalPages | ✅ Frontend läser `res.data.items`, `res.data.totalCount`, `res.data.totalPages` |
| Admin användarlista | id, email, role, emailConfirmed, lockoutEnd | ✅ Matchar Admin.jsx |

#### Övriga verifierade punkter

| Punkt | Status |
|---|---|
| Backendport HTTP 5190 matchar `VITE_API_URL ?? 'http://localhost:5190'` | ✅ |
| `JsonStringEnumConverter` global → `"Deposit"/"Withdrawal"/"Transfer"`, `"Open"/"Frozen"/"Closed"` etc. | ✅ Matchar frontend-strängjämförelser |
| CORS: `localhost:5173` och `localhost:5174` konfigurerade för development | ✅ |
| JWT HS256, 24h utgångstid, token-denylist (Redis/InMemory) | ✅ |
| Rollnamn: Admin, BankManager, Teller, Auditor, User | ✅ Matchar `src/utils/roles.js` `can.*`-funktioner |
| Idempotency-Key header på `/deposit`, `/withdraw`, `/transfer` | ✅ `src/api/transactions.js` skickar `crypto.randomUUID()` |
| AutoMapper: Money VO (Amount + Currency) plattas ut till `balance`/`currency` i DTO | ✅ Frontend ser aldrig VO-strukturen |
| `maskedCardNumber`-format: `"**** **** **** XXXX"` | ✅ Visas direkt i kortlistan |
| `ExpiryDate` som ISO-sträng → `formatExpiry()` i AccountDetail.jsx | ✅ |
| EF Core 8 + SQL Server – 11 migrationer, alla körs | ✅ |

---

### 9.2 NuGet-paket status

#### NexaPay.API
| Paket | Version | Status |
|---|---|---|
| Microsoft.AspNetCore (inbyggt) | .NET 8 | ✅ |
| Microsoft.AspNetCore.Authentication.JwtBearer | 8.x | ✅ |
| Swashbuckle.AspNetCore | – | ✅ |
| Microsoft.AspNetCore.RateLimiting | 8.x | ✅ |
| StackExchange.Redis | – | ✅ |

#### NexaPay.Application
| Paket | Version | Status |
|---|---|---|
| MediatR | **14.1.0** | ✅ |
| AutoMapper | – | ✅ |
| FluentValidation | – | ✅ |

#### NexaPay.Domain
| Paket | Version | Status |
|---|---|---|
| MediatR | **12.4.0** | ❌ Versionsmismatch – se #1 nedan |

#### NexaPay.Infrastructure
| Paket | Version | Status |
|---|---|---|
| Microsoft.EntityFrameworkCore.SqlServer | 8.x | ✅ |
| Microsoft.AspNetCore.Identity.EntityFrameworkCore | 8.x | ✅ |
| Microsoft.IdentityModel.Tokens | – | ✅ |
| StackExchange.Redis | – | ✅ |

---

### 9.3 Identifierade problem

Allvarlighetsnivåer: 🔴 Kritisk · 🟡 Viktig · 🟠 Mindre

---

**#1 🔴 KRITISK – MediatR-versionsmismatch (Domain vs Application)**

| Fält | Värde |
|---|---|
| Fil | `NexaPay.Domain/NexaPay.Domain.csproj` (ca rad 10) |
| Problem | Domain-projektet refererar MediatR **12.4.0**; Application-projektet refererar **14.1.0**. Olika major-versioner kan ge `TypeLoadException` eller tyst beteendediskrepans vid körning om INotification/IRequest-interface inte stämmer överens. |
| Rekommendation | Uppdatera Domain.csproj till MediatR **14.1.0** (samma som Application). Kör `dotnet restore` + `dotnet build` för att verifiera. |

---

**#2 🔴 KRITISK – `Transfer.jsx`: `setSuccess` anropas men state är inte deklarerat**

| Fält | Värde |
|---|---|
| Fil | `src/pages/Transfer.jsx`, rad 51 |
| Problem | `handleToNumberChange()` anropar `setSuccess('')` men `const [success, setSuccess]` togs bort i Runda 6 när toast-systemet introducerades. Anropet finns kvar → `ReferenceError: setSuccess is not defined` kastas varje gång användaren skriver i "Till kontonummer"-fältet. |
| Rekommendation | Ta bort rad 51 (`setSuccess('')`) från `Transfer.jsx`. |

---

**#3 🟡 VIKTIG – SMTP inte konfigurerat (e-postbekräftelse & lösenordsåterställning fungerar inte)**

| Fält | Värde |
|---|---|
| Fil | `NexaPay.API/appsettings.json` (`Email`-sektion) |
| Problem | `Host`, `Username`, `Password` är tomma strängar. `IEmailNotificationService` faller tillbaka till `LoggingNotificationService` som bara skriver till konsolen. Användare som registrerar sig via `/register` i frontend kan aldrig bekräfta e-posten – och `/forgot-password` skickar aldrig återställningslänken. |
| Påverkan | Hela e-postflödet är brutet i en verklig miljö. |
| Rekommendation | Fyll i SMTP-uppgifter (t.ex. SendGrid, Mailgun) i `appsettings.Production.json`. Registrera aldrig credentials i `appsettings.json` – använd User Secrets i utveckling och miljövariabler i produktion. |

---

**#4 🟡 VIKTIG – CORS saknas för produktion**

| Fält | Värde |
|---|---|
| Fil | `NexaPay.API/appsettings.json` eller `Program.cs` (`AllowedOrigins` för `production`-policy) |
| Problem | CORS-policyn för `production` är en tom array. Alla webbläsarförfrågningar från den faktiska domänen blockeras. |
| Rekommendation | Lägg till produktionsdomänen i `AllowedOrigins` innan deploy, t.ex. `"https://app.nexapay.com"`. |

---

**#5 🟡 VIKTIG – Ingen `.env`-fil i frontend (ingen produktionsmiljöhantering)**

| Fält | Värde |
|---|---|
| Fil | `src/api/client.js` rad 10 |
| Problem | `VITE_API_URL ?? 'http://localhost:5190'` – om ingen miljövariabel är satt används alltid localhost. Det finns ingen `.env`, `.env.development` eller `.env.production` i projektroten. |
| Rekommendation | Skapa `.env.development` med `VITE_API_URL=http://localhost:5190` och `.env.production` med produktions-API:ets URL. Lägg till `.env*.local` i `.gitignore`. |

---

**#6 🟡 VIKTIG – HTTP 429 (rate limiting) hanteras inte meningsfullt i frontend**

| Fält | Värde |
|---|---|
| Fil | `src/api/client.js` rad 34 |
| Problem | `throw new Error(data?.message ?? \`Serverfel (\${res.status})\`)` – vid 429 visas "Serverfel (429)" eller backendets råa tekniska meddelande. Ingen retry-after-logik. |
| Rekommendation | Lägg till en `if (res.status === 429)` gren i `client.js` som kastar `"För många förfrågningar – vänta en stund och försök igen."`. |

---

**#7 🟡 VIKTIG – Transfer.jsx: 404-detektering är skör (string-matching på felmeddelande)**

| Fält | Värde |
|---|---|
| Fil | `src/pages/Transfer.jsx` rad 42 |
| Problem | `e.message?.includes('404') \|\| e.message?.toLowerCase().includes('hittades inte')` – logiken förlitar sig på att felmeddelandet innehåller "404" eller en viss sträng. Om backend ändrar sitt felmeddelande, eller om 404 triggas av en annan orsak, kan fel visas felaktigt. |
| Rekommendation | Exponera HTTP-statuskoden i `client.js`-felet (t.ex. `const err = new Error(...); err.status = res.status; throw err`) och kontrollera `e.status === 404` istället för strängmatchning. |

---

**#8 🟡 VIKTIG – Användare antas ha exakt en roll (`FirstOrDefault` i JWT-genereringen)**

| Fält | Värde |
|---|---|
| Fil | `NexaPay.Infrastructure/Services/AuthService.cs` |
| Problem | `GetRole()` använder `FirstOrDefault()` vid JWT-claim-skapandet. Om en användare råkar ha flera Identity-roller returneras bara den första. Frontend förutsätter också ett enda roll-värde (`user.role`). |
| Påverkan | Låg just nu (inga användare har flera roller), men designbegränsning att känna till. |
| Rekommendation | Dokumentera detta som en avsiktlig begränsning eller lägg till en assertion att en användare aldrig tilldelas mer än en roll. |

---

**#9 🟠 MINDRE – Dubbel `NameIdentifier`-claim i JWT**

| Fält | Värde |
|---|---|
| Fil | `NexaPay.Infrastructure/Services/AuthService.cs` (JWT-generering) |
| Problem | Både `sub` (JwtRegisteredClaimNames.Sub) och `ClaimTypes.NameIdentifier` innehåller användar-ID. ASP.NET Core mappar automatiskt `sub` till `NameIdentifier`, vilket gör att ID:t dupliceras i token-payloaden. |
| Rekommendation | Ta bort den explicita `ClaimTypes.NameIdentifier`-clamen och förlita dig på `sub`-mappningen. |

---

**#10 🟠 MINDRE – Swagger visar JWT-lås på ej skyddade endpoints**

| Fält | Värde |
|---|---|
| Fil | `NexaPay.API/Program.cs` eller Swagger-konfiguration |
| Problem | Swagger-UI visar JWT-autentiseringsikonen (🔒) även på publika endpoints som `/api/auth/login`, `/api/auth/register` och `/health`. Vilseledande för utvecklare. |
| Rekommendation | Applicera `[AllowAnonymous]` explicit på auth-controllers och använd `[ProducesResponseType]`-attribut för att Swagger ska reflektera rätt. Alternativt, konfigurera Swagger att bara visa lås på `[Authorize]`-markerade endpoints. |

---

### 9.4 Sammanfattning

| Allvarlighet | Antal | Åtgärdsstatus |
|---|---|---|
| 🔴 Kritisk | 2 | Ej åtgärdade |
| 🟡 Viktig | 6 | Ej åtgärdade |
| 🟠 Mindre | 2 | Ej åtgärdade |
| ✅ Verifierat korrekt | 23 endpoints + alla DTO-kontrakt | — |

**Rekommenderad åtgärdsordning:**
1. `Transfer.jsx` rad 51 – `setSuccess` ReferenceError (1-radsfix, frontend kraschbug)
2. MediatR-versionsmismatch i Domain.csproj (1-radsfix, potentiell körtidskrasch)
3. SMTP-konfiguration (krävs för att e-postflödet ska fungera)
4. CORS-konfiguration för produktion (krävs inför deploy)
5. `.env`-filer för frontend (krävs inför deploy)
6. HTTP 429-hantering i `client.js`
7. 404-detektering i `Transfer.jsx`
8. Övriga lägre-prioritet
