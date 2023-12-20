import { SimpleGrid } from "@chakra-ui/react";

import NFTCard from "../NFTCard";
import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import type { NFTToken } from "lib/services/nft";

const NFTList = ({
  nfts,
  isLoading,
  collectionAddress,
}: {
  nfts?: NFTToken[];
  isLoading?: boolean;
  collectionAddress: string;
}) => {
  if (isLoading) return <Loading />;
  if (!nfts || !nfts.length) return <EmptyState message="Not found" />;
  return (
    <SimpleGrid
      templateColumns="repeat(auto-fill, minmax(206px, 206px))"
      spacing="24px"
    >
      {nfts.map((nft) => (
        <NFTCard
          key={nft.tokenId + nft.uri}
          collectionAddress={collectionAddress}
          {...nft}
        />
      ))}
    </SimpleGrid>
  );
};

export default NFTList;
