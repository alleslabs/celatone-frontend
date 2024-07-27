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
import type { Nft } from "lib/services/types";
import type { Option } from "lib/types";

interface CollectionSuppliesOverviewProps {
  totalCount: number;
  nfts: Option<Nft[]>;
  isLoading: boolean;
  onViewMore: () => void;
}

export const CollectionSuppliesOverviewBody = ({
  totalCount,
  nfts,
  isLoading,
  onViewMore,
}: CollectionSuppliesOverviewProps) => {
  const displayedNftCount =
    useBreakpointValue({
      "2xl": 6,
      xl: 5,
      sm: 4,
    }) ?? 4;

  const nftsInfo = nfts?.slice(0, displayedNftCount);

  if (isLoading) return <Loading />;
  if (!nftsInfo || !nftsInfo.length)
    return (
      <EmptyState imageVariant="empty" message="NFTs not found." withBorder />
    );
  return (
    <>
      <SimpleGrid gap={6} columns={{ base: 2, lg: 4, xl: 5, "2xl": 6 }} my={8}>
        {nftsInfo.map((nft) => (
          <GridItem key={nft.tokenId + nft.uri}>
            <NftCard {...nft} />
          </GridItem>
        ))}
      </SimpleGrid>
      {totalCount > displayedNftCount && <ViewMore onClick={onViewMore} />}
    </>
  );
};

export const CollectionSuppliesOverview = ({
  totalCount,
  nfts,
  isLoading,
  onViewMore,
}: CollectionSuppliesOverviewProps) => (
  <Flex direction="column">
    <Flex align="center" gap={2}>
      <Heading as="h6" variant="h6" fontWeight={600}>
        NFTs in this collection
      </Heading>
      <Badge>{totalCount}</Badge>
    </Flex>
    <CollectionSuppliesOverviewBody
      totalCount={totalCount}
      nfts={nfts}
      isLoading={isLoading}
      onViewMore={onViewMore}
    />
  </Flex>
);
