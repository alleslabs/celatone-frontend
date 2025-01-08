import { DefaultSeo } from "next-seo";

import { useCelatoneApp } from "lib/app-provider";

export const CelatoneSeo = ({ pageName }: { pageName?: string }) => {
  const {
    chainConfig: { prettyName },
    theme,
  } = useCelatoneApp();

  const title = pageName?.length
    ? `${pageName} | ${prettyName} Explorer | ${theme.branding.seo.title}`
    : `${prettyName} Explorer | ${theme.branding.seo.title}`;

  return (
    <DefaultSeo
      title={title}
      twitter={{
        cardType: theme.branding.seo.twitter.cardType,
        handle: theme.branding.seo.twitter.handle,
      }}
      description={theme.branding.seo.description}
      openGraph={{
        description: theme.branding.seo.description,
        images: [
          {
            alt: title,
            height: 630,
            url: theme.branding.seo.image,
            width: 1200,
          },
        ],
        type: "website",
      }}
    />
  );
};
