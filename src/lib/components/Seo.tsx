import { useWallet } from "@cosmos-kit/react";
import { DefaultSeo } from "next-seo";

import { CURR_THEME } from "env";

export const CelatoneSeo = () => {
  const { currentChainRecord } = useWallet();
  const title =
    CURR_THEME.branding.seo.title ??
    `${currentChainRecord?.chain.pretty_name} Explorer | Celatone`;

  return (
    <DefaultSeo
      title={title}
      description={
        CURR_THEME.branding.seo.description ??
        "A smart contract powered explorer for the Cosmos."
      }
      openGraph={{
        type: "website",
        description:
          CURR_THEME.branding.seo.description ??
          "A smart contract powered explorer for the Cosmos.",
        images: [
          {
            url:
              CURR_THEME.branding.seo.image ??
              "https://assets.alleslabs.dev/branding/celatone-cover.jpg",
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      }}
      twitter={{
        handle: CURR_THEME.branding.seo.twitter.handle ?? "@celatone_",
        cardType:
          CURR_THEME.branding.seo.twitter.cardType ?? "summary_large_image",
      }}
    />
  );
};
