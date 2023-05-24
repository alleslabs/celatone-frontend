import { CURR_THEME, SELECTED_CHAIN } from "env";

const APP_NAME = CURR_THEME.branding.seo.appName;
const FALLBACK_DESC = "A smart contract powered explorer for the Cosmos.";
const FALLBACK_IMG = "https://assets.alleslabs.dev/branding/celatone-cover.jpg";

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
      <meta name="theme-color" content={CURR_THEME.colors.background.main} />
      <title>{`${title} Explorer | ${CURR_THEME.branding.seo.title}`}</title>
      <meta
        name="description"
        content={CURR_THEME.branding.seo.description ?? FALLBACK_DESC}
      />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta
        property="og:title"
        content={`${title} Explorer | ${CURR_THEME.branding.seo.title}`}
      />
      <meta
        property="og:description"
        content={CURR_THEME.branding.seo.description ?? FALLBACK_DESC}
      />
      <meta
        property="og:image"
        content={CURR_THEME.branding.seo.image ?? FALLBACK_IMG}
      />

      {/* Twitter */}
      <meta
        property="twitter:card"
        content={
          CURR_THEME.branding.seo.twitter.cardType ?? "summary_large_image"
        }
      />
      <meta
        property="twitter:title"
        content={`${title} Explorer | ${CURR_THEME.branding.seo.title}`}
      />
      <meta
        property="twitter:description"
        content={CURR_THEME.branding.seo.description ?? FALLBACK_DESC}
      />
      <meta
        property="twitter:image"
        content={CURR_THEME.branding.seo.image ?? FALLBACK_IMG}
      />
    </>
  );
};

export default Meta;
