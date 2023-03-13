import type { ChangeEvent } from "react";

import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { TableContainer } from "lib/components/table";
import { useMigrationHistories } from "lib/pages/contract-details/model/data";
import type { ContractAddr, Option } from "lib/types";

import { MigrationHeader } from "./MigrationHeader";
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

  const migrationHistories = useMigrationHistories(
    contractAddress,
    offset,
    pageSize
  );

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

  if (!migrationHistories?.length)
    return (
      <EmptyState
        message="This contract does not have any migration history yet."
        withBorder
      />
    );

  const templateColumns =
    "90px minmax(300px, 1fr) minmax(220px, 1fr) repeat(2, max(150px)) max(232px) max(180px)";

  return (
    <TableContainer>
      <MigrationHeader templateColumns={templateColumns} />
      {migrationHistories.map((history, idx) => (
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
      {!!totalData && totalData > 10 && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={totalData}
          scrollComponentId={scrollComponentId}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </TableContainer>
  );
};
