# Outreach templates

Reusable copy for the corporate-rental outreach to the prospect list in
`../research/`.

- **`outreach-email-ES.md`** — Spanish intro + follow-up (use this for most
  Zaragoza/Aragón HR & operations contacts).
- **`outreach-email-EN.md`** — English intro + follow-up (for international
  global-mobility contacts at multinationals).

## How to use

1. Pick the target rows from `../research/plaza-companies.csv`. **Send to
   verbatim/published emails first** (the `All emails found` column); treat the
   `Inferred emails` column as unverified and verify before using.
2. Personalise the `{{merge fields}}` per company. A mail-merge tool
   (e.g. your CRM, Brevo, Mailchimp transactional) can pull straight from the CSV.
3. Keep the **privacy/opt-out footer on every email** — it's the legal basis for
   B2B cold outreach in Spain (GDPR Art. 6(1)(f) / LOPDGDD / LSSI).

## Sending hygiene (important to protect deliverability)

- **Verify inferred addresses** with an email-verification tool (Hunter,
  ZeroBounce, NeverBounce) before sending — guessed addresses bounce, and bounces
  hurt your domain reputation.
- **Warm up**: ramp volume gradually (e.g. 20–50/day rising over 2–3 weeks), not
  hundreds in one blast, or the sending domain can get throttled/blacklisted.
- Set up **SPF, DKIM and DMARC** on the sending domain first.
- **Honour every opt-out** immediately and keep a record (legitimate-interest
  assessment + suppression list).
- Prioritise by the relevance/priority notes in the research sheet: the
  Zaragoza-commutable, higher-fit companies convert; the Huesca/Teruel rows are
  tagged non-commutable/lower-fit (added for volume only).
