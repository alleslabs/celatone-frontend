import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { MutateEventsTable } from "lib/components/table";
import { useNftMutateEvents } from "lib/services/nft";
import type { HexAddr32 } from "lib/types";

interface NftMutateEventsProps {
  nftAddress: HexAddr32;
}

export const NftMutateEvents = ({ nftAddress }: NftMutateEventsProps) => {
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

  const { data: mutateEvents, isLoading } = useNftMutateEvents(
    nftAddress,
    pageSize,
    offset,
    { onSuccess: ({ total }) => setTotalData(total) }
  );

  return (
    <>
      <MutateEventsTable
        emptyState={
          <EmptyState imageVariant="empty" message="Mutate events not found." />
        }
        mutateEvents={mutateEvents?.items}
        isLoading={isLoading}
      />
      {mutateEvents && mutateEvents?.total > 10 && (
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
          totalData={mutateEvents.total}
        />
      )}
    </>
  );
};
