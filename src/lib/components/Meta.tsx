import { capitalize } from "lodash";

import { FALLBACK_THEME } from "config/theme";
import { CHAIN } from "env";

const Meta = () => {
  const APP_NAME = FALLBACK_THEME.branding.seo.appName;
  const title = `${capitalize(CHAIN)} Explorer | ${FALLBACK_THEME.branding.seo.title}`;
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
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta
        property="og:description"
        content={FALLBACK_THEME.branding.seo.description}
      />
      <meta property="og:image" content={FALLBACK_THEME.branding.seo.image} />

      {/* Twitter */}
      <meta
        property="twitter:card"
        content={FALLBACK_THEME.branding.seo.twitter.cardType}
      />
      <meta property="twitter:title" content={title} />
      <meta
        property="twitter:description"
        content={FALLBACK_THEME.branding.seo.description}
      />
      <meta
        property="twitter:image"
        content={FALLBACK_THEME.branding.seo.image}
      />
    </>
  );
};

export default Meta;
