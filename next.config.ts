import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from "next-intl/plugin";
import {
  resolveSentryServerRelease,
  sentryReleaseOption,
} from "./lib/observability/sentry-release";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://eu-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/array/:path*",
        destination: "https://eu-assets.i.posthog.com/array/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://eu.i.posthog.com/:path*",
      },
    ];
  },
  skipTrailingSlashRedirect: true,
};

function requireSentrySourceMapConfigForVercelBuild() {
  const missingSentrySourceMapConfig = [
    "SENTRY_AUTH_TOKEN",
    "SENTRY_ORG",
    "SENTRY_PROJECT",
  ].filter((key) => !process.env[key]);

  if (!process.env.SENTRY_RELEASE && !process.env.VERCEL_GIT_COMMIT_SHA) {
    missingSentrySourceMapConfig.push("SENTRY_RELEASE or VERCEL_GIT_COMMIT_SHA");
  }

  if (missingSentrySourceMapConfig.length > 0) {
    throw new Error(
      `Missing Sentry source-map upload configuration for Vercel ${process.env.VERCEL_ENV} build: ${missingSentrySourceMapConfig.join(", ")}`,
    );
  }
}

function createNextConfig(phase: string) {
  const vercelEnvironment = process.env.VERCEL_ENV;
  const shouldRequireSentrySourceMaps =
    phase === PHASE_PRODUCTION_BUILD &&
    (vercelEnvironment === "preview" || vercelEnvironment === "production");

  if (shouldRequireSentrySourceMaps) {
    requireSentrySourceMapConfigForVercelBuild();
  }

  const sentryRelease = resolveSentryServerRelease();

  return withSentryConfig(withNextIntl(nextConfig), {
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    authToken: process.env.SENTRY_AUTH_TOKEN,
    ...sentryReleaseOption(sentryRelease),

    // Keep local builds quiet, but show upload details in CI where source-map
    // configuration is expected to be intentional.
    silent: !process.env.CI,

    // Do not send Sentry build-plugin telemetry for this project.
    telemetry: false,

    // Runtime capture works without source maps. Uploads are a deployment/CI
    // concern and need SENTRY_AUTH_TOKEN plus org/project secrets.
    sourcemaps: {
      disable: !process.env.SENTRY_AUTH_TOKEN,
    },

    webpack: {
      treeshake: {
        removeDebugLogging: true,
        removeTracing: true,
      },
    },
  });
}

export default createNextConfig;
