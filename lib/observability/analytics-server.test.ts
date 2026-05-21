/**
 * @jest-environment node
 */

import { captureServerPostHogEvent } from "./posthog-server";
import { recordServerAnalyticsEvent } from "./analytics-server";

jest.mock("./posthog-server", () => ({
  captureServerPostHogEvent: jest.fn(),
}));

describe("recordServerAnalyticsEvent", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("allows server events without an analytics visitor ID", () => {
    recordServerAnalyticsEvent("checkout_reservation_expired", {
      checkoutReservationId: "reservation_123",
      weeklyMenuId: "weekly_menu_123",
    });

    expect(captureServerPostHogEvent).toHaveBeenCalledWith({
      eventName: "checkout_reservation_expired",
      properties: {
        checkoutReservationId: "reservation_123",
        weeklyMenuId: "weekly_menu_123",
      },
    });
  });

  it("passes an optional analytics visitor ID for funnel continuity", () => {
    recordServerAnalyticsEvent(
      "payment_succeeded",
      { orderId: "order_123" },
      { analyticsVisitorId: "visitor_123" },
    );

    expect(captureServerPostHogEvent).toHaveBeenCalledWith({
      eventName: "payment_succeeded",
      analyticsVisitorId: "visitor_123",
      properties: { orderId: "order_123" },
    });
  });
});
