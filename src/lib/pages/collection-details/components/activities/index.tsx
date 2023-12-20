import { Stack, Text } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useState } from "react";

import { TextInput } from "lib/components/forms";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { useCollectionActivities } from "lib/services/collectionService";

import { ActivitiesTable } from "./ActivitiesTable";

const Activities = ({
  collectionAddress,
  totalActivitiesCount,
}: {
  collectionAddress: string;
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
        Activities
      </Text>
      <TextInput
        variant="fixed-floating"
        value={searchKeyword}
        setInputState={setSearchKeyword}
        placeholder="Search by Tx Hash"
        size="md"
      />
      <ActivitiesTable activities={activities} isLoading={isLoading} />
      {totalActivitiesCount > 10 && (
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
