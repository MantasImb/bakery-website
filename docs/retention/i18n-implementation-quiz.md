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
- [ ] A. Any Norwegian language variant
- [ ] B. A country selector for Norway
- [ ] C. Norwegian Bokmål
- [ ] D. A placeholder for future translation work

#### 3. Which locale is the default?
- [ ] A. English
- [ ] B. Norwegian Bokmål
- [ ] C. The first browser language
- [ ] D. The latest selected admin language

#### 4. Which surfaces are localized in V1?
- [ ] A. Admin and kitchen screens only
- [ ] B. API routes
- [ ] C. Technical logs
- [ ] D. Customer-facing ordering pages

#### 5. Which surfaces are intentionally not localized in V1?
- [ ] A. Customer homepage content
- [ ] B. Admin and kitchen screens
- [ ] C. Customer navigation labels
- [ ] D. Customer metadata

#### 6. Where should durable i18n trade-off decisions live?
- [ ] A. `messages/`
- [ ] B. `docs/adr/`
- [ ] C. `app/[locale]/`
- [ ] D. `next.config.ts`

#### 7. Which document records practical localization rules for customer-facing V1 work?
- [ ] A. `docs/sentry.md`
- [ ] B. `docs/i18n.md`
- [ ] C. `docs/posthog.md`
- [ ] D. `docs/retention/sentry-implementation-quiz.md`

#### 8. What is the role of `next-intl` in the implementation?
- [ ] A. Product inventory persistence
- [ ] B. Admin authentication
- [ ] C. Localized routing, UI messages, locale-aware navigation, and future localized customer copy
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
- [ ] A. Unprefixed routes like `/menu`
- [ ] B. Query-string locales like `/menu?locale=no`
- [ ] C. Explicit locale prefixes like `/no` and `/en`
- [ ] D. Browser-negotiated hidden locale routes

#### 12. What should `/` do?
- [ ] A. Render English when the browser prefers English
- [ ] B. Return not-found
- [ ] C. Render both languages
- [ ] D. Redirect deterministically to `/no`

#### 13. Does V1 use browser-language negotiation to choose `/en`?
- [ ] A. No
- [ ] B. Yes, for English-preferring visitors
- [ ] C. Yes, only in production
- [ ] D. Yes, only on checkout routes

#### 14. What should happen for unsupported locale-like prefixes such as `/fr/menu`?
- [ ] A. Redirect to `/no/menu`
- [ ] B. Redirect to `/en/menu`
- [ ] C. Return not-found
- [ ] D. Render the unprefixed route

#### 15. Which route segment style should customer routes use after the locale prefix?
- [ ] A. Translated slugs such as `/no/meny`
- [ ] B. Numeric route IDs only
- [ ] C. Locale query parameters
- [ ] D. Stable English segments such as `/no/menu`

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
- [ ] A. `components/home/HomePage.tsx`
- [ ] B. `i18n/routing.ts`
- [ ] C. `messages/no.json`
- [ ] D. `app/viewport.ts`

#### 20. Which helper swaps only the locale prefix while preserving the stable path?
- [ ] A. `hasUnsupportedLocalePrefix`
- [ ] B. `replacePathLocale`
- [ ] C. `setRequestLocale`
- [ ] D. `getTranslations`

#### 21. Which helper detects unsupported two-letter locale-like prefixes?
- [ ] A. `hasUnsupportedLocalePrefix`
- [ ] B. `localizePath`
- [ ] C. `generateStaticParams`
- [ ] D. `NextIntlClientProvider`

#### 22. What should `replacePathLocale("/no/checkout", "en")` produce?
- [ ] A. `/no/en/checkout`
- [ ] B. `/en/checkout`
- [ ] C. `/checkout?locale=en`
- [ ] D. `/en/no/checkout`

#### 23. What is the URL's role in customer locale state?
- [ ] A. It is secondary to browser headers
- [ ] B. It is secondary to admin preferences
- [ ] C. It is ignored after the first page load
- [ ] D. It is the source of truth for the active customer locale

#### 24. Which routes should the proxy matcher exclude from locale redirect handling?
- [ ] A. All customer pages
- [ ] B. Only `/no`
- [ ] C. Only `/en`
- [ ] D. API routes, admin routes, PostHog ingest, framework internals, static assets, and `favicon.ico`

#### 25. Why does the proxy let unsupported locale-like prefixes continue instead of redirecting them?
- [ ] A. So `/fr` becomes a supported locale
- [ ] B. So browser-language negotiation can run
- [ ] C. So admin routes become localized
- [ ] D. So the route can resolve to not-found instead of masking the bad prefix as Norwegian

### Request, Layout, And Page Implementation

#### 26. Which file loads locale-specific message JSON for `next-intl` requests?
- [ ] A. `messages/en.json`
- [ ] B. `i18n/request.ts`
- [ ] C. `components/home/LanguageSwitcher.tsx`
- [ ] D. `app/viewport.ts`

#### 27. What fallback does request configuration use when the requested locale is invalid?
- [ ] A. `routing.defaultLocale`
- [ ] B. English always
- [ ] C. The browser's first language
- [ ] D. `null`

#### 28. Which layout validates the route locale before rendering localized customer pages?
- [ ] A. `app/viewport.ts`
- [ ] B. `app/[locale]/layout.tsx`
- [ ] C. `components/home/HomePage.tsx`
- [ ] D. `messages/no.json`

#### 29. What does the locale layout call when the locale is unsupported?
- [ ] A. `redirect("/no")`
- [ ] B. `redirect("/en")`
- [ ] C. `captureException()`
- [ ] D. `notFound()`

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
- [ ] A. `Sentry.ErrorBoundary`
- [ ] B. `PostHogProvider`
- [ ] C. `NextIntlClientProvider`
- [ ] D. `StripeProvider`

#### 33. Which current page is the first localized vertical slice?
- [ ] A. Admin orders
- [ ] B. Stripe webhooks
- [ ] C. The homepage
- [ ] D. Kitchen production

#### 34. How does the localized homepage retrieve UI copy?
- [ ] A. With `getTranslations` using the `HomePage` namespace
- [ ] B. By importing both JSON files into the client component
- [ ] C. By reading browser language headers in the component
- [ ] D. By fetching translated slugs from Stripe

#### 35. What does `HomePage` receive from the route page?
- [ ] A. Raw browser headers
- [ ] B. A PostHog distinct ID
- [ ] C. A Stripe locale mapping
- [ ] D. The current path, locale, and resolved messages

#### 36. Which component renders the customer-facing language switcher?
- [ ] A. `components/home/NavLinks.tsx`
- [ ] B. `components/home/LanguageSwitcher.tsx`
- [ ] C. `app/viewport.ts`
- [ ] D. `i18n/request.ts`

#### 37. Which labels should the language switcher use?
- [ ] A. Compact codes like `NO` and `EN` only
- [ ] B. Browser locale tags only
- [ ] C. Clear language names like `Norsk` and `English`
- [ ] D. Admin role names

#### 38. What should the language switcher preserve when changing languages?
- [ ] A. The unsupported locale prefix
- [ ] B. The current stable path after the locale prefix
- [ ] C. The browser's preferred language list
- [ ] D. The page's translated slug

### Messages And Customer Copy

#### 39. Where do the initial message files live?
- [ ] A. `app/[locale]/messages.ts`
- [ ] B. `docs/i18n.md`
- [ ] C. `public/locales`
- [ ] D. `messages/no.json` and `messages/en.json`

#### 40. What should happen when a customer-facing message key is missing in one supported locale?
- [ ] A. The app should silently fall back to English
- [ ] B. The app should silently fall back to Norwegian
- [ ] C. The key should be hidden from the page
- [ ] D. Tests or build checks should fail instead of falling back silently

#### 41. Which message structure does the guidance prefer?
- [ ] A. One large flat file with every key
- [ ] B. One file per individual string
- [ ] C. Shallow nested JSON by surface or shared namespace
- [ ] D. Inline translation objects inside every component

#### 42. Where should page or workflow copy live?
- [ ] A. In a global catch-all namespace only
- [ ] B. Under the owning surface namespace
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
- [ ] A. Browser-language negotiation
- [ ] B. Admin localization
- [ ] C. Generated message-key types
- [ ] D. The active weekly menu and product content model

#### 46. What kind of wording should customer copy use?
- [ ] A. Clever wording in all validation and checkout copy
- [ ] B. Technical operator language
- [ ] C. Clear, warm, and direct wording
- [ ] D. Provider-specific API wording

#### 47. Which areas should prioritize clarity and confidence over brand voice?
- [ ] A. Only the homepage hero
- [ ] B. Only admin logs
- [ ] C. Only Sentry event names
- [ ] D. Validation, checkout, payment, pickup, allergy, cancellation, refund, and error copy

#### 48. Which UI text should be localized under the locale route segment?
- [ ] A. Labels, helper text, validation messages, empty states, loading states, not-found UI, and recoverable errors
- [ ] B. Raw request bodies
- [ ] C. Customer notes
- [ ] D. Technical stack traces

#### 49. What should root or global error fallback UI do if it cannot know the active locale?
- [ ] A. Use browser-language negotiation
- [ ] B. Stay minimal and use the Norwegian/default posture
- [ ] C. Show every supported translation
- [ ] D. Render detailed technical diagnostics

#### 50. Why are generated message-key types deferred?
- [ ] A. Message-key parity checks and route smoke tests are enough for V1
- [ ] B. TypeScript cannot type JSON files
- [ ] C. `next-intl` forbids them
- [ ] D. They are required only for admin pages

### Product Content And Formatting

#### 51. What is separate from `next-intl` UI messages?
- [ ] A. Homepage button labels
- [ ] B. Navigation labels
- [ ] C. Persisted product names, descriptions, allergen notes, and weekly menu content
- [ ] D. Metadata titles

#### 52. What must be true before a weekly menu can be published once product content exists?
- [ ] A. Product content exists only in the default locale
- [ ] B. Product images contain translated labels
- [ ] C. Product slugs are translated
- [ ] D. Product-facing text content exists in both supported customer languages

#### 53. What should happen between Norwegian and English product content?
- [ ] A. Always fall back to English
- [ ] B. Always fall back to Norwegian
- [ ] C. Fall back based on browser headers
- [ ] D. Do not silently fall back between languages

#### 54. What should product images avoid?
- [ ] A. Language-specific text inside images
- [ ] B. Locale-neutral visuals
- [ ] C. Product photography
- [ ] D. Alt text

#### 55. How should user-provided checkout data be handled?
- [ ] A. Translate names and notes into the active locale
- [ ] B. Drop it when the language switcher is used
- [ ] C. Send it to Sentry for translation debugging
- [ ] D. Store it as provided or structurally normalized; do not translate it

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
- [ ] A. EUR
- [ ] B. USD
- [ ] C. NOK
- [ ] D. GBP

#### 59. How should money, dates, and pickup windows be persisted?
- [ ] A. As structured values
- [ ] B. As localized display strings
- [ ] C. As translated route slugs
- [ ] D. As image text

#### 60. What should pickup labels avoid?
- [ ] A. Explicit localized labels
- [ ] B. Active customer locale formatting
- [ ] C. Ambiguous numeric-only dates
- [ ] D. Structured source values

### Checkout, Stripe, And Email

#### 61. What should cart data remain?
- [ ] A. Translated into every customer language
- [ ] B. Tied to the admin locale
- [ ] C. Stored as localized strings
- [ ] D. Locale-neutral

#### 62. Which routes should preserve the active locale unless the customer explicitly switches language?
- [ ] A. API routes
- [ ] B. Cart, checkout, payment return, and order confirmation routes
- [ ] C. Static assets
- [ ] D. Admin dashboards

#### 63. What should happen when a customer switches language during checkout?
- [ ] A. Clear the cart
- [ ] B. Restart checkout in English
- [ ] C. Translate customer notes
- [ ] D. Preserve cart and entered data where technically feasible and change only UI language

#### 64. When should checkout or order state capture the customer locale?
- [ ] A. Before any cart item can be added
- [ ] B. Only when admin screens are localized
- [ ] C. Never
- [ ] D. When needed for transactional emails and later customer communication

#### 65. What determines the language of customer transactional emails?
- [ ] A. Browser headers at email send time
- [ ] B. The locale captured from the checkout or order route
- [ ] C. Admin UI language
- [ ] D. The customer's country code

#### 66. After order creation, what should happen to the order's customer locale?
- [ ] A. Change it whenever the customer opens another locale route
- [ ] B. Infer it from browser headers before every email
- [ ] C. Keep it fixed for transactional communication
- [ ] D. Delete it after payment

#### 67. If a customer opens an order confirmation route in another locale, what may change?
- [ ] A. The email language should automatically change
- [ ] B. The page UI language may render in that route locale
- [ ] C. The order's stored locale should be overwritten
- [ ] D. Admin resend language should become selectable

#### 68. How should admin resend actions send customer emails in V1?
- [ ] A. In the current admin language
- [ ] B. In the original order locale only
- [ ] C. In English only
- [ ] D. In the browser's first language

#### 69. How should Stripe Checkout locale support be handled?
- [ ] A. Store Stripe locale in route slugs
- [ ] B. Pass customer locale where supported with a minimal project-locale to Stripe-locale mapping
- [ ] C. Use browser-language negotiation after payment
- [ ] D. Translate Stripe IDs

#### 70. What remains the source of truth for post-payment site language?
- [ ] A. Stripe dashboard language
- [ ] B. Admin locale
- [ ] C. Unprefixed `/success` and `/cancel` URLs
- [ ] D. Locale-prefixed success and cancel return URLs

### Metadata, SEO, Observability, And Tests

#### 71. What should customer-facing metadata include?
- [ ] A. English-only titles
- [ ] B. Localized metadata and practical alternate links for `/no` and `/en`
- [ ] C. Unprefixed canonical customer URLs
- [ ] D. Admin diagnostics

#### 72. What canonical URL should a localized page use?
- [ ] A. Always `/`
- [ ] B. Always `/en`
- [ ] C. Its self-canonical localized URL
- [ ] D. Always an unprefixed customer route

#### 73. Where should `x-default` point when practical?
- [ ] A. `/`
- [ ] B. `/en`
- [ ] C. `/no`
- [ ] D. `/api`

#### 74. Why should `x-default` point to `/no` instead of `/`?
- [ ] A. `/` renders all languages
- [ ] B. `/` is the English homepage
- [ ] C. `/` is only a deterministic redirect
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
- [ ] A. Safe locale values
- [ ] B. Stable workflow state
- [ ] C. Operational IDs
- [ ] D. Translated messages, request bodies, customer contact fields, or full provider payloads

#### 78. Which tests guard message completeness?
- [ ] A. Payment provider integration tests
- [ ] B. Browser-language negotiation tests
- [ ] C. Message-key parity checks for both supported locales
- [ ] D. Admin localization tests

#### 79. Which route smoke assertions belong in the i18n test posture?
- [ ] A. Every translated phrase on every page
- [ ] B. High-value visible strings in both `no` and `en`
- [ ] C. Only English strings
- [ ] D. Only raw JSON imports

#### 80. How should component and domain behavior tests treat translations?
- [ ] A. Assert every exact localized string in every behavior test
- [ ] B. Mock all locale routing helpers
- [ ] C. Test browser headers instead of behavior
- [ ] D. Avoid depending on every exact translation

#### 81. Which behavior should routing helper tests cover?
- [ ] A. Stripe webhook signature parsing
- [ ] B. Admin authorization
- [ ] C. Supported prefixes, unsupported locale-like prefixes, and locale replacement without changing the stable path
- [ ] D. Sentry source-map upload

#### 82. What is the implemented behavior for unsupported locale prefixes?
- [ ] A. `/fr/menu` redirects to `/no/menu`
- [ ] B. `/fr/menu` redirects to `/en/menu`
- [ ] C. `/fr/menu` stays `/fr/menu` and resolves to not-found
- [ ] D. `/fr/menu` renders the English homepage

#### 83. What is the implemented behavior for `/`?
- [ ] A. It renders English
- [ ] B. It returns not-found
- [ ] C. It redirects to `/no`
- [ ] D. It renders an admin dashboard

#### 84. What should `no.json` contain for Norwegian customer copy?
- [ ] A. ASCII approximations only
- [ ] B. Proper Norwegian characters where Bokmål requires them
- [ ] C. English fallback strings
- [ ] D. Route slugs instead of visible copy

#### 85. Which statement best describes the current i18n posture?
- [ ] A. All product content, checkout emails, and admin screens are fully localized
- [ ] B. Browser-language negotiation controls all customer routing
- [ ] C. A `next-intl` foundation exists for explicit customer locale routes, localized homepage copy, message parity, metadata alternates, and route-helper coverage
- [ ] D. Product data silently falls back between languages

## Answer Key

1. A
2. C
3. B
4. D
5. B
6. B
7. B
8. C
9. A
10. A
11. C
12. D
13. A
14. C
15. D
16. A
17. A
18. A
19. B
20. B
21. A
22. B
23. D
24. D
25. D
26. B
27. A
28. B
29. D
30. A
31. A
32. C
33. C
34. A
35. D
36. B
37. C
38. B
39. D
40. D
41. C
42. B
43. A
44. A
45. D
46. C
47. D
48. A
49. B
50. A
51. C
52. D
53. D
54. A
55. D
56. A
57. A
58. C
59. A
60. C
61. D
62. B
63. D
64. D
65. B
66. C
67. B
68. B
69. B
70. D
71. B
72. C
73. C
74. C
75. A
76. A
77. D
78. C
79. B
80. D
81. C
82. C
83. C
84. B
85. C
