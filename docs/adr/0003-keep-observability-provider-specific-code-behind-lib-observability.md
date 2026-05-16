---
status: accepted
---

# Keep Observability Provider-Specific Code Behind Lib Observability

Provider-specific observability integrations should stay behind `/lib/observability/`, except for framework-required setup files. Application features should call project-owned observability APIs, and capability modules should keep domain behavior provider-agnostic.

See `docs/sentry.md` for the current detailed Sentry policy.

## Considered Options

- Import providers such as Sentry directly wherever failures need to be captured.
- Keep a project-owned observability boundary for privacy filtering, context normalization, capture calls, and future adapters.

## Consequences

Sentry and future analytics providers can evolve without coupling domain modules to SDK types. Boundary code may attach safe workflow context, but business modules should return typed results or raise unexpected failures without knowing which provider reports them.
