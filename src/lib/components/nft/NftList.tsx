import { SimpleGrid } from "@chakra-ui/react";

import { Loading } from "lib/components/Loading";
import { ErrorFetching } from "lib/components/state";
import type { Nft } from "lib/services/types";
import type { Option } from "lib/types";

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
    <SimpleGrid gap={6} mb={8} mt={4} columns={{ base: 2, lg: 3, xl: 5 }}>
      {nfts.map((nft) => (
        <NftCard
          key={nft.tokenId + nft.uri}
          nftAddress={nft.nftAddress}
          uri={nft.uri}
          collectionAddress={nft.collectionAddress}
          collectionName={nft.collectionName}
          showCollection={showCollection}
          tokenId={nft.tokenId}
        />
      ))}
    </SimpleGrid>
  );
};
