const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const SENTRY_DSN =
  process.env.NEXT_PUBLIC_SENTRY_DSN ??
  "https://examplePublicKey@o0.ingest.sentry.io/0";

const nextConfig = {
  swcMinify: true,
  reactStrictMode: true,
  eslint: {
    dirs: ["src"],
  },
  async rewrites() {
    return [
      {
        source: "/sentry/:path*",
        // https://abcdefghijklmnopqrstquwxyzabcdef@o123456.ingest.sentry.io/1234567
        destination: `https://${SENTRY_DSN.split("@")[1].split("/")[0]}/:path*`,
      },
      {
        source: "/amplitude/:path*",
        destination: `https://api2.amplitude.com/2/httpapi/:path*`,
      },
    ];
  },
};

const moduleExports = {
  ...nextConfig,

  sentry: {
    hideSourceMaps: true,
    tunnelRoute: "/sentry",
  },
};

module.exports = withSentryConfig(moduleExports);
