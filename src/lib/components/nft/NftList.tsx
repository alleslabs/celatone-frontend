import { SimpleGrid } from "@chakra-ui/react";

import { Loading } from "lib/components/Loading";
import { ErrorFetching } from "lib/components/state";
import type { Nft } from "lib/services/nft";
import type { Option } from "lib/types";

import { NftCard } from "./NftCard";

interface NftListProps {
  nfts: Option<Nft[]>;
  isLoading: boolean;
  emptyState: JSX.Element;
  showCollection: boolean;
}

export const NftList = ({
  nfts,
  isLoading,
  emptyState,
  showCollection,
}: NftListProps) => {
  if (isLoading) return <Loading />;
  if (!nfts) return <ErrorFetching dataName="NFTs" />;
  if (!nfts.length) return emptyState;

  return (
    <SimpleGrid gap={6} columns={{ base: 2, lg: 3, xl: 5 }} mt={8}>
      {nfts.map((nft) => (
        <NftCard
          key={nft.tokenId + nft.uri}
          {...nft}
          showCollection={showCollection}
        />
      ))}
    </SimpleGrid>
  );
};
