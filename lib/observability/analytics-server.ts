import { captureServerPostHogEvent } from "./posthog-server";
import type { AnalyticsProperties } from "./analytics-properties";

type ServerAnalyticsEvent =
  | "checkout_reservation_expired"
  | "payment_succeeded";

type ServerAnalyticsOptions = {
  analyticsVisitorId?: string;
};

export function recordServerAnalyticsEvent(
  eventName: ServerAnalyticsEvent,
  properties?: AnalyticsProperties,
  options?: ServerAnalyticsOptions,
) {
  captureServerPostHogEvent({
    eventName,
    analyticsVisitorId: options?.analyticsVisitorId,
    properties,
  });
}
