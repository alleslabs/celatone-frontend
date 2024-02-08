import { useCelatoneApp } from "lib/app-provider";

const Meta = () => {
  const {
    chainConfig: { prettyName },
    theme,
  } = useCelatoneApp();
  const APP_NAME = theme.branding.seo.appName;
  const title = `${prettyName} Explorer | ${theme.branding.seo.title}`;
  return (
    <>
      <meta name="application-name" content={APP_NAME} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={APP_NAME} />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="theme-color" content={theme.colors.background.main} />
      <title>{title}</title>
      <meta name="description" content={theme.branding.seo.description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta
        property="og:description"
        content={theme.branding.seo.description}
      />
      <meta property="og:image" content={theme.branding.seo.image} />

      {/* Twitter */}
      <meta
        property="twitter:card"
        content={theme.branding.seo.twitter.cardType}
      />
      <meta property="twitter:title" content={title} />
      <meta
        property="twitter:description"
        content={theme.branding.seo.description}
      />
      <meta property="twitter:image" content={theme.branding.seo.image} />
    </>
  );
};

export default Meta;
