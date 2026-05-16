import { sanitizeAnalyticsProperties } from "./analytics";

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
