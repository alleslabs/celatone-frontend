import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { MutateEventsTable } from "lib/components/table";
import { useCollectionMutateEvents } from "lib/services/nft-collection";
import type { HexAddr32 } from "lib/types";

interface CollectionMutateEventsProps {
  collectionAddress: HexAddr32;
  totalCount: number;
}

export const CollectionMutateEvents = ({
  collectionAddress,
  totalCount,
}: CollectionMutateEventsProps) => {
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

  const { data: mutateEvents, isLoading } = useCollectionMutateEvents(
    collectionAddress,
    pageSize,
    offset
  );

  return (
    <>
      <MutateEventsTable
        mutateEvents={mutateEvents}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            imageVariant="empty"
            message="Mutate events are not found."
          />
        }
      />
      {totalCount > 10 && (
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
    </>
  );
};
