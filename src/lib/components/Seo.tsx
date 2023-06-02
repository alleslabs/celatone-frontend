import { useWallet } from "@cosmos-kit/react";
import { DefaultSeo } from "next-seo";

import { CURR_THEME } from "env";

export const CelatoneSeo = () => {
  const { currentChainRecord } = useWallet();
  const title = `${currentChainRecord?.chain.pretty_name} Explorer | ${CURR_THEME.branding.seo.title}`;

  return (
    <DefaultSeo
      title={title}
      description={CURR_THEME.branding.seo.description}
      openGraph={{
        type: "website",
        description: CURR_THEME.branding.seo.description,
        images: [
          {
            url: CURR_THEME.branding.seo.image,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      }}
      twitter={{
        handle: CURR_THEME.branding.seo.twitter.handle,
        cardType: CURR_THEME.branding.seo.twitter.cardType,
      }}
    />
  );
};
