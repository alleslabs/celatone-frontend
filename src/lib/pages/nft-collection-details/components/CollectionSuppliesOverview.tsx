import type { Nft } from "lib/services/types";
import type { Option } from "lib/types";

import {
  Badge,
  Flex,
  GridItem,
  Heading,
  SimpleGrid,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Loading } from "lib/components/Loading";
import { NftCard } from "lib/components/nft";
import { EmptyState } from "lib/components/state";
import { ViewMore } from "lib/components/table";

interface CollectionSuppliesOverviewProps {
  isLoading: boolean;
  nfts: Option<Nft[]>;
  onViewMore: () => void;
  totalCount: number;
}

export const CollectionSuppliesOverviewBody = ({
  isLoading,
  nfts,
  onViewMore,
  totalCount,
}: CollectionSuppliesOverviewProps) => {
  const displayedNftCount =
    useBreakpointValue({
      "2xl": 6,
      sm: 4,
      xl: 5,
    }) ?? 4;

  const nftsInfo = nfts?.slice(0, displayedNftCount);

  if (isLoading) return <Loading />;
  if (!nftsInfo || !nftsInfo.length)
    return (
      <EmptyState imageVariant="empty" message="NFTs not found." withBorder />
    );
  return (
    <>
      <SimpleGrid columns={{ "2xl": 6, base: 2, lg: 4, xl: 5 }} gap={6} my={8}>
        {nftsInfo.map((nft) => (
          <GridItem key={nft.tokenId + nft.uri}>
            <NftCard nft={nft} />
          </GridItem>
        ))}
      </SimpleGrid>
      {totalCount > displayedNftCount && <ViewMore onClick={onViewMore} />}
    </>
  );
};

export const CollectionSuppliesOverview = ({
  isLoading,
  nfts,
  onViewMore,
  totalCount,
}: CollectionSuppliesOverviewProps) => (
  <Flex direction="column">
    <Flex align="center" gap={2}>
      <Heading as="h6" fontWeight={600} variant="h6">
        NFTs in this collection
      </Heading>
      <Badge>{totalCount}</Badge>
    </Flex>
    <CollectionSuppliesOverviewBody
      isLoading={isLoading}
      nfts={nfts}
      totalCount={totalCount}
      onViewMore={onViewMore}
    />
  </Flex>
);
