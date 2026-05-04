# Implementation Sequence

This sequence is the recommended order for turning the product PRD into working software. It is not a permanent project plan; update it as implementation teaches us more.

The guiding principle is to build cross-cutting foundations before they become expensive to retrofit, then move into the domain rules that make this product different from a normal brochure site.

## 1. Testing Foundation

Set up Jest and the first testing conventions before feature implementation.

This comes first because the site has several business rules that are easy to break: limited weekly stock, checkout finalization, order state transitions, and kitchen summaries. Starting with tests gives the project a repeatable way to develop these rules with TDD instead of adding tests after the behavior has already spread through UI and integration code.

Actionable outcomes:

- Add the Jest setup that works with the current Next.js version.
- Add a small example test that proves the setup works.
- Decide where behavior-focused domain tests should live: colocate them with the module that owns the behavior, and reserve root-level `__tests__` for app-level smoke, route, layout, and cross-module integration tests.
- Document the rule that tests should verify external behavior, not implementation details.

## 2. Application and Module Skeleton

Create the basic shape of the application before adding real commerce behavior.

This should define where domain logic, persistence access, validation, UI composition, and integration adapters belong. The goal is not to over-architect early; the goal is to avoid putting stock rules, payment state, and admin calculations directly inside page components.

Actionable outcomes:

- Establish the first domain/service boundaries.
- Decide how validation errors and domain errors should be represented.
- Create a clear place for weekly menu, product, cart, checkout, order, and admin/kitchen logic.
- Keep public interfaces small enough that internals can evolve.

## 3. Sentry Error Monitoring

Add Sentry early, but keep the integration thin.

Sentry is cross-cutting infrastructure. It is much easier to add before serious feature work than to retrofit after errors and edge cases are already being handled inconsistently. The initial implementation should prove capture works without trying to design a complete observability taxonomy.

Actionable outcomes:

- Add Sentry configuration for the relevant client and server runtimes.
- Verify that an intentional smoke-test error can be captured in development or a staging-like environment.
- Ensure sensitive customer/payment details are not sent to Sentry.
- Leave detailed custom tagging for later feature work.

## 4. Analytics Wrapper and Event Plan

Introduce the PostHog abstraction early, but do not instrument everything immediately.

Analytics should be baked into user flows, but event names should not be guessed before the flows exist. A thin wrapper and event naming convention gives future features a consistent path while avoiding a large speculative tracking project.

Actionable outcomes:

- Add a small analytics wrapper instead of calling PostHog directly throughout the app.
- Define initial event names for the expected funnel: homepage CTA click, product add, cart view, checkout started, payment success, and checkout abandonment.
- Document what properties are safe and useful to send.
- Delay full instrumentation until each feature flow exists.

## 5. Internationalization Skeleton

Set up the English/Norwegian route and dictionary structure before too much UI is built.

Localization can be added incrementally, but routing and copy structure become tedious to retrofit after many pages and components exist. This step should create the path for localized UI and product content without requiring final translations for every future screen.

Actionable outcomes:

- Establish supported locales and default locale.
- Add the route/layout pattern for localized pages.
- Add dictionaries or another translation mechanism for user-facing UI copy.
- Confirm product content can eventually be stored and rendered per locale.

## 6. Database and Prisma Foundation

Add PostgreSQL and Prisma when the first persistent feature is ready.

The weekly menu and product catalog need durable storage, but database work should follow the module skeleton so persistence does not become the domain model. Prisma should provide schema, migrations, and relational access while business rules remain testable outside the database where possible.

Actionable outcomes:

- Add Prisma and initial PostgreSQL configuration.
- Define initial models for weekly menus, products, localized product content, pickup slots, and stock limits.
- Add migration workflow documentation.
- Add tests around domain behavior separately from ORM implementation details.

## 7. Weekly Menu and Product Catalog

Build the core source of truth for the business: the active weekly menu.

This comes before cart and checkout because customers can only order what the baker has published. The weekly menu defines the homepage offer, product list, ordering availability, pickup slots, and stock limits that every later flow depends on.

Actionable outcomes:

- Allow an admin to create, edit, publish, close, and archive a weekly menu.
- Support 3-5 products per weekly menu.
- Store product name, description, price, image, allergen/dietary notes, and localized copy.
- Store stock limits and sold-out/closed state.
- Render the active weekly menu on the public homepage and product selection flow.

## 8. Cart and Stock Validation

Implement cart behavior and stock rules before payment.

This is the most important TDD-heavy domain area. The system must prevent unlimited preorders and avoid overselling, including during concurrent checkout attempts. Payment should not be introduced until cart quantities, limits, sold-out behavior, and reservation rules are clear.

Actionable outcomes:

- Add guest cart behavior for active weekly products.
- Support quantity changes and removal.
- Prevent adding unavailable or sold-out products.
- Validate stock before checkout starts.
- Define how temporary checkout reservations expire when payment is abandoned.

## 9. Stripe Checkout and Order Finalization

Add Stripe once product, cart, stock, and pickup rules are stable.

Stripe introduces external state, webhooks, payment failures, abandoned sessions, idempotency, and refunds. It should sit on top of already-tested domain rules rather than defining those rules itself. Stripe webhooks should become the source of truth for paid order finalization.

Actionable outcomes:

- Create Stripe checkout sessions from validated carts.
- Handle successful payment webhooks idempotently.
- Convert paid checkouts into orders.
- Release or expire abandoned checkout reservations.
- Add payment-aware states such as pending payment, paid, cancelled, and refunded.

## 10. Orders and Admin Kitchen Workflow

Build the operational admin experience after paid orders exist.

The kitchen workflow should be grounded in real order data. Once orders are finalized, the admin can review production totals, packing lists, pickup-slot checklists, and status changes in a way that directly supports weekend fulfillment.

Actionable outcomes:

- Add an authenticated single-admin area.
- Show orders by week, product, pickup slot, and status.
- Generate production totals by product.
- Generate packing lists grouped by customer order.
- Support status transitions from paid through picked up.
- Include customer contact details for pickup issues.

## 11. Email Notifications

Add transactional email once order states are reliable.

Emails should be triggered by durable order events, not by fragile UI actions. Confirmation, admin notification, cancellation/refund notices, and pickup reminders all depend on trustworthy order state and customer contact details.

Actionable outcomes:

- Send customer order confirmation after successful payment.
- Send admin new-order notification.
- Send cancellation/refund notifications.
- Add pickup reminders for selected pickup slots.
- Track notification send state to avoid duplicate sends.

## 12. Deeper PostHog Instrumentation

Expand analytics after the major customer and admin flows exist.

Once the homepage, product selection, cart, checkout, and order confirmation flows are real, PostHog can track meaningful behavior instead of speculative events. This should refine conversion insight without polluting the codebase with provider-specific calls.

Actionable outcomes:

- Instrument the agreed customer funnel events.
- Add useful event properties without sending personal or sensitive data.
- Track checkout abandonment and payment success.
- Track product interest and sold-out interactions.
- Review event names before launch so dashboards are coherent.

## Deferred Until Later

These are intentionally not part of the early implementation sequence:

- Vipps payment integration.
- Delivery support.
- Customer accounts.
- SMS notifications.
- Multiple admin or staff roles.
- Loyalty, subscriptions, or recurring orders.

They should become their own feature PRDs when the core preorder flow is stable.
