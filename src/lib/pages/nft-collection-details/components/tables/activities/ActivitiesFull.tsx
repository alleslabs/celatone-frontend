import { Heading, Stack } from "@chakra-ui/react";
import { useState } from "react";

import InputWithIcon from "lib/components/InputWithIcon";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { useDebounce } from "lib/hooks";
import { useNftCollectionActivities } from "lib/services/nft-collection";
import type { HexAddr32 } from "lib/types";

import { ActivitiesTable } from "./ActivitiesTable";

interface ActivitiesFullProps {
  collectionAddress: HexAddr32;
}

export const ActivitiesFull = ({ collectionAddress }: ActivitiesFullProps) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const debouncedSearch = useDebounce(searchKeyword);

  const {
    pagesQuantity,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    offset,
    setTotalData,
  } = usePaginator({
    initialState: {
      pageSize: 10,
      currentPage: 1,
      isDisabled: false,
    },
  });
  const { data: activities, isLoading } = useNftCollectionActivities(
    collectionAddress,
    pageSize,
    offset,
    debouncedSearch,
    {
      onSuccess: ({ total }) => setTotalData(total),
    }
  );

  return (
    <Stack spacing="32px" mt="32px">
      <Heading as="h6" variant="h6" fontWeight={600}>
        Activities in this collection
      </Heading>
      <InputWithIcon
        placeholder="Search by Tx Hash / Token Id / NFT Address"
        value={searchKeyword}
        autoFocus
        onChange={(e) => {
          setSearchKeyword(e.target.value);
          setCurrentPage(1);
        }}
        size={{ base: "md", md: "lg" }}
        amptrackSection="activities-in-this-collection-search"
      />
      <ActivitiesTable
        collectionAddress={collectionAddress}
        activities={activities?.items}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            message="There are no activities matches your keyword."
            imageVariant="not-found"
            withBorder
          />
        }
      />
      {activities && activities.total > 10 && !searchKeyword && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={activities.total}
          pageSize={pageSize}
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
