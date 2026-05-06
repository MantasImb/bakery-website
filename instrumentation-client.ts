import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  environment: process.env.NODE_ENV,

  // Browser events must not include automatic user IP, headers, cookies, or
  // other default PII. Add safe workflow IDs through the observability wrapper.
  sendDefaultPii: false,

  // No replay integration is registered in this baseline. Replays can be added
  // later with explicit masking and sampling decisions.
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,

  // Keep route tracing wired but unsampled until telemetry requirements exist.
  tracesSampleRate: 0,
});

// Next calls this browser hook when App Router navigation starts. Sentry uses
// it only for navigation instrumentation; with tracesSampleRate 0, it remains a
// no-op for captured trace volume.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
