import type { HexAddr32 } from "lib/types";

import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { MutateEventsTable } from "lib/components/table";
import { useQueryEvents } from "lib/hooks";
import { useNftCollectionMutateEvents } from "lib/services/nft-collection";

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

  const nftCollectionMutateEventsQuery = useNftCollectionMutateEvents(
    collectionAddress,
    pageSize,
    offset
  );
  useQueryEvents(nftCollectionMutateEventsQuery, {
    onSuccess: ({ total }) => setTotalData(total),
  });
  const { data: mutateEvents, isLoading } = nftCollectionMutateEventsQuery;

  return (
    <>
      <MutateEventsTable
        emptyState={
          <EmptyState
            imageVariant="empty"
            message="Mutate events are not found."
          />
        }
        isLoading={isLoading}
        mutateEvents={mutateEvents?.items}
      />
      {mutateEvents && mutateEvents.total > 10 && (
        <Pagination
          currentPage={currentPage}
          offset={offset}
          pageSize={pageSize}
          pagesQuantity={pagesQuantity}
          totalData={mutateEvents.total}
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
