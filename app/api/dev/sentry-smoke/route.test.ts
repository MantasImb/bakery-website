/**
 * @jest-environment node
 */

import { GET } from "./route";
import { captureException } from "@/lib/observability";

jest.mock("@/lib/observability", () => ({
  captureException: jest.fn(() => "event-id-123"),
}));

const originalSmokeEnabled = process.env.SENTRY_DEV_SMOKE_ENABLED;

describe("GET /api/dev/sentry-smoke", () => {
  afterEach(() => {
    process.env.SENTRY_DEV_SMOKE_ENABLED = originalSmokeEnabled;
    jest.clearAllMocks();
  });

  it("returns 404 and does not report when the smoke route is not explicitly enabled", async () => {
    delete process.env.SENTRY_DEV_SMOKE_ENABLED;

    const response = await GET();

    await expect(response.json()).resolves.toEqual({ status: "disabled" });
    expect(response.status).toBe(404);
    expect(captureException).not.toHaveBeenCalled();
  });

  it("captures one controlled exception when explicitly enabled", async () => {
    process.env.SENTRY_DEV_SMOKE_ENABLED = "true";

    const response = await GET();

    await expect(response.json()).resolves.toEqual({
      status: "captured",
      eventId: "event-id-123",
    });
    expect(response.status).toBe(202);
    expect(captureException).toHaveBeenCalledWith(expect.any(Error), {
      route: "/api/dev/sentry-smoke",
      runtime: "nodejs",
      featureFlag: "SENTRY_DEV_SMOKE_ENABLED",
      configName: "sentry-smoke",
    });
  });
});
