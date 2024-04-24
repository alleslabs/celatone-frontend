import { useNftConfig } from "lib/app-provider";
import PageContainer from "lib/components/PageContainer";
import { PageHeader } from "lib/components/PageHeader";
import PageHeaderContainer from "lib/components/PageHeaderContainer";

import { Collections } from "./components/Collections";

const NftCollections = () => {
  useNftConfig({ shouldRedirect: true });
  return (
    <>
      <PageHeaderContainer bgColor="overlay.collection">
        <PageHeader
          title="NFT Collections"
          subtitle="These are the most recently NFT collections created on this network"
          docHref="move/nfts/collection-list"
        />
      </PageHeaderContainer>
      <PageContainer>
        <Collections />
      </PageContainer>
    </>
  );
};

export default NftCollections;
