import { Flex } from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import type { ChangeEvent } from "react";

import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import type { ContractState } from "lib/types";

import { StateCard } from "./StateCard";

interface StateListProps {
  totalData: number;
  states: ContractState[];
  isLoading: boolean;
  isSearching: boolean;
}

export const StateList = ({
  totalData,
  states,
  isLoading,
  isSearching,
}: StateListProps) => {
  const {
    pagesQuantity,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    offset,
  } = usePaginator({
    total: totalData,
    initialState: {
      pageSize: 10,
      currentPage: 1,
      isDisabled: false,
    },
  });

  const onPageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const size = Number(e.target.value);
    setPageSize(size);
    setCurrentPage(1);
  };

  const displayStates = useMemo(() => {
    return states.slice(offset, offset + pageSize);
  }, [offset, pageSize, states]);

  // reset page when states change
  useEffect(() => {
    setCurrentPage(1);
  }, [setCurrentPage, states]);

  if (states.length === 0 && isSearching) {
    return (
      <EmptyState
        imageVariant="not-found"
        message="No contract states match your search keyword within all loaded states."
      />
    );
  }

  return (
    <>
      <Flex direction="column" gap={4} flexWrap="wrap">
        {displayStates.map((state) => (
          <StateCard key={state.rawKey} state={state} />
        ))}
      </Flex>
      {!isLoading && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={totalData}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </>
  );
};
