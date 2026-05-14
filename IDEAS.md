# NexaPay – Idéer & framtida funktioner

> Backlog för funktioner som inte är beslutade/planerade än. Inget här är åtagande –
> det är underlag för att kunna fatta beslut senare.

---

## 1. Betala faktura (OCR-betalning)

**Status:** Idé – ej påbörjad
**Föreslagen branch:** `feature/invoice-payment` (egen branch – detta är en feature, inte en audit-åtgärd)

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

### Öppna frågor

- Ska "extern mottagare" modelleras alls, eller är det bara en utbetalning från ett konto?
- Stödja kommande betalningar (förfallodatum i framtiden) eller bara direktbetalning i v1?
- Behövs ett betalningsregister/mottagarlista, eller skriver man in bankgiro varje gång?
