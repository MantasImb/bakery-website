import { captureException } from "@/lib/observability";

export const runtime = "nodejs";

export async function GET() {
  if (process.env.SENTRY_DEV_SMOKE_ENABLED !== "true") {
    return Response.json({ status: "disabled" }, { status: 404 });
  }

  // This route intentionally creates a controlled exception so a developer can
  // verify the Sentry pipeline without depending on a real user workflow.
  const eventId = captureException(
    new Error("Sentry developer smoke test"),
    {
      route: "/api/dev/sentry-smoke",
      runtime,
      featureFlag: "SENTRY_DEV_SMOKE_ENABLED",
      configName: "sentry-smoke",
    },
  );

  return Response.json({ status: "captured", eventId }, { status: 202 });
}
