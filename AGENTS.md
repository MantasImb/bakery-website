<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

Don't run `bun run dev`, unless asked.

<!-- END:nextjs-agent-rules -->

## Testing

Behavior-focused domain and service tests should live with the module that owns the behavior.
Use root-level `__tests__` only for app-level smoke, route, rendered layout, and cross-module integration tests.
Direct tests of exported module-owned config or helpers, including exports from `app/layout.tsx`, should live beside the owning module.
Tests should verify external behavior and business rules, not implementation details.
For TDD, prefer starting with small, behavior-focused unit tests at the owning module boundary so the red/green/refactor cycle stays fast. Unit tests should exercise public module APIs and business outcomes, not private helper implementation details.
