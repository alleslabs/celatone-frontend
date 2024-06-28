import { useNftConfig, useTierConfig } from "lib/app-provider";
import PageContainer from "lib/components/PageContainer";
import { PageHeader } from "lib/components/PageHeader";
import { CelatoneSeo } from "lib/components/Seo";

import { Collections } from "./components/Collections";

const NftCollections = () => {
  useTierConfig({ minTier: "full" });
  useNftConfig({ shouldRedirect: true });
  return (
    <PageContainer>
      <CelatoneSeo pageName="NFT Collections" />
      <PageHeader
        title="NFT Collections"
        subtitle="These are the most recently NFT collections created on this network"
        docHref="move/nfts/collection-list"
      />
      <Collections />
    </PageContainer>
  );
};

export default NftCollections;
