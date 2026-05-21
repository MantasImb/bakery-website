# PostHog Implementation Quiz

This quiz is based on the current PostHog guidance and implementation in this project. Each question has one best answer.

## Questions

### Project Guidance And Ownership

#### 1. What is PostHog's primary role in this project?
- [ ] A. Source of truth for orders and stock
- [ ] B. Product analytics for product interest, preorder funnel progress, checkout conversion, and later operational usage
- [ ] C. Unexpected error capture
- [ ] D. Payment authorization

#### 2. What is PostHog explicitly not responsible for?
- [ ] A. Product analytics
- [ ] B. Conversion analysis
- [ ] C. Error monitoring and business source-of-truth data
- [ ] D. Deliberate workflow events

#### 3. Where should PostHog-specific integration code live?
- [ ] A. Inside each capability module
- [ ] B. Under `/lib/observability/`
- [ ] C. Only inside React components
- [ ] D. Only inside `next.config.ts`

#### 4. Which code may import `posthog-js` or `posthog-node` directly?
- [ ] A. Any application feature
- [ ] B. Code inside `/lib/observability/`
- [ ] C. Only tests
- [ ] D. Only route handlers

#### 5. What should application features use instead of importing PostHog directly?
- [ ] A. The project-owned analytics facade
- [ ] B. Sentry `captureMessage`
- [ ] C. Raw fetch calls to PostHog
- [ ] D. A shared `utils.ts` file

#### 6. Why should capability modules keep analytics provider-agnostic?
- [ ] A. So UI boundaries, route handlers, server actions, or orchestration code decide what analytics events are emitted
- [ ] B. So PostHog can inspect private domain state directly
- [ ] C. So every domain function emits analytics
- [ ] D. So tests can mock PostHog everywhere

#### 7. What is the intended browser analytics call path?
- [ ] A. `component or boundary -> analytics.ts -> posthog.ts -> posthog-js`
- [ ] B. `component -> posthog-js -> analytics.ts`
- [ ] C. `component -> next.config.ts -> PostHog`
- [ ] D. `component -> Sentry -> PostHog`

#### 8. What does `analytics.ts` own?
- [ ] A. PostHog SDK internals
- [ ] B. App-level event names, property shaping, and safe public helpers
- [ ] C. Database writes
- [ ] D. Source-map upload

#### 9. What does `posthog.ts` own?
- [ ] A. SDK initialization, low-level browser capture, and PostHog-specific configuration
- [ ] B. Checkout persistence
- [ ] C. Sentry release resolution
- [ ] D. Weekly menu pricing rules

#### 10. What is the intended server analytics call path?
- [ ] A. `route handler, server action, or webhook boundary -> analytics-server.ts -> posthog-server.ts -> posthog-node`
- [ ] B. `route handler -> analytics.ts -> posthog-js`
- [ ] C. `webhook -> Sentry -> PostHog`
- [ ] D. `server action -> browser local storage -> PostHog`

#### 11. Why is `analytics-server.ts` separate from the browser analytics facade?
- [ ] A. To avoid bundling the Node PostHog SDK into client components
- [ ] B. To disable all server analytics
- [ ] C. To make server events use `posthog-js`
- [ ] D. To bypass property sanitization

#### 12. What does the current server foundation avoid doing?
- [ ] A. Defining a typed server event contract
- [ ] B. Hard-coding checkout, Stripe, or persistence details before those flows exist
- [ ] C. Suppressing person profile creation
- [ ] D. No-oping safely when disabled

### Browser And Server Baseline

#### 13. When does browser PostHog initialize?
- [ ] A. Always during app startup
- [ ] B. Only when `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` is present and non-blank
- [ ] C. Only when `POSTHOG_PROJECT_API_KEY` is present
- [ ] D. Only after checkout succeeds

#### 14. What is the foundation-stage enablement posture?
- [ ] A. Analytics may default to enabled when the relevant PostHog configuration is present
- [ ] B. Analytics must always be disabled
- [ ] C. Analytics must require login
- [ ] D. Analytics must require Stripe configuration

#### 15. Which browser API host is configured for PostHog events?
- [ ] A. `/api/posthog`
- [ ] B. `/ingest`
- [ ] C. `/analytics`
- [ ] D. `/sentry`

#### 16. What is `autocapture` set to in the baseline browser config?
- [ ] A. `true`
- [ ] B. `false`
- [ ] C. `"anonymous_only"`
- [ ] D. It is omitted

#### 17. What is `capture_pageview` set to in the baseline browser config?
- [ ] A. `true`
- [ ] B. `false`
- [ ] C. `"route_only"`
- [ ] D. It is omitted

#### 18. What is `capture_exceptions` set to in the baseline browser config?
- [ ] A. `true`
- [ ] B. `false`
- [ ] C. `"unhandled"`
- [ ] D. It depends on `NODE_ENV`

#### 19. What is `disable_session_recording` set to?
- [ ] A. `true`
- [ ] B. `false`
- [ ] C. `"errors_only"`
- [ ] D. It depends on consent

#### 20. What is `person_profiles` set to in browser PostHog config?
- [ ] A. `"always"`
- [ ] B. `"identified_only"`
- [ ] C. `"never"`
- [ ] D. It is omitted

#### 21. What does the browser baseline mean in practice?
- [ ] A. PostHog captures only events the app deliberately emits
- [ ] B. PostHog captures every route view automatically
- [ ] C. PostHog records sessions by default
- [ ] D. PostHog identifies all visitors as people

#### 22. What prevents duplicate browser SDK initialization?
- [ ] A. A module-level idempotency flag in `posthog.ts`
- [ ] B. A cookie written by Sentry
- [ ] C. Next.js route caching
- [ ] D. The PostHog host variable

#### 23. What should happen if browser capture throws?
- [ ] A. The user interaction should fail
- [ ] B. The app should swallow the analytics failure
- [ ] C. The event should be sent to Sentry automatically
- [ ] D. The user should be redirected

#### 24. What should happen if server PostHog capture throws?
- [ ] A. The request flow should continue while the failure is logged
- [ ] B. The request should fail
- [ ] C. The checkout should be cancelled
- [ ] D. The event should be retried synchronously until successful

#### 25. How is the server PostHog client managed?
- [ ] A. A new client is created for every event
- [ ] B. A module-level singleton is reused
- [ ] C. It is stored in React state
- [ ] D. It is created in `next.config.ts`

#### 26. What shutdown behavior is registered for the server PostHog client?
- [ ] A. A process `beforeExit` hook calls the client's shutdown method
- [ ] B. A browser unload handler flushes it
- [ ] C. It is never shut down
- [ ] D. It is shut down after every capture

### Consent And Analytics Visitor Identity

#### 27. What is the current consent or notice UI status?
- [ ] A. Implemented and required for every event
- [ ] B. A future policy decision
- [ ] C. Forbidden by the guidance
- [ ] D. Replaced by Sentry consent

#### 28. What should checkout, payment, and order behavior depend on?
- [ ] A. Analytics being enabled
- [ ] B. A stable analytics visitor ID
- [ ] C. Business rules and source-of-truth state, not analytics
- [ ] D. Browser session recording

#### 29. What is the project's analytics visitor ID?
- [ ] A. Customer email
- [ ] B. PostHog's generated anonymous browser `distinct_id`
- [ ] C. Stripe customer ID
- [ ] D. Order number

#### 30. How should checkout use the analytics visitor ID in the future?
- [ ] A. Store it optionally on the checkout reservation
- [ ] B. Require it before checkout starts
- [ ] C. Treat it as a customer account ID
- [ ] D. Send it to Sentry as direct customer identity

#### 31. What is the analytics visitor ID not?
- [ ] A. A browser-generated anonymous analytics ID
- [ ] B. A customer, account, login, source of truth, or business rule input
- [ ] C. A way to connect anonymous browser and server analytics events
- [ ] D. An optional value for funnel continuity

#### 32. What should happen if the analytics visitor ID is absent?
- [ ] A. Checkout must fail
- [ ] B. Checkout should still work
- [ ] C. Server events must be dropped
- [ ] D. PostHog should identify the customer by email

#### 33. Which fallback distinct ID does the server adapter use when no visitor ID is present?
- [ ] A. `anonymous_server`
- [ ] B. `unknown_customer`
- [ ] C. `checkout_user`
- [ ] D. `guest_email`

#### 34. What must server-side PostHog capture suppress?
- [ ] A. Person profile creation for anonymous visitor events
- [ ] B. All event properties
- [ ] C. All server events
- [ ] D. All checkout reservation IDs

#### 35. Which facade function exposes the anonymous browser distinct ID?
- [ ] A. `getAnalyticsVisitorId`
- [ ] B. `captureBrowserPostHogEvent`
- [ ] C. `recordServerAnalyticsEvent`
- [ ] D. `sanitizeAnalyticsProperties`

### Autocapture And Pageview Policy

#### 36. Why is autocapture disabled?
- [ ] A. It can capture UI details instead of deliberate product-language events
- [ ] B. PostHog does not support it
- [ ] C. It prevents explicit capture
- [ ] D. It is required only on the server

#### 37. Which risk is listed for autocapture?
- [ ] A. It may collect clicked text, element metadata, URLs, and other page context not modeled as safe analytics data
- [ ] B. It prevents route rendering
- [ ] C. It disables checkout
- [ ] D. It removes all analytics events

#### 38. Why can autocapture create noisy events in this project?
- [ ] A. Weekly menu, cart, checkout, payment, and order flows are still forming
- [ ] B. It only records payment events
- [ ] C. It only works in production
- [ ] D. It requires Sentry source maps

#### 39. What does autocapture not replace?
- [ ] A. Meaningful business events such as product added, checkout started, pickup slot selected, payment succeeded, or reservation expired
- [ ] B. CSS styling
- [ ] C. TypeScript checking
- [ ] D. Database migrations

#### 40. What must be documented before enabling autocapture later?
- [ ] A. Masking, privacy, retention, and event-review policy
- [ ] B. Only the PostHog host
- [ ] C. The Sentry DSN
- [ ] D. The weekly menu price list

#### 41. Why is automatic pageview capture disabled?
- [ ] A. Route and funnel semantics are not defined yet
- [ ] B. Pageviews are impossible in Next.js
- [ ] C. Pageviews require a database
- [ ] D. Pageviews would replace all events

#### 42. Which event is an explicit page or flow event listed in the guidance?
- [ ] A. `weekly_menu_viewed`
- [ ] B. `$pageview`
- [ ] C. `button_clicked`
- [ ] D. `component_loaded`

#### 43. What should be documented if route-level `$pageview` tracking is enabled later?
- [ ] A. Client-side route transitions, localized routes, canonical URLs, and `/ingest` proxy paths
- [ ] B. Only button colors
- [ ] C. Only Sentry source maps
- [ ] D. Only Stripe webhook payloads

### Event Policy

#### 44. What naming style should analytics events use?
- [ ] A. Stable `snake_case`
- [ ] B. Component class names
- [ ] C. Sentence case
- [ ] D. Random PostHog-generated names

#### 45. What should event names describe?
- [ ] A. User or workflow outcomes
- [ ] B. Component file names
- [ ] C. DOM selectors
- [ ] D. Internal PostHog methods

#### 46. When should events be added?
- [ ] A. When the owning flow exists
- [ ] B. Before any behavior exists
- [ ] C. Only after production has errors
- [ ] D. Only after Sentry captures them

#### 47. Which event belongs to the canonical V1 customer funnel?
- [ ] A. `product_added`
- [ ] B. `nav_item_clicked`
- [ ] C. `button_hovered`
- [ ] D. `component_mounted`

#### 48. Which event belongs to the canonical V1 customer funnel?
- [ ] A. `payment_succeeded`
- [ ] B. `checkout_abandoned`
- [ ] C. `order_ahead_clicked`
- [ ] D. `visit_planning_clicked`

#### 49. What should the primary homepage ordering CTA use?
- [ ] A. `homepage_cta_clicked` with a compact `cta` property
- [ ] B. `view_menu_clicked` with the full button text
- [ ] C. `nav_item_clicked` with a DOM selector
- [ ] D. `$pageview`

#### 50. How should navigation and visit-planning interactions be treated?
- [ ] A. As typed secondary engagement events
- [ ] B. As canonical funnel events
- [ ] C. As Sentry messages
- [ ] D. As automatic pageviews

#### 51. What should not be mixed into funnel dashboards?
- [ ] A. Generic navigation and visit-planning secondary engagement events
- [ ] B. Product added events
- [ ] C. Checkout started events
- [ ] D. Payment succeeded events

#### 52. Which free-form event should be replaced by project-owned typed events?
- [ ] A. `view_menu_clicked`
- [ ] B. `homepage_cta_clicked`
- [ ] C. `payment_succeeded`
- [ ] D. `checkout_started`

#### 53. What is the narrow generic helper allowed for?
- [ ] A. Explicitly classified secondary engagement events
- [ ] B. Any arbitrary event string
- [ ] C. Direct PostHog SDK access from components
- [ ] D. Sentry exceptions

#### 54. Which event names are currently allowed by `recordSecondaryEngagement`?
- [ ] A. `navigation_clicked` and `visit_planning_clicked`
- [ ] B. `product_added` and `payment_succeeded`
- [ ] C. `view_menu_clicked` and `plan_visit_clicked`
- [ ] D. `checkout_started` and `$pageview`

#### 55. What happens when `recordSecondaryEngagement` receives an unallowed event name?
- [ ] A. It returns without capturing
- [ ] B. It captures anyway
- [ ] C. It throws
- [ ] D. It sends the event to Sentry

#### 56. What is `checkout_reservation_expired`?
- [ ] A. A server-side lifecycle event emitted when real reservation expiry behavior exists
- [ ] B. A browser pageview
- [ ] C. A customer contact field
- [ ] D. A component click event

#### 57. Why should V1 avoid `checkout_abandoned`?
- [ ] A. It overstates what the app can know from browser behavior
- [ ] B. PostHog reserves the name
- [ ] C. It is a Sentry event
- [ ] D. It requires session recording

#### 58. What does `checkout_exited` represent?
- [ ] A. A secondary checkout behavior event when a browser leaves checkout before payment starts or succeeds
- [ ] B. The canonical lifecycle event that releases stock
- [ ] C. A payment success event
- [ ] D. A server shutdown event

#### 59. What does `checkout_reservation_expired` represent?
- [ ] A. The canonical lifecycle abandonment event when a real checkout reservation expires and held stock can be released
- [ ] B. Any browser tab close
- [ ] C. A customer clicking navigation
- [ ] D. A route-level pageview

#### 60. Which server events are currently typed in `analytics-server.ts`?
- [ ] A. `checkout_reservation_expired` and `payment_succeeded`
- [ ] B. `navigation_clicked` and `visit_planning_clicked`
- [ ] C. `view_menu_clicked` and `plan_visit_clicked`
- [ ] D. `$pageview` and `$autocapture`

### Allowed And Disallowed Properties

#### 61. Which property category is allowed when useful for conversion analysis?
- [ ] A. Weekly menu, product, cart, checkout reservation, order, payment, and pickup slot IDs
- [ ] B. Customer email
- [ ] C. Raw request body
- [ ] D. Full Stripe payload

#### 62. Which property is allowed when it comes from PostHog's anonymous browser identity?
- [ ] A. Analytics visitor ID
- [ ] B. Customer phone number
- [ ] C. Session token
- [ ] D. Webhook secret

#### 63. Which value shape is preferred?
- [ ] A. A few stable scalar fields
- [ ] B. Full nested database records
- [ ] C. Raw form submissions
- [ ] D. Cookies

#### 64. How should cart or order totals be represented when sent?
- [ ] A. Normalized numeric fields such as minor currency units plus `currency`
- [ ] B. Formatted price strings copied from the UI
- [ ] C. Raw Stripe amounts copied from provider payloads
- [ ] D. Full cart payloads

#### 65. Which field is disallowed?
- [ ] A. `email`
- [ ] B. `productId`
- [ ] C. `weeklyMenuId`
- [ ] D. `currency`

#### 66. Which field is disallowed?
- [ ] A. `rawRequestBody`
- [ ] B. `checkoutReservationId`
- [ ] C. `orderTotalMinor`
- [ ] D. `locale`

#### 67. Which field is disallowed?
- [ ] A. `stripePayload`
- [ ] B. `paymentId`
- [ ] C. `pickupSlotId`
- [ ] D. `paymentState`

#### 68. What does `sanitizeAnalyticsProperties(undefined)` return?
- [ ] A. `undefined`
- [ ] B. `{}`
- [ ] C. `null`
- [ ] D. `{ properties: {} }`

#### 69. Which values are accepted by `sanitizeAnalyticsProperties`?
- [ ] A. Strings, finite numbers, and booleans
- [ ] B. Objects and arrays
- [ ] C. Functions
- [ ] D. `NaN` and `Infinity`

#### 70. What happens to `null` and `undefined` property values?
- [ ] A. They are dropped
- [ ] B. They are converted to empty strings
- [ ] C. They are sent as-is
- [ ] D. They throw

#### 71. What happens to `Number.NaN`?
- [ ] A. It is dropped
- [ ] B. It is sent as `0`
- [ ] C. It is stringified
- [ ] D. It throws

#### 72. How are analytics property keys normalized for disallowed-key checks?
- [ ] A. All non-alphanumeric characters are removed before lowercasing
- [ ] B. Only spaces are removed
- [ ] C. Keys are not normalized
- [ ] D. Keys are converted to JSON

#### 73. Which key variant should be blocked by the sanitizer?
- [ ] A. `api.key`
- [ ] B. `productId`
- [ ] C. `checkoutStep`
- [ ] D. `currency`

#### 74. What happens when every property is removed by sanitization?
- [ ] A. The sanitizer returns `undefined`
- [ ] B. The sanitizer returns the original object
- [ ] C. Capture throws
- [ ] D. The sanitizer returns `{ removed: true }`

#### 75. If analysis needs customer-level investigation, what should be captured?
- [ ] A. A safe order or checkout reservation ID
- [ ] B. Customer email
- [ ] C. Full customer record
- [ ] D. Raw checkout form

### Sentry Relationship, Routing, And Environment

#### 76. What is the relationship between Sentry and PostHog?
- [ ] A. Sentry owns unexpected error capture; PostHog owns product analytics
- [ ] B. PostHog owns unexpected error capture; Sentry owns analytics
- [ ] C. Both should receive every event automatically
- [ ] D. Sentry replaces PostHog

#### 77. Should the generic Sentry `captureMessage` wrapper automatically send to PostHog?
- [ ] A. No
- [ ] B. Yes
- [ ] C. Only in development
- [ ] D. Only for pageviews

#### 78. What should happen if an event is useful in both Sentry and PostHog?
- [ ] A. Model it explicitly at the application boundary
- [ ] B. Send every Sentry message to PostHog
- [ ] C. Send every PostHog event to Sentry
- [ ] D. Put provider calls in domain modules

#### 79. Which PostHog proxy rewrite is configured?
- [ ] A. `/ingest/static/:path*`
- [ ] B. `/posthog/static/:path*`
- [ ] C. `/api/sentry/:path*`
- [ ] D. `/analytics/static/:path*`

#### 80. Which PostHog proxy rewrite is configured?
- [ ] A. `/ingest/array/:path*`
- [ ] B. `/events/array/:path*`
- [ ] C. `/api/array/:path*`
- [ ] D. `/sentry/array/:path*`

#### 81. What must the `/ingest` rewrites avoid changing?
- [ ] A. Unrelated application routes or canonical URL behavior
- [ ] B. PostHog browser traffic
- [ ] C. Analytics event names
- [ ] D. Server API keys

#### 82. Which browser environment variable stores the public project token?
- [ ] A. `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`
- [ ] B. `POSTHOG_PROJECT_API_KEY`
- [ ] C. `SENTRY_AUTH_TOKEN`
- [ ] D. `POSTHOG_SECRET`

#### 83. Which browser environment variable stores the PostHog UI host?
- [ ] A. `NEXT_PUBLIC_POSTHOG_HOST`
- [ ] B. `POSTHOG_HOST`
- [ ] C. `NEXT_PUBLIC_SENTRY_DSN`
- [ ] D. `POSTHOG_PROJECT_API_KEY`

#### 84. Which server-only environment variable stores the PostHog project API key?
- [ ] A. `POSTHOG_PROJECT_API_KEY`
- [ ] B. `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`
- [ ] C. `NEXT_PUBLIC_POSTHOG_HOST`
- [ ] D. `SENTRY_PROJECT`

#### 85. Which server-only environment variable stores the PostHog API host?
- [ ] A. `POSTHOG_HOST`
- [ ] B. `NEXT_PUBLIC_POSTHOG_HOST`
- [ ] C. `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`
- [ ] D. `VERCEL_ENV`

#### 86. What must not be exposed to browser code?
- [ ] A. Private PostHog API keys
- [ ] B. The public project token
- [ ] C. The public PostHog UI host
- [ ] D. The `/ingest` path

#### 87. What do blank or whitespace-only PostHog env values do in the enablement helpers?
- [ ] A. Disable analytics
- [ ] B. Enable analytics
- [ ] C. Throw
- [ ] D. Switch to Sentry

### Tests, Validation, And Implementation Status

#### 88. What should PostHog tests verify?
- [ ] A. Project behavior and guardrails, not PostHog internals
- [ ] B. PostHog SDK private implementation details
- [ ] C. Visual layout only
- [ ] D. Production dashboard values

#### 89. Which test behavior is appropriate?
- [ ] A. Analytics property sanitization removes disallowed fields and preserves safe scalar fields
- [ ] B. PostHog network calls reach production
- [ ] C. Every button uses autocapture
- [ ] D. Sentry source maps upload

#### 90. Which test behavior is appropriate?
- [ ] A. Browser analytics initialization is skipped when the public project token is absent
- [ ] B. Browser analytics always initializes
- [ ] C. Browser analytics requires the server API key
- [ ] D. Browser analytics records sessions

#### 91. Which test behavior is appropriate?
- [ ] A. Server capture suppresses person profile creation for anonymous analytics visitor events
- [ ] B. Server capture creates identified profiles by default
- [ ] C. Server capture sends full order objects
- [ ] D. Server capture depends on browser local storage

#### 92. Which file initializes browser analytics for the app?
- [ ] A. `instrumentation-client.ts`
- [ ] B. `sentry.server.config.ts`
- [ ] C. `app/globals.css`
- [ ] D. `docs/posthog.md`

#### 93. Which facade helper records the primary homepage CTA?
- [ ] A. `recordHomepageCtaClicked`
- [ ] B. `captureBrowserPostHogEvent`
- [ ] C. `recordServerAnalyticsEvent`
- [ ] D. `initializeBrowserPostHog`

#### 94. What CTA value does the current primary homepage helper allow?
- [ ] A. `view_menu`
- [ ] B. `order_ahead`
- [ ] C. `plan_visit`
- [ ] D. `checkout_started`

#### 95. Which homepage interactions are recorded as secondary engagement?
- [ ] A. Navigation and visit planning
- [ ] B. Payment success and reservation expiry
- [ ] C. Sentry smoke route calls
- [ ] D. Source-map uploads

#### 96. What is the status of Step 4, "Analytics Wrapper and Event Plan"?
- [ ] A. Done
- [ ] B. In progress
- [ ] C. Not started
- [ ] D. Deferred

#### 97. What remains deferred to Step 12?
- [ ] A. Deeper PostHog instrumentation for completed customer and admin flows
- [ ] B. The PostHog wrapper itself
- [ ] C. The PostHog dependency
- [ ] D. The `/ingest` rewrites

#### 98. Which product flows are still deferred for concrete instrumentation?
- [ ] A. Product add, cart, checkout, payment success, checkout exit, reservation expiry, and order confirmation
- [ ] B. Homepage CTA only
- [ ] C. Sentry smoke route only
- [ ] D. Static CSS rendering

#### 99. When should this PostHog policy be revisited?
- [ ] A. When weekly menu, cart, checkout, and order confirmation flows are implemented
- [ ] B. Only when Sentry is removed
- [ ] C. Never
- [ ] D. Only after deleting tests

#### 100. Which statement best describes the current PostHog posture?
- [ ] A. A privacy-conservative analytics foundation exists, with explicit app-owned events now and deeper flow instrumentation deferred until flows exist
- [ ] B. Full autocapture, pageviews, session recording, and person profiles are enabled
- [ ] C. PostHog is the order system of record
- [ ] D. Business modules import PostHog directly

## Answer Key

1. B
2. C
3. B
4. B
5. A
6. A
7. A
8. B
9. A
10. A
11. A
12. B
13. B
14. A
15. B
16. B
17. B
18. B
19. A
20. C
21. A
22. A
23. B
24. A
25. B
26. A
27. B
28. C
29. B
30. A
31. B
32. B
33. A
34. A
35. A
36. A
37. A
38. A
39. A
40. A
41. A
42. A
43. A
44. A
45. A
46. A
47. A
48. A
49. A
50. A
51. A
52. A
53. A
54. A
55. A
56. A
57. A
58. A
59. A
60. A
61. A
62. A
63. A
64. A
65. A
66. A
67. A
68. A
69. A
70. A
71. A
72. A
73. A
74. A
75. A
76. A
77. A
78. A
79. A
80. A
81. A
82. A
83. A
84. A
85. A
86. A
87. A
88. A
89. A
90. A
91. A
92. A
93. A
94. A
95. A
96. A
97. A
98. A
99. A
100. A
