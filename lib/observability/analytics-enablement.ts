export function isBrowserAnalyticsEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN);
}

export function isServerAnalyticsEnabled(): boolean {
  return Boolean(process.env.POSTHOG_PROJECT_API_KEY);
}

export function browserPostHogProjectToken(): string | undefined {
  return process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
}

export function serverPostHogProjectApiKey(): string | undefined {
  return process.env.POSTHOG_PROJECT_API_KEY;
}
