# Prisma Guidance

Related guidance:

- [`implementation-sequence.md`](./implementation-sequence.md)
- [`adr/0005-use-postgresql-and-prisma-for-v1-persistence.md`](./adr/0005-use-postgresql-and-prisma-for-v1-persistence.md)
- [`../CONTEXT.md`](../CONTEXT.md)

This document defines how Prisma should be introduced and used in this project. Update it when persistence workflow or database ownership changes.

## Intent

Prisma is the project's ORM and migration tool for PostgreSQL-backed V1 persistence.

The database stores durable workflow state, but the Prisma schema is not the domain model. Business rules for weekly menus, carts, checkout, orders, and kitchen workflows should stay in their owning capability modules.

## Ownership

Keep direct Prisma Client access behind a small project-owned database wrapper, such as `lib/db/prisma.ts`.

- `prisma/schema.prisma` owns the Prisma data model and datasource configuration.
- Generated Prisma Client should use the current Prisma-recommended generated-client pattern for Next.js.
- Application code should import the project-owned database wrapper instead of constructing Prisma clients directly.
- Capability modules should introduce persistence-facing repository or service boundaries only when real behavior needs them.
- Capability module public exports should not expose Prisma-generated types as the domain contract unless a real caller needs that exact persistence shape.

The intended shape is:

`feature boundary or repository -> lib/db/prisma.ts -> generated Prisma Client -> PostgreSQL`

## Initial Scope

Keep the first persistence slice narrow.

The initial schema should cover only the weekly-menu foundation needed by the next feature work:

- Weekly menus.
- Menu-scoped products.
- Localized product content.
- Product prices.
- Product images or image references.
- Pickup slots.
- Stock limits.
- Manual open/closed ordering availability.
- Copy provenance from a previous menu-scoped product when useful.

Defer checkout reservations, orders, payment state, fulfillment state, and notification state until the owning feature steps introduce real behavior.

Draft weekly menus and draft products may be incomplete. Required customer-facing and operational fields are enforced before weekly menu publication, not at initial draft creation.

## Environment

Use `DATABASE_URL` for PostgreSQL connection configuration.

Add the variable to `.env.example` when Prisma is introduced, but do not commit real local, staging, or production database URLs.

Prisma CLI commands load `prisma.config.ts`, which reads `.env` and then `.env.local`. Local development should set `DATABASE_URL` in ignored `.env.local` before running generation or migrations.

The repository includes a local PostgreSQL compose service for development:

```bash
docker compose up -d postgres
```

The matching local URL is:

```bash
DATABASE_URL=postgresql://bakery:bakery@localhost:5432/bakery_website
```

## Migration Workflow

Use checked-in Prisma migrations from the start.

Add package scripts as part of the initial Prisma installation so the project uses stable command names from the beginning.

Normal development flow:

```bash
bun run db:generate
bun run db:migrate --name <name>
```

Deployment flow:

```bash
bun run db:deploy
```

Production builds run Prisma generation before `next build`, so deployment environments also need `DATABASE_URL` available during build.

`prisma db push` is not the normal workflow for this app. It may be useful for throwaway experiments, but durable schema changes should be represented as reviewed migration files.

The scripts should wrap Prisma CLI commands rather than replacing migration behavior with custom code.

## Testing

Domain and service tests should exercise business outcomes at the owning module boundary without requiring a database when possible.

Use Prisma-backed tests only for persistence integration concerns, such as schema mappings, repository queries, migration assumptions, and transaction behavior that cannot be tested meaningfully without PostgreSQL.

Installing Prisma, defining the initial schema, and generating Prisma Client do not require database-backed tests by themselves. Verify those foundation changes with generation, migration, typecheck, build, or equivalent command-level checks. Add database integration tests when the implementation introduces real repository/query behavior that can fail independently of domain rules.

Avoid tests that assert Prisma implementation details when the behavior can be tested through a project-owned API.
