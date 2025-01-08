import { Box } from "@chakra-ui/react";

import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { useNftTransactions } from "lib/services/nft";
import type { HexAddr32 } from "lib/types";

import { TxsTable } from "./TxsTable";

interface TxsFullProps {
  nftAddress: HexAddr32;
}

export const TxsFull = ({ nftAddress }: TxsFullProps) => {
  const {
    currentPage,
    offset,
    pageSize,
    pagesQuantity,
    setCurrentPage,
    setPageSize,
    setTotalData,
  } = usePaginator({
    initialState: {
      currentPage: 1,
      isDisabled: false,
      pageSize: 10,
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
        txs={transactions?.items}
        isLoading={isLoading}
      />
      {transactions && transactions?.total > 10 && (
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          pagesQuantity={pagesQuantity}
          offset={offset}
          onPageChange={setCurrentPage}
          onPageSizeChange={(e) => {
            const size = Number(e.target.value);
            setPageSize(size);
            setCurrentPage(1);
          }}
          totalData={transactions.total}
        />
      )}
    </Box>
  );
};
