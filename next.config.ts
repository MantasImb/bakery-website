import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,

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
