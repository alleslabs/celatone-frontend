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
      {
        source: "/docker/image/:path*",
        destination: `https://hub.docker.com/v2/namespaces/:path*`,
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

    rules.push({
      source: "/address/:accountAddress",
      destination: "/accounts/:accountAddress",
      permanent: false,
    });

    rules.push({
      source: "/:network/address/:accountAddress",
      destination: "/:network/accounts/:accountAddress",
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
  dryRun: true,
});
