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
import { NftCard } from "lib/components/NftCard";
import { EmptyState } from "lib/components/state";
import { ViewMore } from "lib/components/table";
import type { NftToken } from "lib/services/nft";
import type { HexAddr } from "lib/types";

const NftsOverview = ({
  collectionAddress,
  totalCount,
  nfts,
  isLoading,
}: {
  collectionAddress: HexAddr;
  totalCount: number;
  nfts?: NftToken[];
  isLoading?: boolean;
}) => {
  const displayedNftCount = useBreakpointValue({
    "2xl": 6,
    xl: 5,
    sm: 4,
  });

  const nftsInfo = nfts?.slice(0, displayedNftCount);

  const navigate = useInternalNavigate();

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

export default NftsOverview;
