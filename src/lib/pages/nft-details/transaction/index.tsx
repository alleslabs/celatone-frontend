import { Box } from "@chakra-ui/react";
import type { ChangeEvent } from "react";

import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { useNftTransactionsPagination } from "lib/services/nft";
import type { HexAddr } from "lib/types";

import { TxsTable } from "./TxsTable";

const Txs = ({
  txCount,
  nftAddress,
}: {
  txCount: number;
  nftAddress: HexAddr;
}) => {
  const {
    pagesQuantity,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    offset,
  } = usePaginator({
    total: txCount,
    initialState: {
      pageSize: 10,
      currentPage: 1,
      isDisabled: false,
    },
  });

  const { data: transactions, isLoading } = useNftTransactionsPagination(
    pageSize,
    offset,
    nftAddress
  );

  const onPageChange = (nextPage: number) => {
    setCurrentPage(nextPage);
  };

  const onPageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const size = Number(e.target.value);
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <Box>
      <TxsTable
        txs={transactions}
        isLoading={isLoading}
        emptyState={
          <EmptyState message="Transactions not found." imageVariant="empty" />
        }
      />
      {txCount > 10 && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={txCount}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </Box>
  );
};

export default Txs;
