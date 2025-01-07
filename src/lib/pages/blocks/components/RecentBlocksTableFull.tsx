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
  const { data, isLoading } = useBlocks(pageSize, offset, {
    onSuccess: ({ total }) => setTotalData(total),
  });

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
        blocks={data?.items}
        isLoading={isLoading}
      />
      {!isViewMore && data && data.total > 10 && (
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
          totalData={data.total}
        />
      )}
    </>
  );
};
