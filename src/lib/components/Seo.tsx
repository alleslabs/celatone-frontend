import { DefaultSeo } from "next-seo";

import { useCelatoneApp } from "lib/app-provider";

export const CelatoneSeo = () => {
  const {
    chainConfig: { prettyName },
  } = useCelatoneApp();
  const title = `${prettyName} Explorer | Celatone`;

  return (
    <DefaultSeo
      title={title}
      description="A smart contract powered explorer for the Cosmos."
      openGraph={{
        type: "website",
        description: "A smart contract powered explorer for the Cosmos",
        images: [
          {
            url: "https://assets.alleslabs.dev/branding/celatone-cover.jpg",
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      }}
      twitter={{
        handle: "@celatone_",
        cardType: "summary_large_image",
      }}
    />
  );
};
