const isMainnet = process.env.NEXT_PUBLIC_SUPPORTED_NETWORK_TYPES === "mainnet";

/** @type {import('next-sitemap').IConfig} */
const NextSitemapConfig = {
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: isMainnet
      ? [{ allow: "/", userAgent: "*" }]
      : [{ disallow: "/", userAgent: "Googlebot" }],
  },
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};

module.exports = NextSitemapConfig;
