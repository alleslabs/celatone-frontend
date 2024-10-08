import { SimpleGrid } from "@chakra-ui/react";

import { Loading } from "lib/components/Loading";
import { ErrorFetching } from "lib/components/state";
import type { Nft } from "lib/services/types";
import type { Option } from "lib/types";

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
    <SimpleGrid gap={6} columns={{ base: 2, lg: 3, xl: 5 }} mt={4} mb={8}>
      {nfts.map((nft) => (
        <NftCard
          key={nft.tokenId + nft.uri}
          showCollection={showCollection}
          uri={nft.uri}
          tokenId={nft.tokenId}
          collectionName={nft.collectionName}
          collectionAddress={nft.collectionAddress}
          nftAddress={nft.nftAddress}
        />
      ))}
    </SimpleGrid>
  );
};
