import {
  resolveSentryBrowserTelemetryOptions,
  resolveSentryServerTelemetryOptions,
} from "./sentry-telemetry";

describe("resolveSentryServerTelemetryOptions", () => {
  it.each([undefined, "development", "preview", "production"])(
    "keeps tracing and logs disabled for %s",
    (environment) => {
      expect(resolveSentryServerTelemetryOptions(environment)).toEqual({
        tracesSampleRate: 0,
        enableLogs: false,
      });
    },
  );
});

describe("resolveSentryBrowserTelemetryOptions", () => {
  it.each([undefined, "development", "preview", "production"])(
    "keeps tracing, replay, and logs disabled for %s",
    (environment) => {
      expect(resolveSentryBrowserTelemetryOptions(environment)).toEqual({
        tracesSampleRate: 0,
        replaysSessionSampleRate: 0,
        replaysOnErrorSampleRate: 0,
        enableLogs: false,
      });
    },
  );
});
