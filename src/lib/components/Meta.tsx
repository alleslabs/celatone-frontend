import { capitalize } from "lodash";

import { FALLBACK_THEME } from "config/theme";
import { FALLBACK_CHAIN } from "env";

const Meta = () => {
  const APP_NAME = FALLBACK_THEME.branding.seo.appName;
  const title = `${capitalize(FALLBACK_CHAIN)} Explorer | ${FALLBACK_THEME.branding.seo.title}`;
  return (
    <>
      <meta name="application-name" content={APP_NAME} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={APP_NAME} />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta
        name="theme-color"
        content={FALLBACK_THEME.colors.background.main}
      />
      <title>{title}</title>
      <meta
        name="description"
        content={FALLBACK_THEME.branding.seo.description}
      />

      {/* Open Graph / Facebook */}
      <meta content="website" property="og:type" />
      <meta content={title} property="og:title" />
      <meta
        content={FALLBACK_THEME.branding.seo.description}
        property="og:description"
      />
      <meta content={FALLBACK_THEME.branding.seo.image} property="og:image" />

      {/* Twitter */}
      <meta
        content={FALLBACK_THEME.branding.seo.twitter.cardType}
        property="twitter:card"
      />
      <meta content={title} property="twitter:title" />
      <meta
        content={FALLBACK_THEME.branding.seo.description}
        property="twitter:description"
      />
      <meta
        content={FALLBACK_THEME.branding.seo.image}
        property="twitter:image"
      />
    </>
  );
};

export default Meta;
