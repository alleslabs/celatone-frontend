import type { HexAddr32 } from "lib/types";

import { Box } from "@chakra-ui/react";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { useQueryEvents } from "lib/hooks";
import { useNftTransactions } from "lib/services/nft";

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

  const nftTransactionsQuery = useNftTransactions(nftAddress, pageSize, offset);
  useQueryEvents(nftTransactionsQuery, {
    onSuccess: ({ total }) => setTotalData(total),
  });
  const { data: transactions, isLoading } = nftTransactionsQuery;

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
