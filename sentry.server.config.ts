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

  // Keep automatic request/user enrichment disabled. Route and orchestration
  // code should add only the safe join keys allowed by docs/sentry.md.
  sendDefaultPii: false,

  // Performance tracing is a separate telemetry decision. Leaving the sample
  // rate at 0 keeps this slice focused on unexpected error capture.
  tracesSampleRate: 0,
});
