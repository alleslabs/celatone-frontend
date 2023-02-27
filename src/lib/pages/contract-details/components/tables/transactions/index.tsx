import { Grid } from "@chakra-ui/react";
import type { ChangeEvent } from "react";

import { NoTransactions } from "../NoTransactions";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { TableContainer, TableHeader } from "lib/components/table";
import { useTxsByContractAddressPagination } from "lib/services/txService";
import type { ContractAddr, Option } from "lib/types";

import { TxsTableRow } from "./TxsTableRow";

interface TransactionsTableProps {
  contractAddress: ContractAddr;
  scrollComponentId: string;
  totalData: Option<number>;
  refetchCount: () => void;
}

export const TransactionsTable = ({
  contractAddress,
  scrollComponentId,
  totalData,
  refetchCount,
}: TransactionsTableProps) => {
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

  const { data: transactions } = useTxsByContractAddressPagination(
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

  if (!transactions?.length)
    return (
      <NoTransactions displayText="This contract does not have any transactions yet." />
    );

  const templateColumnsStyle =
    "180px 70px minmax(360px, 1fr) repeat(2, max(170px)) max(300px)";

  return (
    <TableContainer>
      <Grid templateColumns={templateColumnsStyle}>
        <TableHeader>Transaction Hash</TableHeader>
        <TableHeader />
        <TableHeader>Messages</TableHeader>
        <TableHeader>Sender</TableHeader>
        <TableHeader>Block Height</TableHeader>
        <TableHeader>Timestamp</TableHeader>
      </Grid>
      {transactions?.map((transaction) => (
        <TxsTableRow
          key={transaction.hash}
          transaction={transaction}
          templateColumnsStyle={templateColumnsStyle}
        />
      ))}
      {totalData && totalData > 10 && (
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
