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

  const { data: mutateEvents, isLoading } = useNftMutateEvents(
    nftAddress,
    pageSize,
    offset,
    { onSuccess: ({ total }) => setTotalData(total) }
  );

  return (
    <>
      <MutateEventsTable
        mutateEvents={mutateEvents?.items}
        isLoading={isLoading}
        emptyState={
          <EmptyState imageVariant="empty" message="Mutate events not found." />
        }
      />
      {mutateEvents && mutateEvents?.total > 10 && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={mutateEvents.total}
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
