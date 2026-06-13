# Payment Processor Comparison — Stripe Alternatives for Ebrostay

**Date:** 2026-06-13
**Context:** Ebrostay is a Spain-based (EUR) marketplace for medium/long-term apartment
rentals. It currently runs on two Stripe products:

1. **Stripe Checkout** (hosted) — guests pay `rent × months` + a 15% Ebrostay
   commission (capped at one month, VAT 21% incl.) + a refundable deposit, with
   invoice generation and Spanish VAT handling
   (`supabase/functions/create-booking-checkout/index.ts`).
2. **Stripe Connect Express** — property owners onboard as connected accounts so
   they can be paid out (`supabase/functions/owner-connect/index.ts`).

That second piece is the **decisive constraint**: any replacement must support a
true *marketplace* model — onboarding third-party sellers (owners) with KYC/KYB,
splitting one guest payment between platform commission and owner, and paying out
to many separate owners. This is regulated activity (see "Why this needs a licensed
PSP" below), so most "cheaper" processors are disqualified before fees even matter.

> **Pricing caveat:** figures below are list prices from official pages where noted,
> gathered June 2026. Several providers (Adyen, PayPal platform, Mangopay, bank
> TPVs) price by quote. MONEI and Paycomet figures conflicted between sources — get
> a written quote before deciding. Confirm EUR/Spain rates in-product.

---

## Headline answer: Can Revolut Business be used? **No.**

Revolut Business merchant acquiring is **single-merchant only**. This is a hard
blocker for Ebrostay's owner-payout model, and it is structural, not a pricing
quirk:

- A Revolut **Merchant account is a sub-account of your own Business account** and
  "only receives payments from your sales." Funds settle to *your* account and can
  only be withdrawn to *your own* linked bank account.
- The Merchant API exposes only Orders / Pay / Capture / Refunds / Webhooks /
  Payouts-to-your-own-bank. There are **no marketplace primitives** — no connected
  / sub-merchant accounts, no seller KYB, no application fees, no
  destination/split/transfer charges.
- Revolut explicitly **restricts payment-intermediary / aggregator business models**
  in its acquiring terms.

There is a theoretical workaround — collect into your own Revolut account, then use
the separate **Business API** to send money to owners as counterparties — but this
makes *Ebrostay* the unlicensed money intermediary holding everyone's funds. That is
exactly the "money remittance" activity PSD2 regulates, plus it commingles owner
funds with yours (a safeguarding breach). **Do not build on this.** Revolut never
appears on any credible "Stripe Connect alternative" list.

What Revolut *is* good at (for reference): competitive EEA card rates (**1% + €0.20**
consumer EEA cards; 2.8% + €0.20 commercial/non-EEA), fast settlement into your own
account, clean single-merchant API, Bizum not listed but Revolut Pay / Apple Pay /
Google Pay / Pay-by-Bank supported. None of that overcomes the marketplace blocker.

*Verification note: Revolut's help-centre and developer-docs pages block automated
fetching (HTTP 403); the verdict rests on official-page snippets plus the directly
fetched Business API page, and is established by the consistent absence of any
marketplace capability across the documented surface. Confidence: high.*

---

## The marketplace filter — who survives it

| Provider | 3rd-party seller payouts? | Self-serve? | Bizum | Verdict for Ebrostay |
|---|---|---|---|---|
| **Stripe Connect** (incumbent) | ✅ Yes | ✅ Yes | ✅ Yes | Already integrated; baseline to beat |
| **Mollie Connect** | ✅ Yes (Connect for Marketplaces) | ✅ Yes | ✅ Turnkey | Strongest EU-native self-serve alternative |
| **Adyen for Platforms** | ✅ Yes | ❌ Sales-led | ⚠️ Needs bank contract | Cheapest at scale, heavy/enterprise |
| **Paycomet** (Spanish PSP) | ✅ Yes (`splitTransfer`) | ❌ Sales-led | ✅ Native | Strong local fit, Banco de España licensed |
| **MONEI** (Spanish PSP) | ⚠️ Partial (Connect + beta Payouts) | Partial | ✅ Native | Modern API, payout path less mature |
| **Mangopay** | ✅ Yes | ❌ Sales-led | — | EU specialist, no public pricing |
| **Lemonway** | ✅ Yes | ❌ Sales-led | — | EU specialist, expensive setup |
| **PayPal Commerce Platform** | ✅ Yes (multiparty) | ❌ Sales-led | ❌ | Spain supported, quote-based, card-costly |
| **Revolut Business** | ❌ **No** | — | ❌ | **Excluded — single-merchant** |
| **Braintree Marketplace** | ❌ No (US-domicile only, winding down) | — | ❌ | **Excluded** |
| **GoCardless** | ❌ No (single-merchant collection) | ✅ | ❌ | Not a payout layer — but see SEPA below |
| **Bank Redsys TPV** (CaixaBank/BBVA/Santander) | ❌ No (processor only) | ❌ | ✅ | Cheap acquiring, no marketplace layer |
| **Paddle / Lemon Squeezy** | ❌ No (single-seller merchant-of-record) | ✅ | ❌ | **Not applicable** to multi-seller |

---

## Fees: the baseline to beat (Stripe, Spain/EUR)

Stripe's EEA card rate is **already low** — this matters for the recommendation.
Source: stripe.com/en-es/pricing and /connect/pricing.

| Item | Stripe (Spain) |
|---|---|
| EEA consumer cards | **1.5% + €0.25** |
| UK cards | 2.5% + €0.25 |
| International / non-EEA cards | 3.25% + €0.25 |
| Currency conversion | +2% |
| **Bizum** | 1.5% + €0.25 |
| **SEPA Direct Debit** | **€0.35 flat** (no %) |
| Connect — monthly active account | €2 per owner who receives a payout that month |
| Connect — per payout to owner | 0.25% + €0.10 |
| Instant payout | 1%, min €0.50 |
| Disputes | €20 (refunded if won) |
| Invoicing (standalone) | 0.4–0.5% per paid invoice |

Card fees and Connect fees **stack**: you pay the processing fee on the guest charge
*plus* the Connect fee on the payout to the owner.

### Where your fee pain almost certainly comes from

1.5% + €0.25 on EEA cards is among the lowest list rates in the market, so "Stripe
is expensive" usually traces to **what** is being charged, not the rate:

- **You charge large amounts on cards.** A multi-month rent total + deposit is a big
  number, and 1.5% of a big number is a big fee — even though most of it is
  pass-through (rent to the owner) or refundable (deposit).
- **The refundable deposit costs you the card fee twice over.** Stripe does **not**
  return the processing fee when you refund. Taking a €700 deposit on a card costs
  ~€10.75 you never recover.
- **Non-EEA guests (3.25%) and FX (+2%)** quietly inflate the blended rate.
- **Connect payout fees** add 0.25% + €0.10 + €2/owner/month on top.

### Worked example (illustrative)

€700/month rent, 6-month stay, €700 deposit. Guest is charged
rent €4,200 + commission €630 (15% capped at one month) + deposit €700 = **€5,530**.

| Collection method | Fee on the €5,530 charge |
|---|---|
| Stripe EEA **card** (1.5% + €0.25) | **≈ €83** |
| + Connect payout to owner (0.25% + €0.10 on €4,200) | + ≈ €11 + €2 account |
| **Total ≈ €96 per booking** | |
| If the **rent €4,200 moved to SEPA Direct Debit** (€0.35 flat) | rent leg drops from ~€63 to **€0.35** |

The single biggest lever is **not the processor — it's the payment method.** Cards
charge a percentage; SEPA Direct Debit is flat/capped. On a €4,200 rent collection
that is roughly €63 vs €0.35.

---

## The real options that lower cost

### 1. Stay on Stripe, but collect rent via SEPA Direct Debit (biggest, lowest-risk win)

Stripe already supports SEPA Direct Debit at **€0.35 flat** (no percentage) and it
plugs into your existing Stripe Connect setup with no new vendor, no new KYB, no
migration. Reserve cards for the deposit and commission (smaller, and where instant
guaranteed funds matter), and pull the large rent amounts over SEPA.

- **Pros:** Massive saving on the largest line item; keeps Connect payouts, invoicing,
  webhooks, and owner onboarding exactly as they are today.
- **Cons:** SEPA DD settles in days, not instantly, and carries failure/return risk —
  so you'd confirm a booking on mandate setup + first-collection success rather than
  instantly. Requires reworking the checkout flow from one upfront card charge to a
  mandate + scheduled collections (which also fits "monthly rent" semantics nicely).
- Stripe SEPA DD's €0.35 flat actually **beats GoCardless's €2 cap** for large rents.

### 2. Reconsider how the deposit is handled

Charging a refundable deposit on a card and refunding it later means paying the card
fee for nothing. Options: collect the deposit via SEPA DD (€0.35), or use a card
*authorization/hold* instead of a capture where your flow allows. This alone removes
a recurring, unrecoverable cost.

### 3. Add native Bizum

Bizum is extremely popular with Spanish consumers and you don't currently offer it.
Stripe supports it (1.5% + €0.25). Mollie, MONEI, and Paycomet offer it turnkey too.
This is about conversion more than cost.

### 4. Switch processor only if volume justifies it

- **Adyen for Platforms** uses **Interchange++** (regulated EEA consumer debit
  interchange is capped at 0.2% / credit 0.3%, + scheme fees, + Adyen's ~0.6% markup,
  + ~€0.11 fixed). All-in this can land **below Stripe's flat 1.5%** on card volume —
  but it is sales-led, has an (industry-dependent, unpublished) minimum monthly
  invoice, Bizum needs a separate local bank acquirer contract, and integration is
  heavier. Worth it once card volume is substantial; overkill for an early-stage book.
- **Mollie Connect** is the cleanest self-serve EU-native alternative, but its card
  rate is **1.8% + €0.25** — *higher* than Stripe's 1.5% for EEA cards. Its draws are
  turnkey Bizum, no minimums, and a simple flat model — not a lower card cost. A
  lateral move, not a saving.

---

## The Spanish specialists (genuine marketplace + native Bizum)

Both are licensed in Spain and offer documented split-payout flows — the most
interesting "local" options if you want Bizum-first and EUR-native handling.

- **Paycomet** (Banco de España–authorised Payment Entity). Documented marketplace
  **`splitTransfer`** flow: collect the full basket to a marketplace wallet, then
  distribute to each owner (SPLIT into per-vendor wallets, or SEPA remittance to their
  IBAN), auto-deducting your commission; reversible within 90 days. Native Bizum, cards,
  SEPA. Reported card fees ~0.5% + €0.09 (Spain) — **unconfirmed, get a quote.** This is
  the closest off-the-shelf Spanish equivalent to Stripe Connect + Bizum.
- **MONEI**. Modern API, native Bizum, and **MONEI Connect** handles partner KYC +
  payouts — but the explicit *split-at-checkout to a third-party seller* is less
  clearly a finished product, and the standalone Payouts API is in closed beta
  (requires a €5,000 top-up). Pricing is interchange++/dynamic (€0.10/day +
  ~€17/chargeback on the entry tier). Validate the exact owner-split mechanics with
  their team before committing.

EU marketplace specialists **Mangopay** (no public pricing) and **Lemonway**
(~€5,490 setup + €840/mo — steep for your stage) are capable but sales-led; better
suited once you have scale or need bespoke flows.

---

## What's explicitly *not* viable, and why

- **Revolut Business** — single-merchant; no Connect equivalent (the headline blocker).
- **Braintree Marketplace** — restricted to US-domiciled master + sub-merchants, and
  being wound down. Unusable from Spain.
- **GoCardless alone** — superb, cheap *collection* (SEPA DD capped at €2/txn) but it
  settles to one merchant account; its 2025 "Outbound Payments" sends your own money
  out, it is not an automated marketplace split. Use it (or Stripe SEPA) for the rent
  leg, not as the owner-payout layer.
- **Bank Redsys TPVs (CaixaBank/BBVA/Santander) & Getnet** — cheap single-merchant
  acquiring (negotiated ~0.35–0.8%), Bizum-capable, but no marketplace/split layer.
  Only useful as the acquiring rail *behind* a licensed marketplace PSP.
- **Paddle / Lemon Squeezy** — single-seller merchant-of-record for your own digital
  products; Paddle's terms ban marketplaces outright. Not applicable.

---

## Why this needs a licensed PSP (regulatory reality)

Under **PSD2**, receiving a buyer's funds and forwarding them to a seller is itself a
regulated payment service (money remittance / executing payment transactions). A
normal business bank account does **not** make this legal: the *activity* is regulated
regardless of which account holds the money, and safeguarding rules require licensed
firms to segregate user funds (you can't commingle owner money with Ebrostay's). The
commercial-agent exemption generally fails for marketplaces that contract with both
sides and take control of funds. That's why you use a licensed provider (Stripe,
Adyen, Mollie, Mangopay, Lemonway, Paycomet) — they hold the licence and provide the
per-seller wallets, split, KYC/AML, and segregated safeguarding, *provided funds flow
through the PSP's rails rather than Ebrostay's own account.* **PSD3 + PSR** (provisional
agreement Nov 2025, final text expected H1 2026) narrows the exemptions further. *This
is a factual summary, not legal advice.*

---

## Recommendation

1. **Don't switch processors to chase a lower rate — Stripe's 1.5% EEA card rate is
   already near the floor.** Revolut is out entirely (single-merchant).
2. **Get the biggest saving by changing payment method, not provider:** collect the
   large rent amounts via **SEPA Direct Debit** (Stripe's own, €0.35 flat) instead of
   cards. Reserve cards/Bizum for the deposit and commission. This keeps your entire
   Connect + invoicing stack intact.
3. **Stop paying card fees on the refundable deposit** — move it to SEPA DD or a card
   hold/authorization.
4. **Add Bizum** for Spanish conversion (Stripe supports it; or go Bizum-native via
   Paycomet/MONEI).
5. **Only consider migrating** if/when card volume is high enough that **Adyen for
   Platforms** (Interchange++, can beat 1.5%) justifies its sales-led, heavier setup —
   or if you specifically want a **Bizum-first Spanish stack**, in which case price
   **Paycomet** against Stripe. Mollie is a clean alternative but won't cut card cost.

---

## Sources

**Stripe:** stripe.com/en-es/pricing · stripe.com/en-es/connect/pricing ·
stripe.com/en-es/pricing/local-payment-methods · stripe.com/en-es/invoicing/pricing
**Revolut:** developer.revolut.com/docs/merchant/merchant-api ·
help.revolut.com/business/help/merchant-accounts/setting-up-a-merchant-account/what-is-a-merchant-account/ ·
help.revolut.com/en-ES/help/merchant-accounts/fees/how-much-does-it-cost-to-accept-card-payments/ ·
revolut.com/en-ES/legal/business-acquiring
**Adyen:** adyen.com/platform-payments · docs.adyen.com/platforms · adyen.com/pricing ·
docs.adyen.com/payment-methods/bizum
**Mollie:** docs.mollie.com/docs/connect-overview · mollie.com/solutions/payments-for-marketplaces · mollie.com/pricing
**PayPal/Braintree:** developer.paypal.com/docs/multiparty/ · paypal.com/es/business/paypal-business-fees ·
developer.paypal.com/braintree/docs/guides/braintree-marketplace/overview
**GoCardless:** gocardless.com/pricing-eu · gocardless.com/guides/sepa/mandates/
**MONEI:** monei.com/connect/ · monei.com/pricing/ · monei.com/payment-methods/bizum/
**Paycomet:** docs.paycomet.com/en/otras-integraciones/split-transfer-marketplace · paycomet.com/en/payment-methods/bizum
**Mangopay / Lemonway:** mangopay.com/pricing · lemonway.com/en/pricing
**Redsys / Spanish banks:** redsys.es · pagosrecurrentes.com/blog/redsys-comisiones-guia-completa
**Regulation (PSD2/PSD3):** stripe.com/guides/what-platforms-and-marketplaces-can-expect-from-psd3 ·
nortonrosefulbright.com (PSD3/PSR 2026 readiness)
