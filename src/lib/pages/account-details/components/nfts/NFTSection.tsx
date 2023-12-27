import { Badge, Box, Flex, Heading, Stack } from "@chakra-ui/react";
import { useState } from "react";

import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import { useCollectionListByAddress } from "lib/services/collectionService";
import type { HexAddr } from "lib/types";

import { FilterItem } from "./FilterItem";
import { NFTsByCollection } from "./NFTsByCollection";

export const NFTSection = ({
  address,
  totalCount,
}: {
  address: HexAddr;
  totalCount: number;
}) => {
  const { data: collectionList, isLoading } =
    useCollectionListByAddress(address);

  const [collection, setCollection] = useState<string>();
  const [nftCount, setNFTCount] = useState<number>(totalCount);

  if (isLoading) return <Loading />;
  if (!collectionList || !collectionList.length)
    return (
      <EmptyState
        message="There are currently no NFTs held by this account."
        imageVariant="empty"
      />
    );

  const onClick = (count: number, collectionAddress?: string) => {
    setCollection(collectionAddress);
    setNFTCount(count);
  };

  return (
    <Box mt={{ base: 4, md: 8 }}>
      <Flex gap="8px" align="center">
        <Heading variant="h6">NFTs</Heading>
        <Badge>{totalCount}</Badge>
      </Flex>
      <Flex gap="40px" mt="32px">
        <Stack w="300px" spacing="8px">
          <FilterItem
            collectionName="All Collections"
            onClick={() => onClick(totalCount, undefined)}
            isActive={collection === undefined}
            count={totalCount}
          />
          {collectionList.map((item) => (
            <FilterItem
              key={item.collectionAddress}
              collectionName={item.collectionName}
              onClick={() => onClick(item.hold, item.collectionAddress)}
              uri={item.uri}
              isActive={collection === item.collectionAddress}
              count={item.hold}
            />
          ))}
        </Stack>
        <Box w="100%">
          <NFTsByCollection
            collectionAddress={collection}
            hexAddress={address}
            totalCount={nftCount}
          />
        </Box>
      </Flex>
    </Box>
  );
};
