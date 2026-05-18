"use client";

import {
  captureBrowserPostHogEvent,
  getBrowserPostHogDistinctId,
  initializeBrowserPostHog,
} from "./posthog";
import {
  sanitizeAnalyticsProperties,
  type AnalyticsProperties,
} from "./analytics-properties";

type SecondaryEngagementEvent =
  | "navigation_clicked"
  | "visit_planning_clicked";

export { sanitizeAnalyticsProperties, type AnalyticsProperties };

export function initializeBrowserAnalytics() {
  initializeBrowserPostHog();
}

function captureBrowserAnalyticsEvent(
  eventName: string,
  properties?: AnalyticsProperties,
) {
  captureBrowserPostHogEvent(eventName, sanitizeAnalyticsProperties(properties));
}

export function recordHomepageCtaClicked(cta: "view_menu") {
  captureBrowserAnalyticsEvent("homepage_cta_clicked", { cta });
}

export function recordSecondaryEngagement(
  eventName: SecondaryEngagementEvent,
  properties?: AnalyticsProperties,
) {
  captureBrowserAnalyticsEvent(eventName, properties);
}

export function getAnalyticsVisitorId(): string | undefined {
  return getBrowserPostHogDistinctId();
}
