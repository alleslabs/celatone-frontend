import {
  Badge,
  Flex,
  GridItem,
  Heading,
  SimpleGrid,
  useBreakpointValue,
} from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { NftCard } from "lib/components/nft";
import { EmptyState } from "lib/components/state";
import { ViewMore } from "lib/components/table";
import type { Nft } from "lib/services/nft";
import type { HexAddr32, Option } from "lib/types";

interface NftsOverviewProps {
  collectionAddress: HexAddr32;
  totalCount: number;
  nfts: Option<Nft[]>;
  isLoading: boolean;
}

export const NftsOverview = ({
  collectionAddress,
  totalCount,
  nfts,
  isLoading,
}: NftsOverviewProps) => {
  const navigate = useInternalNavigate();
  const displayedNftCount = useBreakpointValue({
    "2xl": 6,
    xl: 5,
    sm: 4,
  });

  const nftsInfo = nfts?.slice(0, displayedNftCount);

  if (isLoading) return <Loading />;
  if (!nftsInfo || !nftsInfo.length)
    return (
      <EmptyState message="NFT not found." imageVariant="empty" withBorder />
    );

  return (
    <Flex direction="column" gap={8}>
      <Flex align="center" gap={2}>
        <Heading as="h6" variant="h6" fontWeight={600}>
          NFTs in this collection
        </Heading>
        <Badge>{totalCount}</Badge>
      </Flex>
      <SimpleGrid gap={6} columns={{ base: 2, lg: 4, xl: 5, "2xl": 6 }}>
        {nftsInfo.map((nft) => (
          <GridItem key={nft.tokenId + nft.uri}>
            <NftCard {...nft} />
          </GridItem>
        ))}
      </SimpleGrid>
      {(displayedNftCount ?? 0) <= totalCount && (
        <ViewMore
          onClick={() =>
            navigate({
              pathname: "/nft-collections/[collectionAddress]/supplies",
              query: { collectionAddress },
            })
          }
        />
      )}
    </Flex>
  );
};
