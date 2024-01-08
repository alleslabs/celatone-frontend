import { Stack, Text } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useState } from "react";

import InputWithIcon from "lib/components/InputWithIcon";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { useCollectionActivities } from "lib/services/nft";
import type { HexAddr } from "lib/types";

import { ActivitiesTable } from "./ActivitiesTable";

const Activities = ({
  collectionAddress,
  totalActivitiesCount,
}: {
  collectionAddress: HexAddr;
  totalActivitiesCount: number;
}) => {
  const {
    pagesQuantity,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    offset,
  } = usePaginator({
    initialState: {
      pageSize: 10,
      currentPage: 1,
      isDisabled: false,
    },
  });

  const [searchKeyword, setSearchKeyword] = useState("");

  const { data: activities, isLoading } = useCollectionActivities(
    collectionAddress,
    pageSize,
    offset,
    searchKeyword
  );

  const onPageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const size = Number(e.target.value);
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <Stack spacing="32px" mt="32px">
      <Text fontSize="18px" fontWeight={600} fontFamily="Pilat Wide">
        Activities in this collection
      </Text>
      <InputWithIcon
        placeholder="Search by Tx Hash / Token Id / NFT Address"
        value={searchKeyword}
        autoFocus
        onChange={(e) => {
          setSearchKeyword(e.target.value);
          setCurrentPage(1);
        }}
        size={{ base: "md", md: "lg" }}
      />
      <ActivitiesTable
        activities={activities}
        isLoading={isLoading}
        collectionAddress={collectionAddress}
        emptyState={
          <EmptyState
            message="There are no activities matches your keyword."
            imageVariant="not-found"
            withBorder
          />
        }
      />
      {totalActivitiesCount > 10 && !searchKeyword && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={totalActivitiesCount}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </Stack>
  );
};

export default Activities;
