This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Variables

Copy `.env.example` to `.env.local` for local development and fill in only the values needed for the feature you are working on.

Sentry error monitoring uses these variables:

- `SENTRY_DSN`: Server and edge runtime Sentry DSN.
- `NEXT_PUBLIC_SENTRY_DSN`: Browser Sentry DSN exposed to the client bundle.
- `SENTRY_ENVIRONMENT`: Sentry environment label, such as `development`, `preview`, or `production`.
- `NEXT_PUBLIC_SENTRY_ENVIRONMENT`: Browser Sentry environment label. Use the same value as `SENTRY_ENVIRONMENT`.
- `SENTRY_RELEASE`: Stable release identifier, usually the deployment git SHA.
- `SENTRY_AUTH_TOKEN`: CI/deployment token for source-map upload only.
- `SENTRY_ORG`: Sentry organization slug for source-map upload.
- `SENTRY_PROJECT`: Sentry project slug for source-map upload.
- `SENTRY_DEV_SMOKE_ENABLED`: Explicit opt-in for developer smoke routes outside normal local development.
- `SENTRY_DEV_SMOKE_TOKEN`: Secret token required to call the developer smoke route when enabled.

Vercel Preview and Production builds require `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`,
`SENTRY_PROJECT`, and either `SENTRY_RELEASE` or Vercel's
`VERCEL_GIT_COMMIT_SHA` system environment variable so source-map upload cannot
be skipped accidentally.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
