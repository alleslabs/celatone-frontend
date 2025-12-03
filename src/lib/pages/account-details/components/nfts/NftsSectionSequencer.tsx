import type { BechAddr, HexAddr32, Option } from "lib/types";

import { Badge, Box, Flex, Heading, Stack } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";
import { Loading } from "lib/components/Loading";
import { LoadNext } from "lib/components/LoadNext";
import { NftList } from "lib/components/nft";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { useDebounce } from "lib/hooks";
import {
  useNftsByAccountCountSequencerBatch,
  useNftsByAccountSequencer,
} from "lib/services/nft";
import { useNftCollectionsByAccountAddress } from "lib/services/nft-collection";
import { useState } from "react";

import { CollectionFilter, CollectionFilterDefault } from "./CollectionFilter";

interface NftsSectionSequencerProps {
  accountAddress: BechAddr;
  totalData: Option<number>;
}

export const NftsSectionSequencer = ({
  accountAddress,
  totalData = 0,
}: NftsSectionSequencerProps) => {
  const isMobile = useMobile();
  const [selectedCollection, setSelectedCollection] = useState<HexAddr32>();
  const [searchByTokenId, setSearchByTokenId] = useState("");
  const debouncedSearchByTokenId = useDebounce(searchByTokenId);

  const {
    data: accountNfts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useNftsByAccountSequencer(
    accountAddress,
    selectedCollection,
    debouncedSearchByTokenId
  );
  const { data: collections, isLoading: isCollectionsLoading } =
    useNftCollectionsByAccountAddress(accountAddress);

  const collectionAddresses =
    collections?.items.map((collection) => collection.collectionAddress) ?? [];
  const nftCountsByCollection = useNftsByAccountCountSequencerBatch(
    accountAddress,
    collectionAddresses
  );

  const hideCountBadge = accountNfts?.length && totalData === 0;

  if (isLoading || isCollectionsLoading) return <Loading />;
  if (!collections) return <ErrorFetching dataName="collections" />;
  if (!collections.items.length)
    return (
      <EmptyState
        imageVariant="empty"
        message="There are currently no NFTs held by this account."
      />
    );

  return (
    <Box mt={{ base: 4, md: 8 }}>
      <Flex align="center" gap="8px">
        <Heading variant="h6">NFTs</Heading>
        {!hideCountBadge && <Badge>{totalData}</Badge>}
      </Flex>
      <Flex flexDir={isMobile ? "column" : "row"} gap="40px" mt="32px">
        {/* Left Panel */}
        <Stack
          minW={64}
          spacing="8px"
          w={{ base: "100%", lg: "25%", md: "35%" }}
        >
          <CollectionFilterDefault
            collectionName="All collections"
            count={hideCountBadge ? undefined : totalData}
            isActive={selectedCollection === undefined}
            onClick={() => setSelectedCollection(undefined)}
          />
          {collections.items.map((collection, index) => (
            <CollectionFilter
              key={collection.collectionAddress}
              collectionAddress={collection.collectionAddress}
              collectionName={collection.collectionName}
              count={
                hideCountBadge ? undefined : nftCountsByCollection[index].data
              }
              isActive={selectedCollection === collection.collectionAddress}
              uri={
                accountNfts?.find(
                  (nft) =>
                    nft.collectionAddress === collection.collectionAddress
                )?.uri
              }
              onClick={() =>
                setSelectedCollection(collection.collectionAddress)
              }
            />
          ))}
        </Stack>

        {/* Right Panel */}
        <Stack spacing="24px" w="full">
          <InputWithIcon
            amptrackSection="nft-account-detail-tokenid-search"
            autoFocus={!isMobile}
            placeholder="Search with token ID"
            size={{ base: "md", md: "lg" }}
            value={searchByTokenId}
            onChange={(e) => setSearchByTokenId(e.target.value)}
          />
          <NftList
            emptyState={
              <EmptyState
                imageVariant="empty"
                message={
                  searchByTokenId
                    ? "There are no NFTs matching your keyword."
                    : "There are currently no NFTs held by this account."
                }
                withBorder
              />
            }
            nfts={accountNfts}
            showCollection
          />
          {hasNextPage && (
            <LoadNext
              fetchNextPage={fetchNextPage}
              isFetchingNextPage={isFetchingNextPage}
              text="Load more NFTs"
            />
          )}
        </Stack>
      </Flex>
    </Box>
  );
};
