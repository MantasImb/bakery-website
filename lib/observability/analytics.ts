"use client";

import posthog from "posthog-js";

type AnalyticsScalar = string | number | boolean;

export type AnalyticsProperties = Record<
  string,
  AnalyticsScalar | null | undefined
>;

const DISALLOWED_ANALYTICS_KEYS = new Set([
  "apikey",
  "authorization",
  "cart",
  "cookies",
  "customername",
  "customernotes",
  "email",
  "formdata",
  "fullorder",
  "order",
  "phone",
  "rawrequestbody",
  "stripepayload",
]);

let isBrowserAnalyticsInitialized = false;

export function initializeBrowserAnalytics() {
  const posthogProjectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

  if (!posthogProjectToken) {
    return;
  }

  try {
    posthog.init(posthogProjectToken, {
      api_host: "/ingest",
      ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      defaults: "2026-01-30",
      capture_exceptions: false,
      autocapture: false,
      capture_pageview: false,
      disable_session_recording: true,
      person_profiles: "never",
      debug: process.env.NODE_ENV === "development",
    });
    isBrowserAnalyticsInitialized = true;
  } catch {
    // Analytics must not break application startup.
  }
}

export function captureBrowserAnalyticsEvent(
  eventName: string,
  properties?: AnalyticsProperties,
) {
  if (!isBrowserAnalyticsInitialized) {
    return;
  }

  try {
    posthog.capture(eventName, sanitizeAnalyticsProperties(properties));
  } catch {
    // Analytics must not break user interactions.
  }
}

export function sanitizeAnalyticsProperties(
  properties?: AnalyticsProperties,
): Record<string, AnalyticsScalar> | undefined {
  if (!properties) {
    return undefined;
  }

  const sanitized: Record<string, AnalyticsScalar> = {};

  for (const [key, value] of Object.entries(properties)) {
    if (
      DISALLOWED_ANALYTICS_KEYS.has(normalizeAnalyticsKey(key)) ||
      value == null
    ) {
      continue;
    }

    if (isAnalyticsScalar(value)) {
      sanitized[key] = value;
    }
  }

  return Object.keys(sanitized).length > 0 ? sanitized : undefined;
}

function normalizeAnalyticsKey(key: string): string {
  return key.replace(/[\s_-]/g, "").toLowerCase();
}

function isAnalyticsScalar(value: unknown): value is AnalyticsScalar {
  return (
    typeof value === "string" ||
    typeof value === "boolean" ||
    (typeof value === "number" && Number.isFinite(value))
  );
}
