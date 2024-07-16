import { Badge, Box, Flex, Heading, Stack } from "@chakra-ui/react";
import { useState } from "react";

import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { useCollectionsByAccount } from "lib/services/nft-collection";
import type { HexAddr, HexAddr32, Option } from "lib/types";

import { FilterItem } from "./FilterItem";
import { NftsByCollection } from "./NftsByCollection";

interface SelectedCollection {
  collectionAddress: HexAddr32;
  nftsCount: number;
}

interface NftsSectionProps {
  address: HexAddr;
  totalData: Option<number>;
}

export const NftsSection = ({ address, totalData = 0 }: NftsSectionProps) => {
  const isMobile = useMobile();
  const { data: collections, isLoading } = useCollectionsByAccount(address);

  const [selectedCollection, setSelectedCollection] =
    useState<SelectedCollection>();

  if (isLoading) return <Loading />;
  if (!collections) return <ErrorFetching dataName="collections" />;
  if (!collections.length)
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
      <Flex gap="8px" align="center">
        <Heading variant="h6">NFTs</Heading>
        <Badge>{totalData}</Badge>
      </Flex>
      <Flex gap="40px" mt="32px" flexDir={isMobile ? "column" : "row"}>
        <Stack
          w={{ base: "100%", md: "35%", lg: "25%" }}
          minW={64}
          spacing="8px"
        >
          <FilterItem
            collectionName="All Collections"
            onClick={() => handleOnClick(undefined)}
            isActive={selectedCollection === undefined}
            count={totalData}
            isDefault
          />
          {collections.map((item) => (
            <FilterItem
              key={item.collectionAddress}
              collectionName={item.collectionName}
              onClick={() =>
                handleOnClick({
                  collectionAddress: item.collectionAddress,
                  nftsCount: item.hold,
                })
              }
              uri={item.uri}
              isActive={
                selectedCollection?.collectionAddress === item.collectionAddress
              }
              count={item.hold}
            />
          ))}
        </Stack>
        <NftsByCollection
          accountAddress={address}
          collectionAddress={selectedCollection?.collectionAddress}
        />
      </Flex>
    </Box>
  );
};
