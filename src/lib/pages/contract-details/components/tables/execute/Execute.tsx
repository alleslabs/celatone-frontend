import { Flex, Grid } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useEffect } from "react";

import { NoTransactions } from "../NoTransactions";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { TableHeader } from "lib/components/table";
import { useExecuteTxsByContractAddress } from "lib/services/contractService";
import type { ContractAddr } from "lib/types";

import { ExecuteTableRow } from "./ExecuteTableRow";

interface ExecuteTableProps {
  contractAddress: ContractAddr;
  scrollComponentId: string;
  totalData: number;
  refetchCount: () => void;
}

export const ExecuteTable = ({
  contractAddress,
  scrollComponentId,
  totalData,
  refetchCount,
}: ExecuteTableProps) => {
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

  const { data: executeTransaction } = useExecuteTxsByContractAddress(
    contractAddress,
    offset,
    pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, setCurrentPage]);

  const onPageChange = (nextPage: number) => {
    refetchCount();
    setCurrentPage(nextPage);
  };

  const onPageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const size = Number(e.target.value);
    setPageSize(size);
  };

  if (!executeTransaction?.length)
    return (
      <NoTransactions displayText="This contract does not have any execute transactions yet." />
    );

  const templateColumnsStyle =
    "170px 70px minmax(300px, 1fr) repeat(2, max(170px)) max(300px)";

  return (
    <Flex direction="column" overflowX="scroll">
      <Grid templateColumns={templateColumnsStyle}>
        <TableHeader>Transaction Hash</TableHeader>
        <TableHeader />
        <TableHeader>Execute Messages</TableHeader>
        <TableHeader>Sender</TableHeader>
        <TableHeader>Block Height</TableHeader>
        <TableHeader>Timestamp</TableHeader>
      </Grid>
      {executeTransaction?.map((transaction) => (
        <ExecuteTableRow
          key={transaction.hash}
          transaction={transaction}
          templateColumnsStyle={templateColumnsStyle}
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
