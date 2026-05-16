---
status: accepted
---

# Use Stripe Webhooks As Payment Confirmation Source Of Truth

Stripe is the V1 payment provider, and Stripe webhooks are the source of truth for successful payment confirmation. Customer redirects and UI states may improve the user experience, but paid order finalization should depend on webhook-confirmed payment state.

## Considered Options

- Finalize orders when the customer returns from Stripe checkout.
- Finalize orders from webhook-confirmed payment events.

## Consequences

Checkout and order finalization must be idempotent and resilient to delayed, duplicated, or retried webhook events. Stock should only be permanently consumed by paid orders; temporary checkout reservations must expire if payment is abandoned.
