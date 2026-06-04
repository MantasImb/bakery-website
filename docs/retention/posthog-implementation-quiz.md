# PostHog Implementation Quiz

This quiz is based on the current PostHog guidance and implementation in this project. Each question has one best answer.

## Questions

### Project Guidance And Ownership

#### 1. What is PostHog's primary role in this project?
- [ ] A. Product analytics for product interest, preorder funnel progress, checkout conversion, and later operational usage
- [ ] B. Source of truth for orders and stock
- [ ] C. Unexpected error capture
- [ ] D. Payment authorization

#### 2. What is PostHog explicitly not responsible for?
- [ ] A. Error monitoring and business source-of-truth data
- [ ] B. Product analytics
- [ ] C. Conversion analysis
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
- [ ] A. Sentry `captureMessage`
- [ ] B. Raw fetch calls to PostHog
- [ ] C. The project-owned analytics facade
- [ ] D. A shared `utils.ts` file

#### 6. Why should capability modules keep analytics provider-agnostic?
- [ ] A. So PostHog can inspect private domain state directly
- [ ] B. So UI boundaries, route handlers, server actions, or orchestration code decide what analytics events are emitted
- [ ] C. So every domain function emits analytics
- [ ] D. So tests can mock PostHog everywhere

#### 7. What is the intended browser analytics call path?
- [ ] A. `component -> posthog-js -> analytics.ts`
- [ ] B. `component -> next.config.ts -> PostHog`
- [ ] C. `component -> Sentry -> PostHog`
- [ ] D. `component or boundary -> analytics.ts -> posthog.ts -> posthog-js`

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
- [ ] A. `route handler -> analytics.ts -> posthog-js`
- [ ] B. `route handler, server action, or webhook boundary -> analytics-server.ts -> posthog-server.ts -> posthog-node`
- [ ] C. `webhook -> Sentry -> PostHog`
- [ ] D. `server action -> browser local storage -> PostHog`

#### 11. Why is `analytics-server.ts` separate from the browser analytics facade?
- [ ] A. To avoid bundling the Node PostHog SDK into client components
- [ ] B. To disable all server analytics
- [ ] C. To make server events use `posthog-js`
- [ ] D. To bypass property sanitization

#### 12. What does the current server foundation avoid doing?
- [ ] A. Defining a typed server event contract
- [ ] B. Suppressing person profile creation
- [ ] C. Hard-coding checkout, Stripe, or persistence details before those flows exist
- [ ] D. No-oping safely when disabled

### Browser And Server Baseline

#### 13. When does browser PostHog initialize?
- [ ] A. Always during app startup
- [ ] B. Only when `POSTHOG_PROJECT_API_KEY` is present
- [ ] C. Only after checkout succeeds
- [ ] D. Only when `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` is present and non-blank

#### 14. What is the foundation-stage enablement posture?
- [ ] A. Analytics must always be disabled
- [ ] B. Analytics must require login
- [ ] C. Analytics must require Stripe configuration
- [ ] D. Analytics may default to enabled when the relevant PostHog configuration is present

#### 15. Which browser API host is configured for PostHog events?
- [ ] A. `/api/posthog`
- [ ] B. `/analytics`
- [ ] C. `/sentry`
- [ ] D. `/ingest`

#### 16. What is `autocapture` set to in the baseline browser config?
- [ ] A. `false`
- [ ] B. `true`
- [ ] C. `"anonymous_only"`
- [ ] D. It is omitted

#### 17. What is `capture_pageview` set to in the baseline browser config?
- [ ] A. `true`
- [ ] B. `"route_only"`
- [ ] C. `false`
- [ ] D. It is omitted

#### 18. What is `capture_exceptions` set to in the baseline browser config?
- [ ] A. `false`
- [ ] B. `true`
- [ ] C. `"unhandled"`
- [ ] D. It depends on `NODE_ENV`

#### 19. What is `disable_session_recording` set to?
- [ ] A. `false`
- [ ] B. `true`
- [ ] C. `"errors_only"`
- [ ] D. It depends on consent

#### 20. What is `person_profiles` set to in browser PostHog config?
- [ ] A. `"always"`
- [ ] B. `"never"`
- [ ] C. `"identified_only"`
- [ ] D. It is omitted

#### 21. What does the browser baseline mean in practice?
- [ ] A. PostHog captures every route view automatically
- [ ] B. PostHog records sessions by default
- [ ] C. PostHog captures only events the app deliberately emits
- [ ] D. PostHog identifies all visitors as people

#### 22. What prevents duplicate browser SDK initialization?
- [ ] A. A cookie written by Sentry
- [ ] B. Next.js route caching
- [ ] C. A module-level idempotency flag in `posthog.ts`
- [ ] D. The PostHog host variable

#### 23. What should happen if browser capture throws?
- [ ] A. The app should swallow the analytics failure
- [ ] B. The user interaction should fail
- [ ] C. The event should be sent to Sentry automatically
- [ ] D. The user should be redirected

#### 24. What should happen if server PostHog capture throws?
- [ ] A. The request should fail
- [ ] B. The checkout should be cancelled
- [ ] C. The request flow should continue while the failure is logged
- [ ] D. The event should be retried synchronously until successful

#### 25. How is the server PostHog client managed?
- [ ] A. A new client is created for every event
- [ ] B. It is stored in React state
- [ ] C. A module-level singleton is reused
- [ ] D. It is created in `next.config.ts`

#### 26. What shutdown behavior is registered for the server PostHog client?
- [ ] A. A browser unload handler flushes it
- [ ] B. It is never shut down
- [ ] C. It is shut down after every capture
- [ ] D. A process `beforeExit` hook calls the client's shutdown method

### Consent And Analytics Visitor Identity

#### 27. What is the current consent or notice UI status?
- [ ] A. Implemented and required for every event
- [ ] B. A future policy decision
- [ ] C. Forbidden by the guidance
- [ ] D. Replaced by Sentry consent

#### 28. What should checkout, payment, and order behavior depend on?
- [ ] A. Analytics being enabled
- [ ] B. A stable analytics visitor ID
- [ ] C. Browser session recording
- [ ] D. Business rules and source-of-truth state, not analytics

#### 29. What is the project's analytics visitor ID?
- [ ] A. Customer email
- [ ] B. Stripe customer ID
- [ ] C. PostHog's generated anonymous browser `distinct_id`
- [ ] D. Order number

#### 30. How should checkout use the analytics visitor ID in the future?
- [ ] A. Store it optionally on the checkout reservation
- [ ] B. Require it before checkout starts
- [ ] C. Treat it as a customer account ID
- [ ] D. Send it to Sentry as direct customer identity

#### 31. What is the analytics visitor ID not?
- [ ] A. A customer, account, login, source of truth, or business rule input
- [ ] B. A browser-generated anonymous analytics ID
- [ ] C. A way to connect anonymous browser and server analytics events
- [ ] D. An optional value for funnel continuity

#### 32. What should happen if the analytics visitor ID is absent?
- [ ] A. Checkout must fail
- [ ] B. Checkout should still work
- [ ] C. Server events must be dropped
- [ ] D. PostHog should identify the customer by email

#### 33. Which fallback distinct ID does the server adapter use when no visitor ID is present?
- [ ] A. `unknown_customer`
- [ ] B. `checkout_user`
- [ ] C. `guest_email`
- [ ] D. `anonymous_server`

#### 34. What must server-side PostHog capture suppress?
- [ ] A. All event properties
- [ ] B. All server events
- [ ] C. Person profile creation for anonymous visitor events
- [ ] D. All checkout reservation IDs

#### 35. Which facade function exposes the anonymous browser distinct ID?
- [ ] A. `captureBrowserPostHogEvent`
- [ ] B. `recordServerAnalyticsEvent`
- [ ] C. `sanitizeAnalyticsProperties`
- [ ] D. `getAnalyticsVisitorId`

### Autocapture And Pageview Policy

#### 36. Why is autocapture disabled?
- [ ] A. PostHog does not support it
- [ ] B. It prevents explicit capture
- [ ] C. It is required only on the server
- [ ] D. It can capture UI details instead of deliberate product-language events

#### 37. Which risk is listed for autocapture?
- [ ] A. It prevents route rendering
- [ ] B. It disables checkout
- [ ] C. It removes all analytics events
- [ ] D. It may collect clicked text, element metadata, URLs, and other page context not modeled as safe analytics data

#### 38. Why can autocapture create noisy events in this project?
- [ ] A. Weekly menu, cart, checkout, payment, and order flows are still forming
- [ ] B. It only records payment events
- [ ] C. It only works in production
- [ ] D. It requires Sentry source maps

#### 39. What does autocapture not replace?
- [ ] A. CSS styling
- [ ] B. TypeScript checking
- [ ] C. Database migrations
- [ ] D. Meaningful business events such as product added, checkout started, pickup slot selected, payment succeeded, or reservation expired

#### 40. What must be documented before enabling autocapture later?
- [ ] A. Masking, privacy, retention, and event-review policy
- [ ] B. Only the PostHog host
- [ ] C. The Sentry DSN
- [ ] D. The weekly menu price list

#### 41. Why is automatic pageview capture disabled?
- [ ] A. Pageviews are impossible in Next.js
- [ ] B. Pageviews require a database
- [ ] C. Pageviews would replace all events
- [ ] D. Route and funnel semantics are not defined yet

#### 42. Which event is an explicit page or flow event listed in the guidance?
- [ ] A. `$pageview`
- [ ] B. `weekly_menu_viewed`
- [ ] C. `button_clicked`
- [ ] D. `component_loaded`

#### 43. What should be documented if route-level `$pageview` tracking is enabled later?
- [ ] A. Only button colors
- [ ] B. Client-side route transitions, localized routes, canonical URLs, and `/ingest` proxy paths
- [ ] C. Only Sentry source maps
- [ ] D. Only Stripe webhook payloads

### Event Policy

#### 44. What naming style should analytics events use?
- [ ] A. Component class names
- [ ] B. Sentence case
- [ ] C. Stable `snake_case`
- [ ] D. Random PostHog-generated names

#### 45. What should event names describe?
- [ ] A. User or workflow outcomes
- [ ] B. Component file names
- [ ] C. DOM selectors
- [ ] D. Internal PostHog methods

#### 46. When should events be added?
- [ ] A. Before any behavior exists
- [ ] B. When the owning flow exists
- [ ] C. Only after production has errors
- [ ] D. Only after Sentry captures them

#### 47. Which event belongs to the canonical V1 customer funnel?
- [ ] A. `nav_item_clicked`
- [ ] B. `product_added`
- [ ] C. `button_hovered`
- [ ] D. `component_mounted`

#### 48. Which event belongs to the canonical V1 customer funnel?
- [ ] A. `checkout_abandoned`
- [ ] B. `payment_succeeded`
- [ ] C. `order_ahead_clicked`
- [ ] D. `visit_planning_clicked`

#### 49. What should the primary homepage ordering CTA use?
- [ ] A. `view_menu_clicked` with the full button text
- [ ] B. `nav_item_clicked` with a DOM selector
- [ ] C. `homepage_cta_clicked` with a compact `cta` property
- [ ] D. `$pageview`

#### 50. How should navigation and visit-planning interactions be treated?
- [ ] A. As typed secondary engagement events
- [ ] B. As canonical funnel events
- [ ] C. As Sentry messages
- [ ] D. As automatic pageviews

#### 51. What should not be mixed into funnel dashboards?
- [ ] A. Product added events
- [ ] B. Checkout started events
- [ ] C. Generic navigation and visit-planning secondary engagement events
- [ ] D. Payment succeeded events

#### 52. Which free-form event should be replaced by project-owned typed events?
- [ ] A. `homepage_cta_clicked`
- [ ] B. `payment_succeeded`
- [ ] C. `checkout_started`
- [ ] D. `view_menu_clicked`

#### 53. What is the narrow generic helper allowed for?
- [ ] A. Explicitly classified secondary engagement events
- [ ] B. Any arbitrary event string
- [ ] C. Direct PostHog SDK access from components
- [ ] D. Sentry exceptions

#### 54. Which event names are currently allowed by `recordSecondaryEngagement`?
- [ ] A. `product_added` and `payment_succeeded`
- [ ] B. `navigation_clicked` and `visit_planning_clicked`
- [ ] C. `view_menu_clicked` and `plan_visit_clicked`
- [ ] D. `checkout_started` and `$pageview`

#### 55. What happens when `recordSecondaryEngagement` receives an unallowed event name?
- [ ] A. It captures anyway
- [ ] B. It throws
- [ ] C. It sends the event to Sentry
- [ ] D. It returns without capturing

#### 56. What is `checkout_reservation_expired`?
- [ ] A. A browser pageview
- [ ] B. A customer contact field
- [ ] C. A server-side lifecycle event emitted when real reservation expiry behavior exists
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
- [ ] A. `navigation_clicked` and `visit_planning_clicked`
- [ ] B. `view_menu_clicked` and `plan_visit_clicked`
- [ ] C. `$pageview` and `$autocapture`
- [ ] D. `checkout_reservation_expired` and `payment_succeeded`

### Allowed And Disallowed Properties

#### 61. Which property category is allowed when useful for conversion analysis?
- [ ] A. Customer email
- [ ] B. Weekly menu, product, cart, checkout reservation, order, payment, and pickup slot IDs
- [ ] C. Raw request body
- [ ] D. Full Stripe payload

#### 62. Which property is allowed when it comes from PostHog's anonymous browser identity?
- [ ] A. Customer phone number
- [ ] B. Analytics visitor ID
- [ ] C. Session token
- [ ] D. Webhook secret

#### 63. Which value shape is preferred?
- [ ] A. Full nested database records
- [ ] B. Raw form submissions
- [ ] C. Cookies
- [ ] D. A few stable scalar fields

#### 64. How should cart or order totals be represented when sent?
- [ ] A. Formatted price strings copied from the UI
- [ ] B. Raw Stripe amounts copied from provider payloads
- [ ] C. Normalized numeric fields such as minor currency units plus `currency`
- [ ] D. Full cart payloads

#### 65. Which field is disallowed?
- [ ] A. `email`
- [ ] B. `productId`
- [ ] C. `weeklyMenuId`
- [ ] D. `currency`

#### 66. Which field is disallowed?
- [ ] A. `checkoutReservationId`
- [ ] B. `rawRequestBody`
- [ ] C. `orderTotalMinor`
- [ ] D. `locale`

#### 67. Which field is disallowed?
- [ ] A. `paymentId`
- [ ] B. `pickupSlotId`
- [ ] C. `stripePayload`
- [ ] D. `paymentState`

#### 68. What does `sanitizeAnalyticsProperties(undefined)` return?
- [ ] A. `{}`
- [ ] B. `null`
- [ ] C. `undefined`
- [ ] D. `{ properties: {} }`

#### 69. Which values are accepted by `sanitizeAnalyticsProperties`?
- [ ] A. Objects and arrays
- [ ] B. Strings, finite numbers, and booleans
- [ ] C. Functions
- [ ] D. `NaN` and `Infinity`

#### 70. What happens to `null` and `undefined` property values?
- [ ] A. They are converted to empty strings
- [ ] B. They are dropped
- [ ] C. They are sent as-is
- [ ] D. They throw

#### 71. What happens to `Number.NaN`?
- [ ] A. It is dropped
- [ ] B. It is sent as `0`
- [ ] C. It is stringified
- [ ] D. It throws

#### 72. How are analytics property keys normalized for disallowed-key checks?
- [ ] A. Only spaces are removed
- [ ] B. Keys are not normalized
- [ ] C. Keys are converted to JSON
- [ ] D. All non-alphanumeric characters are removed before lowercasing

#### 73. Which key variant should be blocked by the sanitizer?
- [ ] A. `api.key`
- [ ] B. `productId`
- [ ] C. `checkoutStep`
- [ ] D. `currency`

#### 74. What happens when every property is removed by sanitization?
- [ ] A. The sanitizer returns the original object
- [ ] B. Capture throws
- [ ] C. The sanitizer returns `{ removed: true }`
- [ ] D. The sanitizer returns `undefined`

#### 75. If analysis needs customer-level investigation, what should be captured?
- [ ] A. Customer email
- [ ] B. Full customer record
- [ ] C. A safe order or checkout reservation ID
- [ ] D. Raw checkout form

### Sentry Relationship, Routing, And Environment

#### 76. What is the relationship between Sentry and PostHog?
- [ ] A. PostHog owns unexpected error capture; Sentry owns analytics
- [ ] B. Sentry owns unexpected error capture; PostHog owns product analytics
- [ ] C. Both should receive every event automatically
- [ ] D. Sentry replaces PostHog

#### 77. Should the generic Sentry `captureMessage` wrapper automatically send to PostHog?
- [ ] A. Yes
- [ ] B. Only in development
- [ ] C. No
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
- [ ] A. `/events/array/:path*`
- [ ] B. `/api/array/:path*`
- [ ] C. `/ingest/array/:path*`
- [ ] D. `/sentry/array/:path*`

#### 81. What must the `/ingest` rewrites avoid changing?
- [ ] A. PostHog browser traffic
- [ ] B. Analytics event names
- [ ] C. Server API keys
- [ ] D. Unrelated application routes or canonical URL behavior

#### 82. Which browser environment variable stores the public project token?
- [ ] A. `POSTHOG_PROJECT_API_KEY`
- [ ] B. `SENTRY_AUTH_TOKEN`
- [ ] C. `POSTHOG_SECRET`
- [ ] D. `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`

#### 83. Which browser environment variable stores the PostHog UI host?
- [ ] A. `NEXT_PUBLIC_POSTHOG_HOST`
- [ ] B. `POSTHOG_HOST`
- [ ] C. `NEXT_PUBLIC_SENTRY_DSN`
- [ ] D. `POSTHOG_PROJECT_API_KEY`

#### 84. Which server-only environment variable stores the PostHog project API key?
- [ ] A. `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`
- [ ] B. `NEXT_PUBLIC_POSTHOG_HOST`
- [ ] C. `POSTHOG_PROJECT_API_KEY`
- [ ] D. `SENTRY_PROJECT`

#### 85. Which server-only environment variable stores the PostHog API host?
- [ ] A. `NEXT_PUBLIC_POSTHOG_HOST`
- [ ] B. `POSTHOG_HOST`
- [ ] C. `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`
- [ ] D. `VERCEL_ENV`

#### 86. What must not be exposed to browser code?
- [ ] A. The public project token
- [ ] B. The public PostHog UI host
- [ ] C. The `/ingest` path
- [ ] D. Private PostHog API keys

#### 87. What do blank or whitespace-only PostHog env values do in the enablement helpers?
- [ ] A. Disable analytics
- [ ] B. Enable analytics
- [ ] C. Throw
- [ ] D. Switch to Sentry

### Tests, Validation, And Implementation Status

#### 88. What should PostHog tests verify?
- [ ] A. PostHog SDK private implementation details
- [ ] B. Visual layout only
- [ ] C. Project behavior and guardrails, not PostHog internals
- [ ] D. Production dashboard values

#### 89. Which test behavior is appropriate?
- [ ] A. PostHog network calls reach production
- [ ] B. Every button uses autocapture
- [ ] C. Analytics property sanitization removes disallowed fields and preserves safe scalar fields
- [ ] D. Sentry source maps upload

#### 90. Which test behavior is appropriate?
- [ ] A. Browser analytics always initializes
- [ ] B. Browser analytics initialization is skipped when the public project token is absent
- [ ] C. Browser analytics requires the server API key
- [ ] D. Browser analytics records sessions

#### 91. Which test behavior is appropriate?
- [ ] A. Server capture creates identified profiles by default
- [ ] B. Server capture sends full order objects
- [ ] C. Server capture suppresses person profile creation for anonymous analytics visitor events
- [ ] D. Server capture depends on browser local storage

#### 92. Which file initializes browser analytics for the app?
- [ ] A. `instrumentation-client.ts`
- [ ] B. `sentry.server.config.ts`
- [ ] C. `app/globals.css`
- [ ] D. `docs/posthog.md`

#### 93. Which facade helper records the primary homepage CTA?
- [ ] A. `captureBrowserPostHogEvent`
- [ ] B. `recordHomepageCtaClicked`
- [ ] C. `recordServerAnalyticsEvent`
- [ ] D. `initializeBrowserPostHog`

#### 94. What CTA value does the current primary homepage helper allow?
- [ ] A. `order_ahead`
- [ ] B. `plan_visit`
- [ ] C. `view_menu`
- [ ] D. `checkout_started`

#### 95. Which homepage interactions are recorded as secondary engagement?
- [ ] A. Payment success and reservation expiry
- [ ] B. Sentry smoke route calls
- [ ] C. Source-map uploads
- [ ] D. Navigation and visit planning

#### 96. What is the status of Step 4, "Analytics Wrapper and Event Plan"?
- [ ] A. In progress
- [ ] B. Not started
- [ ] C. Deferred
- [ ] D. Done

#### 97. What remains deferred to Step 12?
- [ ] A. The PostHog wrapper itself
- [ ] B. The PostHog dependency
- [ ] C. The `/ingest` rewrites
- [ ] D. Deeper PostHog instrumentation for completed customer and admin flows

#### 98. Which product flows are still deferred for concrete instrumentation?
- [ ] A. Homepage CTA only
- [ ] B. Sentry smoke route only
- [ ] C. Static CSS rendering
- [ ] D. Product add, cart, checkout, payment success, checkout exit, reservation expiry, and order confirmation

#### 99. When should this PostHog policy be revisited?
- [ ] A. Only when Sentry is removed
- [ ] B. Never
- [ ] C. When weekly menu, cart, checkout, and order confirmation flows are implemented
- [ ] D. Only after deleting tests

#### 100. Which statement best describes the current PostHog posture?
- [ ] A. Full autocapture, pageviews, session recording, and person profiles are enabled
- [ ] B. A privacy-conservative analytics foundation exists, with explicit app-owned events now and deeper flow instrumentation deferred until flows exist
- [ ] C. PostHog is the order system of record
- [ ] D. Business modules import PostHog directly

## Answer Key

1. A
2. A
3. B
4. B
5. C
6. B
7. D
8. B
9. A
10. B
11. A
12. C
13. D
14. D
15. D
16. A
17. C
18. A
19. B
20. B
21. C
22. C
23. A
24. C
25. C
26. D
27. B
28. D
29. C
30. A
31. A
32. B
33. D
34. C
35. D
36. D
37. D
38. A
39. D
40. A
41. D
42. B
43. B
44. C
45. A
46. B
47. B
48. B
49. C
50. A
51. C
52. D
53. A
54. B
55. D
56. C
57. A
58. A
59. A
60. D
61. B
62. B
63. D
64. C
65. A
66. B
67. C
68. C
69. B
70. B
71. A
72. D
73. A
74. D
75. C
76. B
77. C
78. A
79. A
80. C
81. D
82. D
83. A
84. C
85. B
86. D
87. A
88. C
89. C
90. B
91. C
92. A
93. B
94. C
95. D
96. D
97. D
98. D
99. C
100. B
