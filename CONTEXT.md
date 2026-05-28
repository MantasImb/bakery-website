# Bakery Preorder Storefront

This context describes the language for a bakery website built around weekly preorders, limited stock, online payment, and fixed pickup operations. Use these terms when discussing product behavior, business rules, and kitchen/admin workflows.

## Language

**Weekly Menu**:
The published set of products available for one preorder cycle.
_Avoid_: Catalog, product catalog, shop inventory

**Active Weekly Menu**:
The single weekly menu currently visible and orderable by customers.
_Avoid_: Current catalog, live inventory

**Product**:
A baked item offered through a weekly menu.
_Avoid_: SKU, item, listing

**Localized Product Content**:
Customer-facing product name, description, and notes written for one supported language.
_Avoid_: Translation fallback, copy variant

**Stock Limit**:
The maximum quantity of a product the bakery is willing to sell for a weekly menu.
_Avoid_: Inventory, warehouse stock

**Ordering Availability**:
Whether customers can currently place orders for a weekly menu or product.
_Avoid_: Visibility, inventory status

**Allergen**:
A fixed-list food allergen associated with a product.
_Avoid_: Free-text allergy note

**Dietary Flag**:
A structured dietary attribute associated with a product.
_Avoid_: Marketing label, free-text diet note

**Checkout Reservation**:
A temporary hold on stock while a customer attempts payment.
_Avoid_: Order, purchase, permanent stock consumption

**Order**:
A paid customer commitment for products from one weekly menu and one pickup slot.
_Avoid_: Purchase, checkout, transaction

**Pickup Slot**:
An admin-defined pickup window belonging to a weekly menu.
_Avoid_: Delivery window, appointment

**Production Totals**:
Product-level quantities the baker needs to prepare for a weekly menu.
_Avoid_: Inventory report, sales report

**Packing List**:
An order-level preparation view grouped by customer order.
_Avoid_: Receipt, invoice

**Pickup Checklist**:
An operational handoff view grouped by pickup slot.
_Avoid_: Delivery manifest

**Customer**:
A guest buyer who provides contact and pickup details for one order.
_Avoid_: Account, user, member

**Analytics Visitor**:
An anonymous browser journey recognized by product analytics for funnel continuity.
_Avoid_: Customer, account, user, member

**Admin**:
The single authenticated operator role for V1.
_Avoid_: Staff roles, manager role

**Baker**:
The operational user who prepares products and fulfills pickups.
_Avoid_: Warehouse worker, fulfiller

## Relationships

- A **Weekly Menu** contains 3-5 **Products**.
- An **Active Weekly Menu** is the only **Weekly Menu** customers can order from.
- An **Admin** can copy a **Product** from a previous **Weekly Menu** into a new **Weekly Menu** as an independently editable **Product**.
- Updating a copied **Product** does not change the previous **Product** it was copied from.
- A **Product** must have **Localized Product Content** in every supported customer language before its **Weekly Menu** can be published.
- A **Product** image is shared across customer languages and should not contain language-specific text.
- A **Product** on a **Weekly Menu** has one **Stock Limit**.
- A **Weekly Menu** has **Ordering Availability** for the full preorder cycle.
- A **Product** has **Ordering Availability** for product-level sold-out or manual close behavior.
- A **Product** uses fixed-list **Allergens** and structured **Dietary Flags**.
- Copying a **Product** from a previous **Weekly Menu** copies only product information intrinsic to the baked item, including its image, **Allergens**, and **Dietary Flags**.
- Copying a **Product** from a previous **Weekly Menu** does not copy external weekly settings such as price, **Stock Limit**, pickup slots, or ordering availability.
- Product reuse comes from previous weekly menus, not incomplete drafts.
- A published **Weekly Menu** cannot have its product fields edited.
- A **Product** image is duplicated when a **Product** is copied into a new **Weekly Menu** so replacing the new image does not change the previous menu.
- A **Pickup Slot** does not have its own capacity limit in V1.
- A **Checkout Reservation** belongs to one customer checkout attempt and expires if payment is abandoned.
- A **Checkout Reservation** may include one **Analytics Visitor** for analytics continuity, but checkout must work without one.
- An **Order** is created only after successful payment confirmation.
- An **Order** belongs to exactly one **Pickup Slot**.
- A **Pickup Slot** belongs to exactly one **Weekly Menu**.
- **Production Totals** summarize paid **Orders** by **Product**.
- A **Packing List** groups paid **Orders** by **Customer**.
- A **Pickup Checklist** groups paid **Orders** by **Pickup Slot**.

## Example Dialogue

> **Dev:** "When a customer adds the last croissant to their cart, do we create an order?"
> **Domain expert:** "No. We create a **Checkout Reservation** while they pay. It becomes an **Order** only after payment succeeds."
>
> **Dev:** "Does the customer browse all products the bakery has ever made?"
> **Domain expert:** "No. They only see the **Active Weekly Menu** for the current preorder cycle."

## Flagged Ambiguities

- "Catalog" can imply a permanent evergreen ecommerce catalog. Use **Weekly Menu** because V1 is a preorder/drop model.
- Reusing a previous **Product** as a starting point is an admin creation aid, not a customer-facing catalog. Customers order **Products** from the **Active Weekly Menu**.
- "Inventory" can imply warehouse stock. Use **Stock Limit** for the sellable quantity the bakery chooses for a weekly menu.
- "Order" should mean a paid commitment. Use **Checkout Reservation** for temporary stock holds before payment succeeds.
- "Account" conflicts with guest checkout. Use **Customer** for the buyer who provides contact details for a single order.
- "Analytics visitor" should not imply an account or customer profile. It is only an anonymous analytics join key for product funnel analysis.
- "Delivery" is out of scope for V1. Use **Pickup Slot** for the fixed handoff window.
