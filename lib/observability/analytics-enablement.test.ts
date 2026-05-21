import {
  browserPostHogProjectToken,
  isBrowserAnalyticsEnabled,
  isServerAnalyticsEnabled,
  serverPostHogProjectApiKey,
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

  it("disables browser analytics when PostHog configuration is blank", () => {
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN = "   ";

    expect(isBrowserAnalyticsEnabled()).toBe(false);
  });

  it("returns the configured browser PostHog project token", () => {
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN = "public-token";

    expect(browserPostHogProjectToken()).toBe("public-token");
  });

  it("returns undefined when the browser PostHog project token is not set", () => {
    delete process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

    expect(browserPostHogProjectToken()).toBeUndefined();
  });

  it("returns the raw blank browser PostHog project token", () => {
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN = "   ";

    expect(browserPostHogProjectToken()).toBe("   ");
  });

  it("defaults server analytics to enabled when PostHog is configured", () => {
    process.env.POSTHOG_PROJECT_API_KEY = "server-key";

    expect(isServerAnalyticsEnabled()).toBe(true);
  });

  it("defaults server analytics to disabled when PostHog is not configured", () => {
    delete process.env.POSTHOG_PROJECT_API_KEY;

    expect(isServerAnalyticsEnabled()).toBe(false);
  });

  it("disables server analytics when PostHog configuration is blank", () => {
    process.env.POSTHOG_PROJECT_API_KEY = "   ";

    expect(isServerAnalyticsEnabled()).toBe(false);
  });

  it("returns the configured server PostHog project API key", () => {
    process.env.POSTHOG_PROJECT_API_KEY = "server-key";

    expect(serverPostHogProjectApiKey()).toBe("server-key");
  });

  it("returns undefined when the server PostHog project API key is not set", () => {
    delete process.env.POSTHOG_PROJECT_API_KEY;

    expect(serverPostHogProjectApiKey()).toBeUndefined();
  });

  it("returns the raw blank server PostHog project API key", () => {
    process.env.POSTHOG_PROJECT_API_KEY = "   ";

    expect(serverPostHogProjectApiKey()).toBe("   ");
  });
});
