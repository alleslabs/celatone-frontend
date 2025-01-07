import { Flex } from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import type { ChangeEvent } from "react";

import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import type { ContractState } from "lib/types";

import { StateCard } from "./StateCard";

interface StateListProps {
  isLoading: boolean;
  isSearching: boolean;
  states: ContractState[];
  totalData: number;
}

export const StateList = ({
  isLoading,
  isSearching,
  states,
  totalData,
}: StateListProps) => {
  const {
    currentPage,
    offset,
    pageSize,
    pagesQuantity,
    setCurrentPage,
    setPageSize,
  } = usePaginator({
    initialState: {
      currentPage: 1,
      isDisabled: false,
      pageSize: 10,
    },
    total: totalData,
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
      <Flex flexWrap="wrap" gap={4} direction="column">
        {displayStates.map((state) => (
          <StateCard key={state.rawKey} state={state} />
        ))}
      </Flex>
      {!isLoading && (
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          pagesQuantity={pagesQuantity}
          offset={offset}
          onPageChange={setCurrentPage}
          onPageSizeChange={onPageSizeChange}
          totalData={totalData}
        />
      )}
    </>
  );
};
