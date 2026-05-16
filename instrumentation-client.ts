import * as Sentry from "@sentry/nextjs";
import { initializeBrowserAnalytics } from "./lib/observability/analytics";
import { resolveSentryBrowserTelemetryOptions } from "./lib/observability/sentry-telemetry";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
const environment =
  process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ||
  process.env.SENTRY_ENVIRONMENT ||
  process.env.NODE_ENV;

Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  environment,
  ...resolveSentryBrowserTelemetryOptions(environment),

  // Browser events must not include automatic user IP, headers, cookies, or
  // other default PII. Add safe workflow IDs through the observability wrapper.
  sendDefaultPii: false,
});

// Next calls this browser hook when App Router navigation starts. Sentry uses
// it only for navigation instrumentation; initial telemetry policy leaves trace
// capture unsampled until real feature flows define useful sampling.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

initializeBrowserAnalytics();
