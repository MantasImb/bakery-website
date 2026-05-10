type SentryTelemetryEnvironment = "development" | "preview" | "production";

type SentryServerTelemetryOptions = Readonly<{
  tracesSampleRate: 0;
  enableLogs: false;
}>;

type SentryBrowserTelemetryOptions = SentryServerTelemetryOptions &
  Readonly<{
    replaysSessionSampleRate: 0;
    replaysOnErrorSampleRate: 0;
  }>;

const DISABLED_SERVER_TELEMETRY = {
  tracesSampleRate: 0,
  enableLogs: false,
} as const;

const DISABLED_BROWSER_TELEMETRY = {
  tracesSampleRate: 0,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
  enableLogs: false,
} as const;

const SERVER_TELEMETRY_BY_ENVIRONMENT = {
  development: DISABLED_SERVER_TELEMETRY,
  preview: DISABLED_SERVER_TELEMETRY,
  production: DISABLED_SERVER_TELEMETRY,
  default: DISABLED_SERVER_TELEMETRY,
} as const;

const BROWSER_TELEMETRY_BY_ENVIRONMENT = {
  development: DISABLED_BROWSER_TELEMETRY,
  preview: DISABLED_BROWSER_TELEMETRY,
  production: DISABLED_BROWSER_TELEMETRY,
  default: DISABLED_BROWSER_TELEMETRY,
} as const;

// Initial Sentry telemetry stays wired but unsampled until checkout, order, and
// admin workflows exist and can define the operational questions to answer.
export function resolveSentryServerTelemetryOptions(
  environment?: string,
): SentryServerTelemetryOptions {
  return SERVER_TELEMETRY_BY_ENVIRONMENT[environmentKey(environment)];
}

export function resolveSentryBrowserTelemetryOptions(
  environment?: string,
): SentryBrowserTelemetryOptions {
  return BROWSER_TELEMETRY_BY_ENVIRONMENT[environmentKey(environment)];
}

function environmentKey(
  environment: string | undefined,
): SentryTelemetryEnvironment | "default" {
  if (
    environment === "development" ||
    environment === "preview" ||
    environment === "production"
  ) {
    return environment;
  }

  return "default";
}
