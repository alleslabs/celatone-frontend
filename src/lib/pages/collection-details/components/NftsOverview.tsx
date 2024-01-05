import {
  Badge,
  Box,
  Flex,
  GridItem,
  SimpleGrid,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";

import { useInternalNavigate, useMobile } from "lib/app-provider";
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
    xl: 6,
    lg: 5,
    base: 5,
    md: 4,
    xs: 4,
  });

  const nftsInfo = nfts?.slice(0, displayedNftCount);
  const isMobile = useMobile();

  const navigate = useInternalNavigate();

  if (isLoading) return <Loading />;
  if (!nftsInfo || !nftsInfo.length)
    return (
      <EmptyState message="NFT not found." imageVariant="empty" withBorder />
    );

  return (
    <Box p="14px 6px">
      <Flex align="center" mb="24px" gap="8px">
        <Text fontSize="18px" fontWeight={600}>
          NFTs in this collection
        </Text>
        <Badge>{totalCount}</Badge>
      </Flex>
      <SimpleGrid
        gap="24px"
        templateColumns={`repeat(auto-fill, ${isMobile ? "150px" : "206px"})`}
      >
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
    </Box>
  );
};

export default NftsOverview;
