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
