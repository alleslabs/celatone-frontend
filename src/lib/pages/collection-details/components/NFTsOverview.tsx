import {
  Box,
  Flex,
  GridItem,
  SimpleGrid,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import Link from "next/link";

import { CustomIcon } from "lib/components/icon";
import type { NFTToken } from "lib/types";

import NFTCard from "./NFTCard";

const NFTsOverview = ({ nfts }: { nfts: NFTToken[] }) => {
  const displayedNftCount = useBreakpointValue({
    xl: 6,
    lg: 6,
    base: 4,
    md: 4,
    xs: 4,
  });

  const nftsInfo = nfts?.slice(0, displayedNftCount);

  return (
    <Box p="14px 6px">
      <Text fontSize="18px" fontWeight={600} mb="24px">
        NFTs in this collection
      </Text>
      <SimpleGrid gap="24px" templateColumns="repeat(auto-fill, 206px)">
        {nftsInfo.map((nft) => (
          <GridItem>
            <NFTCard key={nft.tokenId + nft.uri} {...nft} />
          </GridItem>
        ))}
      </SimpleGrid>

      <Link href="/">
        <Flex align="center" justify="center" w="100%" height="64px">
          <Text color="gray.400" fontSize="14px">
            View More
          </Text>{" "}
          <CustomIcon name="chevron-right" boxSize="12px" />
        </Flex>
      </Link>
    </Box>
  );
};

export default NFTsOverview;
