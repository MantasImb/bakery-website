# Routing Guidance

This document records routing concerns that affect analytics, observability, localization, SEO, and deployment behavior.

Related SEO guidance: [`seo.md`](./seo.md)

## Trailing Slash Redirects

Next.js normally owns canonical trailing-slash redirect behavior. Do not disable that behavior globally unless the product explicitly needs both slash and non-slash URLs to be handled without redirecting.

The `skipTrailingSlashRedirect` option is an advanced Next.js flag for custom proxy or migration behavior. If it is enabled, document the exact reason, affected paths, and verification steps before merging the change.

## Analytics Rewrites

PostHog reverse-proxy rewrites should be scoped to the ingest paths only. Adding `/ingest` rewrites must not change unrelated application routes or canonical URL behavior.

When reviewing analytics rewrites:

- Confirm that `/ingest/static/:path*`, `/ingest/array/:path*`, and `/ingest/:path*` are the only analytics proxy paths.
- Avoid global routing flags unless PostHog or the deployment platform requires them.
- Verify that normal application routes still canonicalize consistently, especially `/`, `/menu`, `/visit`, and future localized routes.
- Prefer documenting any provider-specific routing exception here before it becomes part of deployment behavior.

## Locale Routes

Customer-facing routes should use explicit locale prefixes for every supported language. V1 supports Norwegian Bokmål and English as `/no` and `/en`.

Implement localized customer pages under the locale segment, for example `app/[locale]/(customer)/...`. Keep admin and API routes outside that locale segment.

The default locale is Norwegian Bokmål. Requests without a locale prefix, including `/`, should redirect to the matching `/no` path instead of rendering unprefixed localized content. The root redirect is deterministic for V1; do not use browser-language negotiation to redirect English-preferring visitors to `/en`. Treat `no` as the Norwegian Bokmål locale for V1; do not add separate `nb` or `nn` route handling unless product scope changes.

Unsupported locale prefixes, such as `/fr/menu`, should return not-found instead of redirecting to `/no`. Redirect only truly unprefixed customer routes to the Norwegian default.

Localized customer routes should keep stable English path segments after the locale prefix, such as `/no/menu` and `/en/menu`. Translate visible navigation labels and page content, not route slugs, for V1.

The customer-facing language switcher should preserve the current stable path and swap only the locale prefix, for example `/no/checkout` to `/en/checkout`. The URL is the source of truth for the active customer locale. Do not add account-level language preferences in V1 because customer checkout is guest-only.

Admin and kitchen routes are not localized in V1. They should use English UI copy and should not require `/no` or `/en` route prefixes unless a future product decision changes admin localization scope.

API routes are not localized. Do not create `/no/api/...` or `/en/api/...` variants; pass structured locale values only where a business flow needs them, such as checkout or order creation.

When reviewing locale routing:

- Keep both supported languages first-class in route tests and navigation helpers.
- Do not add a hidden default-locale route such as `/menu` if the canonical localized path is `/no/menu`.
- Keep admin and kitchen routes outside customer locale-prefix requirements.
- Keep API routes outside customer locale-prefix requirements.
- Keep provider proxy paths, framework internals, static assets, images, `/favicon.ico`, API routes, and admin routes outside locale redirect handling.
- Confirm localized routes do not weaken the canonical URL behavior described above.

## Review Checklist

Before accepting routing changes:

- Run `bun run build` so Next.js validates the config.
- Check whether the change affects all routes or only a narrow provider path.
- Confirm the change does not conflict with future locale routing.
- Record any intentional canonical URL tradeoff in this document or in an ADR if the tradeoff is durable.
