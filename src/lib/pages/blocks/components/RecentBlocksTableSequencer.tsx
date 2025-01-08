import { LoadNext } from "lib/components/LoadNext";
import { EmptyState } from "lib/components/state";
import { BlocksTable } from "lib/components/table/blocks";
import { useBlocksSequencer } from "lib/services/block";

import type { RecentBlocksTableProps } from "./type";

export const RecentBlocksTableSequencer = ({
  isViewMore,
}: RecentBlocksTableProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useBlocksSequencer(isViewMore ? 5 : 10);

  return (
    <>
      <BlocksTable
        emptyState={
          <EmptyState
            imageVariant="empty"
            message="This network does not have any blocks."
            withBorder
          />
        }
        blocks={data}
        isLoading={isLoading}
      />
      {!isViewMore && hasNextPage && (
        <LoadNext
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          text="Load more 10 blocks"
        />
      )}
    </>
  );
};
