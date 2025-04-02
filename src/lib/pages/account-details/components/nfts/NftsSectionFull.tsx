import type { HexAddr, HexAddr32, Option } from "lib/types";

import { Badge, Box, Flex, Heading, Stack } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { useNftCollectionsByAccountAddress } from "lib/services/nft-collection";
import { useState } from "react";

import { FilterItem } from "./FilterItem";
import { NftsByCollectionFull } from "./NftsByCollectionFull";

interface SelectedCollection {
  collectionAddress: HexAddr32;
  nftsCount: number;
}

interface NftsSectionFullProps {
  address: HexAddr;
  totalData: Option<number>;
}

export const NftsSectionFull = ({
  address,
  totalData = 0,
}: NftsSectionFullProps) => {
  const isMobile = useMobile();
  const { data: collections, isLoading } =
    useNftCollectionsByAccountAddress(address);

  const [selectedCollection, setSelectedCollection] =
    useState<SelectedCollection>();

  if (isLoading) return <Loading />;
  if (!collections) return <ErrorFetching dataName="collections" />;
  if (!collections.items.length)
    return (
      <EmptyState
        imageVariant="empty"
        message="There are currently no NFTs held by this account."
      />
    );

  const handleOnClick = (collection?: SelectedCollection) =>
    setSelectedCollection(collection);

  return (
    <Box mt={{ base: 4, md: 8 }}>
      <Flex align="center" gap="8px">
        <Heading variant="h6">NFTs</Heading>
        <Badge>{totalData}</Badge>
      </Flex>
      <Flex flexDir={isMobile ? "column" : "row"} gap="40px" mt="32px">
        <Stack
          minW={64}
          spacing="8px"
          w={{ base: "100%", md: "35%", lg: "25%" }}
        >
          <FilterItem
            collectionName="All Collections"
            count={totalData}
            isActive={selectedCollection === undefined}
            isDefault
            onClick={() => handleOnClick(undefined)}
          />
          {collections.items.map((item) => (
            <FilterItem
              key={item.collectionAddress}
              collectionName={item.collectionName}
              count={item.hold}
              isActive={
                selectedCollection?.collectionAddress === item.collectionAddress
              }
              uri={item.uri}
              onClick={() =>
                handleOnClick({
                  collectionAddress: item.collectionAddress,
                  nftsCount: item.hold,
                })
              }
            />
          ))}
        </Stack>
        <NftsByCollectionFull
          accountAddress={address}
          collectionAddress={selectedCollection?.collectionAddress}
        />
      </Flex>
    </Box>
  );
};
