import type { ChangeEvent } from "react";

import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { useNftMutateEventsPagination } from "lib/services/nftService";
import type { HexAddr } from "lib/types";

import { MutateEventsTable } from "./MutateEventsTable";

const MutateEvents = ({
  nftAddress,
  totalCount,
}: {
  nftAddress: HexAddr;
  totalCount: number;
}) => {
  const {
    pagesQuantity,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    offset,
  } = usePaginator({
    total: totalCount,
    initialState: {
      pageSize: 10,
      currentPage: 1,
      isDisabled: false,
    },
  });

  const onPageChange = (nextPage: number) => {
    setCurrentPage(nextPage);
  };

  const onPageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const size = Number(e.target.value);
    setPageSize(size);
    setCurrentPage(1);
  };

  const { data: mutateEvents, isLoading } = useNftMutateEventsPagination(
    pageSize,
    offset,
    nftAddress
  );

  return (
    <>
      <MutateEventsTable
        mutateEvents={mutateEvents}
        isLoading={isLoading}
        emptyState={<EmptyState message="Mutate events not found." />}
      />
      {totalCount > 10 && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={totalCount}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </>
  );
};

export default MutateEvents;
