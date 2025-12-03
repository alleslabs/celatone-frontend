import { useEvmConfig } from "lib/app-provider";
import { LoadNext } from "lib/components/LoadNext";
import { EmptyState } from "lib/components/state";
import { BlocksTable } from "lib/components/table/blocks";
import { EvmBlocksTable } from "lib/components/table/evm-blocks";
import { useBlocksSequencer } from "lib/services/block";

import type { RecentBlocksTableProps } from "./type";

export const RecentBlocksTableSequencer = ({
  isViewMore,
}: RecentBlocksTableProps) => {
  const evm = useEvmConfig({ shouldRedirect: false });
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useBlocksSequencer(isViewMore ? 5 : 10);

  return (
    <>
      {evm.enabled ? (
        <EvmBlocksTable
          blocks={data}
          emptyState={
            <EmptyState
              imageVariant="empty"
              message="This network does not have any blocks."
              withBorder
            />
          }
          isLoading={isLoading}
        />
      ) : (
        <BlocksTable
          blocks={data}
          emptyState={
            <EmptyState
              imageVariant="empty"
              message="This network does not have any blocks."
              withBorder
            />
          }
          isLoading={isLoading}
        />
      )}
      {!isViewMore && hasNextPage && (
        <LoadNext
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          text="Load more blocks"
        />
      )}
    </>
  );
};
