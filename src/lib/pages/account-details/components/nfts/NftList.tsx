import { SimpleGrid } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { Loading } from "lib/components/Loading";
import { NftCard } from "lib/components/NftCard";
import type { NftToken } from "lib/services/nft/nft";

export const NftList = ({
  nfts,
  isLoading,
  emptyState,
}: {
  nfts?: NftToken[];
  isLoading?: boolean;
  emptyState?: ReactNode;
}) => {
  if (isLoading) return <Loading />;
  if (!nfts || !nfts.length) return emptyState;

  return (
    <SimpleGrid gap={6} columns={{ base: 2, lg: 3, xl: 5 }} mt={8}>
      {nfts.map((nft) => (
        <NftCard key={nft.tokenId + nft.uri} {...nft} showCollection />
      ))}
    </SimpleGrid>
  );
};
