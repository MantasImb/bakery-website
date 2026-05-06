import * as Sentry from "@sentry/nextjs";

export async function register() {
  // Next calls this hook for each server runtime. Importing inside the branch
  // keeps Node-only and Edge-only Sentry setup out of the wrong runtime bundle.
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Next invokes this hook for request-time server failures. Sentry records the
// unexpected error, while project code still controls any additional safe
// workflow context through /lib/observability/.
export const onRequestError = Sentry.captureRequestError;
