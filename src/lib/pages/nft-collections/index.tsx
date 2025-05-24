import { useNftConfig, useTierConfig } from "lib/app-provider";
import PageContainer from "lib/components/PageContainer";
import { PageHeader } from "lib/components/PageHeader";
import { CelatoneSeo } from "lib/components/Seo";
import { TierSwitcher } from "lib/components/TierSwitcher";

import { CollectionsFull } from "./components/CollectionsFull";
import { CollectionsSequencer } from "./components/CollectionsSequencer";

const NftCollections = () => {
  useTierConfig({ minTier: "sequencer" });
  useNftConfig({ shouldRedirect: true });
  return (
    <PageContainer>
      <CelatoneSeo pageName="NFT collections" />
      <PageHeader
        docHref="move/nfts/collection-list"
        subtitle="These are the most recently NFT collections created on this network"
        title="NFT collections"
      />
      <TierSwitcher
        full={<CollectionsFull />}
        sequencer={<CollectionsSequencer />}
      />
    </PageContainer>
  );
};

export default NftCollections;
