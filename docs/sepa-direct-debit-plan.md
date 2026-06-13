# SEPA Direct Debit rent flow — implementation sketch

**Status:** design sketch for review. **Not yet wired into the live payment path** —
payment changes need testing against Stripe test keys before deploy.

## Why

Stripe's EEA **card** rate is 1.5% + €0.25; Stripe **SEPA Direct Debit** is a flat
**€0.35** with no percentage (`stripe.com/en-es/pricing/local-payment-methods`). The
rent is the large line item, so collecting it by direct debit instead of card is the
single biggest fee saving available — e.g. on €4,200 of rent, ~€63 on a card becomes
**€0.35**. The platform commission and refundable deposit are smaller; offering SEPA
on the whole basket also stops the deposit silently costing a card fee you never
recover on refund.

## What makes this non-trivial

SEPA Direct Debit settles **asynchronously** (typically 1–5 business days), which
breaks three assumptions baked into the current flow
(`create-booking-checkout/index.ts`, `stripe-webhook/index.ts`):

1. **The webhook only acts on instant success.** It handles
   `checkout.session.completed` and bails unless `payment_status === "paid"`. A SEPA
   checkout fires `completed` with `payment_status` **not** `paid`; the funds confirm
   later via `checkout.session.async_payment_succeeded` (or fail via
   `checkout.session.async_payment_failed`). As written, a SEPA booking would never be
   recorded.
2. **The owner payout assumes settled funds.** The webhook does
   `stripe.transfers.create()` to the owner's connected account immediately. With SEPA
   the platform balance isn't funded yet, so the transfer must move to the settlement
   event (and ideally later still — see return risk).
3. **The 30-minute availability hold is far too short** for multi-day SEPA settlement.

## Recommended approach: one Checkout, guest chooses method, async-aware webhook

Keep the existing single hosted Checkout. Offer `card` **and** `sepa_debit` (and
Bizum, a free win for Spanish conversion); the guest picks on Stripe's page. If they
choose SEPA, the whole basket (rent + commission + deposit) settles by direct debit at
€0.35 flat. The only behavioural change for SEPA is that the booking confirms **on
settlement** instead of instantly.

A more granular split (rent via SEPA, deposit + commission via card in one flow) needs
two PaymentIntents and a much heavier integration; it's noted under "Alternatives" but
not recommended as the first step — rent dominates the total, so letting the guest pay
the whole basket by SEPA captures essentially all the saving with far less code.

---

### Change 1 — `create-booking-checkout/index.ts`

Offer the extra methods and make SEPA work (it needs a Customer for the mandate):

```ts
const session = await stripe.checkout.sessions.create({
  mode: "payment",
  payment_method_types: ["card", "sepa_debit", "bizum"], // NEW (was implicitly card)
  customer_email: user.email || undefined,
  customer_creation: "always",                            // NEW: SEPA mandate needs a Customer
  invoice_creation: { /* unchanged */ },
  line_items: lineItems,                                  // unchanged
  metadata: { /* unchanged */ },
  success_url: `${origin}/account.html?booking=success`,
  cancel_url: `${origin}/property.html?id=${property.id}&booking=cancelled`,
});
```

The 30-minute hold (lines ~219-231) stays for the "guest hasn't paid yet" window. It
gets **extended on settlement-pending** in the webhook (Change 2). Note the narrow
pre-existing race: if a guest sits on the hosted page longer than the hold, the dates
can be taken; SEPA makes this slightly more likely (entering an IBAN takes longer than
a card). Optional mitigation: raise the initial hold to a couple of hours. Abandoned
holds still expire and are cleaned up, so the only cost is dates showing unavailable a
bit longer.

### Change 2 — `stripe-webhook/index.ts`

Handle three events and gate confirmation on a once-only transition to `paid`. The
current idempotency trick — `upsert(..., { ignoreDuplicates: true }).select()` returns
a row only on first insert, and confirmation runs only `if (inserted)` — must be
preserved, because the confirmed-block insert would otherwise trip the GIST exclusion
constraint on redelivery and wrongly refund the booking.

```ts
const HANDLED = new Set([
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "checkout.session.async_payment_failed",
]);
if (!HANDLED.has(event.type)) return received();

const session = event.data.object as Stripe.Checkout.Session;
const db = createClient(/* service role */);

// (a) SEPA failed/returned during clearing → free the dates, mark the booking.
if (event.type === "checkout.session.async_payment_failed") {
  await db.from("bookings").update({ status: "payment_failed" })
    .eq("stripe_session_id", session.id);
  await db.from("availability_blocks").delete().eq("note", `hold:${session.id}`);
  return received();
}

// (b) SEPA submitted, not yet settled → provisional booking, keep the dates held.
if (event.type === "checkout.session.completed" && session.payment_status !== "paid") {
  await db.from("bookings").upsert({
    stripe_session_id: session.id, user_id: md.user_id || null,
    customer_email: customerEmail, property_id: md.property_id || null,
    property_name: md.property_name || "", start_date: md.start_date,
    end_date: md.end_date, months: Number(md.months) || null,
    amount_eur: (session.amount_total ?? 0) / 100, currency: session.currency || "eur",
    status: "processing",
  }, { onConflict: "stripe_session_id", ignoreDuplicates: true });

  // Extend the 30-min hold to cover settlement. Re-check there is no CONFIRMED
  // overlap first (a card booking may have confirmed these dates meanwhile).
  const nowIso = new Date().toISOString();
  const { data: clash } = await db.from("availability_blocks")
    .select("id").eq("property_id", md.property_id)
    .lte("start_date", md.end_date).gte("end_date", md.start_date)
    .is("hold_expires_at", null).limit(1);
  if (clash?.length) {
    await db.from("bookings").update({ status: "conflict" }).eq("stripe_session_id", session.id);
    // SEPA is already clearing and can't be cancelled cleanly; refund on settlement.
    return received();
  }
  await db.from("availability_blocks").delete().eq("note", `hold:${session.id}`);
  await db.from("availability_blocks").insert({
    property_id: md.property_id, start_date: md.start_date, end_date: md.end_date,
    user_id: md.user_id, note: `hold:${session.id}`,
    hold_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
  });
  return received();
}

// (c) Settled — card (`completed` + paid) or SEPA cleared (`async_payment_succeeded`).
//     Detect the first transition to `paid` so confirmation runs exactly once.
let firstTransition = false;
if (event.type === "checkout.session.completed") {
  // Card: insert; ignoreDuplicates makes redelivery a no-op (returns null).
  const { data } = await db.from("bookings").upsert(
    { /* full row as today */ status: "paid" },
    { onConflict: "stripe_session_id", ignoreDuplicates: true }).select().maybeSingle();
  firstTransition = Boolean(data);
} else {
  // SEPA cleared: promote processing → paid (and insert if `completed` was missed).
  const { data } = await db.from("bookings")
    .update({ status: "paid", invoice_url: invoiceUrl, invoice_pdf: invoicePdf, receipt_url: receiptUrl,
              stripe_payment_intent: String(session.payment_intent), amount_eur: (session.amount_total ?? 0) / 100 })
    .eq("stripe_session_id", session.id).neq("status", "paid").select().maybeSingle();
  firstTransition = Boolean(data);
  // (If no processing row existed, upsert-insert a paid row here and set firstTransition.)
}
if (!firstTransition) return received(); // redelivery → idempotent no-op

await confirmDatesPayoutEmail(db, stripe, session, invoiceUrl); // existing lines ~109-190, unchanged
```

`confirmDatesPayoutEmail` is the current body from ~line 109 onward (drop hold → insert
confirmed `stripe:${id}` block → conflict/refund guard → owner transfer → email),
extracted verbatim into a helper. Because it now runs only on `firstTransition`, the
confirmed-block insert can't double-fire — which also fixes a latent double-delivery
bug in today's card path.

### Change 3 — owner payout & SEPA return risk (important)

A settled SEPA debit can still be **returned for up to 8 weeks**. The webhook transfers
rent to the owner on settlement, so a later return would leave the platform out the
rent it already paid out. Two sensible mitigations, not mutually exclusive:

- **Delay the owner rent transfer until check-in** (the `start_date`). This is how
  rentals work anyway — you don't pay the landlord before move-in — and it parks the
  money safely past most of the SEPA return window. Implement as a scheduled job that
  transfers for bookings whose `start_date` has arrived and whose payment is `paid`,
  rather than transferring inline in the webhook.
- Or switch the owner leg from a separate `transfers.create` to a **destination charge
  / `on_behalf_of`** so a reversal propagates to the connected account automatically.

Recommendation: delay to check-in — simplest and matches the business.

### Change 4 — migration

`bookings.status` is free text (default `'paid'`), so `processing`, `payment_failed`,
and `conflict` need **no schema change**. Add only an index for the
scheduled-payout/admin queries:

```sql
-- supabase/upgrade-2026-06-sepa-bookings.sql
create index if not exists bookings_status_start_idx
  on public.bookings (status, start_date);
```

### Change 5 — frontend (status is no longer always "paid")

`loadMyBookings` already selects `status` but `account.js` renders every booking with a
hardcoded "Pagado" label, and `booking.js` shows "Pagado ahora" unconditionally. With
SEPA these can be `processing`:

- **`account.js` `renderBookings`** — badge by status: `paid` → "Pagada", `processing`
  → "Pago en proceso", `payment_failed` → "Pago fallido". (`booking-paid` class today.)
- **`account.js` success toast** (line ~149, `?booking=success`) — soften the copy:
  Stripe redirects here after submission for *both* methods, so it should read e.g.
  "Hemos recibido tu reserva. Si has pagado por domiciliación (SEPA), confirmaremos por
  correo en cuanto el cobro se complete (1–5 días laborables)."
- **`booking.js`** — show the status instead of always "Pagado ahora".
- **`loadOwnerDashboard`** — owners see `status`; badge or filter out non-`paid`.
- Add the new labels to the `translations` table (es/en).

A "payment processing" confirmation email on the provisional (b) step is optional but
good UX.

---

## Test plan (Stripe test mode)

- SEPA test IBAN `DE89370400440532013000`. Use the CLI to drive the async lifecycle:
  `stripe trigger checkout.session.async_payment_succeeded` and
  `…async_payment_failed`.
- Verify: provisional booking on `completed` (processing) holds the dates for 7 days;
  promotion to `paid` on success inserts the confirmed block, transfers (or schedules)
  the owner payout once, and emails; failure releases the hold and marks
  `payment_failed`.
- Redeliver each event (Stripe Dashboard → resend) and confirm **no** duplicate block,
  duplicate transfer, or erroneous refund (the `firstTransition` gate).
- Card path unchanged: instant `paid`, confirmed immediately.
- Conflict: start a SEPA checkout, confirm a card booking on the same dates, then settle
  the SEPA — booking goes `conflict` and is refunded.

## Rollout

1. Ship the async-aware webhook + migration first (handles SEPA correctly even though
   no one can pick it yet — safe, backward-compatible with the card path).
2. Move the owner payout to a check-in-time scheduled job.
3. Add `sepa_debit` (and `bizum`) to the Checkout session.
4. Ship the frontend status/badge + copy changes.
5. Monitor settlement and return rates before promoting SEPA in the UI.

## Alternatives considered

- **Split rent→SEPA, deposit+commission→card in one flow.** Two PaymentIntents / a
  SetupIntent + custom UI. More moving parts for marginal extra saving (rent already
  dominates). Revisit only if guests dislike paying the deposit by direct debit.
- **Mandate once, debit rent monthly** (`setup_future_usage: "off_session"` +
  scheduled monthly PaymentIntents). The "truest" long-term-rental model and lowest
  per-cycle cost, but a substantially bigger build (mandate storage, monthly billing,
  dunning). Good future direction; out of scope for this first step.
