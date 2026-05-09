import {
  resolveSentryBrowserRelease,
  resolveSentryServerRelease,
  sentryReleaseOption,
} from "./sentry-release";

describe("resolveSentryServerRelease", () => {
  it("prefers an explicit Sentry release over the Vercel deployment commit", () => {
    expect(
      resolveSentryServerRelease({
        SENTRY_RELEASE: "release_123",
        VERCEL_GIT_COMMIT_SHA: "commit_123",
      }),
    ).toBe("release_123");
  });

  it("falls back to the Vercel deployment commit", () => {
    expect(
      resolveSentryServerRelease({
        VERCEL_GIT_COMMIT_SHA: "commit_123",
      }),
    ).toBe("commit_123");
  });
});

describe("resolveSentryBrowserRelease", () => {
  it("prefers the client-safe release value", () => {
    expect(
      resolveSentryBrowserRelease({
        NEXT_PUBLIC_SENTRY_RELEASE: "public_release_123",
        SENTRY_RELEASE: "release_123",
        VERCEL_GIT_COMMIT_SHA: "commit_123",
      }),
    ).toBe("public_release_123");
  });

  it("keeps server release fallbacks for build-time injection environments", () => {
    expect(
      resolveSentryBrowserRelease({
        VERCEL_GIT_COMMIT_SHA: "commit_123",
      }),
    ).toBe("commit_123");
  });
});

describe("sentryReleaseOption", () => {
  it("omits release when no release is configured", () => {
    expect(sentryReleaseOption(undefined)).toEqual({});
  });

  it("returns the Sentry init release option when a release is configured", () => {
    expect(sentryReleaseOption("release_123")).toEqual({
      release: "release_123",
    });
  });
});
