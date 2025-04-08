import type { HexAddr, HexAddr32, Option } from "lib/types";

import { Badge, Box, Flex, Heading, Stack } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { useNftsByAccountByCollectionSequencer } from "lib/services/nft";
import { zHexAddr32 } from "lib/types";
import { groupBy } from "lodash";
import { useState } from "react";

import { FilterItem } from "./FilterItem";
import { NftsByCollectionSequencer } from "./NftsByCollectionSequencer";

interface SelectedCollection {
  collectionAddress: HexAddr32;
  nftsCount: number;
}

interface NftsSectionSequencerProps {
  address: HexAddr;
  totalData: Option<number>;
}

export const NftsSectionSequencer = ({
  address,
  totalData = 0,
}: NftsSectionSequencerProps) => {
  const isMobile = useMobile();
  const { data: accountNfts, isLoading } =
    useNftsByAccountByCollectionSequencer(address, undefined, undefined);

  const collections = groupBy(accountNfts?.items, "collectionAddress");

  const [selectedCollection, setSelectedCollection] =
    useState<SelectedCollection>();

  if (isLoading) return <Loading />;
  if (!collections) return <ErrorFetching dataName="collections" />;
  if (!Object.keys(collections).length)
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
            collectionName="All collections"
            onClick={() => handleOnClick(undefined)}
            isActive={selectedCollection === undefined}
            count={totalData}
            isActive={selectedCollection === undefined}
            isDefault
            onClick={() => handleOnClick(undefined)}
          />
          {Object.entries(collections).map(([collectionAddress, nfts]) => (
            <FilterItem
              key={collectionAddress}
              collectionName={nfts[0].collectionName}
              count={nfts.length}
              isActive={
                selectedCollection?.collectionAddress === collectionAddress
              }
              uri={nfts[0].uri}
              onClick={() =>
                handleOnClick({
                  collectionAddress: zHexAddr32.parse(collectionAddress),
                  nftsCount: nfts.length,
                })
              }
            />
          ))}
        </Stack>
        <NftsByCollectionSequencer
          nfts={
            selectedCollection?.collectionAddress
              ? collections[selectedCollection.collectionAddress]
              : Object.values(collections).flat()
          }
        />
      </Flex>
    </Box>
  );
};
