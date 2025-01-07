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
    <Stack mt="32px" spacing="32px">
      <Heading as="h6" variant="h6" fontWeight={600}>
        Activities in this collection
      </Heading>
      <InputWithIcon
        size={{ base: "md", md: "lg" }}
        value={searchKeyword}
        amptrackSection="activities-in-this-collection-search"
        autoFocus
        onChange={(e) => {
          setSearchKeyword(e.target.value);
          setCurrentPage(1);
        }}
        placeholder="Search by Tx Hash / Token Id / NFT Address"
      />
      <ActivitiesTable
        activities={activities?.items}
        emptyState={
          <EmptyState
            imageVariant="not-found"
            message="There are no activities matches your keyword."
            withBorder
          />
        }
        collectionAddress={collectionAddress}
        isLoading={isLoading}
      />
      {activities && activities.total > 10 && !searchKeyword && (
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          pagesQuantity={pagesQuantity}
          offset={offset}
          onPageChange={setCurrentPage}
          onPageSizeChange={(e) => {
            const size = Number(e.target.value);
            setPageSize(size);
            setCurrentPage(1);
          }}
          totalData={activities.total}
        />
      )}
    </Stack>
  );
};
