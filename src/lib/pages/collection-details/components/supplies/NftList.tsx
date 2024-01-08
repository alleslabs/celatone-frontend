import { SimpleGrid } from "@chakra-ui/react";

import { Loading } from "lib/components/Loading";
import { NftCard } from "lib/components/NftCard";
import { EmptyState } from "lib/components/state";
import type { NftToken } from "lib/services/nft/nft";

const NftList = ({
  nfts,
  isLoading,
}: {
  nfts?: NftToken[];
  isLoading?: boolean;
}) => {
  if (isLoading) return <Loading />;
  if (!nfts || !nfts.length)
    return (
      <EmptyState
        message="There are no NFTs matches your keyword."
        imageVariant="not-found"
        withBorder
      />
    );

  return (
    <SimpleGrid gap={6} columns={{ base: 2, lg: 4, xl: 5, "2xl": 6 }} mt={8}>
      {nfts.map((nft) => (
        <NftCard key={nft.tokenId + nft.uri} {...nft} />
      ))}
    </SimpleGrid>
  );
};

export default NftList;
