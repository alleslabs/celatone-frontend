import { useCelatoneApp } from "lib/app-provider";
import { DefaultSeo } from "next-seo";

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
      title={title}
      twitter={{
        handle: theme.branding.seo.x.handle,
        cardType: theme.branding.seo.x.cardType,
      }}
    />
  );
};
