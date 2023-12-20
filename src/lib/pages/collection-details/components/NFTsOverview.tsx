import {
  Box,
  Flex,
  GridItem,
  SimpleGrid,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";

import { AppLink } from "lib/components/AppLink";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import type { NFTToken } from "lib/services/nft";

import NFTCard from "./NFTCard";

const NFTsOverview = ({
  collectionAddress,
  nfts,
  isLoading,
}: {
  collectionAddress: string;
  nfts?: NFTToken[];
  isLoading?: boolean;
}) => {
  const displayedNftCount = useBreakpointValue({
    xl: 6,
    lg: 6,
    base: 4,
    md: 4,
    xs: 4,
  });

  const nftsInfo = nfts?.slice(0, displayedNftCount);

  if (isLoading) return <Loading />;
  if (!nftsInfo || !nftsInfo.length)
    return <EmptyState message="NFT not found." imageVariant="empty" />;

  return (
    <Box p="14px 6px">
      <Text fontSize="18px" fontWeight={600} mb="24px">
        NFTs in this collection
      </Text>
      <SimpleGrid gap="24px" templateColumns="repeat(auto-fill, 206px)">
        {nftsInfo.map((nft) => (
          <GridItem key={nft.tokenId + nft.uri}>
            <NFTCard collectionAddress={collectionAddress} {...nft} />
          </GridItem>
        ))}
      </SimpleGrid>

      <AppLink href={`/collections/${collectionAddress}/supplies`}>
        <Flex align="center" justify="center" w="100%" height="64px">
          <Text color="gray.400" fontSize="14px">
            View More
          </Text>{" "}
          <CustomIcon name="chevron-right" boxSize="12px" />
        </Flex>
      </AppLink>
    </Box>
  );
};

export default NFTsOverview;
