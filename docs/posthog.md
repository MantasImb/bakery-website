# PostHog Guidance

Related guidance:

- [`sentry.md`](./sentry.md)
- [`routing.md`](./routing.md)
- [`adr/0003-keep-observability-provider-specific-code-behind-lib-observability.md`](./adr/0003-keep-observability-provider-specific-code-behind-lib-observability.md)

This document defines how PostHog should be integrated and used in this project. It is durable project guidance: update it when analytics policy changes, and follow it when adding homepage, weekly menu, cart, checkout, order, kitchen, or admin behavior.

## Intent

PostHog is the project's product analytics provider. The integration should help understand product interest, preorder funnel progress, checkout conversion, and later operational flow usage without spreading provider-specific calls through application code.

PostHog is not the source of truth for orders, payments, stock, customers, fulfillment, audit history, or error monitoring. Sentry owns unexpected failure reporting. PostHog may receive deliberate product and workflow events with safe compact properties.

## Ownership

Keep PostHog behind `/lib/observability/`.

- Framework-required browser setup may call the project analytics initializer.
- Code inside `/lib/observability/` may import `posthog-js` or `posthog-node` directly.
- Application features should use the project-owned analytics facade instead of importing PostHog directly.
- Capability modules such as `modules/cart`, `modules/weekly-menu`, `modules/checkout`, `modules/orders`, and `modules/kitchen` should keep domain behavior provider-agnostic. UI boundaries, route handlers, server actions, or service orchestration code decide what analytics events are emitted.

The intended shape is:

`component or boundary -> analytics.ts -> posthog.ts -> posthog-js`

Use `analytics.ts` for app-level event names, property shaping, and safe public helpers. Use `posthog.ts` for SDK initialization, low-level capture, and PostHog-specific configuration.

Server-side analytics should follow the same ownership rule when checkout and payment lifecycle events exist:

`route handler, server action, or webhook boundary -> analytics-server.ts -> posthog-server.ts -> posthog-node`

`analytics-server.ts` is intentionally separate from the browser analytics facade so Next.js does not bundle the Node PostHog SDK into client components. The current foundation prepares the typed server event contract, shared property sanitization, and optional analytics visitor ID plumbing. It avoids hard-coding checkout, Stripe, or persistence details before those flows exist.

The current foundation includes a minimal inert server PostHog adapter so server capture is ready before checkout work begins. The adapter initializes only when server PostHog configuration is present, exposes a provider-neutral server capture function through `analytics-server.ts`, no-ops safely when disabled, suppresses person profile creation for anonymous visitor events, and avoids emitting real server events until checkout, payment, or reservation lifecycle behavior exists.

## Current Baseline

The initial browser integration is intentionally conservative:

- PostHog initializes only when `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` is present.
- Analytics defaults to enabled when configured during the foundation stage.
- Browser events are proxied through `/ingest` rewrites.
- `autocapture` is disabled.
- `capture_pageview` is disabled.
- exception capture is disabled.
- session recording is disabled.
- person profiles are set to `never`.
- event properties are reduced to scalar values and filtered for disallowed keys.

This means PostHog captures only events that the app deliberately emits. It should not collect broad UI behavior, automatic route views, session recordings, unexpected errors, or identified person profiles during the foundation stage.

## Consent And Enablement

The foundation should include a project-owned analytics enablement check, but the actual consent or notice UI is a future decision. Until that policy is implemented, analytics may default to enabled when the relevant PostHog configuration is present.

The enablement check should make it easy to disable browser or server analytics later without changing feature event calls. Future consent or notice work may change when browser analytics initializes, whether the analytics visitor ID is available, and whether server lifecycle events can be linked back to a browser journey.

Checkout, payment, and order behavior must never depend on analytics being enabled. If browser analytics is disabled by future consent policy, checkout should proceed normally and server analytics should avoid using an analytics visitor ID for that flow.

## Analytics Visitor Identity

V1 uses guest checkout, so there is no stable authenticated user ID for connecting the browser journey to checkout and payment lifecycle events.

Use PostHog's generated anonymous browser `distinct_id` as the project's analytics visitor ID. When checkout starts, read it through the analytics facade and store it optionally on the future checkout reservation. Server-side PostHog events may use that same ID so events such as payment success or reservation expiry can be analyzed against the anonymous browser funnel.

The analytics visitor ID is not a customer, account, login, source of truth, or business rule input. Checkout must still work if it is absent. When server-side analytics cannot provide a visitor ID, events should still be captured with safe aggregate properties such as checkout reservation, order, weekly menu, payment, and pickup slot IDs.

Server-side PostHog capture must not create identified person profiles for these events. Use PostHog's person-profile suppression option for server events that are tied only to an anonymous analytics visitor ID.

## Why Autocapture Is Disabled

Autocapture can reduce implementation work, but it also captures behavior based on rendered UI details instead of product language. That is risky while the commerce flows are still forming.

Keep `autocapture: false` until the team intentionally accepts the tradeoffs:

- It may collect clicked text, element metadata, URLs, and other page context that was not modeled as safe analytics data.
- It can create noisy events before weekly menu, cart, checkout, payment, and order flows are stable.
- It makes analytics depend on UI markup and labels, which can drift as design changes.
- It does not replace meaningful business events such as product added, checkout started, pickup slot selected, payment succeeded, or checkout reservation expired.

The preferred baseline is explicit capture for business events and user-visible actions that matter.

Autocapture can be revisited later if broad interaction analytics becomes useful. Before enabling it, document the masking, privacy, retention, and event-review policy in this file.

## Why Pageview Capture Is Disabled

Automatic pageview capture is disabled until route and funnel semantics are defined.

This app is expected to have customer flows where the useful analytical event is often more specific than a route load. Examples include viewing the active weekly menu, starting checkout, selecting a pickup slot, reaching payment, and seeing an order confirmation.

Use explicit page or flow events when the route becomes meaningful:

- `weekly_menu_viewed`
- `cart_viewed`
- `checkout_started`
- `payment_succeeded`
- `order_confirmation_viewed`

If route-level `$pageview` tracking is enabled later, document how client-side route transitions, localized routes, canonical URLs, and `/ingest` proxy paths are handled.

## Event Policy

Prefer deliberate events named in product language.

- Use stable `snake_case` event names in code.
- Name events after user or workflow outcomes, not component names.
- Keep event properties compact and scalar.
- Prefer IDs and state names over nested objects.
- Avoid sending direct customer contact fields or provider payloads.
- Add events when the owning flow exists, not speculatively before there is behavior to measure.

Initial homepage events may remain narrow while the storefront is static. Future commerce instrumentation should prioritize:

- `homepage_cta_clicked`
- `weekly_menu_viewed`
- `product_added`
- `cart_viewed`
- `checkout_started`
- `pickup_slot_selected`
- `payment_started`
- `payment_succeeded`
- `order_confirmation_viewed`

Treat this list as the canonical V1 customer funnel. Generic navigation and visit-planning events may remain available as secondary engagement events, but they should not be mixed into funnel dashboards.

The existing homepage events added during initial PostHog setup are placeholders, not durable taxonomy. During the analytics foundation work, replace free-form events such as `view_menu_clicked`, `plan_visit_clicked`, `nav_item_clicked`, and `order_ahead_clicked` with project-owned typed events. The primary homepage ordering CTA should use `homepage_cta_clicked` with a compact property such as `cta`. Navigation and visit-planning interactions may remain as typed secondary engagement events.

Use named analytics helper functions for canonical funnel and lifecycle events instead of letting application code pass arbitrary event strings. A narrow generic helper may exist only for explicitly classified secondary engagement events. This keeps required properties and event names coherent while still allowing low-risk engagement signals that are not part of the preorder funnel.

`checkout_reservation_expired` is a server-side lifecycle event, not a customer funnel step. It should be emitted when reservation expiry behavior exists and can be tied to a real checkout reservation lifecycle.

Do not use `checkout_abandoned` as a V1 event name because it overstates what the app can know from browser behavior. Use two separate concepts:

- `checkout_exited`: a secondary checkout behavior event emitted when a browser leaves the checkout flow before payment starts or succeeds. It may be followed by a successful checkout later, including on the same device.
- `checkout_reservation_expired`: the canonical lifecycle abandonment event emitted when a real checkout reservation expires and held stock can be released.

This distinction lets analytics show where visitors exit checkout without confusing that signal with the business event that ends a checkout reservation.

## Allowed Properties

PostHog events may include compact product and workflow context that helps understand conversion:

- Weekly menu, product, cart, checkout reservation, order, payment, and pickup slot IDs.
- Analytics visitor ID when it comes from PostHog's anonymous browser `distinct_id`.
- Product quantities, item counts, cart totals, order totals, currency, and price bands when they are needed for funnel analysis.
- Workflow state such as weekly menu state, checkout step, payment state, fulfillment state, locale, route, and environment.
- Non-sensitive feature flag names or variant names when they affect the user experience.

Prefer a few stable fields over large payloads.

Exact cart or order totals may be sent when they are useful for conversion analysis, such as comparing checkout completion by cart size. Treat these as pseudonymous analytics properties when they are tied to an analytics visitor, checkout reservation, or order ID. Prefer normalized numeric fields such as minor currency units plus `currency`, and do not send formatted prices, full cart payloads, full order payloads, customer contact fields, or raw Stripe amounts copied from provider payloads.

## Disallowed Properties

Do not send direct customer contact data or sensitive payloads to PostHog.

Disallowed data includes:

- Customer name, email, phone number, free-form customer notes, or other direct contact fields.
- Raw request bodies, full form submissions, cookies, session tokens, auth headers, API keys, webhook secrets, or environment secrets.
- Full Stripe payloads, full cart objects, full order objects, or full database records.
- Payment card details or anything that could be considered cardholder data.

If analysis needs customer-level investigation, capture a safe order or checkout reservation ID and inspect the source system directly.

## Relationship To Sentry

Sentry owns unexpected error capture and diagnostic context. PostHog owns product analytics.

Do not make the generic Sentry `captureMessage` wrapper automatically send to PostHog. Most Sentry messages are operational diagnostics, not product analytics.

If an event is useful in both systems, model it explicitly at the application boundary. For example, a future `recordOperationalEvent` helper could send a safe compact event to PostHog and a diagnostic message to Sentry when both are intentional. Use that only for notable workflow milestones or anomalies, such as checkout reservation expiry, webhook recovery, or admin correction.

## Routing And Proxy

PostHog browser traffic should use scoped `/ingest` rewrites:

- `/ingest/static/:path*`
- `/ingest/array/:path*`
- `/ingest/:path*`

These rewrites must not change unrelated application routes or canonical URL behavior. If PostHog or the deployment platform requires a global routing exception, document the exact reason and verification steps in [`routing.md`](./routing.md) before merging the change.

## Environment Variables

PostHog browser analytics uses public client-side environment variables:

- `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`: public PostHog project token. Leave empty to disable PostHog capture.
- `NEXT_PUBLIC_POSTHOG_HOST`: PostHog UI host, such as `https://eu.posthog.com`.

Server-side PostHog analytics should use server-only environment variables. Keep these out of browser code:

- `POSTHOG_PROJECT_API_KEY`: server-side PostHog project API key. Leave empty to disable server capture.
- `POSTHOG_HOST`: PostHog API host for server capture, such as `https://eu.posthog.com`.

Do not expose private PostHog API keys to browser code.

## Testing

Tests should verify project behavior and guardrails, not PostHog internals.

Appropriate tests include:

- Analytics property sanitization removes disallowed fields and preserves safe scalar fields.
- Browser analytics initialization is skipped when the public project token is absent.
- Capture calls do not throw when PostHog is unavailable or disabled.
- Server analytics initialization is skipped when server PostHog configuration is absent.
- Server capture suppresses person profile creation for anonymous analytics visitor events.
- User-visible interactions emit the expected project-owned analytics event when the owning flow exists.

Avoid tests that lock the app to incidental PostHog SDK implementation details.

## Revisit Conditions

Revisit this policy when:

- Weekly menu, cart, checkout, and order confirmation flows are implemented.
- Consent or notice UI is implemented.
- The team wants route-level pageview reporting.
- The team wants autocapture for broad interaction analysis.
- The team wants session recording or person profiles.
- Consent, privacy, retention, or regional hosting requirements change.

Any move from explicit-only capture to broader automatic capture should be documented here as an analytics policy change.
