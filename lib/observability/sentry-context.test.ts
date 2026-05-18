import { sanitizeSentryContext } from "./sentry-context";

describe("sanitizeSentryContext", () => {
  it("keeps safe operational IDs and workflow state", () => {
    const sanitized = sanitizeSentryContext({
      orderId: "order_123",
      checkoutId: "checkout_123",
      productId: 123,
      stripePaymentIntentId: "pi_123",
      paymentState: "pending_payment",
      fulfillmentState: "paid",
      locale: "nb",
      route: "/checkout",
      runtime: "nodejs",
      reservationId: Number.NaN,
      notificationId: Number.POSITIVE_INFINITY,
    });

    expect(sanitized).toEqual({
      orderId: "order_123",
      checkoutId: "checkout_123",
      productId: 123,
      stripePaymentIntentId: "pi_123",
      paymentState: "pending_payment",
      fulfillmentState: "paid",
      locale: "nb",
      route: "/checkout",
      runtime: "nodejs",
    });
  });

  it("removes customer contact fields secrets raw payloads and nested records", () => {
    const sanitized = sanitizeSentryContext({
      orderId: "order_123",
      customerName: "Ada Lovelace",
      email: "ada@example.com",
      phone: "+47 123 45 678",
      customerNotes: "Leave at the door",
      rawRequestBody: { email: "ada@example.com" },
      formData: { customerName: "Ada Lovelace" },
      cookies: "session=secret",
      authorization: "Bearer secret",
      apiKey: "secret",
      stripePayload: { id: "evt_123", data: { object: { email: "ada@example.com" } } },
      fullOrder: { id: "order_123", email: "ada@example.com" },
    });

    expect(sanitized).toEqual({
      orderId: "order_123",
    });
  });

  it("keeps compact product quantities without keeping full cart objects", () => {
    const sanitized = sanitizeSentryContext({
      checkoutId: "checkout_123",
      productQuantities: {
        product_123: 2,
        product_456: 1,
        product_invalid: Number.NaN,
      },
      cart: {
        items: [
          { productId: "product_123", customerNote: "birthday order" },
        ],
      },
    });

    expect(sanitized).toEqual({
      checkoutId: "checkout_123",
      productQuantities: {
        product_123: 2,
        product_456: 1,
      },
    });
  });
});
