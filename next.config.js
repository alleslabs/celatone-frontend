const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  reactStrictMode: true,
  eslint: {
    dirs: ["src"],
  },
  async rewrites() {
    return [
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
  },
};

module.exports = withSentryConfig(moduleExports);
