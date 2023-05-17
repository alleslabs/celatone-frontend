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
    return [
      {
        source: "/:network/account/:address",
        destination: "/:network/accounts/:address",
        permanent: false,
      },
      {
        source: "/:network/tx/:txHash",
        destination: "/:network/txs/:txHash",
        permanent: false,
      },
      {
        source: "/:network/block/:height",
        destination: "/:network/blocks/:height",
        permanent: false,
      },
      {
        source: "/:network/code/:codeId",
        destination: "/:network/codes/:codeId",
        permanent: false,
      },
      {
        source: "/:network/contract/:address",
        destination: "/:network/contracts/:address",
        permanent: false,
      },
      {
        source: "/:network/public-project/:slug",
        destination: "/:network/public-projects/:slug",
        permanent: false,
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
