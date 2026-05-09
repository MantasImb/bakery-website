# Sentry Integration Plan

This is an expendable implementation plan for adding Sentry. Update or delete it as the work lands. Durable rules belong in `docs/sentry.md`.

## Phase Status

- Phase 1: Completed
- Phase 2: Completed
- Phase 3: Completed
- Phase 4: Completed
- Phase 5: Completed
- Phase 6: Not started
- Phase 7: Partially completed

## Decisions From Planning

- Use `/lib/observability/` as the project-owned observability boundary.
- Add Sentry now and leave PostHog implementation for the later analytics step.
- Keep Sentry error monitoring and broader telemetry as separate tracks.
- Include a committed developer-only smoke surface for verifying Sentry capture.
- Allow operational IDs and workflow state in Sentry.
- Do not send direct customer contact fields or sensitive payloads.
- Include release/source-map upload as its own integration step.

## Phase 1: Dependency And Docs Check

Status: Completed

- Confirm the current official Sentry Next.js setup for the installed Next.js version.
- Re-read the local Next.js instrumentation docs under `node_modules/next/dist/docs/`.
- Add `@sentry/nextjs` using the repository package manager.
- Record required environment variables in the appropriate project docs or example environment file when one exists.

Expected environment variables:

- `SENTRY_DSN`
- `NEXT_PUBLIC_SENTRY_DSN`
- `SENTRY_ENVIRONMENT`
- `NEXT_PUBLIC_SENTRY_ENVIRONMENT`
- `SENTRY_RELEASE`
- `SENTRY_AUTH_TOKEN` for CI/source-map upload only
- Sentry organization and project identifiers if the upload step requires them
- A dev-only smoke opt-in flag and token if the route should be usable outside local development

## Phase 2: Observability Wrapper

Status: Completed

- Create `/lib/observability/`.
- Add public wrapper functions for capturing exceptions and messages.
- Add typed context for safe IDs and workflow state.
- Add a sanitizer or allowlist that strips disallowed fields before capture.
- Keep provider-specific Sentry calls isolated to the wrapper and required Sentry setup files.
- Add focused tests for sanitizer behavior.

Initial public API should stay small. A likely first shape:

- `captureException(error, context?)`
- `captureMessage(message, context?)`
- `withObservabilityContext(context, callback)` only if scope handling is needed immediately

## Phase 3: Next And Sentry Runtime Setup

Status: Completed

- Add the root-level Sentry/Next instrumentation files required by the current SDK and Next.js version.
- Configure client, server, and edge runtime capture.
- Wire Next request error capture through the current `instrumentation.ts` convention.
- Wrap `next.config.ts` with Sentry configuration.
- Keep sampling and telemetry options explicit.
- Keep `sendDefaultPii` disabled unless this guidance is intentionally changed.

## Phase 4: Developer Smoke Surface

Status: Completed

- Add a clearly named developer-only smoke route or page, such as `/dev/sentry-smoke`.
- Include a server-side capture path.
- Include a client-side capture path if the route is implemented as a page.
- Guard the route so it is unavailable in production by default.
- Add tests for the guard behavior.
- Document how to run the smoke check without using real customer, order, or payment data.

## Phase 5: Source Maps And Releases

Status: Completed

- Decide the production deployment target and CI path: Vercel deploys preview and production builds.
- Choose the release identifier, preferably the deployment git SHA: use Vercel's deployment commit SHA, with `SENTRY_RELEASE` still supported as an explicit override.
- Configure source-map upload for production builds through `@sentry/nextjs` and `withSentryConfig`; do not enable a separate Sentry Vercel source-map upload integration initially.
- Store `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, and `SENTRY_PROJECT` in Vercel preview and production environment variables.
- Fail Vercel preview and production builds early when source-map upload configuration is missing.
- Use the same release identifier for source-map upload and runtime events: server and edge init resolve it explicitly, while browser init relies on the `@sentry/nextjs` build-time injected release.
- Verify a Vercel preview build uploads source maps and reports readable stack traces in Sentry.
- Ensure source maps are uploaded to Sentry without making browser-served source maps publicly useful if the deployment setup allows that choice.

## Phase 6: Telemetry Expansion

Status: Not started

- Decide initial tracing sample rates per environment.
- Decide whether session replay is enabled, and at what sample rates.
- Confirm masking/privacy settings before enabling replay.
- Add safe breadcrumbs and tags only when real feature flows exist.
- Revisit this after checkout, Stripe webhooks, order finalization, and admin workflows exist.

## Phase 7: Validation

Status: Partially completed

- Run lint and tests.
- Run a production build.
- Exercise the smoke route locally or in a staging-like environment.
- Confirm Sentry receives client and server events.
- Confirm disallowed fields are not present in event payloads.
- Confirm release/source-map setup when deployment details are available.

## Open Follow-Ups

- Final tracing, replay, and logs sample rates should be selected when production traffic expectations are clearer.
- Feature-specific Sentry context should be added with the feature that owns the workflow.
