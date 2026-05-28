---
status: accepted
---

# Use next-intl For Localization

Related guidance: [`../i18n.md`](../i18n.md)

V1 uses `next-intl` for localized routing, UI messages, locale-aware navigation, and future validation or transactional message copy. The project should lean on `next-intl` primitives directly to keep localization overhead low, adding project-owned wrappers only when repeated product code proves they are needed.

Step 5 should install and wire `next-intl` directly instead of introducing temporary hand-rolled dictionaries that would need to be replaced later. The current homepage should be migrated into the localized customer route as the first vertical slice; it is a template and may be reshaped as needed while establishing the i18n structure.

## Considered Options

- Use only App Router locale segments and hand-rolled dictionaries.
- Use `next-intl` for the common localization mechanics and keep product-specific localized content in the weekly menu/product data model.

## Consequences

### Routing and Locale Handling

Customer-facing routing should stay explicit and predictable. Customer-facing routes should stay explicit as `/no` and `/en`, with Norwegian as the default fallback. Localized customer pages should live under the locale segment, such as `app/[locale]/(customer)/...`, while admin and API routes stay outside that tree. Supported locales, default locale, and narrow route helpers should live in one small i18n/routing module used by `next-intl`, proxy, metadata, the language switcher, and tests. The root path should redirect deterministically to `/no`; V1 should not use browser-language negotiation to send English-preferring visitors to `/en`. Localized customer routes should keep stable English path segments, such as `/no/menu` and `/en/menu`, rather than translated slugs. The customer-facing language switcher should preserve the current stable path and swap only the locale prefix; the URL is the source of truth for the active customer locale. The `no` locale represents Norwegian Bokmål for V1; do not introduce separate `nb` or `nn` locale handling unless that becomes a real product requirement.

Customer flow state should preserve language continuity without making every data structure localized. Cart, checkout, payment return, and order confirmation routes should preserve the current locale unless the customer explicitly switches language. Cart data should stay locale-neutral; the checkout or order should capture the customer locale when it becomes needed for transactional emails and later customer communication. Stripe Checkout should receive the customer locale where supported, with a minimal mapping from project locales to Stripe locales; locale-prefixed success and cancel return URLs remain the source of truth for post-payment site language. Customer transactional emails should use the locale captured from the checkout/order route when the checkout reservation or order is created; do not infer email language later from browser headers or admin UI state.

### Messages and Translations

UI messages and persisted product content have different ownership. UI copy belongs in `next-intl` messages, while persisted product names, descriptions, allergen notes, and other weekly menu content should remain part of product content storage when persistence is introduced. Customer-facing `next-intl` message keys must exist in both `no` and `en`; missing UI translations should fail tests or build checks instead of falling back at runtime. Message keys should separate surface-specific copy from reusable phrases: page or workflow copy belongs under the owning surface, while exact phrases reused across customer-facing surfaces may live in a shared namespace. Message files should use shallow nested JSON by surface or shared namespace, not one large flat file. Customer-facing labels, helper text, validation messages, empty states, loading states, not-found UI, and recoverable errors should be localized under the locale route segment. If a root or global error fallback cannot know the locale, keep it minimal and use the Norwegian/default posture. Tests should combine representative customer route smoke assertions for high-value visible strings in both locales with separate message-key coverage; avoid making every behavior test depend on exact translated copy. V1 should use message-key parity checks and route smoke tests rather than introducing generated message-key types; generated types can be revisited later if key mistakes become a recurring source of defects.

Product content should be complete in each supported customer language. Product images should be locale-neutral and should not contain language-specific text. Product-facing text content should be required in both supported customer languages before a weekly menu can be published; V1 should not silently fall back between Norwegian and English product content.

### Metadata and SEO

Localized pages should expose localized search metadata from the start. Customer-facing metadata should be localized and include practical alternate links for `/no` and `/en`; keep the SEO implementation lightweight but centralized enough that richer metadata can be added later without rewriting each page.

### Analytics and Observability

Telemetry should use stable identifiers while attaching safe locale context. Customer-facing analytics events should keep stable English event names and include a safe `locale` property for segmentation. Unexpected customer-facing failures should show short localized generic messages while technical detail goes to Sentry under the existing observability rules. Customer-facing Sentry context may include the safe `locale` value when available, but should not include translated messages, request bodies, customer contact fields, or full provider payloads.

### Formatting and Display

Localized formatting should happen at the display boundary. Customer-facing money, date, time, and number display should use the active customer locale, with NOK as the only V1 currency. Persist money, dates, and pickup windows as structured values rather than localized strings, and use explicit localized pickup labels instead of ambiguous numeric-only dates. User-provided checkout data such as names, email addresses, phone numbers, and notes should never be translated; store it as provided or normalized structurally, and localize only surrounding labels, helper text, and errors.

### Admin and API Scope

Operator and integration surfaces should remain outside V1 localization unless a business flow needs a structured locale. API routes should not be localized; pass structured locale values only where a business flow needs them. Admin and kitchen screens are not localized in V1 and should use English UI copy. Technical logs, admin errors, and operator-facing diagnostics can stay English-only in V1.
