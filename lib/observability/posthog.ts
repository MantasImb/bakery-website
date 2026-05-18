"use client";

import posthog from "posthog-js";
import {
  browserPostHogProjectToken,
  isBrowserAnalyticsEnabled,
} from "./analytics-enablement";

let isBrowserPostHogInitialized = false;

export function initializeBrowserPostHog() {
  const posthogProjectToken = browserPostHogProjectToken();

  if (!isBrowserAnalyticsEnabled() || !posthogProjectToken) {
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
    isBrowserPostHogInitialized = true;
  } catch {
    // Analytics must not break application startup.
  }
}

export function captureBrowserPostHogEvent(
  eventName: string,
  properties?: Record<string, string | number | boolean>,
) {
  if (!isBrowserPostHogInitialized || !isBrowserAnalyticsEnabled()) {
    return;
  }

  try {
    posthog.capture(eventName, properties);
  } catch {
    // Analytics must not break user interactions.
  }
}

export function getBrowserPostHogDistinctId(): string | undefined {
  if (!isBrowserPostHogInitialized || !isBrowserAnalyticsEnabled()) {
    return undefined;
  }

  try {
    return posthog.get_distinct_id();
  } catch {
    return undefined;
  }
}
