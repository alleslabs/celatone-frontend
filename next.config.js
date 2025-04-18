/* eslint-disable @typescript-eslint/no-require-imports */
const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const SENTRY_DSN =
  process.env.NEXT_PUBLIC_SENTRY_DSN ??
  "https://examplePublicKey@o0.ingest.sentry.io/0";

const nextConfig = {
  eslint: {
    dirs: ["src"],
  },
  images: {
    domains: [
      "raw.githubusercontent.com",
      "i.ibb.co",
      "pbs.twimg.com",
      "github.com",
      "app.osmosis.zone",
      "imagedelivery.net",
      "list.initia.tech",
    ],
  },
  reactStrictMode: true,
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
        destination: `/:network/${route}s/:id`,
        permanent: false,
        source: `/:network/${route}/:id`,
      });

      acc.push({
        destination: `/${route}s/:id`,
        permanent: false,
        source: `/${route}/:id`,
      });

      acc.push({
        destination: `/:network/${route}s`,
        permanent: false,
        source: `/:network/${route}`,
      });

      acc.push({
        destination: `/${route}s`,
        permanent: false,
        source: `/${route}`,
      });

      return acc;
    }, []);

    rules.push({
      destination: "/:network",
      permanent: false,
      source: "/:network/accounts/usei",
    });

    rules.push({
      destination: "/accounts/:accountAddress",
      permanent: false,
      source: "/address/:accountAddress",
    });

    rules.push({
      destination: "/:network/accounts/:accountAddress",
      permanent: false,
      source: "/:network/address/:accountAddress",
    });

    return rules;
  },
  async rewrites() {
    return [
      {
        // https://abcdefghijklmnopqrstquwxyzabcdef@o123456.ingest.sentry.io/1234567
        destination: `https://${SENTRY_DSN.split("@")[1].split("/")[0]}/:path*`,
        source: "/sentry/:path*",
      },
      {
        destination: `https://api2.amplitude.com/2/httpapi`,
        source: "/amplitude",
      },
      {
        destination: `https://hub.docker.com/v2/namespaces/:path*`,
        source: "/docker/image/:path*",
      },
    ];
  },
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        __SENTRY_DEBUG__: false,
      })
    );

    return config;
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
  dryRun: true,
});
