import { Table, TableContainer, Tbody, Th, Thead, Tr } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";

import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { useExecuteTransactions } from "lib/model/contract";
import type { ContractAddr } from "lib/types";

import { ExecuteTableRow } from "./ExecuteTableRow";
import { NoTransactions } from "./NoTransactions";

interface ExecuteTableProps {
  contractAddress: ContractAddr;
  scrollComponentId: string;
}

export const ExecuteTable = ({
  contractAddress,
  scrollComponentId,
}: ExecuteTableProps) => {
  const [totalData, setTotalData] = useState<number>(0);

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

  const { executeTransaction, count } = useExecuteTransactions(
    contractAddress,
    offset,
    pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, setCurrentPage]);

  useEffect(() => {
    setTotalData(count);
  }, [count]);

  const onPageChange = (nextPage: number) => {
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
