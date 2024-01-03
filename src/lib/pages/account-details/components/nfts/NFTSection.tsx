import { Badge, Box, Flex, Heading, Stack } from "@chakra-ui/react";
import { useState } from "react";

import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import { useCollectionListByAddress } from "lib/services/collectionService";
import type { HexAddr } from "lib/types";

import { FilterItem } from "./FilterItem";
import { NftsByCollection } from "./NftsByCollection";

export const NftSection = ({
  address,
  totalCount,
}: {
  address: HexAddr;
  totalCount: number;
}) => {
  const { data: collectionList, isLoading } =
    useCollectionListByAddress(address);

  const [collection, setCollection] = useState<HexAddr>();
  const [nftCount, setNftCount] = useState<number>(totalCount);

  const isMobile = useMobile();

  if (isLoading) return <Loading />;
  if (!collectionList || !collectionList.length)
    return (
      <EmptyState
        message="There are currently no NFTs held by this account."
        imageVariant="empty"
      />
    );

  const onClick = (count: number, collectionAddress?: HexAddr) => {
    setCollection(collectionAddress);
    setNftCount(count);
  };

  return (
    <Box mt={{ base: 4, md: 8 }}>
      <Flex gap="8px" align="center">
        <Heading variant="h6">NFTs</Heading>
        <Badge>{totalCount}</Badge>
      </Flex>
      <Flex gap="40px" mt="32px" flexDir={isMobile ? "column" : "row"}>
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
          <NftsByCollection
            collectionAddress={collection}
            userAddress={address}
            totalCount={nftCount}
          />
        </Box>
      </Flex>
    </Box>
  );
};
