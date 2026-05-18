import { PostHog } from "posthog-node";
import {
  sanitizeAnalyticsProperties,
  type AnalyticsProperties,
} from "./analytics-properties";
import {
  isServerAnalyticsEnabled,
  serverPostHogProjectApiKey,
} from "./analytics-enablement";

export type ServerPostHogEvent = {
  eventName: string;
  analyticsVisitorId?: string;
  properties?: AnalyticsProperties;
};

export function captureServerPostHogEvent(event: ServerPostHogEvent): void {
  const projectApiKey = serverPostHogProjectApiKey();

  if (!isServerAnalyticsEnabled() || !projectApiKey) {
    return;
  }

  const posthog = new PostHog(projectApiKey, {
    host: process.env.POSTHOG_HOST,
    disableGeoip: true,
  });

  posthog.capture({
    distinctId: event.analyticsVisitorId ?? "anonymous_server",
    event: event.eventName,
    properties: {
      ...sanitizeAnalyticsProperties(event.properties),
      $process_person_profile: false,
    },
  });
}
