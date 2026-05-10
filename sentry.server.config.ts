import * as Sentry from "@sentry/nextjs";
import {
  resolveSentryServerRelease,
  sentryRuntimeReleaseOption,
} from "./lib/observability/sentry-release";
import { resolveSentryServerTelemetryOptions } from "./lib/observability/sentry-telemetry";

const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
const release = resolveSentryServerRelease();
const environment = process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV;

Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  environment,
  ...sentryRuntimeReleaseOption(release),
  ...resolveSentryServerTelemetryOptions(environment),

  // Keep automatic request/user enrichment disabled. Route and orchestration
  // code should add only the safe join keys allowed by docs/sentry.md.
  sendDefaultPii: false,
});
