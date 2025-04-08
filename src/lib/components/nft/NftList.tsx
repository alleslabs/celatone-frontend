import type { Nft } from "lib/services/types";
import type { Option } from "lib/types";

import { SimpleGrid } from "@chakra-ui/react";
import { Loading } from "lib/components/Loading";
import { ErrorFetching } from "lib/components/state";
import { JSX } from "react";

import { NftCard } from "./NftCard";

interface NftListProps {
  nfts: Option<Nft[]>;
  isLoading?: boolean;
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
    <SimpleGrid columns={{ base: 2, lg: 3, xl: 5 }} gap={6} mb={8} mt={4}>
      {nfts.map((nft) => (
        <NftCard
          key={nft.tokenId + nft.uri}
          collectionAddress={nft.collectionAddress}
          collectionName={nft.collectionName}
          nftAddress={nft.nftAddress}
          showCollection={showCollection}
          tokenId={nft.tokenId}
          uri={nft.uri}
        />
      ))}
    </SimpleGrid>
  );
};
