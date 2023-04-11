import type { ChangeEvent } from "react";

import { Loading } from "lib/components/Loading";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { TableContainer } from "lib/components/table";
import {
  useBlockCountQuery,
  useBlocklistQuery,
} from "lib/services/blockService";

import { BlocksHeader } from "./BlocksHeader";
import { BlocksRow } from "./BlocksRow";

interface BlocksTableProps {
  isViewMore?: boolean;
}

const TEMPLATE_COLUMNS = "140px 160px minmax(300px,1fr) 120px 280px";
const scrollComponentId = "block-table-header";

export const BlocksTable = ({ isViewMore }: BlocksTableProps) => {
  const { data: blockCount, refetch: refetchCount } = useBlockCountQuery();

  const {
    pagesQuantity,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    offset,
  } = usePaginator({
    total: blockCount,
    initialState: {
      pageSize: isViewMore ? 5 : 10,
      currentPage: 1,
      isDisabled: false,
    },
  });

  const { data: blocksData, isLoading } = useBlocklistQuery(pageSize, offset);

  const onPageChange = (nextPage: number) => {
    refetchCount();
    setCurrentPage(nextPage);
  };

  const onPageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const size = Number(e.target.value);
    refetchCount();
    setPageSize(size);
    setCurrentPage(1);
  };

  if (isLoading || !blocksData || !blockCount) return <Loading />;

  return (
    <TableContainer>
      <BlocksHeader
        templateColumns={TEMPLATE_COLUMNS}
        scrollComponentId={scrollComponentId}
      />
      {blocksData.map((block) => (
        <BlocksRow templateColumns={TEMPLATE_COLUMNS} blockData={block} />
      ))}
      {!isViewMore && blockCount > 10 && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={blockCount}
          scrollComponentId={scrollComponentId}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </TableContainer>
  );
};
