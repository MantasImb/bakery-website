import * as Sentry from "@sentry/nextjs";
import {
  resolveSentryServerRelease,
  sentryRuntimeReleaseOption,
} from "./lib/observability/sentry-release";

const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
const release = resolveSentryServerRelease();

Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,
  ...sentryRuntimeReleaseOption(release),

  // Edge events may be close to incoming requests, so keep Sentry's default PII
  // enrichment off and rely on project-owned sanitized context instead.
  sendDefaultPii: false,

  // Tracing can be enabled later with explicit sampling once we know the
  // operational questions it needs to answer.
  tracesSampleRate: 0,
});
