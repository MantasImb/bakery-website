<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

Don't run `bun run dev`, unless asked.

<!-- END:nextjs-agent-rules -->

## Architecture

Organize commerce and operations behavior around capability modules, not broad technical layers.
Business rules for weekly menus, carts, checkout, orders, and kitchen/admin workflows should live inside the module that owns that capability.
Keep shared modules limited to small cross-module primitives such as result types, base error shapes, money helpers, and IDs.
Do not move business rules into shared utilities just because more than one module needs to coordinate with them.
Capability module `index.ts` files should expose only contracts that real callers need.
Do not add speculative exports or type barrels before behavior and tests require them.

## Observability

Follow `docs/sentry.md` when adding or changing Sentry behavior.
Keep provider-specific observability integrations behind `/lib/observability/` except for framework-required setup files.
Use operational IDs and workflow state for debugging context; do not send direct customer contact fields, raw request bodies, cookies, auth headers, secrets, or full provider payloads to Sentry.

## Testing

Behavior-focused domain and service tests should live with the module that owns the behavior.
Use root-level `__tests__` only for app-level smoke, route, rendered layout, and cross-module integration tests.
Direct tests of exported module-owned config or helpers, including exports from `app/layout.tsx`, should live beside the owning module.
Tests should verify external behavior and business rules, not implementation details.
For TDD, prefer starting with small, behavior-focused unit tests at the owning module boundary so the red/green/refactor cycle stays fast. Unit tests should exercise public module APIs and business outcomes, not private helper implementation details.
