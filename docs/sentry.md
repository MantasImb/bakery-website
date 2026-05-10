# Sentry Guidance

This document defines how Sentry should be integrated and used in this project. It is durable project guidance: update it when observability policy changes, and follow it when adding new checkout, order, kitchen, admin, or integration behavior.

## Intent

Sentry is the project's error monitoring and debugging provider. The integration should catch unexpected client, server, and edge runtime failures early without spreading provider-specific calls through business modules.

Sentry is not the source of truth for orders, payments, stock, customer contact details, analytics, or audit history. It is a diagnostic system that may carry safe join keys and workflow state so developers can investigate failures in the application database and provider dashboards.

## Ownership

Keep Sentry behind `/lib/observability/`.

- Sentry setup files required by Next.js or Sentry may import `@sentry/nextjs` directly.
- Code inside `/lib/observability/` may import `@sentry/nextjs` directly.
- Application features should use the project-owned observability wrapper instead of importing Sentry directly.
- Capability modules such as `modules/cart`, `modules/weekly-menu`, `modules/checkout`, `modules/orders`, and `modules/kitchen` should keep domain behavior provider-agnostic. Prefer returning typed results or throwing unexpected errors; route handlers, server actions, UI boundaries, or service orchestration code decide what gets reported.
- PostHog should eventually live under `/lib/observability/` too, but it remains deferred until the analytics implementation step.

The wrapper should stay small. It should provide a clear place for privacy filtering, context normalization, Sentry capture calls, and future provider-specific adapters. Do not turn it into a broad logging framework unless real feature work proves that need.

The initial implementation may keep the public wrapper, sanitizer, and Sentry adapter in `/lib/observability/index.ts` while Sentry is the only provider. When PostHog or another observability provider is added, expect this folder to split into a project-owned public facade plus provider-specific files, for example `context.ts`, `sentry.ts`, and `analytics.ts`.

## Allowed Context

Sentry events may include operational join keys and workflow state that help reproduce and debug failures:

- Order, checkout, payment, weekly menu, product, pickup slot, reservation, and notification IDs.
- Stripe session, payment intent, customer, webhook event, and refund IDs when they are needed to join against Stripe state.
- Current workflow state such as payment state, fulfillment state, weekly menu state, locale, route, runtime, deployment environment, and release.
- Product IDs and quantities when needed to debug stock, cart, checkout, or order behavior.
- Non-sensitive feature flags or configuration names when they affect behavior.

Prefer stable IDs and compact state over large nested objects.

## Disallowed Context

Do not send direct customer contact data or sensitive payloads to Sentry.

Disallowed data includes:

- Customer name, email, phone number, free-form customer notes, or other direct contact fields.
- Raw request bodies, full form submissions, cookies, session tokens, auth headers, API keys, webhook secrets, or environment secrets.
- Full Stripe payloads, full cart objects, full order objects, or full database records.
- Payment card details or anything that could be considered cardholder data.

If debugging needs customer contact details, capture the relevant order or customer ID and inspect the source system directly.

## Error Capture Rules

Capture unexpected failures. Do not report expected domain outcomes as Sentry exceptions.

Examples:

- A sold-out product, invalid cart quantity, validation failure, or declined payment should normally be represented as a typed result or user-facing error state.
- A database write failure, unhandled webhook exception, impossible state transition, unexpected Stripe API shape, or render crash should be captured.
- Boundary code may add safe context before reporting, but business modules should not depend on Sentry types.

When adding capture calls, include enough safe context to identify the failing workflow, but keep the payload minimal.

## Initial Integration Shape

The Sentry implementation should include separate error monitoring and telemetry tracks.

Error monitoring baseline:

- Install and configure `@sentry/nextjs`.
- Add root-level Next/Sentry files required for the current Next.js version, including server, edge, client, and request error capture surfaces.
- Wrap `next.config.ts` with Sentry configuration.
- Add `/lib/observability/` wrapper functions and sanitization rules.
- Add a developer-only Sentry smoke surface for verifying that capture works.
- Ensure smoke behavior cannot be used in production unless an explicit opt-in environment flag allows it.

Telemetry expansion:

- Configure tracing, session replay, logs, and additional breadcrumbs deliberately, not as accidental defaults.
- Keep sampling rates explicit and environment-aware.
- Do not add detailed feature tags before the owning feature exists.
- When feature flows are implemented, add safe IDs and workflow states at route or orchestration boundaries.

## Initial Telemetry Policy

The initial telemetry policy is intentionally off for all environments:

- Server, edge, and browser tracing sample rate is `0`.
- Browser session replay sample rates are `0`, and no replay integration should be added until masking and sampling are decided.
- Sentry logs are disabled.
- Feature-specific breadcrumbs and tags remain deferred until checkout, Stripe webhooks, order finalization, and admin workflows exist.

Keep these options centralized in `/lib/observability/sentry-telemetry.ts` so future changes are reviewed as policy changes, not scattered Sentry configuration edits. When production traffic expectations and feature workflows are clearer, update this document, adjust the telemetry policy module, and add tests for the new sampling behavior.

## Source Maps And Releases

Production Sentry events are most useful when they are tied to a release and uploaded source maps.

The integration plan should include release/source-map setup as a dedicated step. This step may depend on the deployment provider or CI pipeline. Use a stable release identifier such as a git SHA or deployment commit SHA, and keep Sentry auth tokens in CI/deployment secrets.

Vercel preview and production builds must upload Sentry source maps. Those
builds should fail early when `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`,
`SENTRY_PROJECT`, and either `SENTRY_RELEASE` or `VERCEL_GIT_COMMIT_SHA` are
not available. Local builds may skip source-map upload.

Runtime Sentry events must use the same release identifier as the source-map
upload. The release precedence is `SENTRY_RELEASE`, then
`VERCEL_GIT_COMMIT_SHA`. Server and edge init may pass that release explicitly.
Browser init should rely on the release that `@sentry/nextjs` injects during the
same build that uploads source maps; do not pass a separate public release value
that can drift from the upload release.

Do not block local runtime capture on deployment-specific source-map work. Production Sentry is complete when release and source-map upload are configured and runtime events report the matching release.

Current deployment status:

- Vercel preview and production builds are configured to upload Sentry source maps.
- The developer smoke route has produced an event visible in the Sentry project.
- Source-map upload has been verified during Vercel builds.

## Testing

Tests should verify project behavior and guardrails, not Sentry internals.

Appropriate tests include:

- The observability sanitizer removes disallowed fields and preserves allowed IDs/state.
- The developer smoke route is unavailable without the required opt-in flag and token, and remains unavailable in Vercel production.
- Feature code reports unexpected failures through the project wrapper when that behavior matters at the boundary.

Avoid tests that assert Sentry SDK implementation details.

## Developer Smoke Test

The route `/api/dev/sentry-smoke` sends one controlled exception through the
project-owned observability wrapper. It exists only to verify that local or
deployed Sentry runtime capture is wired correctly.

The route returns `404` unless `SENTRY_DEV_SMOKE_ENABLED=true` is set. When the
route is enabled outside Vercel production, callers must also provide
`SENTRY_DEV_SMOKE_TOKEN` through the `x-smoke-token` header or a bearer
`Authorization` header. Keep this flag disabled by default, and enable it only
while intentionally testing Sentry delivery. The smoke event uses static safe
context only: route, runtime, feature flag name, and config name.

## Development Notes

Before writing Sentry or Next instrumentation code, read the relevant local Next.js docs under `node_modules/next/dist/docs/` and the current official Sentry Next.js docs. This project uses a newer Next.js version with instrumentation conventions that may differ from older examples.
