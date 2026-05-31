---
status: accepted
---

# Use PostgreSQL And Prisma For V1 Persistence

Related guidance: [`../prisma.md`](../prisma.md)

V1 uses PostgreSQL and Prisma for persistent data such as weekly menus, weekly menu products, localized product content, stock limits, pickup slots, checkout reservations, orders, payment state, fulfillment state, and notification state. Persistence supports the domain model, but database schema and ORM behavior should not become the owner of business rules.

## Considered Options

- Defer persistence choice until individual features are implemented.
- Select PostgreSQL and Prisma early so menu, stock, checkout, and order work can share one relational foundation.

## Consequences

Feature work should include migration workflow documentation when Prisma is introduced. Domain tests should exercise business outcomes at module boundaries and should avoid coupling directly to ORM implementation details unless the test is specifically about persistence integration.

Prisma access should stay behind a small project-owned database wrapper and persistence-facing boundaries owned by the relevant capability module. Capability modules should not let Prisma schema details become the public domain API.
