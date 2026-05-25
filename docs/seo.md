# SEO Guidance

Related guidance:

- Internationalization: [`i18n.md`](./i18n.md)
- Routing: [`routing.md`](./routing.md)

This document records practical SEO rules for V1 customer-facing pages. Keep it lightweight, but update it when metadata, sitemap, indexing, or localized search behavior changes.

## Localized URLs

Customer-facing pages use explicit locale prefixes:

- `/no`
- `/en`

Customer route segments stay stable and English after the locale prefix, such as `/no/menu` and `/en/menu`. Visible labels and page content are translated; route slugs are not translated in V1.

Unprefixed customer URLs are not canonical. The root path redirects to `/no`, and unprefixed customer routes should redirect to the Norwegian default when they are supported.

## Canonicals And Alternates

Localized customer pages should use self-canonical URLs:

- `/no/menu` canonicalizes to `/no/menu`
- `/en/menu` canonicalizes to `/en/menu`

Do not canonicalize English and Norwegian pages to one shared unprefixed URL. Use `hreflang` alternates to connect localized variants instead.

Where practical, customer pages should include alternates for:

- `no`
- `en`
- `x-default`

`x-default` should point directly to `/no`, not `/`, because `/` is only a deterministic redirect and V1 does not use browser-language negotiation.

## Metadata

Customer-facing page metadata should be localized, including page titles and descriptions.

Keep the metadata pattern centralized enough that richer SEO behavior can be added later without rewriting every page. Avoid a heavy SEO abstraction until the site has enough page types or search requirements to justify it.

Admin, kitchen, API, provider proxy, and framework/internal routes are outside customer SEO scope.

## Sitemap

When sitemap generation exists, include canonical localized customer URLs for every indexable customer page:

- include `/no/...`;
- include `/en/...`;
- do not include unprefixed customer URLs such as `/menu`;
- include alternate language metadata where supported by the sitemap implementation.

## Indexing

Indexability should not differ just because of locale. If a customer page is indexable in Norwegian, the matching English page should generally be indexable too, with `hreflang` connecting them.

Use noindex for non-customer, operational, customer-specific, and transient routes such as cart, checkout, payment return, order confirmation, admin, API, provider proxy, and framework/internal routes when those routes become relevant.

Cart and checkout can still be locale-prefixed for customer clarity, such as `/no/cart` and `/en/cart`, while remaining non-indexable.

Order confirmation pages should also remain locale-prefixed for language continuity, but they are customer-specific and must be non-indexable.

## Product Content

Product-facing text content must exist in both supported customer languages before a weekly menu can be published. This prevents indexed customer pages from silently mixing Norwegian and English copy.

Product images should be locale-neutral and should not contain language-specific text.

Localized product slugs are deferred. If product detail pages are added later, start with stable product IDs or stable non-localized slugs, and revisit localized slugs only if product discovery or SEO requirements justify the extra overhead.

## Sources To Revisit

- [Google Search Central: Localized versions of your pages](https://developers.google.com/search/docs/advanced/crawling/localized-versions)
- [Google Search Central: Canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
