import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { BlocksTable } from "lib/components/table/blocks";
import { useQueryEvents } from "lib/hooks";
import { useBlocks } from "lib/services/block";

import type { RecentBlocksTableProps } from "./type";

export const RecentBlocksTableFull = ({
  isViewMore,
}: RecentBlocksTableProps) => {
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
      pageSize: isViewMore ? 5 : 10,
    },
  });
  const blocksQuery = useBlocks(pageSize, offset);
  useQueryEvents(blocksQuery, {
    onSuccess: ({ total }) => setTotalData(total),
  });
  const { data, isLoading } = blocksQuery;

  return (
    <>
      <BlocksTable
        blocks={data?.items}
        emptyState={
          <EmptyState
            imageVariant="empty"
            message="This network does not have any blocks."
            withBorder
          />
        }
        isLoading={isLoading}
      />
      {!isViewMore && data && data.total > 10 && (
        <Pagination
          currentPage={currentPage}
          offset={offset}
          pageSize={pageSize}
          pagesQuantity={pagesQuantity}
          totalData={data.total}
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
