# Internationalization Implementation Quiz

This quiz is based on the current internationalization guidance and implementation in this project. Each question has one best answer.

## Questions

### Project Scope And Ownership

#### 1. Which customer locales does V1 support?
- [ ] A. `no` and `en`
- [ ] B. `nb`, `nn`, and `en`
- [ ] C. `en` only
- [ ] D. Any locale accepted by the browser

#### 2. What does the `no` locale represent for V1?
- [ ] A. Norwegian Bokmal
- [ ] B. Any Norwegian language variant
- [ ] C. A country selector for Norway
- [ ] D. A placeholder for future translation work

#### 3. Which locale is the default?
- [ ] A. English
- [ ] B. Norwegian Bokmal
- [ ] C. The first browser language
- [ ] D. The latest selected admin language

#### 4. Which surfaces are localized in V1?
- [ ] A. Customer-facing ordering pages
- [ ] B. Admin and kitchen screens only
- [ ] C. API routes
- [ ] D. Technical logs

#### 5. Which surfaces are intentionally not localized in V1?
- [ ] A. Admin and kitchen screens
- [ ] B. Customer homepage content
- [ ] C. Customer navigation labels
- [ ] D. Customer metadata

#### 6. Where should durable i18n trade-off decisions live?
- [ ] A. `docs/adr/`
- [ ] B. `messages/`
- [ ] C. `app/[locale]/`
- [ ] D. `next.config.ts`

#### 7. Which document records practical localization rules for customer-facing V1 work?
- [ ] A. `docs/i18n.md`
- [ ] B. `docs/sentry.md`
- [ ] C. `docs/posthog.md`
- [ ] D. `docs/retention/sentry-implementation-quiz.md`

#### 8. What is the role of `next-intl` in the implementation?
- [ ] A. Localized routing, UI messages, locale-aware navigation, and future localized customer copy
- [ ] B. Product inventory persistence
- [ ] C. Admin authentication
- [ ] D. Payment authorization

#### 9. What did Step 5 explicitly avoid building first?
- [ ] A. Temporary hand-rolled dictionaries
- [ ] B. The `next-intl` dependency
- [ ] C. Locale-prefixed routes
- [ ] D. Message-key parity tests

#### 10. When should project-owned localization wrappers be added?
- [ ] A. Only after repeated product code proves they are needed
- [ ] B. Before any localized page exists
- [ ] C. Any time a component imports a translation function
- [ ] D. To replace all `next-intl` primitives immediately

### Routing And Locale Boundaries

#### 11. Which customer route shape is canonical in V1?
- [ ] A. Explicit locale prefixes like `/no` and `/en`
- [ ] B. Unprefixed routes like `/menu`
- [ ] C. Query-string locales like `/menu?locale=no`
- [ ] D. Browser-negotiated hidden locale routes

#### 12. What should `/` do?
- [ ] A. Redirect deterministically to `/no`
- [ ] B. Render English when the browser prefers English
- [ ] C. Return not-found
- [ ] D. Render both languages

#### 13. Does V1 use browser-language negotiation to choose `/en`?
- [ ] A. No
- [ ] B. Yes, for English-preferring visitors
- [ ] C. Yes, only in production
- [ ] D. Yes, only on checkout routes

#### 14. What should happen for unsupported locale-like prefixes such as `/fr/menu`?
- [ ] A. Return not-found
- [ ] B. Redirect to `/no/menu`
- [ ] C. Redirect to `/en/menu`
- [ ] D. Render the unprefixed route

#### 15. Which route segment style should customer routes use after the locale prefix?
- [ ] A. Stable English segments such as `/no/menu`
- [ ] B. Translated slugs such as `/no/meny`
- [ ] C. Numeric route IDs only
- [ ] D. Locale query parameters

#### 16. What should be translated for customer pages?
- [ ] A. Visible labels and page content
- [ ] B. API route paths
- [ ] C. Framework internals
- [ ] D. The `admin` route segment

#### 17. Where should localized customer pages live?
- [ ] A. Under `app/[locale]/(customer)/...`
- [ ] B. Under `app/api/[locale]/...`
- [ ] C. Under `app/admin/[locale]/...`
- [ ] D. Only in root `app/page.tsx`

#### 18. Where should admin and API routes live relative to the locale tree?
- [ ] A. Outside the locale tree
- [ ] B. Inside every supported locale
- [ ] C. Under `/no/api` only
- [ ] D. Under `/en/admin` only

#### 19. Which module owns supported locale constants and narrow route helpers?
- [ ] A. `i18n/routing.ts`
- [ ] B. `components/home/HomePage.tsx`
- [ ] C. `messages/no.json`
- [ ] D. `app/viewport.ts`

#### 20. Which helper swaps only the locale prefix while preserving the stable path?
- [ ] A. `replacePathLocale`
- [ ] B. `hasUnsupportedLocalePrefix`
- [ ] C. `setRequestLocale`
- [ ] D. `getTranslations`

#### 21. Which helper detects unsupported two-letter locale-like prefixes?
- [ ] A. `hasUnsupportedLocalePrefix`
- [ ] B. `localizePath`
- [ ] C. `generateStaticParams`
- [ ] D. `NextIntlClientProvider`

#### 22. What should `replacePathLocale("/no/checkout", "en")` produce?
- [ ] A. `/en/checkout`
- [ ] B. `/no/en/checkout`
- [ ] C. `/checkout?locale=en`
- [ ] D. `/en/no/checkout`

#### 23. What is the URL's role in customer locale state?
- [ ] A. It is the source of truth for the active customer locale
- [ ] B. It is secondary to browser headers
- [ ] C. It is secondary to admin preferences
- [ ] D. It is ignored after the first page load

#### 24. Which routes should the proxy matcher exclude from locale redirect handling?
- [ ] A. API routes, admin routes, PostHog ingest, framework internals, static assets, and `favicon.ico`
- [ ] B. All customer pages
- [ ] C. Only `/no`
- [ ] D. Only `/en`

#### 25. Why does the proxy let unsupported locale-like prefixes continue instead of redirecting them?
- [ ] A. So the route can resolve to not-found instead of masking the bad prefix as Norwegian
- [ ] B. So `/fr` becomes a supported locale
- [ ] C. So browser-language negotiation can run
- [ ] D. So admin routes become localized

### Request, Layout, And Page Implementation

#### 26. Which file loads locale-specific message JSON for `next-intl` requests?
- [ ] A. `i18n/request.ts`
- [ ] B. `messages/en.json`
- [ ] C. `components/home/LanguageSwitcher.tsx`
- [ ] D. `app/viewport.ts`

#### 27. What fallback does request configuration use when the requested locale is invalid?
- [ ] A. `routing.defaultLocale`
- [ ] B. English always
- [ ] C. The browser's first language
- [ ] D. `null`

#### 28. Which layout validates the route locale before rendering localized customer pages?
- [ ] A. `app/[locale]/layout.tsx`
- [ ] B. `app/viewport.ts`
- [ ] C. `components/home/HomePage.tsx`
- [ ] D. `messages/no.json`

#### 29. What does the locale layout call when the locale is unsupported?
- [ ] A. `notFound()`
- [ ] B. `redirect("/no")`
- [ ] C. `redirect("/en")`
- [ ] D. `captureException()`

#### 30. Why does the locale layout call `setRequestLocale(locale)`?
- [ ] A. To set the active request locale for localized rendering
- [ ] B. To persist the customer's email language
- [ ] C. To create translated route slugs
- [ ] D. To initialize PostHog

#### 31. What does `generateStaticParams` return for the localized layout?
- [ ] A. One params object per supported locale
- [ ] B. One params object per product
- [ ] C. A single unprefixed params object
- [ ] D. Runtime browser language headers

#### 32. Which provider wraps localized page children in the locale layout?
- [ ] A. `NextIntlClientProvider`
- [ ] B. `Sentry.ErrorBoundary`
- [ ] C. `PostHogProvider`
- [ ] D. `StripeProvider`

#### 33. Which current page is the first localized vertical slice?
- [ ] A. The homepage
- [ ] B. Admin orders
- [ ] C. Stripe webhooks
- [ ] D. Kitchen production

#### 34. How does the localized homepage retrieve UI copy?
- [ ] A. With `getTranslations` using the `HomePage` namespace
- [ ] B. By importing both JSON files into the client component
- [ ] C. By reading browser language headers in the component
- [ ] D. By fetching translated slugs from Stripe

#### 35. What does `HomePage` receive from the route page?
- [ ] A. The current path, locale, and resolved messages
- [ ] B. Raw browser headers
- [ ] C. A PostHog distinct ID
- [ ] D. A Stripe locale mapping

#### 36. Which component renders the customer-facing language switcher?
- [ ] A. `components/home/LanguageSwitcher.tsx`
- [ ] B. `components/home/NavLinks.tsx`
- [ ] C. `app/viewport.ts`
- [ ] D. `i18n/request.ts`

#### 37. Which labels should the language switcher use?
- [ ] A. Clear language names like `Norsk` and `English`
- [ ] B. Compact codes like `NO` and `EN` only
- [ ] C. Browser locale tags only
- [ ] D. Admin role names

#### 38. What should the language switcher preserve when changing languages?
- [ ] A. The current stable path after the locale prefix
- [ ] B. The unsupported locale prefix
- [ ] C. The browser's preferred language list
- [ ] D. The page's translated slug

### Messages And Customer Copy

#### 39. Where do the initial message files live?
- [ ] A. `messages/no.json` and `messages/en.json`
- [ ] B. `app/[locale]/messages.ts`
- [ ] C. `docs/i18n.md`
- [ ] D. `public/locales`

#### 40. What should happen when a customer-facing message key is missing in one supported locale?
- [ ] A. Tests or build checks should fail instead of falling back silently
- [ ] B. The app should silently fall back to English
- [ ] C. The app should silently fall back to Norwegian
- [ ] D. The key should be hidden from the page

#### 41. Which message structure does the guidance prefer?
- [ ] A. Shallow nested JSON by surface or shared namespace
- [ ] B. One large flat file with every key
- [ ] C. One file per individual string
- [ ] D. Inline translation objects inside every component

#### 42. Where should page or workflow copy live?
- [ ] A. Under the owning surface namespace
- [ ] B. In a global catch-all namespace only
- [ ] C. In product persistence tables only
- [ ] D. In `next.config.ts`

#### 43. Where may exact phrases reused across customer-facing surfaces live?
- [ ] A. A shared namespace
- [ ] B. Sentry context
- [ ] C. Route slugs
- [ ] D. API paths

#### 44. What is the current quality target for initial localized homepage copy?
- [ ] A. Clean placeholder-quality copy for proving the system and tone
- [ ] B. Final sales copy for all future products
- [ ] C. Machine-generated placeholders only
- [ ] D. English-only copy

#### 45. What should final sales and product copy wait for?
- [ ] A. The active weekly menu and product content model
- [ ] B. Browser-language negotiation
- [ ] C. Admin localization
- [ ] D. Generated message-key types

#### 46. What kind of wording should customer copy use?
- [ ] A. Clear, warm, and direct wording
- [ ] B. Clever wording in all validation and checkout copy
- [ ] C. Technical operator language
- [ ] D. Provider-specific API wording

#### 47. Which areas should prioritize clarity and confidence over brand voice?
- [ ] A. Validation, checkout, payment, pickup, allergy, cancellation, refund, and error copy
- [ ] B. Only the homepage hero
- [ ] C. Only admin logs
- [ ] D. Only Sentry event names

#### 48. Which UI text should be localized under the locale route segment?
- [ ] A. Labels, helper text, validation messages, empty states, loading states, not-found UI, and recoverable errors
- [ ] B. Raw request bodies
- [ ] C. Customer notes
- [ ] D. Technical stack traces

#### 49. What should root or global error fallback UI do if it cannot know the active locale?
- [ ] A. Stay minimal and use the Norwegian/default posture
- [ ] B. Use browser-language negotiation
- [ ] C. Show every supported translation
- [ ] D. Render detailed technical diagnostics

#### 50. Why are generated message-key types deferred?
- [ ] A. Message-key parity checks and route smoke tests are enough for V1
- [ ] B. TypeScript cannot type JSON files
- [ ] C. `next-intl` forbids them
- [ ] D. They are required only for admin pages

### Product Content And Formatting

#### 51. What is separate from `next-intl` UI messages?
- [ ] A. Persisted product names, descriptions, allergen notes, and weekly menu content
- [ ] B. Homepage button labels
- [ ] C. Navigation labels
- [ ] D. Metadata titles

#### 52. What must be true before a weekly menu can be published once product content exists?
- [ ] A. Product-facing text content exists in both supported customer languages
- [ ] B. Product content exists only in the default locale
- [ ] C. Product images contain translated labels
- [ ] D. Product slugs are translated

#### 53. What should happen between Norwegian and English product content?
- [ ] A. Do not silently fall back between languages
- [ ] B. Always fall back to English
- [ ] C. Always fall back to Norwegian
- [ ] D. Fall back based on browser headers

#### 54. What should product images avoid?
- [ ] A. Language-specific text inside images
- [ ] B. Locale-neutral visuals
- [ ] C. Product photography
- [ ] D. Alt text

#### 55. How should user-provided checkout data be handled?
- [ ] A. Store it as provided or structurally normalized; do not translate it
- [ ] B. Translate names and notes into the active locale
- [ ] C. Drop it when the language switcher is used
- [ ] D. Send it to Sentry for translation debugging

#### 56. What should be localized around user-provided checkout data?
- [ ] A. Labels, helper text, validation, and errors
- [ ] B. Customer names
- [ ] C. Customer email addresses
- [ ] D. Raw notes

#### 57. What should customer-facing money, date, time, and number display use?
- [ ] A. The active customer locale
- [ ] B. English only
- [ ] C. Admin locale
- [ ] D. Browser locale even when the URL says otherwise

#### 58. What is the only V1 currency?
- [ ] A. NOK
- [ ] B. EUR
- [ ] C. USD
- [ ] D. GBP

#### 59. How should money, dates, and pickup windows be persisted?
- [ ] A. As structured values
- [ ] B. As localized display strings
- [ ] C. As translated route slugs
- [ ] D. As image text

#### 60. What should pickup labels avoid?
- [ ] A. Ambiguous numeric-only dates
- [ ] B. Explicit localized labels
- [ ] C. Active customer locale formatting
- [ ] D. Structured source values

### Checkout, Stripe, And Email

#### 61. What should cart data remain?
- [ ] A. Locale-neutral
- [ ] B. Translated into every customer language
- [ ] C. Tied to the admin locale
- [ ] D. Stored as localized strings

#### 62. Which routes should preserve the active locale unless the customer explicitly switches language?
- [ ] A. Cart, checkout, payment return, and order confirmation routes
- [ ] B. API routes
- [ ] C. Static assets
- [ ] D. Admin dashboards

#### 63. What should happen when a customer switches language during checkout?
- [ ] A. Preserve cart and entered data where technically feasible and change only UI language
- [ ] B. Clear the cart
- [ ] C. Restart checkout in English
- [ ] D. Translate customer notes

#### 64. When should checkout or order state capture the customer locale?
- [ ] A. When needed for transactional emails and later customer communication
- [ ] B. Before any cart item can be added
- [ ] C. Only when admin screens are localized
- [ ] D. Never

#### 65. What determines the language of customer transactional emails?
- [ ] A. The locale captured from the checkout or order route
- [ ] B. Browser headers at email send time
- [ ] C. Admin UI language
- [ ] D. The customer's country code

#### 66. After order creation, what should happen to the order's customer locale?
- [ ] A. Keep it fixed for transactional communication
- [ ] B. Change it whenever the customer opens another locale route
- [ ] C. Infer it from browser headers before every email
- [ ] D. Delete it after payment

#### 67. If a customer opens an order confirmation route in another locale, what may change?
- [ ] A. The page UI language may render in that route locale
- [ ] B. The email language should automatically change
- [ ] C. The order's stored locale should be overwritten
- [ ] D. Admin resend language should become selectable

#### 68. How should admin resend actions send customer emails in V1?
- [ ] A. In the original order locale only
- [ ] B. In the current admin language
- [ ] C. In English only
- [ ] D. In the browser's first language

#### 69. How should Stripe Checkout locale support be handled?
- [ ] A. Pass customer locale where supported with a minimal project-locale to Stripe-locale mapping
- [ ] B. Store Stripe locale in route slugs
- [ ] C. Use browser-language negotiation after payment
- [ ] D. Translate Stripe IDs

#### 70. What remains the source of truth for post-payment site language?
- [ ] A. Locale-prefixed success and cancel return URLs
- [ ] B. Stripe dashboard language
- [ ] C. Admin locale
- [ ] D. Unprefixed `/success` and `/cancel` URLs

### Metadata, SEO, Observability, And Tests

#### 71. What should customer-facing metadata include?
- [ ] A. Localized metadata and practical alternate links for `/no` and `/en`
- [ ] B. English-only titles
- [ ] C. Unprefixed canonical customer URLs
- [ ] D. Admin diagnostics

#### 72. What canonical URL should a localized page use?
- [ ] A. Its self-canonical localized URL
- [ ] B. Always `/`
- [ ] C. Always `/en`
- [ ] D. Always an unprefixed customer route

#### 73. Where should `x-default` point when practical?
- [ ] A. `/no`
- [ ] B. `/`
- [ ] C. `/en`
- [ ] D. `/api`

#### 74. Why should `x-default` point to `/no` instead of `/`?
- [ ] A. `/` is only a deterministic redirect
- [ ] B. `/` renders all languages
- [ ] C. `/` is the English homepage
- [ ] D. `/` is an API route

#### 75. What should customer-facing analytics events do with locale?
- [ ] A. Keep stable English event names and include a safe `locale` property
- [ ] B. Translate event names into the active locale
- [ ] C. Store customer contact fields with every event
- [ ] D. Use route slugs as event names

#### 76. What may customer-facing Sentry context include?
- [ ] A. A safe `locale` value when available
- [ ] B. Translated messages
- [ ] C. Raw request bodies
- [ ] D. Customer contact fields

#### 77. What should not be sent to Sentry for localized customer failures?
- [ ] A. Translated messages, request bodies, customer contact fields, or full provider payloads
- [ ] B. Safe locale values
- [ ] C. Stable workflow state
- [ ] D. Operational IDs

#### 78. Which tests guard message completeness?
- [ ] A. Message-key parity checks for both supported locales
- [ ] B. Payment provider integration tests
- [ ] C. Browser-language negotiation tests
- [ ] D. Admin localization tests

#### 79. Which route smoke assertions belong in the i18n test posture?
- [ ] A. High-value visible strings in both `no` and `en`
- [ ] B. Every translated phrase on every page
- [ ] C. Only English strings
- [ ] D. Only raw JSON imports

#### 80. How should component and domain behavior tests treat translations?
- [ ] A. Avoid depending on every exact translation
- [ ] B. Assert every exact localized string in every behavior test
- [ ] C. Mock all locale routing helpers
- [ ] D. Test browser headers instead of behavior

#### 81. Which behavior should routing helper tests cover?
- [ ] A. Supported prefixes, unsupported locale-like prefixes, and locale replacement without changing the stable path
- [ ] B. Stripe webhook signature parsing
- [ ] C. Admin authorization
- [ ] D. Sentry source-map upload

#### 82. Which production behavior was verified for unsupported locale prefixes?
- [ ] A. `/fr/menu` stays `/fr/menu` and resolves to not-found
- [ ] B. `/fr/menu` redirects to `/no/menu`
- [ ] C. `/fr/menu` redirects to `/en/menu`
- [ ] D. `/fr/menu` renders the English homepage

#### 83. Which production behavior was verified for `/`?
- [ ] A. It redirects to `/no`
- [ ] B. It renders English
- [ ] C. It returns not-found
- [ ] D. It renders an admin dashboard

#### 84. What should `no.json` contain for Norwegian customer copy?
- [ ] A. Proper Norwegian characters where Bokmal requires them
- [ ] B. ASCII approximations only
- [ ] C. English fallback strings
- [ ] D. Route slugs instead of visible copy

#### 85. Which statement best describes the current i18n posture?
- [ ] A. A `next-intl` foundation exists for explicit customer locale routes, localized homepage copy, message parity, metadata alternates, and route-helper coverage
- [ ] B. All product content, checkout emails, and admin screens are fully localized
- [ ] C. Browser-language negotiation controls all customer routing
- [ ] D. Product data silently falls back between languages

## Answer Key

1. A
2. A
3. B
4. A
5. A
6. A
7. A
8. A
9. A
10. A
11. A
12. A
13. A
14. A
15. A
16. A
17. A
18. A
19. A
20. A
21. A
22. A
23. A
24. A
25. A
26. A
27. A
28. A
29. A
30. A
31. A
32. A
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
