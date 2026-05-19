export function isBrowserAnalyticsEnabled(): boolean {
  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

  return Boolean(token && token.trim());
}

export function isServerAnalyticsEnabled(): boolean {
  const projectApiKey = process.env.POSTHOG_PROJECT_API_KEY;

  return Boolean(projectApiKey && projectApiKey.trim());
}

export function browserPostHogProjectToken(): string | undefined {
  return process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
}

export function serverPostHogProjectApiKey(): string | undefined {
  return process.env.POSTHOG_PROJECT_API_KEY;
}
