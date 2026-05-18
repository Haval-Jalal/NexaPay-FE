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

**#1 🔴 KRITISK – MediatR-versionsmismatch (Domain vs Application)** — ✅ ÅTGÄRDAD (avsnitt 11.2)

| Fält | Värde |
|---|---|
| Fil | `NexaPay.Domain/NexaPay.Domain.csproj` (ca rad 10) |
| Problem | Domain-projektet refererar MediatR **12.4.0**; Application-projektet refererar **14.1.0**. Olika major-versioner kan ge `TypeLoadException` eller tyst beteendediskrepans vid körning om INotification/IRequest-interface inte stämmer överens. |
| Rekommendation | Uppdatera Domain.csproj till MediatR **14.1.0** (samma som Application). Kör `dotnet restore` + `dotnet build` för att verifiera. |

---

**#2 🔴 KRITISK – `Transfer.jsx`: `setSuccess` anropas men state är inte deklarerat** — ✅ ÅTGÄRDAD (avsnitt 11.3)

| Fält | Värde |
|---|---|
| Fil | `src/pages/Transfer.jsx`, rad 51 |
| Problem | `handleToNumberChange()` anropar `setSuccess('')` men `const [success, setSuccess]` togs bort i Runda 6 när toast-systemet introducerades. Anropet finns kvar → `ReferenceError: setSuccess is not defined` kastas varje gång användaren skriver i "Till kontonummer"-fältet. |
| Rekommendation | Ta bort rad 51 (`setSuccess('')`) från `Transfer.jsx`. |

---

**#3 🟡 VIKTIG – SMTP inte konfigurerat (e-postbekräftelse & lösenordsåterställning fungerar inte)** — ✅ KORRIGERAD (avsnitt 11.1 — påståendet var delvis fel; creds blankade lokalt, kommentar rättad)

| Fält | Värde |
|---|---|
| Fil | `NexaPay.API/appsettings.json` (`Email`-sektion) |
| Problem | `Host`, `Username`, `Password` är tomma strängar. `IEmailNotificationService` faller tillbaka till `LoggingNotificationService` som bara skriver till konsolen. Användare som registrerar sig via `/register` i frontend kan aldrig bekräfta e-posten – och `/forgot-password` skickar aldrig återställningslänken. |
| Påverkan | Hela e-postflödet är brutet i en verklig miljö. |
| Rekommendation | Fyll i SMTP-uppgifter (t.ex. SendGrid, Mailgun) i `appsettings.Production.json`. Registrera aldrig credentials i `appsettings.json` – använd User Secrets i utveckling och miljövariabler i produktion. |

---

**#4 🟡 VIKTIG – CORS saknas för produktion** — ⏳ EJ ÅTGÄRDAD (avsiktligt — tom lista = korrekt "fail-closed"; deploy-konfiguration, inte en bugg)

| Fält | Värde |
|---|---|
| Fil | `NexaPay.API/appsettings.json` eller `Program.cs` (`AllowedOrigins` för `production`-policy) |
| Problem | CORS-policyn för `production` är en tom array. Alla webbläsarförfrågningar från den faktiska domänen blockeras. |
| Rekommendation | Lägg till produktionsdomänen i `AllowedOrigins` innan deploy, t.ex. `"https://app.nexapay.com"`. |

---

**#5 🟡 VIKTIG – Ingen `.env`-fil i frontend (ingen produktionsmiljöhantering)** — ✅ ÅTGÄRDAD (avsnitt 11.3)

| Fält | Värde |
|---|---|
| Fil | `src/api/client.js` rad 10 |
| Problem | `VITE_API_URL ?? 'http://localhost:5190'` – om ingen miljövariabel är satt används alltid localhost. Det finns ingen `.env`, `.env.development` eller `.env.production` i projektroten. |
| Rekommendation | Skapa `.env.development` med `VITE_API_URL=http://localhost:5190` och `.env.production` med produktions-API:ets URL. Lägg till `.env*.local` i `.gitignore`. |

---

**#6 🟡 VIKTIG – HTTP 429 (rate limiting) hanteras inte meningsfullt i frontend** — ⏳ EJ ÅTGÄRDAD (avsiktligt — påståendet var överdrivet; backend returnerar redan ett läsbart meddelande, se 11.1)

| Fält | Värde |
|---|---|
| Fil | `src/api/client.js` rad 34 |
| Problem | `throw new Error(data?.message ?? \`Serverfel (\${res.status})\`)` – vid 429 visas "Serverfel (429)" eller backendets råa tekniska meddelande. Ingen retry-after-logik. |
| Rekommendation | Lägg till en `if (res.status === 429)` gren i `client.js` som kastar `"För många förfrågningar – vänta en stund och försök igen."`. |

---

**#7 🟡 VIKTIG – Transfer.jsx: 404-detektering är skör (string-matching på felmeddelande)** — ✅ ÅTGÄRDAD (avsnitt 11.3)

| Fält | Värde |
|---|---|
| Fil | `src/pages/Transfer.jsx` rad 42 |
| Problem | `e.message?.includes('404') \|\| e.message?.toLowerCase().includes('hittades inte')` – logiken förlitar sig på att felmeddelandet innehåller "404" eller en viss sträng. Om backend ändrar sitt felmeddelande, eller om 404 triggas av en annan orsak, kan fel visas felaktigt. |
| Rekommendation | Exponera HTTP-statuskoden i `client.js`-felet (t.ex. `const err = new Error(...); err.status = res.status; throw err`) och kontrollera `e.status === 404` istället för strängmatchning. |

---

**#8 🟡 VIKTIG – Användare antas ha exakt en roll (`FirstOrDefault` i JWT-genereringen)** — ⏳ EJ ÅTGÄRDAD (avsiktlig design — en användare tilldelas aldrig mer än en roll)

| Fält | Värde |
|---|---|
| Fil | `NexaPay.Infrastructure/Services/AuthService.cs` |
| Problem | `GetRole()` använder `FirstOrDefault()` vid JWT-claim-skapandet. Om en användare råkar ha flera Identity-roller returneras bara den första. Frontend förutsätter också ett enda roll-värde (`user.role`). |
| Påverkan | Låg just nu (inga användare har flera roller), men designbegränsning att känna till. |
| Rekommendation | Dokumentera detta som en avsiktlig begränsning eller lägg till en assertion att en användare aldrig tilldelas mer än en roll. |

---

**#9 🟠 MINDRE – Dubbel `NameIdentifier`-claim i JWT** — ⏳ EJ ÅTGÄRDAD (ofarlig redundans — att ta bort den explicita claimen riskerar att slå sönder `GetUserId()`)

| Fält | Värde |
|---|---|
| Fil | `NexaPay.Infrastructure/Services/AuthService.cs` (JWT-generering) |
| Problem | Både `sub` (JwtRegisteredClaimNames.Sub) och `ClaimTypes.NameIdentifier` innehåller användar-ID. ASP.NET Core mappar automatiskt `sub` till `NameIdentifier`, vilket gör att ID:t dupliceras i token-payloaden. |
| Rekommendation | Ta bort den explicita `ClaimTypes.NameIdentifier`-clamen och förlita dig på `sub`-mappningen. |

---

**#10 🟠 MINDRE – Swagger visar JWT-lås på ej skyddade endpoints** — ⏳ EJ ÅTGÄRDAD (kosmetiskt — kräver en operation filter; ingen runtime-påverkan)

| Fält | Värde |
|---|---|
| Fil | `NexaPay.API/Program.cs` eller Swagger-konfiguration |
| Problem | Swagger-UI visar JWT-autentiseringsikonen (🔒) även på publika endpoints som `/api/auth/login`, `/api/auth/register` och `/health`. Vilseledande för utvecklare. |
| Rekommendation | Applicera `[AllowAnonymous]` explicit på auth-controllers och använd `[ProducesResponseType]`-attribut för att Swagger ska reflektera rätt. Alternativt, konfigurera Swagger att bara visa lås på `[Authorize]`-markerade endpoints. |

---

### 9.4 Sammanfattning

| Allvarlighet | Antal | Åtgärdsstatus (uppdaterad — se avsnitt 11) |
|---|---|---|
| 🔴 Kritisk | 2 | ✅ 2 åtgärdade (#1, #2) |
| 🟡 Viktig | 6 | ✅ 3 åtgärdade/korrigerade (#3, #5, #7) · ⏳ 3 ej åtgärdade avsiktligt (#4, #6, #8) |
| 🟠 Mindre | 2 | ⏳ 2 ej åtgärdade avsiktligt (#9, #10) |
| ✅ Verifierat korrekt | 23 endpoints + alla DTO-kontrakt | — |

**Rekommenderad åtgärdsordning** (status efter branch `fix/audit-followup`):
1. ✅ `Transfer.jsx` rad 51 – `setSuccess` ReferenceError (1-radsfix, frontend kraschbug)
2. ✅ MediatR-versionsmismatch i Domain.csproj (1-radsfix, potentiell körtidskrasch)
3. ✅ SMTP-konfiguration – korrigerad (påståendet var delvis fel, se 11.1)
4. ⏳ CORS-konfiguration för produktion – ej åtgärdad avsiktligt (deploy-config, korrekt fail-closed)
5. ✅ `.env`-filer för frontend
6. ⏳ HTTP 429-hantering i `client.js` – ej åtgärdad avsiktligt (fungerar redan)
7. ✅ 404-detektering i `Transfer.jsx`
8. ⏳ Övriga lägre-prioritet (#8, #9, #10) – ej åtgärdade avsiktligt

---

## 10. Best Practice-genomgång – 10 React-principer

> Kontroll genomförd 2026-05-12. Inga kodändringar — enbart dokumentation.
> Principer: API service layer, useEffect, loading/error-states, children-prop, miljövariabler, React Router, Context, ProtectedRoute.

---

### Resultat per kategori

| # | Princip | Status | Kommentar |
|---|---|---|---|
| 1 | API-anrop i separata filer | ✅ | `src/api/` — 5 servicefiler + `client.js`. Inga `fetch()`-anrop i komponenter. |
| 2 | `useEffect` för API-anrop | ✅ | Alla datahämtningar sker i `useEffect`. Inga anrop i component body. |
| 3 | Loading / Success / Error states | ✅ | BP-1 åtgärdad — de 3 tysta catch-blocken visar nu inline-fel (avsnitt 11.3). |
| 4 | `children`-prop / wrapper-komponenter | ✅ | `Layout`, `AuthLayout`, `ProtectedRoute`, `Modal`, `ConfirmModal`, `ToastProvider`, `AuthProvider`. |
| 5 | API-logik samlad och återanvändbar | ✅ | `client.js` centraliserar headers, auth-token, fel-parsing och bas-URL. |
| 6 | Inga hemligheter i koden | ✅ | Inga API-nycklar eller lösenord hårdkodade. Localhost-fallback är acceptabelt för dev. |
| 7 | Professionell API service layer | ✅ | `request()` + `getToken()` i `client.js` — importeras av samtliga api-filer. |
| 8 | React Router för multi-page SPA | ✅ | `BrowserRouter`, `Routes`, `NavLink`, `useNavigate`, `useLocation` — allt korrekt. |
| 9 | Context för delad auth-state | ✅ | `AuthContext` + `ToastContext` wrappas runt hela appen. `useAuth()` / `useToast()` hooks. |
| 10 | `ProtectedRoute` för sidskydd | ✅ | `ProtectedRoute` + `AdminRoute` i `App.jsx` — alla skyddade sidor täckta. |

---

### Identifierade förbättringspunkter (inga kraschbuggar)

**BP-1 🟠 – Tysta catch-block lämnar användaren med blank vy utan förklaring** — ✅ ÅTGÄRDAD (avsnitt 11.3)

Tre platser slukar undantag utan att visa ett felmeddelande:

| Fil | Rad | Funktion | Konsekvens |
|---|---|---|---|
| `AccountDetail.jsx` | 103 | `loadCards()` — tomt catch-block | Kort laddas inte men ingenting visas; användaren ser en tom kortlista utan orsak |
| `AccountDetail.jsx` | 111 | `loadTransactions()` — tomt catch-block | Transaktioner laddas inte utan felindikator |
| `Transfer.jsx` | 31 | `getAccounts().catch(() => {})` | Från-konto-dropdown är tom utan förklaring; användaren kan inte göra en överföring |

Rekommendation: Lägg till ett `setCardsError` / `setTxError` / `setAccountsError`-state och rendera ett inline-felmeddelande i alla tre fallen. Alternativt, logga till konsolen under dev med `console.error(e)` som minsta åtgärd.

---

**BP-2 🟠 – Pedagogiska kommentarer kvar i API-filer och ProtectedRoute** — ✅ ÅTGÄRDAD (avsnitt 11.3)

Runda 6 rensade pedagog-kommentarer från alla sidor och auth-komponenter, men samma kommentarsstil finns kvar i:

| Fil | Exempel |
|---|---|
| `src/api/client.js` | Radkommentarer på varje rad: `// Bygg headers – alltid JSON, lägg till Authorization om token finns` |
| `src/api/auth.js` | Funktionsvis förklaring av varje endpoint |
| `src/api/accounts.js` | Förklarande kommentarer om rollkrav etc. |
| `src/api/cards.js` | Ditto |
| `src/api/admin.js` | Ditto |
| `src/components/ProtectedRoute.jsx` | 10-radigt kommentarsblock i toppen |

Konsekvens: Inkonsekvent kodstil — komponenter är rena, service-filer är fulla av pedagogiska förklaringar. Ingen funktionspåverkan.

Rekommendation: Kör samma kommentar-rensning som gjordes i Runda 6, men på api-filerna och `ProtectedRoute.jsx`.

---

**BP-3 🟠 – Dubbel `animate-fade-in` vid sidnavigering på skyddade sidor** — ✅ ÅTGÄRDAD (avsnitt 11.3)

Två ställen applicerar `key={location.pathname}` + `animate-fade-in` på varandra:

| Fil | Rad | Scope |
|---|---|---|
| `App.jsx` | 28 | Yttre wrapper i `AnimatedRoutes` — täcker hela sidan inkl. Layout |
| `Layout.jsx` | 108 | Inre wrapper runt `{children}` — täcker bara sidinnehållet |

Auth-sidor (utan Layout) triggar animationen en gång. Skyddade sidor triggar den två gånger. Visuellt märks det knappt (båda körs 0.15s parallellt) men det är redundant — Layout-wrappern är redan inkluderad i `AnimatedRoutes`-remounten.

Rekommendation: Ta bort antingen `key={location.pathname}` i `Layout.jsx` rad 108 eller i `AnimatedRoutes` i `App.jsx` — behåll bara ett ställe.

---

**BP-4 🟠 – `eslint-disable-line` i AuthContext utan förklarande kommentar** — ✅ ÅTGÄRDAD (avsnitt 11.3 — effekten omskriven utan reaktiva deps, suppressionen borttagen)

`AuthContext.jsx` rad 29:
```js
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
```

`user` används inuti `useEffect` men är utesluten från dependency-arrayen med avsikt (för att undvika oändlig loop). Suppressionen är korrekt, men utan förklaring ser det ut som ett förbisett lint-varning snarare än ett medvetet beslut.

Rekommendation: Byt ut kommentaren mot en förklaring, t.ex.:
```js
  }, []) // avsiktligt — vi vill bara köra vid mount; user i deps → oändlig loop
```
Alternativt: refaktorera med `useRef(false)` som mount-guard och ta bort eslint-suppression helt.

---

### Sammanfattning

Alla 10 best practices är i grunden uppfyllda. Fyra förbättringspunkter hittades — alla klassade 🟠 (mindre), inga kraschbuggar. **Samtliga fyra åtgärdade i branch `fix/audit-followup` (se avsnitt 11.3).**

| ID | Fil | Problem | Allvar | Status |
|---|---|---|---|---|
| BP-1 | `AccountDetail.jsx`, `Transfer.jsx` | 3 tysta catch-block → blank vy vid fel | 🟠 | ✅ ÅTGÄRDAD |
| BP-2 | `src/api/*.js`, `ProtectedRoute.jsx` | Pedagogiska kommentarer inte rensade | 🟠 | ✅ ÅTGÄRDAD |
| BP-3 | `App.jsx` + `Layout.jsx` | Dubbel fade-in-animation på skyddade sidor | 🟠 | ✅ ÅTGÄRDAD |
| BP-4 | `AuthContext.jsx` | `eslint-disable-line` utan förklarande kommentar | 🟠 | ✅ ÅTGÄRDAD |

---

## 11. Audit-uppföljning – åtgärder i branch `fix/audit-followup`

> Genomförd 2026-05-14. Hela avsnitt 9 + 10 verifierades mot faktisk kod i båda repos.
> Resultat: alla skarpa buggar åtgärdade, flera MD-påståenden korrigerade, två
> förbefintliga problem upptäckta.

### 11.1 Korrigeringar av tidigare MD-påståenden

| Påstående | Verkligt läge |
|---|---|
| Avs. 7 #2 / Avs. 9 #2 "Transfer – åtgärdat" | `setSuccess('')` låg kvar i `Transfer.jsx` och kastade `ReferenceError` vid varje tangenttryck i kontonummerfältet. Nu **faktiskt** borttaget. |
| Avs. 9 #3 "SMTP faller tillbaka till `LoggingNotificationService`" | Fel. `DependencyInjection.cs` registrerar `SmtpNotificationService`. Kodkommentaren var inaktuell – nu rättad. |
| Avs. 9 #3 "creds är tomma strängar" | `appsettings.json` (prod) var tom – men `appsettings.Development.json` hade riktiga Gmail-uppgifter. Filen är dock gitignored och uppgifterna har **aldrig committats** (verifierat i git-historiken). Blankade lokalt ändå. |
| Avs. 9 #6 "429 visar 'Serverfel (429)'" | Överdrivet. Backend returnerar redan ett läsbart svenskt meddelande som `client.js` surfar upp. Ingen åtgärd behövdes. |

### 11.2 Backend-åtgärder

| # | Fil | Åtgärd |
|---|---|---|
| #1 | `AuthController.cs` | Register-endpointen returnerar nu hela `AuthDto` (inte `{ Email }`) så `requiresEmailConfirmation` når frontend – registreringsflödet fungerar |
| #4 | `NexaPay.Domain.csproj` | MediatR 12.4.0 → 14.1.0 (matchar Application) |
| #5 | `DependencyInjection.cs` | Inaktuell kommentar om notification service rättad |
| #3 | `appsettings.Development.json` | Gmail-uppgifter blankade lokalt (gitignored fil, aldrig committad) |

### 11.3 Frontend-åtgärder

| # | Fil(er) | Åtgärd |
|---|---|---|
| #2 | `Transfer.jsx` | `setSuccess`-kraschen borttagen |
| #7 | `client.js`, `Transfer.jsx` | `client.js` sätter `error.status`; 404-detektering via `e.status === 404` istället för strängmatchning |
| #5 | `.env.development`, `.env.production` | Skapade (`.gitignore` täckte redan `*.local`) |
| BP-1 | `AccountDetail.jsx`, `Transfer.jsx` | Tysta catch-block → inline-felmeddelanden |
| BP-2 | `api/*.js`, `ProtectedRoute.jsx`, `Modal.jsx` | Pedagogiska kommentarer rensade |
| BP-3 | `App.jsx` | Dubbel `animate-fade-in`-wrapper borttagen |
| BP-4 | `AuthContext.jsx` | Effekten omskriven utan reaktiva deps → `eslint-disable` borttagen |
| — | `roles.js` | Död kod `can.viewAll` borttagen |
| — | `AuthContext.jsx` + nya `useAuth.js`, `ToastContext.jsx` + nya `useToast.js` | Context-filerna splittrade: `.jsx` exporterar bara providern, hook + context-objekt i egen `.js`-fil → löser `react-refresh/only-export-components` |

### 11.4 Upptäckta förbefintliga problem (ej i avsnitt 9/10)

**Åtgärdat:**
- **`NexaPay.Tests` byggde inte** – 6× CS0854 i `RegisterHandlerTests.cs`. `IAuthService.RegisterAsync` fick en 4:e valfri parameter men Moq-anropen skickade 3 argument (expression trees tillåter inte utelämnade valfria args). Doldes av fil-låsfel i tidigare builds. Fixat med `It.IsAny<bool>()`.

**Åtgärdat i branch `fix/audit-remaining` (se avsnitt 12):**
- **2 integrationstester faller** – `AdminCreateUser_WithValidStaffRole_Returns200` och `AdminCreateUser_StaffRoleWithExternalEmail_Returns400`. Rotorsak: testhjälparen `CreateAndLoginAsAdminAsync` använde hårdkodad e-post `admin@nexapay.com` som krockade med en seed-användare (annat lösenord) → login 401 → `KeyNotFoundException`. ✅ Åtgärdad – unik e-post per anrop.
- **`npm run lint` – 4 kvarvarande fel** – `react-hooks/set-state-in-effect` i `Dashboard`, `Admin`, `ConfirmEmail`, `AccountDetail`. ✅ Åtgärdad – effekterna omskrivna.

### 11.5 Verifiering

| | Resultat |
|---|---|
| Backend-build | ✅ Hela solutionen 0/0 |
| Backend-tester | ✅ 158/160 (2 förbefintliga fel enligt 11.4 – åtgärdade i avsnitt 12) |
| Frontend-build | ✅ `npm run build` rent |
| Frontend-lint | 4 förbefintliga fel kvar (11.4 – åtgärdade i avsnitt 12); 2 åtgärdade via context-split |
| Manuell körning | ✅ Backend `:5190`, frontend `:5173` – bekräftat fungerande |

---

## 12. Audit-uppföljning II – branch `fix/audit-remaining`

> Genomförd 2026-05-14. Åtgärdar de två kvarvarande "kräver beslut"-punkterna från avsnitt 11.4.
> Samma branchnamn `fix/audit-remaining` i båda repos.

### 12.1 Åtgärder

| # | Repo / Fil | Åtgärd |
|---|---|---|
| A1 | `NexaPay.Tests/Integration/ApiIntegrationTestBase.cs` | `CreateAndLoginAsAdminAsync` genererar unik e-post per anrop (`admin_{guid}@nexapay.com`) istället för hårdkodad `admin@nexapay.com`. Default-parametern ändrad till `string? email = null` med `??=`-fallback. Eliminerar krocken med seedad admin-användare. |
| A2 | `src/pages/Dashboard.jsx`, `Admin.jsx` | Datahämtning flyttad in i `useEffect` som `.then()`-kedja med `active`-avbrytningsguard; omladdning från handlers sker via `refreshKey`-state istället för att anropa loader-funktionen. |
| A2 | `src/pages/ConfirmEmail.jsx` | `setStatus('pending')` borttagen ur effekten – initialvärdet härleds nu direkt: `useState(userId && token ? 'loading' : 'pending')`. |
| A2 | `src/pages/AccountDetail.jsx` | Loader-funktionerna (`loadAccount`/`loadCards`/`loadTransactions`) omskrivna från `async/await` till `.then()`-kedjor. De återanvänds på ~10 ställen så de behölls som komponentfunktioner; `.then()`-callbacks känns igen av regeln som icke-synkrona. Wrappade i `useCallback(..., [id])` så de får stabil referens → mount-effekten deklarerar dem korrekt i deps-arrayen och `exhaustive-deps`-varningen försvinner. |

### 12.1b 🔴 Ny bugg upptäckt vid manuell test – överföring kraschade (500)

| Fält | Värde |
|---|---|
| Fil | `NexaPay.Domain/Entities/Account.cs` – `TransferTo()` |
| Symptom | `POST /api/transactions/transfer` returnerade 500. `SqlException`: `Cannot insert the value NULL into column 'Amount', table 'Transactions'`. |
| Rotorsak | `TransferTo` skapade `fromTransaction` och `toTransaction` med **samma `Money`-instans** (`Amount = amount`). `Money` är en EF Core *owned type* – en owned-instans kan bara tillhöra en ägar-entitet, så EF kopplade den till en transaktion och lämnade den andras `Amount` som NULL. `Deposit`/`Withdraw` drabbades inte (skapar bara en transaktion). |
| Åtgärd | Varje transaktion får sin egen instans: `Amount = new Money(amount.Amount, amount.Currency)`. |
| Test | Nytt `NexaPay.Tests/Integration/Transactions/TransactionsIntegrationTests.cs` – `Transfer_BetweenOwnAccounts_Returns200AndMovesBalance` (verifierar 200 + att saldon flyttas) och `Transfer_WithInsufficientBalance_Returns400`. Ingen integrationstest täckte tidigare hela transfer-flödet. |
| Verifierat | End-to-end mot körande API: 1000 → 700 / 0 → 300. |

### 12.1c 🟡 Rate limiter för aggressiv för dev/test – `financial`-policyn (20/min) blockerade normal användning

| Fält | Värde |
|---|---|
| Fil | `NexaPay.API/ServiceExtensions.cs`, `appsettings.json`, `appsettings.Development.json` |
| Symptom | "För många förfrågningar. Försök igen om en stund." (429) vid normal navigering i Översikt/Överföring. |
| Rotorsak | `financial`-policyn tillät 20 req/min **per IP** – och i dev delar allt samma IP (localhost). Översikt + Överföring gör flera anrop per sidvisning (mount-laddningar, och Transfer slår upp kontonummer på varje debouncad tangenttryckning), så 20 tog slut på sekunder. |
| Åtgärd | Gränserna är nu konfigurerbara via `RateLimiting`-sektionen. `appsettings.json` behåller de strikta värdena (auth 5/min, financial 20/min) som default; `appsettings.Development.json` sätter generösa värden (auth 100/min, financial 1000/min). Saknas sektionen faller koden tillbaka på de strikta värdena. |
| Verifierat | 60 snabba anrop i rad mot `/api/accounts` i dev – alla 200, 0 blockerade. |

### 12.1d ✨ Funktion – personal kan skapa konto åt en kund

| Fält | Värde |
|---|---|
| Filer (backend) | `CreateAccountRequest.cs`, `AccountsController.cs` |
| Filer (frontend) | `src/api/accounts.js`, `src/pages/Dashboard.jsx` |
| Bakgrund | `AccountsController.Create` hårdkodade `OwnerId = User.GetUserId()` – så även när personal skapade ett konto hamnade det på personalens eget konto. Det fanns ingen väg att skapa ett konto åt en kund. |
| Åtgärd | `CreateAccountRequest` har nu ett valfritt `OwnerEmail`. Controllern: om `OwnerEmail` anges **och** anroparen är personal → slår upp användaren via `UserManager.FindByEmailAsync` och sätter kontots ägare till den. Vanlig User som anger `OwnerEmail` → 403. Okänd e-post → 400. Tomt fält → kontot skapas åt anroparen (oförändrat beteende). Frontend: skapa-konto-modalen visar ett "Kundens e-post"-fält enbart för personal (`isStaff`). |
| Tester | 3 nya integrationstester i `AccountsIntegrationTests.cs` – personal skapar åt befintlig kund (verifierar att kunden ser kontot), okänd e-post → 400, vanlig User med `ownerEmail` → 403. |
| Verifierat | End-to-end: Teller skapade konto med `ownerEmail=user@test.com` → syns i kundens lista; okänd e-post → 400; User med `ownerEmail` → 403. |

### 12.2 Verifiering

| | Resultat |
|---|---|
| Backend-tester | ✅ 165/165 (160 + 2 transfer + 3 "skapa åt kund") |
| Frontend-build | ✅ `npm run build` rent |
| Frontend-lint | ✅ 0 fel, 0 varningar |
| Manuell test | ✅ Överföring user→user; personal skapar konto åt kund; rate limiter blockerar inte längre normal testning |

---

## 13. Lärarens feedback – fix/teacher-feedback-branchen

> Lärare "Nemo Sensei" levererade en detaljerad granskning. Två iterationer i samma branch (`fix/teacher-feedback`):
> Iteration 1 implementerade lärarens "top 5" (#1–#5). Iteration 2 fortsätter med resten av Phase 1 + 2 + 3.

### 13.1 Phase 1 Critical – allt åtgärdat utom Testcontainers

| # | Punkt | Status |
|---|---|---|
| 1 | `SeedUsersAsync` körs alltid | ✅ Gateat bakom `app.Environment.IsDevelopment()` i `DatabaseExtensions.cs` |
| 2 | Rate limit-undantag på `forgot/reset/confirm/change-password` | ✅ `[DisableRateLimiting]` borttaget – `"auth"`-policyn gäller nu |
| 3 | Idempotency-race ger 500 | ✅ `UnitOfWork` översätter `DbUpdateException` på unikt index → `IdempotencyConflictException`; alla 4 handlers fångar och returnerar vinnaren |
| 4 | Idempotency-key globalt unik (privacy leak) | ✅ Composite unique index `(IdempotencyKey, AccountId)`; lookup scopad till kontot |
| 5 | Sync Redis I/O i JWT-validering | ✅ `ITokenDenylist` är helt async; `OnTokenValidated` await:ar |
| 6 | Domain events firar utanför DB-transaktionen | ✅ **Outbox-mönster**: `OutboxEvent`-tabell, events serialiseras in i samma transaktion som aggregatet, `OutboxDispatcher` (BackgroundService) plockar oprocessade rader och publicerar via MediatR i bakgrunden |
| 7 | Mottagaren av en överföring notifieras inte | ✅ Nytt `MoneyReceived`-event raise:as på mottagar-aggregatet i `Account.TransferTo`; nytt `MoneyReceivedHandler` skickar notifiering |
| 8 | Integrationstester använder EF InMemory | ⏳ **Skippat** – Testcontainers kräver Docker hos alla utvecklare, byter hela test-infra (lärarens estimat 6h) |

### 13.2 Phase 2 Important – nästan allt åtgärdat

| # | Punkt | Status |
|---|---|---|
| 1 | MediatR läcker in i Domain | ✅ `IDomainEvent` är plain marker i Domain (inga NuGet-deps); Application har `DomainEventNotification<T>` som lindar events innan dispatch |
| 2 | `AdminController.GetUsers` är N+1 + sync | ✅ Async (`.ToListAsync`), enstaka JOIN-query mot UserRoles+Roles, paginerad via `page`/`pageSize` |
| 3 | Admin kan ta bort sig själv / sista admin | ✅ Båda blockerade i `DeleteUser` (400 BadRequest) |
| 4 | Lockout-meddelande läcker email-existens | ✅ Uniform `GenericFailure`-konstant i `LoginAsync` – ingen skillnad på okänt konto, låst eller obekräftat |
| 5 | JWT 24h utan refresh tokens | ⏳ **Skippat** – ny tabell + endpoint + frontend-integration (8h) |
| 6 | Card saknar RowVersion och har public setters | ✅ Privata setters; `Card.Issue()`-fabrik; `RowVersion`-property + `IsRowVersion()` i config; EF-migration |
| 7 | `AuditBehavior`/`ValidationBehavior` reflection för UserId | ⏳ **Delvis** – ICommand/IUserScopedRequest-interfaces skippade (touchar 15+ command-filer för liten värde); reflection behålls |
| 8 | `ConcurrencyRetryBehavior` körs även på queries | ✅ Skip på `typeof(TRequest).Name.EndsWith("Query")` |
| 9 | Egen JSON-shape i `ExceptionMiddleware` | ✅ `ProblemDetails`/`ValidationProblemDetails` (RFC 7807) – content-type `application/problem+json` |
| 10 | CORS är `AllowAnyMethod` + `AllowAnyHeader` | ✅ Snäv lista: `WithMethods("GET","POST","PUT","DELETE","OPTIONS")` + `WithHeaders("Content-Type","Authorization","Idempotency-Key","X-API-Version")` |
| 11 | Ingen strukturerad loggning / correlation ID | ✅ Serilog + Console-sink konfigurerad i `Program.cs`; `CorrelationIdMiddleware` pushar `X-Correlation-Id` till `LogContext` och ekar tillbaka i svaret; `UseSerilogRequestLogging` ger en rad per request |

### 13.3 Phase 3 Polish

| Punkt | Status |
|---|---|
| Dela `ServiceExtensions.cs` i mindre filer | ⏳ Skippat – organisatoriskt, ingen funktionsvinst |
| Ta bort tom `IRepository.cs`-stub | ✅ Borttagen |
| Lägg till `CardTests.cs` | ⏳ Skippat – Card täcks via `ActivateCardHandlerTests`, `BlockCardHandlerTests`, `CreateCardHandlerTests` |
| Typed `[FromHeader]` för Idempotency-Key | ✅ Alla 4 transaktions-endpoints (`Deposit`/`Withdraw`/`Transfer`/`PayInvoice`); `GetIdempotencyKey()`-helpern borttagen |
| Polly resilience på SMTP + Redis | ⏳ Skippat – kräver flaky-infra för att ge värde |
| OpenTelemetry tracing/metrics | ⏳ Skippat – kräver collector (Jaeger/OTLP) för att vara meningsfull |
| DataProtection-on-Redis | ⏳ Skippat – bara relevant vid multi-instance |

### 13.4 Paket-rekommendationer

| Paket | Status |
|---|---|
| MediatR ur Domain | ✅ Borttaget från `Domain.csproj` |
| FluentAssertions 8 → 7.2.0 | ✅ Pinned (kommersiell licens i 8+) |
| AutoMapper 16 → Mapster | ⏳ Skippat – mekanisk migration av alla mappnings-filer, låg värde för skoluppgift |
| Moq → NSubstitute | ⏳ Skippat – mekanisk omskrivning av alla mock-setups |
| Swashbuckle → Microsoft.AspNetCore.OpenApi | ⏳ Skippat – fungerar bra, byte är optional |
| Serilog | ✅ Tillagt (`Serilog.AspNetCore` 8.0.3) |

### 13.5 Verifiering

| | Resultat |
|---|---|
| Backend-build | ✅ Hela solutionen 0 fel, 0 warnings |
| Backend-tester | ✅ 218/218 |
| Migrationer | 2 nya: `CardRowVersion`, `Outbox` (utöver `IdempotencyKeyPerAccount` från förra branchen) |
| Kvar utanför scope | #8 Testcontainers · #5 Refresh tokens · #7 marker interfaces (partial) · Polly · OpenTelemetry · DataProtection-Redis · AutoMapper→Mapster · Moq→NSubstitute · Swashbuckle→OpenApi · split ServiceExtensions · CardTests |
