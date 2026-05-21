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

let serverPostHogClient: PostHog | undefined;
let isShutdownHookRegistered = false;

export function captureServerPostHogEvent(event: ServerPostHogEvent): void {
  const projectApiKey = serverPostHogProjectApiKey();

  if (!isServerAnalyticsEnabled() || !projectApiKey) {
    return;
  }

  try {
    const posthog = getServerPostHogClient(projectApiKey);

    posthog.capture({
      distinctId: event.analyticsVisitorId ?? "anonymous_server",
      event: event.eventName,
      properties: {
        ...sanitizeAnalyticsProperties(event.properties),
        $process_person_profile: false,
      },
    });
  } catch (error) {
    console.error("PostHog server analytics capture failed", error);
  }
}

function getServerPostHogClient(projectApiKey: string): PostHog {
  if (!serverPostHogClient) {
    serverPostHogClient = new PostHog(projectApiKey, {
      host: process.env.POSTHOG_HOST,
      disableGeoip: true,
    });
    registerPostHogShutdownHook();
  }

  return serverPostHogClient;
}

function registerPostHogShutdownHook(): void {
  if (isShutdownHookRegistered) {
    return;
  }

  process.once("beforeExit", () => {
    if (!serverPostHogClient) {
      return;
    }

    Promise.resolve(serverPostHogClient.shutdown()).catch((error) => {
      console.error("PostHog server analytics shutdown failed", error);
    });
  });
  isShutdownHookRegistered = true;
}
