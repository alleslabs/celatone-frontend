import type { Nft } from "lib/services/types";
import type { Option } from "lib/types";

import { SimpleGrid } from "@chakra-ui/react";
import { Loading } from "lib/components/Loading";
import { ErrorFetching } from "lib/components/state";

import { NftCard } from "./NftCard";

interface NftListProps {
  emptyState: JSX.Element;
  isLoading?: boolean;
  nfts: Option<Nft[]>;
  showCollection: boolean;
}

export const NftList = ({
  emptyState,
  isLoading,
  nfts,
  showCollection,
}: NftListProps) => {
  if (isLoading) return <Loading />;
  if (!nfts) return <ErrorFetching dataName="NFTs" />;
  if (!nfts.length) return emptyState;

  return (
    <SimpleGrid columns={{ base: 2, lg: 3, xl: 5 }} gap={6} mb={8} mt={4}>
      {nfts.map((nft) => (
        <NftCard
          key={nft.collectionAddress + nft.tokenId}
          nft={nft}
          showCollection={showCollection}
        />
      ))}
    </SimpleGrid>
  );
};
