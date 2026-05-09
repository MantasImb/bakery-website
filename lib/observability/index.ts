import * as Sentry from "@sentry/nextjs";

type SafeScalar = string | number | boolean;
type ProductQuantities = Record<string, number>;

// Sentry events should carry join keys and workflow state, not customer data or
// full provider payloads. New context fields should be added here only when
// they are useful for debugging and allowed by docs/sentry.md.
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

// This is the shape normal application code should pass into the wrapper.
// Keeping it typed gives callers a nudge toward safe context before runtime
// sanitization runs.
export type ObservabilityContext = Partial<
  Record<SafeContextKey, SafeScalar>
> & {
  productQuantities?: ProductQuantities;
};

// This names the post-sanitizer result separately from caller input. It matches
// ObservabilityContext today, but can diverge if sanitization output changes.
export type SanitizedObservabilityContext = ObservabilityContext;

// Boundary code can receive broad runtime data from requests, forms, SDKs, or
// errors. This function narrows that data to the tiny subset we are willing to
// send to Sentry.
export function sanitizeObservabilityContext(
  context?: Record<string, unknown>,
): SanitizedObservabilityContext {
  if (!context) {
    return {};
  }

  const sanitized: SanitizedObservabilityContext = {};

  for (const [key, value] of Object.entries(context)) {
    // Product quantities are the one intentionally nested context shape because
    // stock issues often need product IDs and counts. Full cart/order objects
    // remain disallowed.
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

export function captureException(
  error: unknown,
  context?: ObservabilityContext,
): string {
  const sanitizedContext = sanitizeObservabilityContext(context);

  // withScope keeps this context attached only to this one Sentry event, so a
  // later error in the same request or browser session does not accidentally
  // inherit stale checkout/order state.
  return Sentry.withScope((scope) => {
    setObservabilityContext(scope, sanitizedContext);
    return Sentry.captureException(error);
  });
}

export function captureMessage(
  message: string,
  context?: ObservabilityContext,
): string {
  const sanitizedContext = sanitizeObservabilityContext(context);

  // Messages are for notable diagnostics that are not thrown exceptions. They
  // still go through the same context sanitizer.
  return Sentry.withScope((scope) => {
    setObservabilityContext(scope, sanitizedContext);
    return Sentry.captureMessage(message);
  });
}

function isSafeScalar(value: unknown): value is SafeScalar {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
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
    // Drop NaN, Infinity, strings, arrays, and nested objects. Sentry context
    // should stay compact and predictable.
    if (typeof quantity === "number" && Number.isFinite(quantity)) {
      productQuantities[productId] = quantity;
    }
  }

  return productQuantities;
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function setObservabilityContext(
  scope: Sentry.Scope,
  context: SanitizedObservabilityContext,
): void {
  if (Object.keys(context).length === 0) {
    return;
  }

  // Sentry contexts are structured key/value sections shown with an event.
  // Using one project-owned section avoids scattering custom fields across the
  // event payload.
  scope.setContext("observability", context);
}
