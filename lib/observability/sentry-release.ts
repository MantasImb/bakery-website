type Environment = Partial<NodeJS.ProcessEnv>;

function firstConfiguredValue(...values: Array<string | undefined>) {
  return values.find((value) => value && value.trim().length > 0);
}

export function resolveSentryServerRelease(env: Environment = process.env) {
  return firstConfiguredValue(env.SENTRY_RELEASE, env.VERCEL_GIT_COMMIT_SHA);
}

export function sentryReleaseOption(release: string | undefined) {
  return release ? { release: { name: release } } : {};
}

export function sentryRuntimeReleaseOption(release: string | undefined) {
  return release ? { release } : {};
}
