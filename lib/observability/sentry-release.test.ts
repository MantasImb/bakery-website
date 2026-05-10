import {
  resolveSentryServerRelease,
  sentryReleaseOption,
  sentryRuntimeReleaseOption,
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

describe("sentryReleaseOption", () => {
  it("omits release when no release is configured", () => {
    expect(sentryReleaseOption(undefined)).toEqual({});
  });

  it("returns the Sentry build release option when a release is configured", () => {
    expect(sentryReleaseOption("release_123")).toEqual({
      release: {
        name: "release_123",
      },
    });
  });
});

describe("sentryRuntimeReleaseOption", () => {
  it("omits release when no release is configured", () => {
    expect(sentryRuntimeReleaseOption(undefined)).toEqual({});
  });

  it("returns the Sentry runtime release option when a release is configured", () => {
    expect(sentryRuntimeReleaseOption("release_123")).toEqual({
      release: "release_123",
    });
  });
});
