import {
  Flex,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  Text,
} from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useCallback, useEffect, useState } from "react";

import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { useExecuteTransactions } from "lib/model/contract";
import type { ContractAddr } from "lib/types";

import { ExecuteTableRow } from "./ExecuteTableRow";

interface ExecuteTableProps {
  contractAddress: ContractAddr;
  tableHeader: string;
}

export const ExecuteTable = ({
  contractAddress,
  tableHeader,
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

  const { executeTransaction, count, refetch } = useExecuteTransactions(
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

  useEffect(() => {
    refetch();
  }, [pageSize, offset, refetch]);

  // Page change
  const onPageChange = useCallback(
    (nextPage: number) => {
      setCurrentPage(nextPage);
    },
    [setCurrentPage]
  );

  // Page Sizing
  const onPageSizeChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const size = Number(e.target.value);
      setPageSize(size);
    },
    [setPageSize]
  );

  if (executeTransaction?.length === 0) {
    return (
      <Flex
        justifyContent="center"
        h="124px"
        borderY="1px"
        borderColor="divider.main"
      >
        <Text
          variant="body2"
          color="text.dark"
          textAlign="center"
          alignSelf="center"
        >
          This contract does not have any execute transactions yet.
        </Text>
      </Flex>
    );
  }
  return (
    <>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr
              sx={{
                "& th": { textTransform: "none", color: "text.dark" },
              }}
            >
              <Th w="12%">Transaction Hash</Th>
              <Th w="8%" />
              <Th w="31%">Execute Messages</Th>
              <Th w="12%">Sender</Th>
              <Th w="12%">Block Height</Th>
              <Th w="25%">Timestamp</Th>
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
        totalData={count}
        scrollTo={tableHeader}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </>
  );
};
