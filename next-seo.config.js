/** @type {import('next-seo').DefaultSeoProps} */
/** @type {import('next-seo').OpenGraph} */
/** @type {import('next-seo').Twitter} */

const description = 'Explore, deploy, interact, and organize CosmWasm contracts with ease using Celatone. Our tool makes it easy to interact with smart contracts on various networks.'

const defaultSEOConfig = {
  title: undefined,
  titleTemplate: "%s – Celatone ",
  defaultTitle: "Celatone",
  description: description,
  openGraph: {
    type: "website",
    description: description,
    images: [
      {
        url: "https://assets.alleslabs.dev/branding/banners/celatone-cover.jpg",
        width: 1200,
        height: 630,
        alt: "Celatone, simplify your smart contract experience",
      },
    ],
  },
  twitter: {
    handle: "@celatone_",
    cardType: "summary_large_image",
  },
};

export default defaultSEOConfig;
