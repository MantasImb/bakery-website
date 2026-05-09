import { captureException } from "@/lib/observability";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (process.env.SENTRY_DEV_SMOKE_ENABLED !== "true") {
    return Response.json({ status: "disabled" }, { status: 404 });
  }

  const smokeToken = process.env.SENTRY_DEV_SMOKE_TOKEN;
  const requestToken =
    request.headers.get("x-smoke-token") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!smokeToken || requestToken !== smokeToken) {
    return Response.json({ status: "forbidden" }, { status: 403 });
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
