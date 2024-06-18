import { Box } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState, ErrorFetching } from "lib/components/state";
import {
  MobileTitle,
  TableTitle,
  TransactionsTable,
  ViewMore,
} from "lib/components/table";
import { useTxsByAddressLcd } from "lib/services/tx";
import type { BechAddr20 } from "lib/types";

import type { TxsTableProps } from "./types";

export const TxsTableLite = ({
  address,
  scrollComponentId,
  onViewMore,
}: TxsTableProps) => {
  const isMobile = useMobile();

  const {
    pagesQuantity,
    setTotalData,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    offset,
  } = usePaginator({
    initialState: {
      pageSize: 10,
      currentPage: 1,
      isDisabled: false,
    },
  });

  const { data, isLoading, error } = useTxsByAddressLcd(
    address as BechAddr20,
    undefined,
    onViewMore ? 5 : pageSize,
    offset,
    {
      onSuccess: ({ total }) => setTotalData(total),
    }
  );

  const isMobileOverview = isMobile && !!onViewMore;
  const txsCount = data?.total;
  return (
    <Box mt={{ base: 4, md: 8 }}>
      {isMobileOverview ? (
        <MobileTitle
          title="Transactions"
          count={txsCount}
          onViewMore={onViewMore}
        />
      ) : (
        <>
          <TableTitle title="Transactions" count={txsCount} mb={0} />
          {!isMobileOverview && (
            <TransactionsTable
              transactions={data?.items}
              isLoading={isLoading}
              emptyState={
                error ? (
                  <ErrorFetching dataName="transactions" />
                ) : (
                  <EmptyState
                    withBorder
                    imageVariant="empty"
                    message="There are no transactions on this account or prune from LCD."
                  />
                )
              }
              showRelations={false}
            />
          )}
          {Boolean(data?.items?.length) &&
            (onViewMore
              ? !isLoading &&
                (txsCount === undefined || txsCount > 5) &&
                !isMobile && <ViewMore onClick={onViewMore} />
              : txsCount &&
                txsCount > 10 && (
                  <Pagination
                    currentPage={currentPage}
                    pagesQuantity={pagesQuantity}
                    offset={offset}
                    totalData={txsCount}
                    scrollComponentId={scrollComponentId}
                    pageSize={pageSize}
                    onPageChange={(nextPage) => setCurrentPage(nextPage)}
                    onPageSizeChange={(e) => {
                      const size = Number(e.target.value);
                      setPageSize(size);
                      setCurrentPage(1);
                    }}
                  />
                ))}
        </>
      )}
    </Box>
  );
};
