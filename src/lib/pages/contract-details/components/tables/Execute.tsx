import { Table, TableContainer, Tbody, Th, Thead, Tr } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useEffect } from "react";

import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { useExecuteTransactionsByContractAddress } from "lib/services/contractService";
import type { ContractAddr } from "lib/types";

import { ExecuteTableRow } from "./ExecuteTableRow";
import { NoTransactions } from "./NoTransactions";

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

  const { data: executeTransaction } = useExecuteTransactionsByContractAddress(
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

  return (
    <>
      <TableContainer>
        <Table variant="simple" sx={{ tableLayout: "auto" }}>
          <Thead>
            <Tr
              sx={{
                "& th": {
                  textTransform: "none",
                  color: "text.main",
                  fontWeight: 700,
                  py: 6,
                },
              }}
            >
              <Th w="15%">Transaction Hash</Th>
              <Th w="5%" />
              <Th w="30%">Execute Messages</Th>
              <Th w="15%">Sender</Th>
              <Th w="15%">Block Height</Th>
              <Th w="20%">Timestamp</Th>
            </Tr>
          </Thead>
          <Tbody>
            {executeTransaction?.map((transaction) => (
              <ExecuteTableRow
                key={transaction.hash}
                transaction={transaction}
              />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
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
    </>
  );
};
