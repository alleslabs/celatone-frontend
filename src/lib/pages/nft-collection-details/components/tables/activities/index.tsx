import { Stack, Text } from "@chakra-ui/react";
import { useState } from "react";

import InputWithIcon from "lib/components/InputWithIcon";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { useCollectionActivities } from "lib/services/nft";
import type { HexAddr32 } from "lib/types";

import { ActivitiesTable } from "./ActivitiesTable";

interface ActivitiesProps {
  collectionAddress: HexAddr32;
  totalCount: number;
}

export const Activities = ({
  collectionAddress,
  totalCount,
}: ActivitiesProps) => {
  const [searchKeyword, setSearchKeyword] = useState("");

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
  const { data: activities, isLoading } = useCollectionActivities(
    collectionAddress,
    pageSize,
    offset,
    searchKeyword
  );

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
      {totalCount > 10 && !searchKeyword && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={totalCount}
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
