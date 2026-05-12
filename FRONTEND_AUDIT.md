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

### Runda 5 – Slutaudit-åtgärder (senaste)
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

**1. Ikonerna i sidonavigationen är Unicode-tecken**
`▦ ⇄ ⚙ 🛡` renderas olika på Windows, macOS och Android. De saknar hover-state, konsekvent storlek och kan inte stylas med CSS. Byt till ett SVG-ikonbibliotek — Lucide React (`lucide-react`) är lätt, träd-skakas och passar Tailwind perfekt. Skillnaden i upplevd kvalitet är omedelbar.

**2. Kontostatus visas på engelska**
`Open`, `Frozen`, `Closed`, `Active`, `Inactive`, `Blocked`, `Expired` är backend-enumvärden som läckt rakt ut i UI:t. `TYPE_LABELS`-kartan finns redan för kontotyper — samma mönster behövs för statusar. En bank som visar "Blocked" i ett i övrigt helt svenskt gränssnitt ser halvfärdig ut.

**3. Kortvisning saknar kortdesign**
Korten listas som plain textrader. I alla seriösa bankgränssnitt visas kort som ett visuellt kort — gradient, maskerat nummer, kortinnehavare, utgångsdatum. Det tar ungefär 40 rader Tailwind-CSS. Ingenting kommunicerar "vi är en bank" lika omedelbart som ett väldesignat kortelement.

**4. Transaktioner saknar gruppering och ikoner**
Alla transaktioner ser identiska ut. En `+2 400 kr` insättning och en `-14 500 kr` hyresbetalning har exakt samma visuella vikt. Lösning: gruppera per datum ("Idag", "Igår", "8 maj"), lägg till riktningsikoner (pil ned = insättning, pil upp = uttag, dubbelpil = överföring). Det ger omedelbar visuell skanning.

**5. Inga toast-notifikationer**
Lyckade åtgärder (överföring genomförd, lösenord bytt) visas som inline-text i formuläret — lätt att missa, och försvinner om sidan navigeras bort. En global toast-komponent som glider in från hörnet och försvinner efter 4 sekunder är standardmönstret i finansiella produkter. `react-hot-toast` eller en enkel custom hook räcker.

---

### Viktiga förbättringar (UX-poäng)

**6. Ingen mobillayout**
Sidebaren är `w-56` utan responsiv kollaps. Under ~700px bredd är appen oanvändbar. En bank-app måste fungera på mobil — antingen ett hamburgermeny-mönster eller en bottom navigation bar. Tailwind gör detta med `md:flex hidden` på sidebaren och en `fixed bottom-0` nav för mobil.

**7. Inga sidövergångar**
Navigation är ögonblicklig och abrupt. Subtila `opacity`- eller `translateY`-animationer vid sidbyten (100ms ease-out) gör hela appen kännas mer genomarbetad utan att störa. React Router v6 + Tailwind CSS `transition`-klasser räcker.

**8. Auth-sidorna delar duplicerad layout**
`Login.jsx`, `Register.jsx`, `ForgotPassword.jsx`, `ResetPassword.jsx`, `ConfirmEmail.jsx` har alla identisk boilerplate: `min-h-screen bg-gray-950 flex items-center justify-center px-4`. En `AuthLayout`-komponent eliminerar dupliceringen och gör det enkelt att t.ex. lägga till en logotypbild konsekvent på alla auth-sidor.

**9. `autocomplete`-attribut saknas på formulär**
Lösenordsfälten har `type="password"` men inte `autoComplete="current-password"` / `autoComplete="new-password"`. Lösenordshanterare och webbläsarens autofyll fungerar sämre utan dessa. E-postfält bör ha `autoComplete="email"`. Det är en tillgänglighets- och säkerhetsfråga, inte bara UX.

**10. Tomt tillstånd utan visuell feedback**
"Inga konton ännu." är en textrad i grått. En subtil illustration eller ikon (tom plånbok, ett "+"-kort) kommunicerar tillståndet tydligare och ger ett naturligt CTA-utrymme för "Skapa ditt första konto"-knappen.

---

### Finslipning (proffsiga detaljer)

**11. Login.jsx och Settings.jsx har pedagogiska kommentarer**
Varje trivial kodrad förklaras: `// Förhindra att webbläsaren laddar om sidan`. Det är kommentarer för en nybörjare som lär sig React, inte produktionskod. I en riktig kodbas kommunicerar det att koden inte är redo. Ta bort alla kommentarer som förklarar VAD koden gör — lämna bara de som förklarar VARFÖR något icke-uppenbart val gjordes.

**12. ExpiryDate visas som ISO-sträng**
`2028-03-31T00:00:00` ska vara `03/28`. En rad: `new Date(card.expiryDate).toLocaleDateString('sv-SE', { month: '2-digit', year: '2-digit' })`.

**13. Sidtiteln uppdateras aldrig**
Webbläsarfliken visar alltid "NexaPay". En `useEffect(() => { document.title = \`${pageName} – NexaPay\` }, [])` per sida är en liten detalj som märks av användare som har många flikar öppna.

**14. Logout-knappen har ingen laddningsstatus**
`handleLogout` är async men knappen ger ingen feedback under anropet. Om API:et är långsamt kan användaren klicka flera gånger. Samma `disabled={loading}`-mönster som används på alla andra knappar.

**15. Kontokortet på Dashboard visar inte kontotyp med visuell distinktion**
`Lönekonto`, `Sparkonto`, `ISK` visas som en liten grå text längst ner. En subtil vänsterkantfärg (grön för lönekonto, blå för sparkonto, lila för ISK) skulle göra det omedelbart skanbart utan att ändra layouten.

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

| Prio | Åtgärd | Tid | Effekt |
|---|---|---|---|
| 1 | Byt Unicode-ikoner → Lucide React | 1–2h | Omedelbar kvalitetshöjning |
| 2 | Översätt statusetiketter till svenska | 30min | Konsekvens i hela appen |
| 3 | Visuell kortdesign i AccountDetail | 2–3h | Starkaste "det här är en bank"-signalen |
| 4 | Toast-notifikationer | 1–2h | Rätt feedback-mönster för finansiella åtgärder |
| 5 | Transaktionsgruppering + ikoner | 2h | Gör den mest använda vyn mycket mer läsbar |
| 6 | Ta bort pedagogiska kommentarer | 30min | Kodens trovärdighet i en code review |
