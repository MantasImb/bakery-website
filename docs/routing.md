# Routing Guidance

This document records routing concerns that affect analytics, observability, localization, and deployment behavior.

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

## Review Checklist

Before accepting routing changes:

- Run `bun run build` so Next.js validates the config.
- Check whether the change affects all routes or only a narrow provider path.
- Confirm the change does not conflict with future locale routing.
- Record any intentional canonical URL tradeoff in this document or in an ADR if the tradeoff is durable.
