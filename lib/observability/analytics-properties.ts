export type AnalyticsScalar = string | number | boolean;

export type AnalyticsProperties = Record<
  string,
  AnalyticsScalar | null | undefined
>;

const DISALLOWED_ANALYTICS_KEYS = new Set([
  "apikey",
  "authorization",
  "cart",
  "cookies",
  "customername",
  "customernotes",
  "email",
  "formdata",
  "fullorder",
  "order",
  "phone",
  "rawrequestbody",
  "stripepayload",
]);

export function sanitizeAnalyticsProperties(
  properties?: AnalyticsProperties,
): Record<string, AnalyticsScalar> | undefined {
  if (!properties) {
    return undefined;
  }

  const sanitized: Record<string, AnalyticsScalar> = {};

  for (const [key, value] of Object.entries(properties)) {
    if (
      DISALLOWED_ANALYTICS_KEYS.has(normalizeAnalyticsKey(key)) ||
      value == null
    ) {
      continue;
    }

    if (isAnalyticsScalar(value)) {
      sanitized[key] = value;
    }
  }

  return Object.keys(sanitized).length > 0 ? sanitized : undefined;
}

function normalizeAnalyticsKey(key: string): string {
  return key.replace(/[^a-z0-9]/gi, "").toLowerCase();
}

function isAnalyticsScalar(value: unknown): value is AnalyticsScalar {
  return (
    typeof value === "string" ||
    typeof value === "boolean" ||
    (typeof value === "number" && Number.isFinite(value))
  );
}
