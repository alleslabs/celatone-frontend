import PageContainer from "lib/components/PageContainer";
import { PageHeader } from "lib/components/PageHeader";

import { Collections } from "./components/Collections";

const NftCollections = () => (
  <PageContainer>
    <PageHeader
      title="NFT Collections"
      subtitle="These are the most recently NFT collections created on this network"
      docHref="move/nfts/collection-list"
    />
    <Collections />
  </PageContainer>
);

export default NftCollections;
