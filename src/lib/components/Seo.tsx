import { useWallet } from "@cosmos-kit/react";
import { DefaultSeo } from "next-seo";

export const CelatoneSeo = () => {
  const { currentChainRecord } = useWallet();
  const title = `${currentChainRecord?.chain.pretty_name} Explorer | Celatone`;

  return (
    <DefaultSeo
      title={title}
      description="A smart contract powered explorer for the Cosmos."
      openGraph={{
        type: "website",
        description: "A smart contract powered explorer for the Cosmos",
        images: [
          {
            url: "https://assets.alleslabs.dev/integrations/sei/cover.jpg",
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
