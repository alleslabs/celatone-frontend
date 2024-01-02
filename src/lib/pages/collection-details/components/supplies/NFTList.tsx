import { SimpleGrid } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import NFTCard from "lib/components/NFTCard";
import { EmptyState } from "lib/components/state";
import type { NFTToken } from "lib/services/nft";

const NFTList = ({
  nfts,
  isLoading,
}: {
  nfts?: NFTToken[];
  isLoading?: boolean;
}) => {
  const isMobile = useMobile();
  const size = isMobile ? "150px" : "206px";
  if (isLoading) return <Loading />;
  if (!nfts || !nfts.length)
    return (
      <EmptyState
        message="There are no nfts matches your keyword."
        imageVariant="not-found"
      />
    );

  return (
    <SimpleGrid templateColumns={`repeat(auto-fill, ${size})`} spacing="24px">
      {nfts.map((nft) => (
        <NFTCard key={nft.tokenId + nft.uri} {...nft} />
      ))}
    </SimpleGrid>
  );
};

export default NFTList;
