import type { HexAddr32 } from "lib/types";

import { Heading, Stack } from "@chakra-ui/react";
import InputWithIcon from "lib/components/InputWithIcon";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { useDebounce, useQueryEvents } from "lib/hooks";
import { useNftCollectionActivities } from "lib/services/nft-collection";
import { useState } from "react";

import { ActivitiesTable } from "./ActivitiesTable";

interface ActivitiesFullProps {
  collectionAddress: HexAddr32;
}

export const ActivitiesFull = ({ collectionAddress }: ActivitiesFullProps) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const debouncedSearch = useDebounce(searchKeyword);

  const {
    currentPage,
    offset,
    pageSize,
    pagesQuantity,
    setCurrentPage,
    setPageSize,
    setTotalData,
  } = usePaginator({
    initialState: {
      currentPage: 1,
      isDisabled: false,
      pageSize: 10,
    },
  });
  const nftCollectionActivitiesQuery = useNftCollectionActivities(
    collectionAddress,
    pageSize,
    offset,
    debouncedSearch
  );
  useQueryEvents(nftCollectionActivitiesQuery, {
    onSuccess: ({ total }) => setTotalData(total),
  });
  const { data: activities, isLoading } = nftCollectionActivitiesQuery;

  return (
    <Stack mt="32px" spacing="32px">
      <Heading as="h6" fontWeight={600} variant="h6">
        Activities in this collection
      </Heading>
      <InputWithIcon
        amptrackSection="activities-in-this-collection-search"
        autoFocus
        placeholder="Search by tx hash / token ID / NFT address"
        size={{ base: "md", md: "lg" }}
        value={searchKeyword}
        onChange={(e) => {
          setSearchKeyword(e.target.value);
          setCurrentPage(1);
        }}
      />
      <ActivitiesTable
        activities={activities?.items}
        collectionAddress={collectionAddress}
        emptyState={
          <EmptyState
            imageVariant="not-found"
            message="There are no activities matches your keyword."
            withBorder
          />
        }
        isLoading={isLoading}
      />
      {activities && activities.total > 10 && !searchKeyword && (
        <Pagination
          currentPage={currentPage}
          offset={offset}
          pageSize={pageSize}
          pagesQuantity={pagesQuantity}
          totalData={activities.total}
          onPageChange={setCurrentPage}
          onPageSizeChange={(e) => {
            const size = Number(e.target.value);
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      )}
    </Stack>
  );
};
