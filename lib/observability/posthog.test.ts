import posthog from "posthog-js";
import {
  captureBrowserPostHogEvent,
  getBrowserPostHogDistinctId,
  initializeBrowserPostHog,
} from "./posthog";

jest.mock("posthog-js", () => ({
  __esModule: true,
  default: {
    init: jest.fn(),
    capture: jest.fn(),
    get_distinct_id: jest.fn(),
  },
}));

const originalProjectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const originalPostHogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

describe("initializeBrowserPostHog", () => {
  afterEach(() => {
    if (originalProjectToken === undefined) {
      delete process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
    } else {
      process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN = originalProjectToken;
    }

    if (originalPostHogHost === undefined) {
      delete process.env.NEXT_PUBLIC_POSTHOG_HOST;
    } else {
      process.env.NEXT_PUBLIC_POSTHOG_HOST = originalPostHogHost;
    }

    jest.clearAllMocks();
  });

  it("skips initialization when browser analytics is disabled", () => {
    delete process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

    initializeBrowserPostHog();

    expect(posthog.init).not.toHaveBeenCalled();
  });

  it("initializes with explicit privacy preserving defaults", () => {
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN = "public-token";
    process.env.NEXT_PUBLIC_POSTHOG_HOST = "https://eu.posthog.com";

    initializeBrowserPostHog();

    expect(posthog.init).toHaveBeenCalledWith("public-token", {
      api_host: "/ingest",
      ui_host: "https://eu.posthog.com",
      defaults: "2026-01-30",
      capture_exceptions: false,
      autocapture: false,
      capture_pageview: false,
      disable_session_recording: true,
      person_profiles: "never",
      debug: false,
    });
  });

  it("does not capture when browser analytics is disabled", () => {
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN = "public-token";
    initializeBrowserPostHog();
    jest.clearAllMocks();
    delete process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

    captureBrowserPostHogEvent("homepage_cta_clicked", { cta: "view_menu" });

    expect(posthog.capture).not.toHaveBeenCalled();
  });

  it("returns PostHog anonymous distinct ID when available", () => {
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN = "public-token";
    initializeBrowserPostHog();
    jest.mocked(posthog.get_distinct_id).mockReturnValue("visitor_123");

    expect(getBrowserPostHogDistinctId()).toBe("visitor_123");
  });
});
