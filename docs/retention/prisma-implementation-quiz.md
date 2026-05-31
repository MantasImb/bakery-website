# Prisma Implementation Quiz

This quiz is based on the current Prisma guidance and implementation in this project. Each question has one best answer.

## Questions

### Project Guidance And Ownership

#### 1. What is Prisma's role in this project?
- [ ] A. ORM and migration tool for PostgreSQL-backed V1 persistence
- [ ] B. The domain model owner for weekly menus and orders
- [ ] C. A replacement for capability modules
- [ ] D. A client-side data store

#### 2. What is PostgreSQL used for in V1?
- [ ] A. Durable workflow state such as weekly menus, products, and later checkout/order state
- [ ] B. Browser analytics events only
- [ ] C. Sentry source maps
- [ ] D. Static homepage copy

#### 3. Which document defines the practical Prisma workflow?
- [ ] A. `docs/prisma.md`
- [ ] B. `docs/sentry.md`
- [ ] C. `docs/posthog.md`
- [ ] D. `docs/retention/i18n-implementation-quiz.md`

#### 4. Which ADR records the database persistence decision?
- [ ] A. `docs/adr/0005-use-postgresql-and-prisma-for-v1-persistence.md`
- [ ] B. `docs/adr/0002-use-weekly-preorder-model-instead-of-catalog.md`
- [ ] C. `docs/adr/0001-record-architecture-decisions.md`
- [ ] D. `docs/adr/0004-use-posthog-for-product-analytics.md`

#### 5. What should own business rules for weekly menus, carts, checkout, orders, and kitchen workflows?
- [ ] A. The capability module that owns the behavior
- [ ] B. `prisma/schema.prisma`
- [ ] C. Generated Prisma Client types
- [ ] D. `compose.yaml`

#### 6. What should the Prisma schema not become?
- [ ] A. The domain model
- [ ] B. The database schema definition
- [ ] C. The source of checked-in migrations
- [ ] D. The place where table relations are represented

#### 7. What is the intended Prisma access path?
- [ ] A. `feature boundary or repository -> lib/db/prisma.ts -> generated Prisma Client -> PostgreSQL`
- [ ] B. `client component -> generated Prisma Client -> PostgreSQL`
- [ ] C. `PostHog -> Prisma -> weekly menu module`
- [ ] D. `Sentry -> generated Prisma Client -> checkout module`

#### 8. Where should direct Prisma Client access stay?
- [ ] A. Behind a small project-owned database wrapper
- [ ] B. In every page component that needs data
- [ ] C. In shared UI components
- [ ] D. In message JSON files

#### 9. Which file currently exposes the shared Prisma Client wrapper?
- [ ] A. `lib/db/prisma.ts`
- [ ] B. `app/generated/prisma/client.ts`
- [ ] C. `docs/prisma.md`
- [ ] D. `app/[locale]/layout.tsx`

#### 10. What should application code import when it needs database access?
- [ ] A. The project-owned database wrapper
- [ ] B. A newly constructed Prisma Client
- [ ] C. The PostgreSQL driver directly from UI code
- [ ] D. `prisma.config.ts`

#### 11. When should capability modules introduce persistence-facing repositories or services?
- [ ] A. Only when real behavior needs them
- [ ] B. Before any feature behavior exists
- [ ] C. Whenever a model is added to Prisma
- [ ] D. Only after deployment

#### 12. What should capability module public exports avoid exposing by default?
- [ ] A. Prisma-generated types as the domain contract
- [ ] B. Domain result types
- [ ] C. Small behavior-focused service contracts
- [ ] D. Business outcomes

### Environment And Configuration

#### 13. Which environment variable configures the PostgreSQL connection?
- [ ] A. `DATABASE_URL`
- [ ] B. `POSTHOG_HOST`
- [ ] C. `SENTRY_DSN`
- [ ] D. `NEXT_PUBLIC_DATABASE_URL`

#### 14. Where should the example local database URL be documented for developers?
- [ ] A. `.env.example`
- [ ] B. `bun.lock`
- [ ] C. Generated Prisma Client output
- [ ] D. `messages/no.json`

#### 15. Which file should not commit real local, staging, or production database URLs?
- [ ] A. Any tracked repository file
- [ ] B. Only `README.md`
- [ ] C. Only `prisma/schema.prisma`
- [ ] D. Only `compose.yaml`

#### 16. Which local ignored file is expected to hold a developer's local `DATABASE_URL`?
- [ ] A. `.env.local`
- [ ] B. `prisma/migrations/.env`
- [ ] C. `lib/generated/prisma/.env`
- [ ] D. `docs/retention/.env`

#### 17. Which file loads `.env` and then `.env.local` for Prisma CLI commands?
- [ ] A. `prisma.config.ts`
- [ ] B. `next.config.ts`
- [ ] C. `instrumentation.ts`
- [ ] D. `jest.config.ts`

#### 18. Which import provides `defineConfig` and `env` for the current Prisma config?
- [ ] A. `prisma/config`
- [ ] B. `@prisma/client`
- [ ] C. `@prisma/adapter-pg`
- [ ] D. `next/config`

#### 19. Where is the datasource URL configured for the current Prisma 7 setup?
- [ ] A. In `prisma.config.ts`
- [ ] B. In `package.json`
- [ ] C. In generated Prisma Client output
- [ ] D. In `compose.yaml` healthcheck only

#### 20. What does the `datasource db` block in `prisma/schema.prisma` currently include?
- [ ] A. The PostgreSQL provider, without an inline `url`
- [ ] B. A SQLite provider with an inline file path
- [ ] C. A hard-coded production database URL
- [ ] D. A PostHog API key

#### 21. Which package provides the PostgreSQL driver adapter used by the wrapper?
- [ ] A. `@prisma/adapter-pg`
- [ ] B. `posthog-node`
- [ ] C. `@sentry/nextjs`
- [ ] D. `next-intl`

#### 22. What does `lib/db/prisma.ts` do if `DATABASE_URL` is missing?
- [ ] A. Throws a descriptive startup error
- [ ] B. Silently connects to SQLite
- [ ] C. Creates tables automatically
- [ ] D. Falls back to a public browser variable

#### 23. Why does `lib/db/prisma.ts` import `server-only`?
- [ ] A. To keep Prisma access on the server side
- [ ] B. To enable browser-side database queries
- [ ] C. To generate migrations at runtime
- [ ] D. To disable TypeScript

#### 24. Why does the wrapper reuse a global Prisma Client outside production?
- [ ] A. To avoid creating extra clients during local hot reloads
- [ ] B. To share one client across browsers
- [ ] C. To bypass migrations
- [ ] D. To make database access client-side

### Local Database And Scripts

#### 25. Which file defines the local PostgreSQL service?
- [ ] A. `compose.yaml`
- [ ] B. `vercel.json`
- [ ] C. `docs/prisma.md`
- [ ] D. `app/layout.tsx`

#### 26. Which Docker image is used for local PostgreSQL?
- [ ] A. `postgres:17-alpine`
- [ ] B. `mysql:8`
- [ ] C. `sqlite:latest`
- [ ] D. `redis:7-alpine`

#### 27. How is the local PostgreSQL host port bound?
- [ ] A. To `127.0.0.1:5432`
- [ ] B. To every network interface on `5432`
- [ ] C. To a public Vercel URL
- [ ] D. To browser local storage

#### 28. What is the local compose database name?
- [ ] A. `bakery_website`
- [ ] B. `postgres`
- [ ] C. `bakery`
- [ ] D. `weekly_menu`

#### 29. Which command starts the local PostgreSQL service?
- [ ] A. `docker compose up -d postgres`
- [ ] B. `bun run dev`
- [ ] C. `bun run vercel-build`
- [ ] D. `bun test --watch`

#### 30. Which package script generates Prisma Client?
- [ ] A. `bun run db:generate`
- [ ] B. `bun run db:deploy`
- [ ] C. `bun run lint`
- [ ] D. `bun run start`

#### 31. Which package script creates and applies local development migrations?
- [ ] A. `bun run db:migrate`
- [ ] B. `bun run db:generate`
- [ ] C. `bun run test`
- [ ] D. `bun run start`

#### 32. Which package script applies checked-in migrations without creating new ones?
- [ ] A. `bun run db:deploy`
- [ ] B. `bun run db:migrate`
- [ ] C. `bun run dev`
- [ ] D. `bun run test:watch`

#### 33. Which script should normal durable schema changes avoid using as the main workflow?
- [ ] A. `prisma db push`
- [ ] B. `prisma migrate dev`
- [ ] C. `prisma migrate deploy`
- [ ] D. `prisma generate`

#### 34. Why are package scripts added immediately after installing Prisma?
- [ ] A. So the project uses stable command names from the beginning
- [ ] B. So migrations can be skipped during deployment
- [ ] C. So generated clients can be committed
- [ ] D. So database access moves into React components

#### 35. What should Prisma scripts wrap?
- [ ] A. Prisma CLI commands
- [ ] B. Custom SQL-generation code only
- [ ] C. Browser analytics calls
- [ ] D. Next.js route helpers

### Generated Client And Runtime Boundaries

#### 36. Where is Prisma Client generated?
- [ ] A. `lib/generated/prisma`
- [ ] B. `app/generated/prisma`
- [ ] C. `public/prisma`
- [ ] D. `docs/generated/prisma`

#### 37. Why is generated Prisma Client kept out of the `app/` tree?
- [ ] A. To make the server-only boundary explicit and avoid accidental app-route bundling
- [ ] B. To make it available to client components
- [ ] C. To make it editable by hand
- [ ] D. To make it part of localized messages

#### 38. Should generated Prisma Client output be committed?
- [ ] A. No, it is generated and ignored
- [ ] B. Yes, every generated file should be reviewed
- [ ] C. Yes, but only in Vercel
- [ ] D. Only if Sentry is enabled

#### 39. Which file imports the generated Prisma Client today?
- [ ] A. `lib/db/prisma.ts`
- [ ] B. `components/home/HomePage.tsx`
- [ ] C. `messages/en.json`
- [ ] D. `docs/prisma.md`

#### 40. What should avoid importing the generated Prisma Client directly?
- [ ] A. Browser and client bundles
- [ ] B. The server-only database wrapper
- [ ] C. Prisma's generator
- [ ] D. The migration engine

#### 41. Which dependency helps enforce server-only imports in the wrapper?
- [ ] A. `server-only`
- [ ] B. `lucide-react`
- [ ] C. `class-variance-authority`
- [ ] D. `tailwind-merge`

#### 42. What should happen before creating the PrismaPg adapter?
- [ ] A. Validate that `DATABASE_URL` is set
- [ ] B. Query every weekly menu
- [ ] C. Run `db push`
- [ ] D. Import `posthog-js`

### Initial Schema Scope

#### 43. What is the first persistence slice deliberately limited to?
- [ ] A. Weekly-menu foundation needed by next feature work
- [ ] B. Full checkout, payment, fulfillment, and notification workflows
- [ ] C. Complete customer account management
- [ ] D. Full CMS content modeling

#### 44. Which model represents the weekly menu?
- [ ] A. `WeeklyMenu`
- [ ] B. `MenuCatalog`
- [ ] C. `Order`
- [ ] D. `CheckoutReservation`

#### 45. Which enum tracks weekly menu lifecycle state?
- [ ] A. `WeeklyMenuStatus`
- [ ] B. `PaymentState`
- [ ] C. `Locale`
- [ ] D. `FulfillmentStatus`

#### 46. Which statuses exist on `WeeklyMenuStatus`?
- [ ] A. `DRAFT`, `PUBLISHED`, and `ARCHIVED`
- [ ] B. `OPEN`, `CLOSED`, and `SOLD_OUT`
- [ ] C. `NEW`, `PAID`, and `REFUNDED`
- [ ] D. `NO`, `EN`, and `FR`

#### 47. What is the default weekly menu status?
- [ ] A. `DRAFT`
- [ ] B. `PUBLISHED`
- [ ] C. `ARCHIVED`
- [ ] D. `CLOSED`

#### 48. Which enum stores manual ordering availability?
- [ ] A. `OrderingAvailability`
- [ ] B. `WeeklyMenuStatus`
- [ ] C. `PaymentProvider`
- [ ] D. `ProductLocale`

#### 49. Which values exist on `OrderingAvailability`?
- [ ] A. `OPEN` and `CLOSED`
- [ ] B. `DRAFT` and `PUBLISHED`
- [ ] C. `NO` and `EN`
- [ ] D. `AVAILABLE` and `EXPIRED`

#### 50. What does `Product.weeklyMenuId` mean?
- [ ] A. Products are menu-scoped
- [ ] B. Products are evergreen catalog items only
- [ ] C. Products belong to customers
- [ ] D. Products belong to Sentry events

#### 51. Which field stores copy provenance from a previous menu-scoped product?
- [ ] A. `copiedFromProductId`
- [ ] B. `sourceCatalogId`
- [ ] C. `previousOrderId`
- [ ] D. `templateName`

#### 52. Which model stores localized product copy?
- [ ] A. `ProductContent`
- [ ] B. `WeeklyMenu`
- [ ] C. `ProductPrice`
- [ ] D. `PickupSlot`

#### 53. Which fields in `ProductContent` are currently optional?
- [ ] A. `name`, `description`, and `notes`
- [ ] B. `productId` and `locale`
- [ ] C. `id` and `createdAt`
- [ ] D. `updatedAt` only

#### 54. What uniqueness rule exists for localized product content?
- [ ] A. One content row per product and locale
- [ ] B. One locale per weekly menu
- [ ] C. One product per database
- [ ] D. One description per language globally

#### 55. Which model stores required product price data?
- [ ] A. `ProductPrice`
- [ ] B. `WeeklyMenu`
- [ ] C. `ProductContent`
- [ ] D. `PickupSlot`

#### 56. Which `ProductPrice` field is required and stores the numeric amount?
- [ ] A. `amountMinor`
- [ ] B. `amountLocalized`
- [ ] C. `displayPrice`
- [ ] D. `copiedPrice`

#### 57. What is the default product price currency?
- [ ] A. `NOK`
- [ ] B. `EUR`
- [ ] C. `USD`
- [ ] D. Browser locale currency

#### 58. How is product price reuse modeled in the initial schema?
- [ ] A. By copying a prior product's price into the current product's own editable `ProductPrice`
- [ ] B. By sharing one price row across all weeks
- [ ] C. By storing price only in localized copy
- [ ] D. By deriving price from Stripe at query time

#### 59. Which model represents pickup options?
- [ ] A. `PickupSlot`
- [ ] B. `CheckoutReservation`
- [ ] C. `FulfillmentWindow`
- [ ] D. `OrderPickup`

#### 60. Which `PickupSlot` fields may be incomplete while drafting?
- [ ] A. `label`, `startsAt`, and `endsAt`
- [ ] B. `id` and `weeklyMenuId`
- [ ] C. `createdAt` only
- [ ] D. `updatedAt` only

#### 61. Which product field stores a stock cap?
- [ ] A. `stockLimit`
- [ ] B. `quantitySold`
- [ ] C. `reservationCount`
- [ ] D. `maxCheckoutTotal`

#### 62. Which product fields store controlled allergen and dietary references?
- [ ] A. `allergenKeys` and `dietaryFlagKeys`
- [ ] B. `allergenNotes` and `dietaryDescription`
- [ ] C. `localizedWarnings` and `pickupLabels`
- [ ] D. `sentryTags` and `analyticsLabels`

#### 63. What happens to products when their weekly menu is deleted?
- [ ] A. They are cascade-deleted
- [ ] B. They are published automatically
- [ ] C. They become global products
- [ ] D. They are converted to orders

#### 64. What happens to a copied product reference if the source product is deleted?
- [ ] A. The reference is set to null
- [ ] B. The copied product is deleted
- [ ] C. The entire weekly menu is archived
- [ ] D. The price is set to zero

### Drafting, Publishing, And Deferred Scope

#### 65. What is the current rule for draft weekly menus and products?
- [ ] A. They may be incomplete
- [ ] B. They must satisfy all publication requirements immediately
- [ ] C. They cannot include prices
- [ ] D. They must be visible to customers

#### 66. When should required customer-facing and operational fields be enforced?
- [ ] A. Before weekly menu publication
- [ ] B. Before any draft record can be saved
- [ ] C. Only after payment succeeds
- [ ] D. Only during analytics capture

#### 67. What is published in this project?
- [ ] A. A whole weekly menu
- [ ] B. A single product independently
- [ ] C. A single pickup slot independently
- [ ] D. A generated Prisma Client

#### 68. What should published weekly menus require later?
- [ ] A. Valid publishable menu data, including required product fields and pickup slots
- [ ] B. Empty product content
- [ ] C. No prices
- [ ] D. Missing localized copy

#### 69. Which areas are intentionally deferred from the initial schema?
- [ ] A. Checkout reservations, orders, payment state, fulfillment state, and notification state
- [ ] B. Weekly menus and products
- [ ] C. Product prices and pickup slots
- [ ] D. Stock limits and ordering availability

#### 70. Why are checkout/order/payment tables deferred?
- [ ] A. Their owning feature steps should introduce them when real behavior exists
- [ ] B. Prisma cannot model them
- [ ] C. PostgreSQL cannot store them
- [ ] D. They belong in Sentry

#### 71. What does the narrow initial schema avoid?
- [ ] A. Freezing speculative future data shapes before behavior makes them concrete
- [ ] B. Creating any checked-in migrations
- [ ] C. Using PostgreSQL
- [ ] D. Adding product prices

#### 72. What should happen when future schema needs become clear?
- [ ] A. Add tables and fields with the feature work that needs them
- [ ] B. Predict every possible future table now
- [ ] C. Store all future state in JSON blobs immediately
- [ ] D. Move business behavior into Prisma middleware

### Migrations And Deployment

#### 73. What creates the database tables required by the application?
- [ ] A. Checked-in migrations applied by Prisma
- [ ] B. The first query to each model
- [ ] C. Browser page load
- [ ] D. Sentry initialization

#### 74. Do Prisma queries create missing tables automatically?
- [ ] A. No
- [ ] B. Yes, every query runs migrations first
- [ ] C. Yes, but only in Vercel
- [ ] D. Yes, when `server-only` is imported

#### 75. Which migration workflow should be used from the start?
- [ ] A. Checked-in Prisma migrations
- [ ] B. Manual production edits in a database console only
- [ ] C. Runtime schema creation on first request
- [ ] D. Untracked `db push` changes

#### 76. Which script does Vercel use for deployments?
- [ ] A. `bun run vercel-build`
- [ ] B. `bun run dev`
- [ ] C. `bun test --watch`
- [ ] D. `docker compose up -d postgres`

#### 77. What does `bun run vercel-build` run?
- [ ] A. Prisma Client generation, migration deploy, and Next.js production build
- [ ] B. Only Jest tests
- [ ] C. Only `next start`
- [ ] D. Docker compose startup

#### 78. Which file configures Vercel to use `bun run vercel-build`?
- [ ] A. `vercel.json`
- [ ] B. `compose.yaml`
- [ ] C. `prisma/schema.prisma`
- [ ] D. `docs/retention/prisma-implementation-quiz.md`

#### 79. What must Vercel have during builds that apply migrations?
- [ ] A. `DATABASE_URL`
- [ ] B. `NEXT_PUBLIC_DATABASE_URL`
- [ ] C. `POSTGRES_PASSWORD` in the client bundle
- [ ] D. A local Docker compose service

#### 80. Which Vercel environments should receive migration-capable credentials?
- [ ] A. Only environments allowed to apply migrations
- [ ] B. Every Preview environment pointing at production by default
- [ ] C. Browser client code
- [ ] D. No environments

#### 81. If Preview deployments should not migrate production, what should happen?
- [ ] A. Use a separate preview database or withhold `DATABASE_URL` from Preview builds
- [ ] B. Let previews use production `DATABASE_URL` freely
- [ ] C. Disable all checked-in migrations
- [ ] D. Move tables into generated client output

#### 82. Which command validates that Prisma schema and config are coherent?
- [ ] A. `bunx prisma validate`
- [ ] B. `bun run start`
- [ ] C. `docker compose ps`
- [ ] D. `bun test --watch`

#### 83. Which command checks whether local migrations are applied?
- [ ] A. `bunx prisma migrate status`
- [ ] B. `bun run lint --fix`
- [ ] C. `bun run start`
- [ ] D. `bun run dev`

#### 84. What should be true before deploying schema-dependent code?
- [ ] A. The matching checked-in migrations can be applied to the target database
- [ ] B. The first user query can create missing tables
- [ ] C. Generated client output is committed to Git
- [ ] D. Preview builds always share production credentials

### Testing And Current Posture

#### 85. What kind of tests should domain and service behavior prefer?
- [ ] A. Behavior-focused tests at the owning module boundary without requiring a database when possible
- [ ] B. Tests that assert every generated Prisma method
- [ ] C. Browser-only tests for database migrations
- [ ] D. Tests that depend on production data

#### 86. When are Prisma-backed tests appropriate?
- [ ] A. For persistence integration concerns that cannot be tested meaningfully without PostgreSQL
- [ ] B. For every domain rule
- [ ] C. For every UI component
- [ ] D. Only for Sentry setup files

#### 87. Which examples fit Prisma-backed integration testing?
- [ ] A. Schema mappings, repository queries, migration assumptions, and transaction behavior
- [ ] B. Button variants and CSS classes
- [ ] C. Message-key parity only
- [ ] D. Homepage copy only

#### 88. What did the initial Prisma foundation not require by itself?
- [ ] A. Database-backed feature tests
- [ ] B. Client generation
- [ ] C. Migration validation
- [ ] D. Documentation updates

#### 89. Which checks are appropriate for the foundation stage?
- [ ] A. Generation, migration, typecheck, build, or equivalent command-level checks
- [ ] B. Production traffic testing only
- [ ] C. Runtime table creation by querying every route
- [ ] D. Manual edits to generated client output

#### 90. What should future database tests avoid when behavior can be tested through a project-owned API?
- [ ] A. Asserting Prisma implementation details
- [ ] B. Testing business outcomes
- [ ] C. Testing repository contracts when they exist
- [ ] D. Testing transaction behavior that matters

#### 91. Which Step 6 item is currently complete?
- [ ] A. Database and Prisma foundation
- [ ] B. Cart and stock validation
- [ ] C. Stripe checkout and order finalization
- [ ] D. Orders and admin kitchen workflow

#### 92. Which feature step comes next after the Prisma foundation?
- [ ] A. Weekly Menu and Product Reuse
- [ ] B. Sentry Error Monitoring
- [ ] C. Testing Foundation
- [ ] D. Analytics Wrapper and Event Plan

#### 93. Which statement best describes the current Prisma posture?
- [ ] A. A narrow PostgreSQL/Prisma foundation exists with checked-in migrations, local compose DB, generated client wrapper, and Vercel migration deployment wiring
- [ ] B. Full checkout, order, fulfillment, payment, and notification persistence exists
- [ ] C. Prisma is imported directly throughout client components
- [ ] D. Queries create tables automatically when a route is visited

## Answer Key

1. A
2. A
3. A
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
86. A
87. A
88. A
89. A
90. A
91. A
92. A
93. A
