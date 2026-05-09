/**
 * @jest-environment node
 */

import { GET } from "./route";
import { captureException } from "@/lib/observability";

jest.mock("@/lib/observability", () => ({
  captureException: jest.fn(() => "event-id-123"),
}));

const originalSmokeEnabled = process.env.SENTRY_DEV_SMOKE_ENABLED;
const originalSmokeToken = process.env.SENTRY_DEV_SMOKE_TOKEN;
const callGet = GET as (request: Request) => ReturnType<typeof GET>;

describe("GET /api/dev/sentry-smoke", () => {
  afterEach(() => {
    if (originalSmokeEnabled === undefined) {
      delete process.env.SENTRY_DEV_SMOKE_ENABLED;
    } else {
      process.env.SENTRY_DEV_SMOKE_ENABLED = originalSmokeEnabled;
    }

    if (originalSmokeToken === undefined) {
      delete process.env.SENTRY_DEV_SMOKE_TOKEN;
    } else {
      process.env.SENTRY_DEV_SMOKE_TOKEN = originalSmokeToken;
    }

    jest.clearAllMocks();
  });

  it("returns 404 and does not report when the smoke route is not explicitly enabled", async () => {
    delete process.env.SENTRY_DEV_SMOKE_ENABLED;

    const response = await callGet(new Request("http://localhost/api/dev/sentry-smoke"));

    await expect(response.json()).resolves.toEqual({ status: "disabled" });
    expect(response.status).toBe(404);
    expect(captureException).not.toHaveBeenCalled();
  });

  it("returns 403 and does not report when the smoke token is missing", async () => {
    process.env.SENTRY_DEV_SMOKE_ENABLED = "true";
    process.env.SENTRY_DEV_SMOKE_TOKEN = "secret-token";

    const response = await callGet(new Request("http://localhost/api/dev/sentry-smoke"));

    await expect(response.json()).resolves.toEqual({ status: "forbidden" });
    expect(response.status).toBe(403);
    expect(captureException).not.toHaveBeenCalled();
  });

  it("captures one controlled exception when explicitly enabled and authorized", async () => {
    process.env.SENTRY_DEV_SMOKE_ENABLED = "true";
    process.env.SENTRY_DEV_SMOKE_TOKEN = "secret-token";

    const response = await callGet(
      new Request("http://localhost/api/dev/sentry-smoke", {
        headers: { "x-smoke-token": "secret-token" },
      }),
    );

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
