# Sentry Implementation Quiz

This quiz is based on the current Sentry guidance and implementation in this project. Each question has one best answer.

## Questions

### Project Guidance And Ownership

#### 1. What is Sentry's primary role in this project?
- [ ] A. The source of truth for orders, payments, and stock
- [ ] B. Error monitoring and debugging for unexpected failures
- [ ] C. Product analytics and conversion tracking
- [ ] D. Audit history for admin workflows

#### 2. Where should provider-specific Sentry integrations generally live?
- [ ] A. Inside each capability module
- [ ] B. Under `/lib/observability/`, except framework-required setup files
- [ ] C. Only in route handlers
- [ ] D. Only in root-level configuration files

#### 3. Which code is allowed to import `@sentry/nextjs` directly?
- [ ] A. Any business module that needs error reporting
- [ ] B. Sentry setup files required by Next.js or Sentry, and code inside `/lib/observability/`
- [ ] C. Only Jest tests
- [ ] D. Only files under `app/api`

#### 4. What should application feature code use instead of importing Sentry directly?
- [ ] A. Console logging only
- [ ] B. The project-owned observability wrapper
- [ ] C. The Sentry CLI
- [ ] D. A shared `utils.ts` helper

#### 5. Why should capability modules keep domain behavior provider-agnostic?
- [ ] A. So routes, server actions, UI boundaries, or orchestration code decide what is reported
- [ ] B. So no errors are ever captured
- [ ] C. So Sentry can automatically inspect private domain state
- [ ] D. So tests can mock the Sentry SDK everywhere

#### 6. Which future provider is explicitly mentioned as eventually belonging under `/lib/observability/`?
- [ ] A. Datadog
- [ ] B. New Relic
- [ ] C. PostHog
- [ ] D. Honeycomb

#### 7. What is the intended size and scope of the observability wrapper?
- [ ] A. A broad logging framework for all application events
- [ ] B. A small boundary for privacy filtering, context normalization, capture calls, and future adapters
- [ ] C. A replacement for route handlers
- [ ] D. A full analytics pipeline

#### 8. When might `/lib/observability/index.ts` be split into multiple files?
- [ ] A. When another observability provider such as PostHog is added
- [ ] B. Whenever a new Sentry context key is added
- [ ] C. Only after every route has Sentry capture
- [ ] D. Never, because the guidance forbids it

#### 9. Which statement best describes the relationship between Sentry and business source-of-truth data?
- [ ] A. Sentry stores canonical order, payment, and stock data
- [ ] B. Sentry may carry safe join keys but is not the source of truth
- [ ] C. Sentry replaces provider dashboards
- [ ] D. Sentry stores full provider payloads for debugging

#### 10. What should be updated when observability policy changes?
- [ ] A. Only `.env.example`
- [ ] B. Only tests
- [ ] C. `docs/sentry.md`
- [ ] D. `bun.lock`

### Allowed And Disallowed Context

#### 11. Which of these is allowed Sentry context according to the guidance?
- [ ] A. Customer email
- [ ] B. Order ID
- [ ] C. Raw request body
- [ ] D. Full order object

#### 12. Which Stripe value is allowed when needed to join against Stripe state?
- [ ] A. Full Stripe payload
- [ ] B. Webhook signing secret
- [ ] C. Stripe payment intent ID
- [ ] D. Cardholder data

#### 13. Which workflow state is allowed as context?
- [ ] A. Full database record
- [ ] B. Free-form customer notes
- [ ] C. Fulfillment state
- [ ] D. Session token

#### 14. Which context shape is preferred by the guidance?
- [ ] A. Stable IDs and compact state
- [ ] B. Large nested objects
- [ ] C. Raw form submissions
- [ ] D. Full provider responses

#### 15. Which field is explicitly disallowed?
- [ ] A. `checkoutId`
- [ ] B. `locale`
- [ ] C. Customer phone number
- [ ] D. `weeklyMenuState`

#### 16. If debugging needs customer contact details, what should be captured in Sentry instead?
- [ ] A. The full customer record
- [ ] B. The relevant order or customer ID
- [ ] C. The customer's email address
- [ ] D. The raw checkout form

#### 17. Which data is disallowed from Sentry events?
- [ ] A. Product IDs
- [ ] B. Product quantities when needed for stock debugging
- [ ] C. Payment card details
- [ ] D. Payment state

#### 18. Which field is part of the safe context key allowlist?
- [ ] A. `customerName`
- [ ] B. `authorization`
- [ ] C. `featureFlag`
- [ ] D. `rawRequestBody`

#### 19. Which of these values may be captured as a safe join key?
- [ ] A. API key
- [ ] B. Session token
- [ ] C. Notification ID
- [ ] D. Cookie header

#### 20. Which context value type is accepted for most allowlisted keys?
- [ ] A. String, finite number, or boolean
- [ ] B. Any object
- [ ] C. Any array
- [ ] D. Any function

#### 21. What happens to `Number.NaN` in an allowlisted context key?
- [ ] A. It is kept as-is
- [ ] B. It is converted to zero
- [ ] C. It is dropped
- [ ] D. It is stringified

#### 22. What happens to `Number.POSITIVE_INFINITY` in an allowlisted context key?
- [ ] A. It is kept as-is
- [ ] B. It is dropped
- [ ] C. It is converted to `null`
- [ ] D. It throws an error

#### 23. Which nested context shape is intentionally allowed by the sanitizer?
- [ ] A. Full cart object
- [ ] B. Full order object
- [ ] C. `productQuantities`
- [ ] D. Full Stripe payload

#### 24. What does the sanitizer keep inside `productQuantities`?
- [ ] A. Only finite numeric quantities keyed by product ID
- [ ] B. Any nested cart item object
- [ ] C. Product names and customer notes
- [ ] D. String quantities

#### 25. What happens when `productQuantities` is present but contains no valid finite numeric quantities?
- [ ] A. It is included as an empty object
- [ ] B. It is omitted from the sanitized context
- [ ] C. It is converted to `null`
- [ ] D. It causes capture to fail

#### 26. Which key is not part of the safe context allowlist?
- [ ] A. `stripeRefundId`
- [ ] B. `pickupSlotId`
- [ ] C. `environment`
- [ ] D. `customerNotes`

#### 27. Which key is part of the safe context allowlist?
- [ ] A. `fullOrder`
- [ ] B. `stripeWebhookEventId`
- [ ] C. `stripePayload`
- [ ] D. `cookies`

#### 28. What is the sanitizer's behavior for unknown keys?
- [ ] A. It passes them through if they are strings
- [ ] B. It stores them under `unknown`
- [ ] C. It drops them
- [ ] D. It throws an exception

#### 29. What does `sanitizeObservabilityContext(undefined)` return?
- [ ] A. `undefined`
- [ ] B. `null`
- [ ] C. `{}`
- [ ] D. `{ observability: {} }`

#### 30. Which safe context key would best describe the deployment label of a captured event?
- [ ] A. `environment`
- [ ] B. `customerName`
- [ ] C. `rawRequestBody`
- [ ] D. `apiKey`

### Capture Wrapper Behavior

#### 31. Which public wrapper function captures thrown or unexpected errors?
- [ ] A. `captureFailure`
- [ ] B. `captureException`
- [ ] C. `captureErrorState`
- [ ] D. `captureTrace`

#### 32. Which public wrapper function captures notable diagnostics that are not thrown exceptions?
- [ ] A. `captureMessage`
- [ ] B. `captureBreadcrumb`
- [ ] C. `captureReplay`
- [ ] D. `captureSpan`

#### 33. What does the wrapper do before sending context to Sentry?
- [ ] A. Sends it unchanged
- [ ] B. Sanitizes it through `sanitizeObservabilityContext`
- [ ] C. Serializes it into a raw request body
- [ ] D. Stores it in cookies

#### 34. Why does `captureException` use `Sentry.withScope`?
- [ ] A. To keep context attached only to the current Sentry event
- [ ] B. To disable Sentry globally
- [ ] C. To upload source maps
- [ ] D. To initialize browser replay

#### 35. Which Sentry context section name is used by `setObservabilityContext`?
- [ ] A. `workflow`
- [ ] B. `commerce`
- [ ] C. `observability`
- [ ] D. `debug`

#### 36. What happens if the sanitized context is empty?
- [ ] A. `scope.setContext` is not called
- [ ] B. An empty `observability` context is always attached
- [ ] C. The event is dropped
- [ ] D. The wrapper throws

#### 37. What does `captureException` return?
- [ ] A. A boolean
- [ ] B. The Sentry event ID string
- [ ] C. The sanitized context
- [ ] D. A `Response`

#### 38. What does `captureMessage` return?
- [ ] A. The Sentry event ID string
- [ ] B. The original message
- [ ] C. A promise of a response
- [ ] D. The Sentry scope

#### 39. Which module owns the `ObservabilityContext` type?
- [ ] A. `next.config.ts`
- [ ] B. `lib/observability/index.ts`
- [ ] C. `instrumentation.ts`
- [ ] D. `app/layout.tsx`

#### 40. What is the current relationship between `SanitizedObservabilityContext` and `ObservabilityContext`?
- [ ] A. They are unrelated types
- [ ] B. `SanitizedObservabilityContext` currently aliases `ObservabilityContext`
- [ ] C. `SanitizedObservabilityContext` only allows strings
- [ ] D. `SanitizedObservabilityContext` is imported from Sentry

### Runtime Configuration

#### 41. Which package provides the Sentry Next.js SDK in this project?
- [ ] A. `@sentry/react`
- [ ] B. `@sentry/browser`
- [ ] C. `@sentry/nextjs`
- [ ] D. `@sentry/node`

#### 42. Which installed version range is declared for `@sentry/nextjs`?
- [ ] A. `^8.0.0`
- [ ] B. `^9.0.0`
- [ ] C. `^10.51.0`
- [ ] D. `latest`

#### 43. Which root-level file registers server runtime Sentry setup based on `NEXT_RUNTIME`?
- [ ] A. `instrumentation.ts`
- [ ] B. `instrumentation-client.ts`
- [ ] C. `next.config.ts`
- [ ] D. `sentry-release.ts`

#### 44. What does `instrumentation.ts` import when `process.env.NEXT_RUNTIME === "nodejs"`?
- [ ] A. `./sentry.edge.config`
- [ ] B. `./sentry.server.config`
- [ ] C. `./instrumentation-client`
- [ ] D. `./next.config`

#### 45. What does `instrumentation.ts` import when `process.env.NEXT_RUNTIME === "edge"`?
- [ ] A. `./sentry.edge.config`
- [ ] B. `./sentry.server.config`
- [ ] C. `./lib/observability/index`
- [ ] D. `./package.json`

#### 46. Why are the server and edge Sentry config imports inside runtime branches?
- [ ] A. To keep Node-only and Edge-only setup out of the wrong runtime bundle
- [ ] B. To avoid all Sentry initialization
- [ ] C. To make tests slower
- [ ] D. To bypass source-map upload

#### 47. Which Next hook is exported for request-time server failures?
- [ ] A. `onRouteChangeStart`
- [ ] B. `onRequestError`
- [ ] C. `onBuildError`
- [ ] D. `onSmokeTest`

#### 48. What is `onRequestError` assigned to?
- [ ] A. `captureException`
- [ ] B. `Sentry.captureRequestError`
- [ ] C. `Sentry.captureMessage`
- [ ] D. `sanitizeObservabilityContext`

#### 49. Which file initializes browser Sentry capture?
- [ ] A. `sentry.server.config.ts`
- [ ] B. `sentry.edge.config.ts`
- [ ] C. `instrumentation-client.ts`
- [ ] D. `next.config.ts`

#### 50. Which browser hook is exported from `instrumentation-client.ts`?
- [ ] A. `onRequestError`
- [ ] B. `onRouterTransitionStart`
- [ ] C. `onWebhookError`
- [ ] D. `onBeforeUnload`

#### 51. What is `onRouterTransitionStart` assigned to?
- [ ] A. `Sentry.captureRouterTransitionStart`
- [ ] B. `Sentry.captureRequestError`
- [ ] C. `captureException`
- [ ] D. `withSentryConfig`

#### 52. Which DSN does the browser Sentry init use?
- [ ] A. `SENTRY_DSN`
- [ ] B. `NEXT_PUBLIC_SENTRY_DSN`
- [ ] C. `SENTRY_AUTH_TOKEN`
- [ ] D. `SENTRY_PROJECT`

#### 53. Which DSN fallback order is used by server and edge configs?
- [ ] A. `NEXT_PUBLIC_SENTRY_DSN`, then `SENTRY_DSN`
- [ ] B. `SENTRY_DSN`, then `NEXT_PUBLIC_SENTRY_DSN`
- [ ] C. `SENTRY_AUTH_TOKEN`, then `SENTRY_DSN`
- [ ] D. No DSN is configured

#### 54. When is Sentry enabled in the server, edge, and browser init calls?
- [ ] A. Always
- [ ] B. Only when `NODE_ENV` is production
- [ ] C. When the configured DSN value is truthy
- [ ] D. Only when source maps are uploaded

#### 55. What is `sendDefaultPii` set to in server, edge, and browser configuration?
- [ ] A. `true`
- [ ] B. `false`
- [ ] C. It is not configured
- [ ] D. It depends on `NODE_ENV`

#### 56. What is `tracesSampleRate` set to in the baseline Sentry runtime configs?
- [ ] A. `1`
- [ ] B. `0.5`
- [ ] C. `0`
- [ ] D. It is omitted

#### 57. What are browser replay sample rates set to in the baseline?
- [ ] A. Both are `1`
- [ ] B. Session replay is `1`, on-error replay is `0`
- [ ] C. Both are `0`
- [ ] D. They are environment-dependent

#### 58. Why is tracing kept wired but unsampled?
- [ ] A. Because telemetry requirements have not been defined yet
- [ ] B. Because Sentry cannot support route tracing
- [ ] C. Because tracing breaks source maps
- [ ] D. Because browser Sentry is disabled

#### 59. Which environment label precedence is used by browser Sentry init?
- [ ] A. `SENTRY_ENVIRONMENT`, then `NEXT_PUBLIC_SENTRY_ENVIRONMENT`, then `NODE_ENV`
- [ ] B. `NEXT_PUBLIC_SENTRY_ENVIRONMENT`, then `SENTRY_ENVIRONMENT`, then `NODE_ENV`
- [ ] C. `NODE_ENV`, then `SENTRY_ENVIRONMENT`
- [ ] D. No environment is set

#### 60. Which environment label precedence is used by server and edge Sentry init?
- [ ] A. `NEXT_PUBLIC_SENTRY_ENVIRONMENT`, then `NODE_ENV`
- [ ] B. `SENTRY_ENVIRONMENT`, then `NODE_ENV`
- [ ] C. `NODE_ENV`, then `SENTRY_ENVIRONMENT`
- [ ] D. `VERCEL_ENV`, then `NODE_ENV`

### Releases And Source Maps

#### 61. Which helper resolves the server-side Sentry release?
- [ ] A. `resolveSentryBrowserRelease`
- [ ] B. `resolveSentryServerRelease`
- [ ] C. `sentryReleaseOption`
- [ ] D. `requireSentrySourceMapConfigForVercelBuild`

#### 62. What is the server release precedence?
- [ ] A. `VERCEL_GIT_COMMIT_SHA`, then `SENTRY_RELEASE`
- [ ] B. `SENTRY_RELEASE`, then `VERCEL_GIT_COMMIT_SHA`
- [ ] C. `NEXT_PUBLIC_SENTRY_RELEASE`, then `NODE_ENV`
- [ ] D. `SENTRY_PROJECT`, then `SENTRY_ORG`

#### 63. What is the browser release precedence in the helper?
- [ ] A. `SENTRY_RELEASE`, then `NEXT_PUBLIC_SENTRY_RELEASE`, then `VERCEL_GIT_COMMIT_SHA`
- [ ] B. `NEXT_PUBLIC_SENTRY_RELEASE`, then `SENTRY_RELEASE`, then `VERCEL_GIT_COMMIT_SHA`
- [ ] C. `VERCEL_GIT_COMMIT_SHA`, then `NEXT_PUBLIC_SENTRY_RELEASE`
- [ ] D. `NODE_ENV`, then `SENTRY_RELEASE`

#### 64. What does `sentryReleaseOption(undefined)` return?
- [ ] A. `{ release: undefined }`
- [ ] B. `{}`
- [ ] C. `null`
- [ ] D. It throws

#### 65. What does `sentryReleaseOption("release_123")` return?
- [ ] A. `{ name: "release_123" }`
- [ ] B. `{ release: "release_123" }`
- [ ] C. `{ sentryRelease: "release_123" }`
- [ ] D. `"release_123"`

#### 66. Why should browser events use `NEXT_PUBLIC_SENTRY_RELEASE`?
- [ ] A. Browser bundles cannot reliably access non-`NEXT_PUBLIC_` environment variables
- [ ] B. Server releases are never useful
- [ ] C. Source maps only work without a release
- [ ] D. It disables runtime capture

#### 67. Which file wraps Next config with Sentry build configuration?
- [ ] A. `next.config.ts`
- [ ] B. `instrumentation-client.ts`
- [ ] C. `sentry.edge.config.ts`
- [ ] D. `lib/observability/index.ts`

#### 68. Which function wraps the Next config?
- [ ] A. `withSentryConfig`
- [ ] B. `captureRequestError`
- [ ] C. `sanitizeObservabilityContext`
- [ ] D. `resolveSentryBrowserRelease`

#### 69. In Vercel preview and production builds during the production build phase, what happens if source-map upload config is missing?
- [ ] A. The build fails early with an error
- [ ] B. The build silently skips all Sentry setup
- [ ] C. The route handler returns 403
- [ ] D. The browser DSN is cleared

#### 70. Which source-map upload variables are required for Vercel preview and production builds?
- [ ] A. `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, and `NODE_ENV`
- [ ] B. `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT`, and either `SENTRY_RELEASE` or `VERCEL_GIT_COMMIT_SHA`
- [ ] C. `SENTRY_DEV_SMOKE_ENABLED` and `SENTRY_DEV_SMOKE_TOKEN`
- [ ] D. `NEXT_PUBLIC_SENTRY_ENVIRONMENT` only

#### 71. What is the intended behavior for local builds regarding source-map upload?
- [ ] A. Local builds must always upload source maps
- [ ] B. Local builds may skip source-map upload
- [ ] C. Local builds must fail if no Sentry auth token exists
- [ ] D. Local builds must enable replay

#### 72. How does `next.config.ts` decide whether to require Sentry source-map config?
- [ ] A. It checks for any build phase and any Vercel environment
- [ ] B. It checks `PHASE_PRODUCTION_BUILD` and `VERCEL_ENV` of `preview` or `production`
- [ ] C. It checks only `NODE_ENV === "development"`
- [ ] D. It checks only `NEXT_PUBLIC_SENTRY_DSN`

#### 73. How is `sourcemaps.disable` configured in the Sentry build config?
- [ ] A. It is always `false`
- [ ] B. It is always `true`
- [ ] C. It is disabled when `SENTRY_AUTH_TOKEN` is missing
- [ ] D. It depends on `NEXT_PUBLIC_SENTRY_RELEASE`

#### 74. What does the Sentry build config set `silent` to?
- [ ] A. `true` in CI and `false` locally
- [ ] B. `!process.env.CI`
- [ ] C. Always `false`
- [ ] D. It is omitted

#### 75. What is the Sentry build-plugin telemetry setting?
- [ ] A. `true`
- [ ] B. `false`
- [ ] C. `"auto"`
- [ ] D. It is controlled by `SENTRY_ENVIRONMENT`

#### 76. Which webpack treeshake options are enabled in Sentry config?
- [ ] A. `removeDebugLogging` and `removeTracing`
- [ ] B. `removeReact` and `removeNext`
- [ ] C. `removeSmokeRoutes` and `removeTests`
- [ ] D. No treeshake options are configured

#### 77. Which release name is passed into the Sentry build config?
- [ ] A. The result of `resolveSentryServerRelease()`
- [ ] B. `NEXT_PUBLIC_SENTRY_ENVIRONMENT`
- [ ] C. `SENTRY_PROJECT`
- [ ] D. The smoke token

#### 78. What does `firstConfiguredValue` ignore?
- [ ] A. Truthy strings
- [ ] B. Undefined values and strings that trim to an empty value
- [ ] C. Vercel commit SHAs
- [ ] D. Browser release variables

### Developer Smoke Route

#### 79. Which route performs the developer Sentry smoke test?
- [ ] A. `/api/sentry`
- [ ] B. `/dev/sentry-smoke`
- [ ] C. `/api/dev/sentry-smoke`
- [ ] D. `/sentry-smoke`

#### 80. Which runtime is explicitly selected for the smoke route?
- [ ] A. `edge`
- [ ] B. `nodejs`
- [ ] C. `browser`
- [ ] D. `static`

#### 81. What does the smoke route return when `SENTRY_DEV_SMOKE_ENABLED` is not exactly `"true"`?
- [ ] A. `202` with `captured`
- [ ] B. `403` with `forbidden`
- [ ] C. `404` with `disabled`
- [ ] D. `500` with `error`

#### 82. What does the smoke route return in Vercel production even when enabled and authorized?
- [ ] A. `404` with `disabled`
- [ ] B. `202` with `captured`
- [ ] C. `403` with `forbidden`
- [ ] D. `204` with no body

#### 83. Which environment variable stores the expected smoke token?
- [ ] A. `SENTRY_AUTH_TOKEN`
- [ ] B. `SENTRY_DEV_SMOKE_TOKEN`
- [ ] C. `NEXT_PUBLIC_SENTRY_DSN`
- [ ] D. `SENTRY_PROJECT`

#### 84. Which request header can supply the smoke token directly?
- [ ] A. `x-smoke-token`
- [ ] B. `x-sentry-auth-token`
- [ ] C. `x-api-key`
- [ ] D. `cookie`

#### 85. Which Authorization format can supply the smoke token?
- [ ] A. `Basic <token>`
- [ ] B. `Bearer <token>`
- [ ] C. `Token <token>`
- [ ] D. `Digest <token>`

#### 86. What does the smoke route return when the token is missing or wrong?
- [ ] A. `404` with `disabled`
- [ ] B. `403` with `forbidden`
- [ ] C. `202` with `captured`
- [ ] D. `200` with `ignored`

#### 87. What error message is used for the controlled smoke exception?
- [ ] A. `Sentry developer smoke test`
- [ ] B. `Smoke route failed`
- [ ] C. `Intentional checkout error`
- [ ] D. `Sentry route unavailable`

#### 88. Which context does the smoke route send with the controlled exception?
- [ ] A. Route, runtime, feature flag name, and config name
- [ ] B. Customer name, email, phone, and route
- [ ] C. Full request headers and body
- [ ] D. Full environment variables

#### 89. What status code is returned after the smoke route captures the controlled exception?
- [ ] A. `200`
- [ ] B. `201`
- [ ] C. `202`
- [ ] D. `204`

#### 90. What response body status is returned after successful smoke capture?
- [ ] A. `disabled`
- [ ] B. `forbidden`
- [ ] C. `captured`
- [ ] D. `ok`

#### 91. Which wrapper function does the smoke route call?
- [ ] A. `captureException`
- [ ] B. `captureMessage`
- [ ] C. `sanitizeObservabilityContext`
- [ ] D. `resolveSentryServerRelease`

#### 92. Why is the smoke route developer-only?
- [ ] A. It intentionally creates a controlled exception to verify Sentry delivery
- [ ] B. It handles customer checkout
- [ ] C. It uploads source maps
- [ ] D. It enables browser replay

### Tests And Validation

#### 93. Where should sanitizer behavior tests live according to the current layout?
- [ ] A. Beside the observability module
- [ ] B. Only in root-level `__tests__`
- [ ] C. Only in `app/api`
- [ ] D. In `next.config.ts`

#### 94. What does `lib/observability/index.test.ts` verify?
- [ ] A. Sentry SDK internals
- [ ] B. Sanitizer behavior for safe IDs/state, disallowed fields, and product quantities
- [ ] C. Vercel deployment logs
- [ ] D. Browser rendering behavior

#### 95. Which test proves `Number.NaN` and `Infinity` are excluded from safe context?
- [ ] A. The safe operational IDs and workflow state sanitizer test
- [ ] B. The smoke token test
- [ ] C. The source-map upload test
- [ ] D. The page render smoke test

#### 96. What does the smoke route test mock?
- [ ] A. `next.config.ts`
- [ ] B. `@/lib/observability` with `captureException`
- [ ] C. `@sentry/cli`
- [ ] D. `SENTRY_AUTH_TOKEN`

#### 97. What mocked event ID does the smoke route test return from `captureException`?
- [ ] A. `event-id-123`
- [ ] B. `release_123`
- [ ] C. `commit_123`
- [ ] D. `smoke-token`

#### 98. Which smoke route behavior is explicitly tested for production?
- [ ] A. It returns `404` and does not report even when enabled and authorized
- [ ] B. It always captures
- [ ] C. It uploads source maps
- [ ] D. It changes the runtime to edge

#### 99. What does `lib/observability/sentry-release.test.ts` verify about server release resolution?
- [ ] A. `VERCEL_GIT_COMMIT_SHA` always wins
- [ ] B. `SENTRY_RELEASE` wins over `VERCEL_GIT_COMMIT_SHA`, with fallback to the commit SHA
- [ ] C. No release is ever configured
- [ ] D. Browser releases are ignored

#### 100. What does the browser release test verify?
- [ ] A. `NEXT_PUBLIC_SENTRY_RELEASE` is preferred when present
- [ ] B. `SENTRY_PROJECT` is preferred when present
- [ ] C. `SENTRY_AUTH_TOKEN` becomes the release
- [ ] D. `NODE_ENV` becomes the release

#### 101. What testing guidance does `docs/sentry.md` give?
- [ ] A. Tests should assert Sentry SDK internals
- [ ] B. Tests should verify project behavior and guardrails, not Sentry internals
- [ ] C. Tests should only cover visual output
- [ ] D. Tests should skip privacy behavior

#### 102. Which route behavior is tested when the smoke route is not explicitly enabled?
- [ ] A. It returns `404` and does not call `captureException`
- [ ] B. It returns `202` and calls `captureException`
- [ ] C. It returns `500`
- [ ] D. It redirects to Sentry

#### 103. Which route behavior is tested when the smoke token is missing?
- [ ] A. It returns `403` and does not call `captureException`
- [ ] B. It returns `202` and captures
- [ ] C. It returns `404`
- [ ] D. It returns `401` with WWW-Authenticate

#### 104. Which successful smoke route assertion is made about captured context?
- [ ] A. It includes customer email
- [ ] B. It includes route, runtime, feature flag, and config name
- [ ] C. It includes the full request body
- [ ] D. It includes cookies

### Environment And Documentation

#### 105. Which env var is documented as the server and edge runtime Sentry DSN?
- [ ] A. `SENTRY_DSN`
- [ ] B. `NEXT_PUBLIC_SENTRY_DSN`
- [ ] C. `SENTRY_AUTH_TOKEN`
- [ ] D. `SENTRY_ORG`

#### 106. Which env var is documented as the browser Sentry DSN?
- [ ] A. `SENTRY_DSN`
- [ ] B. `NEXT_PUBLIC_SENTRY_DSN`
- [ ] C. `SENTRY_PROJECT`
- [ ] D. `VERCEL_ENV`

#### 107. Which env var is used only for source-map upload authentication?
- [ ] A. `SENTRY_AUTH_TOKEN`
- [ ] B. `SENTRY_DEV_SMOKE_TOKEN`
- [ ] C. `NEXT_PUBLIC_SENTRY_DSN`
- [ ] D. `NODE_ENV`

#### 108. What default value does `.env.example` show for `SENTRY_DEV_SMOKE_ENABLED`?
- [ ] A. `true`
- [ ] B. `false`
- [ ] C. `production`
- [ ] D. It is not present

#### 109. What does `.env.example` recommend for `NEXT_PUBLIC_SENTRY_RELEASE`?
- [ ] A. Set it to a different value from the server release
- [ ] B. Set it to the same value so browser events match uploaded source maps
- [ ] C. Leave it unset in production
- [ ] D. Set it to the Sentry auth token

#### 110. Which variables does README say should use the same environment label?
- [ ] A. `SENTRY_ENVIRONMENT` and `NEXT_PUBLIC_SENTRY_ENVIRONMENT`
- [ ] B. `SENTRY_ORG` and `SENTRY_PROJECT`
- [ ] C. `SENTRY_DSN` and `SENTRY_AUTH_TOKEN`
- [ ] D. `SENTRY_RELEASE` and `SENTRY_DEV_SMOKE_TOKEN`

#### 111. What does the Sentry integration plan say about telemetry expansion?
- [ ] A. It is completed
- [ ] B. It is not started
- [ ] C. It is forbidden forever
- [ ] D. It should be enabled by default

#### 112. Which phase is listed as partially completed in the Sentry integration plan?
- [ ] A. Dependency and docs check
- [ ] B. Observability wrapper
- [ ] C. Validation
- [ ] D. Developer smoke surface

#### 113. Which validation item remains part of the integration plan?
- [ ] A. Confirm Sentry receives client and server events
- [ ] B. Remove all Sentry code
- [ ] C. Enable full replay sampling
- [ ] D. Store customer emails in Sentry

#### 114. What should happen before writing Sentry or Next instrumentation code?
- [ ] A. Read the relevant local Next.js docs and current official Sentry Next.js docs
- [ ] B. Run the development server
- [ ] C. Delete source-map config
- [ ] D. Import Sentry from every feature module

#### 115. What should be kept disabled unless intentionally testing Sentry delivery?
- [ ] A. `SENTRY_DEV_SMOKE_ENABLED`
- [ ] B. `SENTRY_PROJECT`
- [ ] C. `NEXT_PUBLIC_SENTRY_ENVIRONMENT`
- [ ] D. `NODE_ENV`

#### 116. Which statement best summarizes production completeness for Sentry?
- [ ] A. Runtime capture alone is enough, even without release/source maps
- [ ] B. Production is not complete until release and source-map upload are configured and runtime events report the matching release
- [ ] C. Production only requires the smoke route
- [ ] D. Production should skip source maps by default

#### 117. Which values must match between runtime events and source-map upload?
- [ ] A. Smoke token and Sentry auth token
- [ ] B. Release identifier
- [ ] C. Customer ID and email
- [ ] D. Route and browser DSN

#### 118. What should feature-specific Sentry context wait for?
- [ ] A. The owning feature flow to exist
- [ ] B. Every possible analytics event
- [ ] C. A broad logging framework
- [ ] D. A public source map

#### 119. Which root-level file is responsible for browser instrumentation rather than server instrumentation?
- [ ] A. `instrumentation-client.ts`
- [ ] B. `instrumentation.ts`
- [ ] C. `sentry.server.config.ts`
- [ ] D. `next.config.ts`

#### 120. Which answer best describes this project's current Sentry posture?
- [ ] A. Error monitoring baseline is implemented with privacy guardrails, while tracing/replay telemetry remains intentionally unsampled or deferred
- [ ] B. Full analytics and replay are enabled for every user
- [ ] C. Sentry is used as the order system of record
- [ ] D. Business modules import the Sentry SDK directly

## Answer Key

1. B
2. B
3. B
4. B
5. A
6. C
7. B
8. A
9. B
10. C
11. B
12. C
13. C
14. A
15. C
16. B
17. C
18. C
19. C
20. A
21. C
22. B
23. C
24. A
25. B
26. D
27. B
28. C
29. C
30. A
31. B
32. A
33. B
34. A
35. C
36. A
37. B
38. A
39. B
40. B
41. C
42. C
43. A
44. B
45. A
46. A
47. B
48. B
49. C
50. B
51. A
52. B
53. B
54. C
55. B
56. C
57. C
58. A
59. B
60. B
61. B
62. B
63. B
64. B
65. B
66. A
67. A
68. A
69. A
70. B
71. B
72. B
73. C
74. B
75. B
76. A
77. A
78. B
79. C
80. B
81. C
82. A
83. B
84. A
85. B
86. B
87. A
88. A
89. C
90. C
91. A
92. A
93. A
94. B
95. A
96. B
97. A
98. A
99. B
100. A
101. B
102. A
103. A
104. B
105. A
106. B
107. A
108. B
109. B
110. A
111. B
112. C
113. A
114. A
115. A
116. B
117. B
118. A
119. A
120. A
