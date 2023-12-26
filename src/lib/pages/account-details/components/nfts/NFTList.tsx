import { SimpleGrid } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { Loading } from "lib/components/Loading";
import NFTCard from "lib/components/NFTCard";
import type { NFTToken } from "lib/services/nft";

export const NFTList = ({
  nfts,
  isLoading,
  emptyState,
}: {
  nfts?: NFTToken[];
  isLoading?: boolean;
  emptyState?: ReactNode;
}) => {
  if (isLoading) return <Loading />;
  if (!nfts || !nfts.length) return emptyState;

  return (
    <SimpleGrid
      templateColumns="repeat(auto-fill, minmax(206px, 206px))"
      spacing="24px"
    >
      {nfts.map((nft) => (
        <NFTCard key={nft.tokenId + nft.uri} {...nft} />
      ))}
    </SimpleGrid>
  );
};
