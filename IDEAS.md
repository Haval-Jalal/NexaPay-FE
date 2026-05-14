# NexaPay – Idéer & framtida funktioner

> Backlog för funktioner som inte är beslutade/planerade än. Inget här är åtagande –
> det är underlag för att kunna fatta beslut senare.

---

## 1. Betala faktura (OCR-betalning)

**Status:** ✅ Implementerad (v1) – branch `feature/invoice-payment`
**Byggd enligt "minimal version" nedan.** Specen kvar som referens på vad som byggdes.

Implementerat i v1:
- Backend: `TransactionType.InvoicePayment`, `Bankgiro`/`Ocr`-fält på `Transaction`, `Account.PayInvoice()`, `OcrPolicy` (mod-10), `PayInvoice`-command/handler/validator, `POST /api/transactions/invoice-payment`, EF-migration `AddInvoicePaymentFields`. Tester: 3 integrationstester + `OcrPolicyTests`.
- Frontend: `payInvoice()` i `api/transactions.js`, sida `PayInvoice.jsx` (`/pay-invoice`) med klientsidig mod-10-validering, navlänk i `Layout.jsx`, `InvoicePayment` visas i transaktionslistan i `AccountDetail.jsx`.

### Bakgrund

Idag finns bara konto-till-konto-överföring (kontonummer → kontonummer). En "Betala
faktura"-funktion skulle låta en användare betala en faktura mot bankgiro/plusgiro med
ett OCR-nummer som referens – det vanligaste betalflödet i en svensk bankapp.

### Omfattning (förslag på minimal version)

En fakturabetalning är i grunden en överföring till en extern betalningsmottagare,
identifierad av bankgiro/plusgiro + OCR. Minsta rimliga version:

- Användaren anger: från-konto, mottagarens bankgiro/plusgiro, OCR-nummer, belopp, ev. förfallodatum
- Pengarna dras från från-kontot; ingen intern mottagare finns (mottagaren är "extern")
- Transaktionen sparas med en ny typ så den kan särskiljas i historiken

### Fält

| Fält | Krävs | Kommentar |
|---|---|---|
| Från-konto | ✅ | Eget öppet konto (samma dropdown som Överföring) |
| Bankgiro/plusgiro | ✅ | Mottagarens nummer – formatvalidering |
| OCR-nummer | ✅ | Referensnummer – mod-10/Luhn-validering (se nedan) |
| Belopp | ✅ | Minst 1, samma valuta som från-kontot |
| Förfallodatum | ⬜ | Valfritt – om man vill stödja framtida betalning (kan hoppas i v1) |

### OCR-validering

OCR-numret ska valideras innan betalning:
- **Längdkontroll** – sista siffran kan vara en längdkod (OCR-standarden har varianter)
- **Mod-10 / Luhn** – sista siffran är en kontrollsiffra
- Validering bör ske både i frontend (snabb feedback) och backend (auktoritativt)

### Vad som krävs

**Backend (`NexaPay`):**
- Ny `TransactionType.InvoicePayment` (eller liknande)
- Fält för bankgiro/plusgiro + OCR på `Transaction` (eller en egen `InvoicePayment`-entitet)
- OCR-validering (mod-10) – domänlogik, samma plats som övriga invarianter
- Ny endpoint, t.ex. `POST /api/transactions/invoice-payment`
- Validator (FluentValidation) för request
- Tester: OCR-validering (giltig/ogiltig kontrollsiffra), lyckad betalning, otillräckligt saldo

**Frontend (`NexaPay-FE`):**
- Ny sida "Betala faktura" + route (skyddad, samma rollkrav som Överföring: `can.transfer`)
- Formulär med OCR-fält + klientvalidering
- Ny api-funktion i `src/api/transactions.js`
- Länk i `Layout.jsx`-navigeringen
- `Idempotency-Key` på betalningsanropet (samma mönster som deposit/withdraw/transfer)

### Öppna frågor – beslut i v1

- **Extern mottagare modelleras inte** – ingen entitet; bankgiro + OCR lagras som fält på transaktionen, saldot minskar som vid ett uttag.
- **Ingen framtida betalning** – endast direktbetalning (förfallodatum skippat i v1).
- **Inget mottagarregister** – bankgiro skrivs in varje gång.

Dessa kan tas upp igen om funktionen ska byggas ut.
