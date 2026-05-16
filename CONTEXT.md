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

**Stock Limit**:
The maximum quantity of a product the bakery is willing to sell for a weekly menu.
_Avoid_: Inventory, warehouse stock

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

**Admin**:
The single authenticated operator role for V1.
_Avoid_: Staff roles, manager role

**Baker**:
The operational user who prepares products and fulfills pickups.
_Avoid_: Warehouse worker, fulfiller

## Relationships

- A **Weekly Menu** contains 3-5 **Products**.
- An **Active Weekly Menu** is the only **Weekly Menu** customers can order from.
- A **Product** on a **Weekly Menu** has one **Stock Limit**.
- A **Checkout Reservation** belongs to one customer checkout attempt and expires if payment is abandoned.
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
- "Inventory" can imply warehouse stock. Use **Stock Limit** for the sellable quantity the bakery chooses for a weekly menu.
- "Order" should mean a paid commitment. Use **Checkout Reservation** for temporary stock holds before payment succeeds.
- "Account" conflicts with guest checkout. Use **Customer** for the buyer who provides contact details for a single order.
- "Delivery" is out of scope for V1. Use **Pickup Slot** for the fixed handoff window.
