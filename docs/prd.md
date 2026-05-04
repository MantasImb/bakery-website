# PRD: Build Weekly Bakery Preorder Storefront and Admin Kitchen Workflow

## Problem Statement

The bakery needs a website that supports a weekly preorder model instead of a permanent product catalog. Each week, the baker publishes a small selection of pastries or baked goods, customers order from that limited menu, and the bakery prepares orders for fixed weekend pickup slots.

The current website has a neutral visual foundation, but the broader product requirements for commerce, operations, observability, localization, and testing need to guide the next stages of feature implementation.

## Solution

Build a bilingual weekly preorder bakery website where the homepage promotes the current week's offer, customers can quickly add limited-stock products to a cart, pay through Stripe, and choose a fixed pickup slot. The admin can publish weekly menus, manage stock limits, review paid orders, generate production totals, prepare packing lists, and track pickup status.

V1 should prioritize a clear purchase flow for middle-aged or older customers and families: simple navigation, obvious product choices, clear add-to-cart controls, guest checkout, reliable payment, and straightforward pickup instructions.

## User Stories

1. As a customer, I want to immediately see this week's featured bakery offer, so that I understand what is available now.
2. As a customer, I want the homepage hero to show a strong product image, short sales text, and a CTA, so that I can quickly start ordering.
3. As a customer, I want clear preorder and pickup information, so that I know when and where I can receive my order.
4. As a customer, I want to browse only the active weekly menu, so that I am not confused by unavailable products.
5. As a customer, I want simple product cards with clear add buttons, so that adding items to my cart is effortless.
6. As a customer, I want to see product price, description, image, allergens or dietary notes, and remaining availability, so that I can make a confident choice.
7. As a customer, I want sold-out products to be visibly unavailable, so that I do not waste time trying to buy them.
8. As a customer, I want a cart that updates quantities clearly, so that I can review my order before payment.
9. As a customer, I want checkout without creating an account, so that ordering stays fast.
10. As a customer, I want to enter my name, email, phone number, and pickup slot, so that the bakery can prepare and identify my order.
11. As a customer, I want to pay online with Stripe, so that my order is confirmed immediately.
12. As a customer, I want an order confirmation email after payment, so that I have proof and pickup details.
13. As a customer, I want a pickup reminder before my selected slot, so that I do not forget my order.
14. As an admin, I want to create and publish a weekly menu, so that customers can order the current week's products.
15. As an admin, I want to set stock limits per product, so that the bakery does not oversell.
16. As an admin, I want to change stock limits or close ordering manually, so that I can react to production capacity.
17. As an admin, I want to define pickup slots per weekly menu, so that pickup can be planned around bakery operations.
18. As an admin, I want to review paid orders by week, status, product, and pickup slot, so that order management is efficient.
19. As a baker, I want production totals by product, so that I know what to bake.
20. As a baker, I want packing lists grouped by customer order, so that each order can be prepared accurately.
21. As a baker, I want pickup-slot checklists, so that handoff on Saturday and Sunday is organized.
22. As an admin, I want to update order statuses, so that the kitchen can track progress from paid to picked up.
23. As an admin, I want cancellation and refund states, so that exceptions are visible and auditable.
24. As the site owner, I want Sentry error monitoring, so that production issues are caught quickly.
25. As the site owner, I want PostHog analytics, so that I can understand product interest and checkout conversion.
26. As a Norwegian or English-speaking customer, I want the site in my language, so that the ordering flow is understandable.

## Implementation Decisions

- V1 is a weekly preorder/drop model, not a permanent evergreen catalog.
- Each weekly menu contains a small number of products, typically 3-5.
- The homepage hero is driven by the active weekly menu and shows the current offer image, overlay text, quote, and CTA.
- Below the homepage hero, the site explains the preorder model, pickup location, pickup timing, and key customer instructions.
- Product browsing should be simple and direct, with clear add-to-cart controls and minimal decision complexity.
- Product visual design can be refined later, but usability for middle-aged or older customers and families is a V1 requirement.
- Products have limited stock. Unlimited preorder is not allowed.
- Admin can change product stock limits and manually close individual products or the full weekly menu.
- Checkout must prevent overselling, including concurrent checkout attempts.
- Stripe is the V1 payment provider.
- Vipps is deferred to future scope.
- Guest checkout is the only customer checkout mode in V1.
- Customer accounts and saved order history are deferred.
- Fulfillment is pickup-only in V1.
- Delivery is deferred to future scope.
- Pickup uses admin-defined fixed slots, such as Saturday/Sunday 10:00-11:00.
- Pickup slots belong to a weekly menu and can optionally have capacity limits.
- If orders already exist for a pickup slot, editing or deleting that slot must be handled explicitly.
- Admin access uses one authenticated admin role in V1.
- PostgreSQL and Prisma are the selected database stack for V1.
- Core persisted data includes weekly menus, products, localized product content, product images, stock limits, pickup slots, carts or checkout reservations, orders, order line items, customer contact details, payment state, fulfillment state, and notification state.
- Order states should support at least pending payment, paid, preparing, packed, ready for pickup, picked up, cancelled, and refunded.
- Stock should only be permanently consumed by paid orders. Temporary checkout reservations must expire if payment is abandoned.
- Stripe webhooks are the source of truth for successful payment confirmation.
- Email is required for customer order confirmation, admin new-order notification, cancellation/refund notification, and pickup reminders.
- SMS pickup reminders are future scope.
- English and Norwegian are required languages.
- Product names, descriptions, UI text, transactional email content, and key customer instructions must be localizable.
- Sentry should capture frontend and server errors.
- PostHog should track key funnel events such as homepage CTA click, product add, cart view, checkout started, payment success, and checkout abandonment.
- Admin/kitchen views must include production totals, packing lists, pickup-slot checklists, customer contact details, and status updates.

## Testing Decisions

- Jest should be introduced as the first implementation step so future development can follow TDD.
- Tests should verify external behavior and business rules, not implementation details.
- Behavior-focused domain and service tests should live with the module that owns the behavior. Root-level `__tests__` should be reserved for app-level smoke, route, rendered layout, and cross-module integration tests. Direct tests of exported module-owned config or helpers, including exports from `app/layout.tsx`, should live beside the owning module.
- Stock and checkout tests should cover limited inventory, quantity changes, sold-out behavior, concurrent checkout attempts, payment abandonment, and successful payment finalization.
- Weekly menu tests should cover publish/close states, active menu selection, product availability, and pickup slot eligibility.
- Order tests should cover guest customer details, line items, pickup slot assignment, payment state transitions, fulfillment state transitions, cancellation, and refund state.
- Admin/kitchen tests should cover production totals, packing list generation, pickup-slot grouping, status filtering, and status updates.
- Localization tests should cover English/Norwegian route behavior and required translated content.
- Email tests should verify that the correct notification is requested for order confirmation, admin notification, cancellation/refund, and pickup reminder events.
- Analytics tests should verify that key events are emitted from user-visible actions without coupling tests to the analytics provider internals.
- Sentry should be verified through configuration and smoke-level error capture, not by testing Sentry internals.

## Out of Scope

- Vipps payment integration.
- Local delivery.
- Customer accounts.
- Loyalty programs.
- Subscriptions.
- SMS notifications.
- Multiple admin/staff roles.
- Complex CMS workflows.
- Permanent evergreen product catalog.
- Advanced design exploration for the product catalog UI.
- Automated route planning or delivery pricing.
- Native mobile app.

## Further Notes

This PRD intentionally treats the bakery website as a commerce and kitchen operations product, not just a marketing site. The most important domain risks are overselling, unclear pickup expectations, failed or abandoned payment sessions, and kitchen confusion during fulfillment.

The implementation should favor deep modules around weekly menu management, stock validation, checkout/payment finalization, order state, and kitchen summaries. These areas should contain the core business rules and receive the strongest automated test coverage.

The existing neutral foundation is treated as implemented context. This PRD defines the larger product direction that should guide the commerce, admin, and operations phases from here.
