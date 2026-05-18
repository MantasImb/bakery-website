import { sanitizeObservabilityContext } from "./index";

describe("observability facade", () => {
  it("keeps the Sentry context sanitizer available through the public facade", () => {
    expect(
      sanitizeObservabilityContext({
        orderId: "order_123",
        email: "customer@example.com",
      }),
    ).toEqual({
      orderId: "order_123",
    });
  });
});
