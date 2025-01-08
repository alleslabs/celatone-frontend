import { LoadNext } from "lib/components/LoadNext";
import { EmptyState } from "lib/components/state";
import { BlocksTable } from "lib/components/table/blocks";
import { useBlocksSequencer } from "lib/services/block";

import type { RecentBlocksTableProps } from "./type";

export const RecentBlocksTableSequencer = ({
  isViewMore,
}: RecentBlocksTableProps) => {
  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useBlocksSequencer(isViewMore ? 5 : 10);

  return (
    <>
      <BlocksTable
        blocks={data}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            imageVariant="empty"
            message="This network does not have any blocks."
            withBorder
          />
        }
      />
      {!isViewMore && hasNextPage && (
        <LoadNext
          text="Load more 10 blocks"
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}
    </>
  );
};
