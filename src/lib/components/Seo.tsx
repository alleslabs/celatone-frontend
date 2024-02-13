import { DefaultSeo } from "next-seo";

import { useCelatoneApp } from "lib/app-provider";

export const CelatoneSeo = () => {
  const {
    chainConfig: { prettyName },
    theme,
  } = useCelatoneApp();
  const title = `${prettyName} Explorer | ${theme.branding.seo.title}`;

  return (
    <DefaultSeo
      title={title}
      description={theme.branding.seo.description}
      openGraph={{
        type: "website",
        description: theme.branding.seo.description,
        images: [
          {
            url: theme.branding.seo.image,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      }}
      twitter={{
        handle: theme.branding.seo.twitter.handle,
        cardType: theme.branding.seo.twitter.cardType,
      }}
    />
  );
};
