import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { MutateEventsTable } from "lib/components/table";
import { useNftMutateEvents } from "lib/services/nft";
import type { HexAddr32 } from "lib/types";

interface NftMutateEventsProps {
  nftAddress: HexAddr32;
  totalData: number;
}

export const NftMutateEvents = ({
  nftAddress,
  totalData,
}: NftMutateEventsProps) => {
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

  const { data: mutateEvents, isLoading } = useNftMutateEvents(
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
      {totalData > 10 && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={totalData}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(e) => {
            const size = Number(e.target.value);
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      )}
    </>
  );
};
