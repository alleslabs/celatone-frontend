import type { ChangeEvent } from "react";

import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { MobileTableContainer, TableContainer } from "lib/components/table";
import {
  useBlockCountQuery,
  useBlocklistQuery,
} from "lib/services/blockService";

import { BlocksTableHeader } from "./BlocksTableHeader";
import { BlocksTableMobileCard } from "./BlocksTableMobileCard";
import { BlocksTableRow } from "./BlocksTableRow";

interface BlocksTableProps {
  isViewMore?: boolean;
}

const TEMPLATE_COLUMNS = "140px 160px minmax(300px,1fr) 120px 280px";
const scrollComponentId = "block-table-header";

export const BlocksTable = ({ isViewMore }: BlocksTableProps) => {
  const isMobile = useMobile();

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

  const {
    data: blocksData,
    isLoading,
    error,
  } = useBlocklistQuery(pageSize, offset);

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

  if (isLoading) return <Loading withBorder />;
  if (error)
    return (
      <EmptyState
        imageVariant="not-found"
        message="There is an error during fetching recent blocks."
        withBorder
      />
    );

  if (!blocksData || !blockCount)
    return (
      <EmptyState
        imageVariant="empty"
        message="This network does not have any blocks."
        withBorder
      />
    );

  return (
    <>
      {isMobile ? (
        <MobileTableContainer>
          {blocksData.map((block) => (
            <BlocksTableMobileCard key={block.hash} blockData={block} />
          ))}
        </MobileTableContainer>
      ) : (
        <TableContainer>
          <BlocksTableHeader
            templateColumns={TEMPLATE_COLUMNS}
            scrollComponentId={scrollComponentId}
          />
          {blocksData.map((block) => (
            <BlocksTableRow
              key={block.hash}
              templateColumns={TEMPLATE_COLUMNS}
              blockData={block}
            />
          ))}
        </TableContainer>
      )}
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
    </>
  );
};
