import { Flex } from "@chakra-ui/react";
import type { ChangeEvent } from "react";

import { NoTransactions } from "../NoTransactions";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { useMigrationHistories } from "lib/pages/contract-details/model/data";
import type { ContractAddr } from "lib/types";

import { MigrationHeader } from "./MigrationHeader";
import { MigrationRow } from "./MigrationRow";

interface MigrationTableProps {
  contractAddress: ContractAddr;
  scrollComponentId: string;
  totalData: number;
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
    setPageSize(size);
    setCurrentPage(1);
  };

  if (!migrationHistories)
    return (
      <NoTransactions displayText="This contract does not have any migration history yet." />
    );

  const templateColumns =
    "90px minmax(300px, 1fr) repeat(2, max(150px)) max(232px) max(180px)";

  return (
    <Flex direction="column" overflowX="scroll">
      <MigrationHeader templateColumns={templateColumns} />
      {migrationHistories.map((history) => (
        <MigrationRow
          key={history.codeId}
          history={history}
          templateColumns={templateColumns}
        />
      ))}
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
    </Flex>
  );
};
