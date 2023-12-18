import { Box, SimpleGrid } from "@chakra-ui/react";

import NFTCard from "../NFTCard";
import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import type { NFTToken } from "lib/types";

const NFTList = ({
  nfts,
  isLoading,
}: {
  nfts?: NFTToken[];
  isLoading?: boolean;
}) => {
  if (isLoading) return <Loading />;
  if (!nfts || !nfts.length) return <EmptyState message="Not found" />;
  return (
    <Box>
      <SimpleGrid
        templateColumns="repeat(auto-fill, minmax(206px, 206px))"
        spacing="24px"
      >
        {nfts.map((nft) => (
          <NFTCard key={nft.tokenId + nft.uri} {...nft} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default NFTList;
