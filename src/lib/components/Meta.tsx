import { FALLBACK_THEME } from "config/theme";
import { CHAIN } from "env";
import { capitalize } from "lodash";

const Meta = () => {
  const APP_NAME = FALLBACK_THEME.branding.seo.appName;
  const title = `${capitalize(CHAIN)} Explorer | ${FALLBACK_THEME.branding.seo.title}`;
  return (
    <>
      <meta content={APP_NAME} name="application-name" />
      <meta content="yes" name="apple-mobile-web-app-capable" />
      <meta content="default" name="apple-mobile-web-app-status-bar-style" />
      <meta content={APP_NAME} name="apple-mobile-web-app-title" />
      <meta content="telephone=no" name="format-detection" />
      <meta content="yes" name="mobile-web-app-capable" />
      <meta
        content={FALLBACK_THEME.colors.background.main}
        name="theme-color"
      />
      <title>{title}</title>
      <meta
        content={FALLBACK_THEME.branding.seo.description}
        name="description"
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
        content={FALLBACK_THEME.branding.seo.x.cardType}
        name="twitter:card"
      />
      <meta content={title} name="twitter:title" />
      <meta
        content={FALLBACK_THEME.branding.seo.description}
        name="twitter:description"
      />
      <meta content={FALLBACK_THEME.branding.seo.image} name="twitter:image" />
      <meta
        content="1pxs24lWnpcBI8d_INsnTvixVDOSXFi5wqfn6f3jlSo"
        name="google-site-verification"
      />
    </>
  );
};

export default Meta;
