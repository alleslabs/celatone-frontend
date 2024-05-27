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
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        __SENTRY_DEBUG__: false,
      })
    );

    return config;
  },
  async rewrites() {
    return [
      {
        source: "/sentry/:path*",
        // https://abcdefghijklmnopqrstquwxyzabcdef@o123456.ingest.sentry.io/1234567
        destination: `https://${SENTRY_DSN.split("@")[1].split("/")[0]}/:path*`,
      },
      {
        source: "/amplitude",
        destination: `https://api2.amplitude.com/2/httpapi`,
      },
    ];
  },
  async redirects() {
    const routes = [
      "account",
      "block",
      "code",
      "contract",
      "contract-list",
      "module",
      "nft-collection",
      "proposal",
      "project",
      "past-tx",
      "pool",
      "tx",
    ];

    const rules = routes.reduce((acc, route) => {
      acc.push({
        source: `/:network/${route}/:id`,
        destination: `/:network/${route}s/:id`,
        permanent: false,
      });

      acc.push({
        source: `/${route}/:id`,
        destination: `/${route}s/:id`,
        permanent: false,
      });

      acc.push({
        source: `/:network/${route}`,
        destination: `/:network/${route}s`,
        permanent: false,
      });

      acc.push({
        source: `/${route}`,
        destination: `/${route}s`,
        permanent: false,
      });

      return acc;
    }, []);

    rules.push({
      source: "/:network/accounts/usei",
      destination: "/:network",
      permanent: false,
    });

    return rules;
  },
};

const moduleExports = {
  ...nextConfig,
  sentry: {
    hideSourceMaps: true,
    tunnelRoute: "/sentry",
  },
};

module.exports = withSentryConfig(moduleExports, {
  dryRun: process.env.VERCEL_ENV !== "production",
});
