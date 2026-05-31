---
status: accepted
---

# Use Weekly Preorder Model Instead Of Catalog

V1 is a weekly preorder/drop model, not a permanent evergreen ecommerce catalog. Customers order only from the active weekly menu, which keeps product choice small, stock-limited, and aligned with the bakery's weekend pickup operations.

Admins may reuse past product information by copying a product from a previous weekly menu into a new weekly menu, but reused products are creation aids rather than customer-facing orderable catalog entries outside the active weekly menu. When a previous product is copied into a new weekly menu, it becomes an independently editable product for that weekly menu.

## Considered Options

- Maintain a permanent catalog where products may be available continuously.
- Publish a small weekly menu that drives the storefront and customer order flow.

## Consequences

The active weekly menu is the customer-facing source of truth for what can be ordered. Product browsing, stock validation, pickup slots, homepage promotion, and kitchen reports should be designed around the weekly menu rather than a global product catalog.

Edits to a copied product should not rewrite the previous product it was copied from. Copying a product should reuse only product information intrinsic to the baked item, such as localized copy, duplicated image, fixed-list allergens, and structured dietary flags. Price is week-specific and required, but copying may carry forward the previous price as an editable starting reference for admin convenience. Other external weekly settings such as stock limits, pickup slots, and ordering availability are week-specific and must be set fresh before publication. V1 should avoid a separate reusable template library and whole-menu duplication unless admin workflow proves that copying individual products from previous weekly menus is insufficient.
