# Implementation Sequence

Related durable docs:

- Domain language: [`../CONTEXT.md`](../CONTEXT.md)
- Product scope: [`prd.md`](./prd.md)
- Architectural decisions: [`adr/`](./adr/)

This sequence is the recommended order for turning the product PRD into working software. It is not a permanent project plan; update it as implementation teaches us more.

The guiding principle is to build cross-cutting foundations before they become expensive to retrofit, then move into the domain rules that make this product different from a normal brochure site.

## Status Legend

- `Done`: The expected implementation exists in the repository and has supporting evidence.
- `In progress`: Some expected pieces exist, but the step is not complete.
- `Not started`: No meaningful implementation has landed yet.
- `Deferred`: Intentionally outside the early implementation sequence.

## Current Progress Snapshot

Last reviewed: 2026-05-18

| Step | Status | Evidence |
| --- | --- | --- |
| 1. Testing Foundation | Done | `jest.config.ts`, `jest.setup.ts`, `package.json` test scripts, `__tests__/page.test.tsx`, `app/layout.test.tsx`, and `components/ui/button.test.tsx` exist. Test placement rules are documented in `AGENTS.md`. |
| 2. Application and Module Skeleton | Done | Capability module entry points exist for weekly menu, cart, checkout, orders, and kitchen logic. Shared primitives exist for result, domain error, money, and IDs. `AGENTS.md` documents capability ownership and minimal public exports. |
| 3. Sentry Error Monitoring | Done | `@sentry/nextjs` is installed; `instrumentation.ts`, `instrumentation-client.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`, and `next.config.ts` configure runtime capture and source-map upload. `/lib/observability/` owns capture wrappers, sanitization, release, and telemetry policy. `/api/dev/sentry-smoke` has verified capture in Sentry, and `docs/sentry.md` records durable guidance. |
| 4. Analytics Wrapper and Event Plan | Done | `posthog-js`, `posthog-node`, `/lib/observability/analytics.ts`, `/lib/observability/analytics-server.ts`, `/lib/observability/posthog.ts`, `/lib/observability/posthog-server.ts`, typed helper tests, homepage analytics tests, and `docs/posthog.md` are in place. Deeper flow instrumentation remains deferred to step 12. |
| 5. Internationalization Skeleton | Not started | No locale routes or dictionary structure are present. |
| 6. Database and Prisma Foundation | Not started | No Prisma dependency, schema, migration, or database configuration is present. |
| 7. Weekly Menu and Product Catalog | Not started | No weekly menu or product catalog domain, persistence, admin UI, or public menu rendering exists yet. |
| 8. Cart and Stock Validation | Not started | No cart, stock validation, or checkout reservation behavior exists yet. |
| 9. Stripe Checkout and Order Finalization | Not started | No Stripe dependency, checkout session creation, webhook handling, or order finalization exists yet. |
| 10. Orders and Admin Kitchen Workflow | Not started | No admin area, order workflow, production totals, or packing lists exist yet. |
| 11. Email Notifications | Not started | No transactional email integration or notification state tracking exists yet. |
| 12. Deeper PostHog Instrumentation | Not started | Depends on the analytics wrapper and completed customer/admin flows. |

## 1. Testing Foundation

Status: Done

Set up Jest and the first testing conventions before feature implementation.

This comes first because the site has several business rules that are easy to break: limited weekly stock, checkout finalization, order state transitions, and kitchen summaries. Starting with tests gives the project a repeatable way to develop these rules with TDD instead of adding tests after the behavior has already spread through UI and integration code.

Actionable outcomes:

- [x] Add the Jest setup that works with the current Next.js version.
- [x] Add a small example test that proves the setup works.
- [x] Decide where behavior-focused domain tests should live: colocate them with the module that owns the behavior, reserve root-level `__tests__` for app-level smoke, route, rendered layout, and cross-module integration tests, and keep direct tests of exported module-owned config beside the owning module.
- [x] Document the rule that tests should verify external behavior, not implementation details.

## 2. Application and Module Skeleton

Status: Done

Create the basic shape of the application before adding real commerce behavior.

This should define where domain logic, persistence access, validation, UI composition, and integration adapters belong. The goal is not to over-architect early; the goal is to avoid putting stock rules, payment state, and admin calculations directly inside page components.

Actionable outcomes:

- [x] Establish the first domain/service boundaries.
- [x] Decide how validation errors and domain errors should be represented.
- [x] Create a clear place for weekly menu, product, cart, checkout, order, and admin/kitchen logic.
- [x] Keep public interfaces small enough that internals can evolve.

## 3. Sentry Error Monitoring

Status: Done

Add Sentry early, but keep the integration thin.

Sentry is cross-cutting infrastructure. It is much easier to add before serious feature work than to retrofit after errors and edge cases are already being handled inconsistently. The initial implementation should prove capture works without trying to design a complete observability taxonomy.

Actionable outcomes:

- [x] Add Sentry configuration for the relevant client and server runtimes.
- [x] Verify that an intentional smoke-test error can be captured in development or a staging-like environment.
- [x] Ensure sensitive customer/payment details are not sent to Sentry.
- [x] Leave detailed custom tagging for later feature work, but document what we should expect to have in the final product (or what to aim for).

## 4. Analytics Wrapper and Event Plan

Status: In progress

Introduce the PostHog abstraction early, but do not instrument everything immediately.

Analytics should be baked into user flows, but event names should not be guessed before the flows exist. A thin wrapper and event naming convention gives future features a consistent path while avoiding a large speculative tracking project.

Actionable outcomes:

- [x] Add a small analytics wrapper instead of calling PostHog directly throughout the app.
- [x] Define initial event names for the expected funnel: `homepage_cta_clicked`, `weekly_menu_viewed`, `product_added`, `cart_viewed`, `checkout_started`, `pickup_slot_selected`, `payment_started`, `payment_succeeded`, and `order_confirmation_viewed`.
- [x] Document what properties are safe and useful to send in [`posthog.md`](./posthog.md).
- [x] Delay full instrumentation until each feature flow exists.
- [x] Define what full instrumentation would look like and document it.

Completion plan:

- [x] Split `/lib/observability/` into provider-specific files before adding more analytics behavior:
  - `index.ts`: public facade that re-exports project-owned observability APIs only.
  - `sentry.ts`: Sentry adapter that imports `@sentry/nextjs` and owns `captureException`, `captureMessage`, and Sentry scope attachment.
  - `sentry-context.ts`: Sentry context types, safe context keys, and context sanitization.
  - `posthog.ts`: PostHog adapter that imports `posthog-js` and owns SDK initialization and low-level capture.
  - `analytics.ts`: provider-neutral browser analytics facade that owns app event names, event property shaping, and calls the PostHog adapter.
  - `analytics-server.ts`: provider-neutral server analytics facade kept separate from browser code so the Node PostHog SDK is not bundled into client components.
- [x] Move the existing Sentry sanitizer tests beside the new Sentry context owner, and add tests for PostHog initialization and capture behavior.
- [x] Replace wizard-generated free-form analytics event strings in components with named app-level analytics helper functions. Map the primary homepage ordering CTA to `homepage_cta_clicked` and keep navigation or visit-planning clicks only behind a restricted secondary-engagement helper.
- [x] Prepare server-side analytics without overcommitting to unfinished checkout behavior:
  - add the minimal server PostHog adapter and dependency;
  - define a provider-neutral server event API in `analytics-server.ts`;
  - allow an optional analytics visitor ID sourced from PostHog's anonymous browser `distinct_id`;
  - keep server events safe when the visitor ID is absent;
  - suppress person profile creation for anonymous visitor server events;
  - keep concrete checkout reservation, Stripe, and persistence wiring deferred until those flows exist.
- [x] Add a small project-owned analytics enablement check that defaults to enabled when PostHog is configured, while leaving consent or notice UI as a future policy decision.
- [x] Model checkout abandonment as two signals: `checkout_exited` for soft browser exits from checkout, and `checkout_reservation_expired` for the real lifecycle event that releases a checkout reservation.
- [x] Keep [`posthog.md`](./posthog.md) updated as the analytics policy evolves, including event naming, safe property rules, disabled PostHog defaults, environment variables, analytics visitor identity, server event posture, consent posture, and the `/ingest` proxy paths.
- [x] Mark only the analytics wrapper outcome complete after the facade, adapter split, typed browser/server event contracts, enablement gate, tests, and documentation are in place. Keep actual product add, cart, checkout, payment success, checkout exit, reservation expiry, and order confirmation instrumentation deferred until those flows exist.

## 5. Internationalization Skeleton

Status: Not started

Set up the English/Norwegian route and dictionary structure before too much UI is built.

Localization can be added incrementally, but routing and copy structure become tedious to retrofit after many pages and components exist. This step should create the path for localized UI and product content without requiring final translations for every future screen.

Actionable outcomes:

- [ ] Establish supported locales and default locale.
- [ ] Add the route/layout pattern for localized pages.
- [ ] Add dictionaries or another translation mechanism for user-facing UI copy.
- [ ] Confirm product content can eventually be stored and rendered per locale.

## 6. Database and Prisma Foundation

Status: Not started

Add PostgreSQL and Prisma when the first persistent feature is ready.

The weekly menu and product catalog need durable storage, but database work should follow the module skeleton so persistence does not become the domain model. Prisma should provide schema, migrations, and relational access while business rules remain testable outside the database where possible.

Actionable outcomes:

- [ ] Add Prisma and initial PostgreSQL configuration.
- [ ] Define initial models for weekly menus, products, localized product content, pickup slots, and stock limits.
- [ ] Add migration workflow documentation.
- [ ] Add tests around domain behavior separately from ORM implementation details.

## 7. Weekly Menu and Product Catalog

Status: Not started

Build the core source of truth for the business: the active weekly menu.

This comes before cart and checkout because customers can only order what the baker has published. The weekly menu defines the homepage offer, product list, ordering availability, pickup slots, and stock limits that every later flow depends on.

Actionable outcomes:

- [ ] Allow an admin to create, edit, publish, close, and archive a weekly menu.
- [ ] Support 3-5 products per weekly menu.
- [ ] Store product name, description, price, image, allergen/dietary notes, and localized copy.
- [ ] Store stock limits and sold-out/closed state.
- [ ] Render the active weekly menu on the public homepage and product selection flow.

## 8. Cart and Stock Validation

Status: Not started

Implement cart behavior and stock rules before payment.

This is the most important TDD-heavy domain area. The system must prevent unlimited preorders and avoid overselling, including during concurrent checkout attempts. Payment should not be introduced until cart quantities, limits, sold-out behavior, and reservation rules are clear.

Actionable outcomes:

- [ ] Add guest cart behavior for active weekly products.
- [ ] Support quantity changes and removal.
- [ ] Prevent adding unavailable or sold-out products.
- [ ] Validate stock before checkout starts.
- [ ] Define how temporary checkout reservations expire when payment is abandoned.

## 9. Stripe Checkout and Order Finalization

Status: Not started

Add Stripe once product, cart, stock, and pickup rules are stable.

Stripe introduces external state, webhooks, payment failures, abandoned sessions, idempotency, and refunds. It should sit on top of already-tested domain rules rather than defining those rules itself. Stripe webhooks should become the source of truth for paid order finalization.

Actionable outcomes:

- [ ] Create Stripe checkout sessions from validated carts.
- [ ] Handle successful payment webhooks idempotently.
- [ ] Convert paid checkouts into orders.
- [ ] Release or expire abandoned checkout reservations.
- [ ] Add payment-aware states such as pending payment, paid, cancelled, and refunded.

## 10. Orders and Admin Kitchen Workflow

Status: Not started

Build the operational admin experience after paid orders exist.

The kitchen workflow should be grounded in real order data. Once orders are finalized, the admin can review production totals, packing lists, pickup-slot checklists, and status changes in a way that directly supports weekend fulfillment.

Actionable outcomes:

- [ ] Add an authenticated single-admin area.
- [ ] Show orders by week, product, pickup slot, and status.
- [ ] Generate production totals by product.
- [ ] Generate packing lists grouped by customer order.
- [ ] Support status transitions from paid through picked up.
- [ ] Include customer contact details for pickup issues.

## 11. Email Notifications

Status: Not started

Add transactional email once order states are reliable.

Emails should be triggered by durable order events, not by fragile UI actions. Confirmation, admin notification, cancellation/refund notices, and pickup reminders all depend on trustworthy order state and customer contact details.

Actionable outcomes:

- [ ] Send customer order confirmation after successful payment.
- [ ] Send admin new-order notification.
- [ ] Send cancellation/refund notifications.
- [ ] Add pickup reminders for selected pickup slots.
- [ ] Track notification send state to avoid duplicate sends.

## 12. Deeper PostHog Instrumentation

Status: Not started

Expand analytics after the major customer and admin flows exist.

Once the homepage, product selection, cart, checkout, and order confirmation flows are real, PostHog can track meaningful behavior instead of speculative events. This should refine conversion insight without polluting the codebase with provider-specific calls.

Actionable outcomes:

- [ ] Instrument the agreed customer funnel events.
- [ ] Add useful event properties without sending personal or sensitive data.
- [ ] Track checkout abandonment and payment success.
- [ ] Track product interest and sold-out interactions.
- [ ] Review event names before launch so dashboards are coherent.

## Deferred Until Later

Status: Deferred

These are intentionally not part of the early implementation sequence:

- [ ] Vipps payment integration.
- [ ] Delivery support.
- [ ] Customer accounts.
- [ ] SMS notifications.
- [ ] Multiple admin or staff roles.
- [ ] Loyalty, subscriptions, or recurring orders.

They should become their own feature PRDs when the core preorder flow is stable.
