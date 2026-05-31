# Bakery Website

Bakery Website is a Next.js application for a weekly bakery preorder storefront and admin kitchen workflow. V1 is built around small weekly menus, limited stock, guest checkout, Stripe payment, fixed pickup slots, and operational views for production and pickup.

## Documentation

- [CONTEXT.md](./CONTEXT.md) defines the domain language used by product, code, tests, and planning conversations.
- [docs/prd.md](./docs/prd.md) captures the product goals, V1 scope, user stories, and out-of-scope boundaries.
- [docs/implementation-sequence.md](./docs/implementation-sequence.md) tracks the recommended implementation order and current progress.
- [docs/adr/](./docs/adr/) records durable architectural and product decisions.
- [docs/sentry.md](./docs/sentry.md) defines the observability and Sentry policy.
- [docs/routing.md](./docs/routing.md) records routing guidance for rewrites, redirects, and canonical URL behavior.
- [docs/features/](./docs/features/) is reserved for active or upcoming feature-specific PRDs.

## Development Notes

Follow [AGENTS.md](./AGENTS.md) when changing the codebase. In particular:

- Read the relevant local Next.js guide in `node_modules/next/dist/docs/` before writing Next.js code.
- Do not run `bun run dev` unless explicitly asked.
- Keep commerce and operations behavior inside the capability module that owns the behavior.
- Keep shared modules limited to small cross-module primitives.
- Follow `docs/sentry.md` before adding or changing Sentry behavior.

## Commands

```bash
bun test
bun run lint
bun run build
bun run vercel-build
```

Copy `.env.example` to `.env.local` for local development and fill in only the variables needed for the feature you are working on.

Start the local PostgreSQL database before running Prisma migrations or database-backed feature work:

```bash
docker compose up -d postgres
bun run db:migrate
```

## Environment Variables

Sentry error monitoring uses these variables:

- `SENTRY_DSN`: Server and edge runtime Sentry DSN.
- `NEXT_PUBLIC_SENTRY_DSN`: Browser Sentry DSN exposed to the client bundle.
- `SENTRY_ENVIRONMENT`: Sentry environment label, such as `development`, `preview`, or `production`.
- `NEXT_PUBLIC_SENTRY_ENVIRONMENT`: Browser Sentry environment label. Use the same value as `SENTRY_ENVIRONMENT`.
- `SENTRY_RELEASE`: Stable release identifier, usually the deployment git SHA. Overrides Vercel's deployment commit SHA.
- `SENTRY_AUTH_TOKEN`: CI/deployment token for source-map upload only.
- `SENTRY_ORG`: Sentry organization slug for source-map upload.
- `SENTRY_PROJECT`: Sentry project slug for source-map upload.
- `SENTRY_DEV_SMOKE_ENABLED`: Explicit opt-in for developer smoke routes outside normal local development.
- `SENTRY_DEV_SMOKE_TOKEN`: Secret token required to call the developer smoke route when enabled.

Vercel Preview and Production builds require `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT`, and either `SENTRY_RELEASE` or Vercel's `VERCEL_GIT_COMMIT_SHA` system environment variable so source-map upload cannot be skipped accidentally. Browser runtime events use the release injected by `@sentry/nextjs` during the build, so do not configure a separate public release variable that can drift from the uploaded source-map release.

PostHog browser analytics uses these variables:

- `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`: Public PostHog project token. Leave empty to disable PostHog capture.
- `NEXT_PUBLIC_POSTHOG_HOST`: PostHog UI host, such as `https://eu.posthog.com`.

PostHog server analytics uses these variables:

- `POSTHOG_PROJECT_API_KEY`: Server-side PostHog project API key. Leave empty to disable server capture.
- `POSTHOG_HOST`: PostHog API host, such as `https://eu.posthog.com`.

Prisma uses this variable:

- `DATABASE_URL`: PostgreSQL connection string. The local compose service uses `postgresql://bakery:bakery@localhost:5432/bakery_website`.

Vercel uses `bun run vercel-build`, configured in `vercel.json`, so deployments run Prisma Client generation, checked-in migrations, and the Next.js production build in that order. Set `DATABASE_URL` in Vercel for any environment that should apply migrations.
