import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { MutateEventsTable } from "lib/components/table";
import { useNftCollectionMutateEvents } from "lib/services/nft-collection";
import type { HexAddr32 } from "lib/types";

interface CollectionMutateEventsProps {
  collectionAddress: HexAddr32;
}

export const CollectionMutateEvents = ({
  collectionAddress,
}: CollectionMutateEventsProps) => {
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

  const { data: mutateEvents, isLoading } = useNftCollectionMutateEvents(
    collectionAddress,
    pageSize,
    offset,
    { onSuccess: ({ total }) => setTotalData(total) }
  );

  return (
    <>
      <MutateEventsTable
        emptyState={
          <EmptyState
            imageVariant="empty"
            message="Mutate events are not found."
          />
        }
        mutateEvents={mutateEvents?.items}
        isLoading={isLoading}
      />
      {mutateEvents && mutateEvents.total > 10 && (
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
