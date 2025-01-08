import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { BlocksTable } from "lib/components/table/blocks";
import { useBlocks } from "lib/services/block";

import type { RecentBlocksTableProps } from "./type";

export const RecentBlocksTableFull = ({
  isViewMore,
}: RecentBlocksTableProps) => {
  const {
    pagesQuantity,
    setTotalData,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    offset,
  } = usePaginator({
    initialState: {
      pageSize: isViewMore ? 5 : 10,
      currentPage: 1,
      isDisabled: false,
    },
  });
  const { data, isLoading } = useBlocks(pageSize, offset, {
    onSuccess: ({ total }) => setTotalData(total),
  });

  return (
    <>
      <BlocksTable
        blocks={data?.items}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            imageVariant="empty"
            message="This network does not have any blocks."
            withBorder
          />
        }
      />
      {!isViewMore && data && data.total > 10 && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={data.total}
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
