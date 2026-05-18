import * as Sentry from "@sentry/nextjs";
import {
  sanitizeSentryContext,
  type SanitizedSentryContext,
  type SentryContext,
} from "./sentry-context";

export type ObservabilityContext = SentryContext;
export type SanitizedObservabilityContext = SanitizedSentryContext;

export const sanitizeObservabilityContext = sanitizeSentryContext;

export function captureException(
  error: unknown,
  context?: ObservabilityContext,
): string {
  const sanitizedContext = sanitizeSentryContext(context);

  return Sentry.withScope((scope) => {
    setObservabilityContext(scope, sanitizedContext);
    return Sentry.captureException(error);
  });
}

export function captureMessage(
  message: string,
  context?: ObservabilityContext,
): string {
  const sanitizedContext = sanitizeSentryContext(context);

  return Sentry.withScope((scope) => {
    setObservabilityContext(scope, sanitizedContext);
    return Sentry.captureMessage(message);
  });
}

function setObservabilityContext(
  scope: Sentry.Scope,
  context: SanitizedObservabilityContext,
): void {
  if (Object.keys(context).length === 0) {
    return;
  }

  scope.setContext("observability", context);
}
