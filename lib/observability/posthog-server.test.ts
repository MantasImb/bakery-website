/**
 * @jest-environment node
 */

import { PostHog } from "posthog-node";
import { captureServerPostHogEvent } from "./posthog-server";

jest.mock("posthog-node", () => ({
  PostHog: jest.fn().mockImplementation(() => ({
    capture: jest.fn(),
  })),
}));

const originalProjectApiKey = process.env.POSTHOG_PROJECT_API_KEY;
const originalPostHogHost = process.env.POSTHOG_HOST;

describe("captureServerPostHogEvent", () => {
  afterEach(() => {
    if (originalProjectApiKey === undefined) {
      delete process.env.POSTHOG_PROJECT_API_KEY;
    } else {
      process.env.POSTHOG_PROJECT_API_KEY = originalProjectApiKey;
    }

    if (originalPostHogHost === undefined) {
      delete process.env.POSTHOG_HOST;
    } else {
      process.env.POSTHOG_HOST = originalPostHogHost;
    }

    jest.clearAllMocks();
  });

  it("skips capture when server analytics is disabled", () => {
    delete process.env.POSTHOG_PROJECT_API_KEY;

    captureServerPostHogEvent({
      eventName: "checkout_reservation_expired",
      analyticsVisitorId: "visitor_123",
      properties: { checkoutReservationId: "reservation_123" },
    });

    expect(PostHog).not.toHaveBeenCalled();
  });

  it("suppresses person profile creation for anonymous visitor events", () => {
    process.env.POSTHOG_PROJECT_API_KEY = "server-key";
    process.env.POSTHOG_HOST = "https://eu.posthog.com";

    captureServerPostHogEvent({
      eventName: "checkout_reservation_expired",
      analyticsVisitorId: "visitor_123",
      properties: { checkoutReservationId: "reservation_123" },
    });

    expect(PostHog).toHaveBeenCalledWith("server-key", {
      host: "https://eu.posthog.com",
      disableGeoip: true,
    });
    expect(jest.mocked(PostHog).mock.results[0].value.capture).toHaveBeenCalledWith({
      distinctId: "visitor_123",
      event: "checkout_reservation_expired",
      properties: {
        checkoutReservationId: "reservation_123",
        $process_person_profile: false,
      },
    });
  });

  it("keeps safe scalar properties and removes disallowed properties", () => {
    process.env.POSTHOG_PROJECT_API_KEY = "server-key";

    captureServerPostHogEvent({
      eventName: "payment_succeeded",
      analyticsVisitorId: "visitor_123",
      properties: {
        orderId: "order_123",
        orderTotalMinor: 2500,
        email: "customer@example.com",
        rawRequestBody: "payload",
        invalidCount: Number.NaN,
      },
    });

    expect(jest.mocked(PostHog).mock.results[0].value.capture).toHaveBeenCalledWith({
      distinctId: "visitor_123",
      event: "payment_succeeded",
      properties: {
        orderId: "order_123",
        orderTotalMinor: 2500,
        $process_person_profile: false,
      },
    });
  });
});
