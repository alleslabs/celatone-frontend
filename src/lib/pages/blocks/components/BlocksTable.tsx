import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { MobileTableContainer, TableContainer } from "lib/components/table";
import { useBlocks } from "lib/services/blockService";

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
  const { data, isLoading, error } = useBlocks(pageSize, offset, {
    onSuccess: ({ total }) => setTotalData(total),
  });

  if (isLoading) return <Loading />;
  if (error)
    return (
      <ErrorFetching message="There is an error during fetching recent blocks." />
    );

  if (!data?.total)
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
          {data.items.map((block) => (
            <BlocksTableMobileCard key={block.hash} blockData={block} />
          ))}
        </MobileTableContainer>
      ) : (
        <TableContainer>
          <BlocksTableHeader
            templateColumns={TEMPLATE_COLUMNS}
            scrollComponentId={scrollComponentId}
          />
          {data.items.map((block) => (
            <BlocksTableRow
              key={block.hash}
              templateColumns={TEMPLATE_COLUMNS}
              blockData={block}
            />
          ))}
        </TableContainer>
      )}
      {!isViewMore && data.total > 10 && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={data.total}
          scrollComponentId={scrollComponentId}
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
