---
status: accepted
---

# Use Capability Modules For Commerce Behavior

This project organizes commerce and operations behavior around capability modules such as weekly menus, carts, checkout, orders, and kitchen workflows. Business rules should live with the module that owns the capability, while shared modules stay limited to small cross-module primitives such as result types, base errors, money helpers, and IDs.

## Considered Options

- Organize by broad technical layers such as services, repositories, validators, and utilities.
- Organize by business capability and expose only contracts that real callers need.

## Consequences

Domain behavior should not drift into page components, broad shared utilities, or provider-specific integration folders. Capability module `index.ts` files should stay intentionally small and should not become speculative type barrels.
