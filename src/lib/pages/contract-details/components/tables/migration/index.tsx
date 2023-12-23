import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { MobileTableContainer, TableContainer } from "lib/components/table";
import { useMigrationHistories } from "lib/pages/contract-details/data";
import type { ContractAddr, Option } from "lib/types";

import { MigrationHeader } from "./MigrationHeader";
import { MigrationMobileCard } from "./MigrationMobileCard";
import { MigrationRow } from "./MigrationRow";

interface MigrationTableProps {
  contractAddress: ContractAddr;
  scrollComponentId: string;
  totalData: Option<number>;
  refetchCount: () => void;
}

export const MigrationTable = ({
  contractAddress,
  scrollComponentId,
  totalData,
  refetchCount,
}: MigrationTableProps) => {
  const isMobile = useMobile();
  const {
    pagesQuantity,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    offset,
  } = usePaginator({
    total: totalData,
    initialState: {
      pageSize: 10,
      currentPage: 1,
      isDisabled: false,
    },
  });

  const { data, isLoading, error } = useMigrationHistories(
    contractAddress,
    offset,
    pageSize
  );

  if (isLoading) return <Loading />;
  if (error) return <ErrorFetching dataName="related proposals" />;
  if (!data?.items.length)
    return (
      <EmptyState
        imageVariant="empty"
        message="This contract does not have any migration history yet."
        withBorder
      />
    );

  const templateColumns =
    "90px minmax(300px, 1fr) minmax(220px, 1fr) repeat(2, max(150px)) max(232px) max(180px)";

  return (
    <>
      {isMobile ? (
        <MobileTableContainer>
          {data.items.map((history, idx) => (
            <MigrationMobileCard
              key={
                history.codeId +
                history.remark.operation +
                history.remark.type +
                history.remark.value +
                idx.toString()
              }
              history={history}
            />
          ))}
        </MobileTableContainer>
      ) : (
        <TableContainer>
          <MigrationHeader templateColumns={templateColumns} />
          {data.items.map((history, idx) => (
            <MigrationRow
              key={
                history.codeId +
                history.remark.operation +
                history.remark.type +
                history.remark.value +
                idx.toString()
              }
              history={history}
              templateColumns={templateColumns}
            />
          ))}
        </TableContainer>
      )}

      {!!totalData && totalData > 10 && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={totalData}
          scrollComponentId={scrollComponentId}
          pageSize={pageSize}
          onPageChange={(nextPage) => {
            refetchCount();
            setCurrentPage(nextPage);
          }}
          onPageSizeChange={(e) => {
            const size = Number(e.target.value);
            refetchCount();
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      )}
    </>
  );
};
