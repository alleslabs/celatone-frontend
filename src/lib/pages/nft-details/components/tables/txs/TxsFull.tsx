import type { HexAddr32 } from "lib/types";

import { Box } from "@chakra-ui/react";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { useNftTransactions } from "lib/services/nft";

import { TxsTable } from "./TxsTable";

interface TxsFullProps {
  nftAddress: HexAddr32;
}

export const TxsFull = ({ nftAddress }: TxsFullProps) => {
  const {
    pagesQuantity,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    offset,
    setTotalData,
  } = usePaginator({
    initialState: {
      pageSize: 10,
      currentPage: 1,
      isDisabled: false,
    },
  });

  const { data: transactions, isLoading } = useNftTransactions(
    pageSize,
    offset,
    nftAddress,
    { onSuccess: ({ total }) => setTotalData(total) }
  );

  return (
    <Box>
      <TxsTable
        emptyState={
          <EmptyState imageVariant="empty" message="Transactions not found." />
        }
        isLoading={isLoading}
        txs={transactions?.items}
      />
      {transactions && transactions?.total > 10 && (
        <Pagination
          currentPage={currentPage}
          offset={offset}
          pageSize={pageSize}
          pagesQuantity={pagesQuantity}
          totalData={transactions.total}
          onPageChange={setCurrentPage}
          onPageSizeChange={(e) => {
            const size = Number(e.target.value);
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      )}
    </Box>
  );
};
