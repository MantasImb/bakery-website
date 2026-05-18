type SafeScalar = string | number | boolean;
type ProductQuantities = Record<string, number>;

const SAFE_CONTEXT_KEYS = [
  "orderId",
  "checkoutId",
  "paymentId",
  "weeklyMenuId",
  "productId",
  "pickupSlotId",
  "reservationId",
  "notificationId",
  "stripeSessionId",
  "stripePaymentIntentId",
  "stripeCustomerId",
  "stripeWebhookEventId",
  "stripeRefundId",
  "paymentState",
  "fulfillmentState",
  "weeklyMenuState",
  "locale",
  "route",
  "runtime",
  "environment",
  "release",
  "featureFlag",
  "configName",
] as const;

type SafeContextKey = (typeof SAFE_CONTEXT_KEYS)[number];

const SAFE_CONTEXT_KEY_SET: ReadonlySet<string> = new Set(SAFE_CONTEXT_KEYS);

export type SentryContext = Partial<Record<SafeContextKey, SafeScalar>> & {
  productQuantities?: ProductQuantities;
};

export type SanitizedSentryContext = SentryContext;

export function sanitizeSentryContext(
  context?: Record<string, unknown>,
): SanitizedSentryContext {
  if (!context) {
    return {};
  }

  const sanitized: SanitizedSentryContext = {};

  for (const [key, value] of Object.entries(context)) {
    if (key === "productQuantities") {
      const productQuantities = sanitizeProductQuantities(value);

      if (Object.keys(productQuantities).length > 0) {
        sanitized.productQuantities = productQuantities;
      }

      continue;
    }

    if (!isSafeContextKey(key)) {
      continue;
    }

    if (isSafeScalar(value)) {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

function isSafeScalar(value: unknown): value is SafeScalar {
  return (
    typeof value === "string" ||
    (typeof value === "number" && Number.isFinite(value)) ||
    typeof value === "boolean"
  );
}

function isSafeContextKey(key: string): key is SafeContextKey {
  return SAFE_CONTEXT_KEY_SET.has(key);
}

function sanitizeProductQuantities(value: unknown): ProductQuantities {
  if (!isPlainRecord(value)) {
    return {};
  }

  const productQuantities: ProductQuantities = {};

  for (const [productId, quantity] of Object.entries(value)) {
    if (typeof quantity === "number" && Number.isFinite(quantity)) {
      productQuantities[productId] = quantity;
    }
  }

  return productQuantities;
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
