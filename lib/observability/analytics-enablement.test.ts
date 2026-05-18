import {
  isBrowserAnalyticsEnabled,
  isServerAnalyticsEnabled,
} from "./analytics-enablement";

const originalBrowserToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const originalServerKey = process.env.POSTHOG_PROJECT_API_KEY;

describe("analytics enablement", () => {
  afterEach(() => {
    if (originalBrowserToken === undefined) {
      delete process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
    } else {
      process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN = originalBrowserToken;
    }

    if (originalServerKey === undefined) {
      delete process.env.POSTHOG_PROJECT_API_KEY;
    } else {
      process.env.POSTHOG_PROJECT_API_KEY = originalServerKey;
    }
  });

  it("defaults browser analytics to enabled when PostHog is configured", () => {
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN = "public-token";

    expect(isBrowserAnalyticsEnabled()).toBe(true);
  });

  it("disables browser analytics when PostHog is not configured", () => {
    delete process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

    expect(isBrowserAnalyticsEnabled()).toBe(false);
  });

  it("defaults server analytics to enabled when PostHog is configured", () => {
    process.env.POSTHOG_PROJECT_API_KEY = "server-key";

    expect(isServerAnalyticsEnabled()).toBe(true);
  });
});
