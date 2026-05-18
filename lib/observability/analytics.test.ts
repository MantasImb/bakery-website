import { sanitizeAnalyticsProperties } from "./analytics";
import { captureBrowserPostHogEvent } from "./posthog";

jest.mock("./posthog", () => ({
  captureBrowserPostHogEvent: jest.fn(),
  getBrowserPostHogDistinctId: jest.fn(),
}));

const { getBrowserPostHogDistinctId } = jest.requireMock("./posthog") as {
  getBrowserPostHogDistinctId: jest.Mock;
};

describe("sanitizeAnalyticsProperties", () => {
  it("keeps compact scalar analytics properties", () => {
    expect(
      sanitizeAnalyticsProperties({
        item: "menu",
        position: 1,
        visible: true,
      }),
    ).toEqual({
      item: "menu",
      position: 1,
      visible: true,
    });
  });

  it("removes contact fields, payloads, and invalid values", () => {
    expect(
      sanitizeAnalyticsProperties({
        item: "menu",
        email: "customer@example.com",
        phone: "+47 123 45 678",
        customerName: "Ada Lovelace",
        customerNotes: "birthday order",
        raw_request_body: "raw",
        formData: "form",
        cookies: "session=secret",
        authorization: "Bearer secret",
        apiKey: "secret",
        stripePayload: "payload",
        cart: "cart",
        order: "order",
        fullOrder: "full-order",
        missing: null,
        invalidCount: Number.NaN,
      }),
    ).toEqual({
      item: "menu",
    });
  });
});

describe("recordHomepageCtaClicked", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("emits homepage_cta_clicked with a cta property", () => {
    const { recordHomepageCtaClicked } = jest.requireActual("./analytics");

    recordHomepageCtaClicked("view_menu");

    expect(captureBrowserPostHogEvent).toHaveBeenCalledWith(
      "homepage_cta_clicked",
      { cta: "view_menu" },
    );
  });
});

describe("recordSecondaryEngagement", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("emits only allowed secondary engagement events", () => {
    const { recordSecondaryEngagement } = jest.requireActual("./analytics");

    recordSecondaryEngagement("navigation_clicked", { item: "menu" });

    expect(captureBrowserPostHogEvent).toHaveBeenCalledWith(
      "navigation_clicked",
      { item: "menu" },
    );
  });
});

describe("getAnalyticsVisitorId", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns PostHog anonymous distinct ID when available", () => {
    const { getAnalyticsVisitorId } = jest.requireActual("./analytics");
    getBrowserPostHogDistinctId.mockReturnValue("visitor_123");

    expect(getAnalyticsVisitorId()).toBe("visitor_123");
  });
});
