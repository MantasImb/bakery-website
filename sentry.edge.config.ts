import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,
  release: process.env.SENTRY_RELEASE || undefined,

  // Edge events may be close to incoming requests, so keep Sentry's default PII
  // enrichment off and rely on project-owned sanitized context instead.
  sendDefaultPii: false,

  // Tracing can be enabled later with explicit sampling once we know the
  // operational questions it needs to answer.
  tracesSampleRate: 0,
});
