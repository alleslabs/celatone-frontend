import { SELECTED_CHAIN } from "env";

const APP_NAME = "celatone";

const Meta = () => {
  const chainName = SELECTED_CHAIN || "";
  const title = `${chainName.charAt(0).toUpperCase() + chainName.slice(1)}`;
  return (
    <>
      <meta name="application-name" content={APP_NAME} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={APP_NAME} />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="theme-color" content="#FFFFFF" />
      <title>{`${title} Explorer | Celatone`}</title>
      <meta
        name="description"
        content="A smart contract powered explorer for the Cosmos."
      />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Celatone Explorer" />
      <meta
        property="og:description"
        content="A smart contract powered explorer for the Cosmos."
      />
      <meta
        property="og:image"
        content="https://assets.alleslabs.dev/branding/banners/celatone-cover.jpg"
      />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content="Celatone Explorer" />
      <meta
        property="twitter:description"
        content="A smart contract powered explorer for the Cosmos."
      />
      <meta
        property="twitter:image"
        content="https://assets.alleslabs.dev/branding/banners/celatone-cover.jpg"
      />
    </>
  );
};

export default Meta;
