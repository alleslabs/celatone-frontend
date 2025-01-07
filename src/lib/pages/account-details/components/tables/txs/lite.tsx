import { Alert, AlertDescription, Box, Flex } from "@chakra-ui/react";

import { useMobile, useTierConfig } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
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
  onViewMore,
  scrollComponentId,
}: TxsTableProps) => {
  const isMobile = useMobile();
  const { isFullTier } = useTierConfig();

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

  const { data, error, isLoading } = useTxsByAddressLcd(
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
          showCount={isFullTier}
        />
      ) : (
        <Flex gap={6} direction="column">
          <TableTitle
            mb={0}
            title="Transactions"
            count={txsCount}
            showCount={isFullTier}
          />
          <Alert gap={3} variant="warning">
            <CustomIcon
              name="alert-triangle-solid"
              boxSize={4}
              color="warning.main"
            />
            <AlertDescription>
              Please note that account transactions are queried from the LCD and
              may have pruned transactions that will not be displayed.
            </AlertDescription>
          </Alert>
          {!isMobileOverview && (
            <TransactionsTable
              emptyState={
                error ? (
                  <ErrorFetching dataName="transactions" />
                ) : (
                  <EmptyState
                    imageVariant="empty"
                    message="There are no transactions on this account, or they have been pruned from the LCD."
                    withBorder
                  />
                )
              }
              isLoading={isLoading}
              showRelations={false}
              transactions={data?.items}
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
                    pageSize={pageSize}
                    pagesQuantity={pagesQuantity}
                    offset={offset}
                    onPageChange={(nextPage) => setCurrentPage(nextPage)}
                    onPageSizeChange={(e) => {
                      const size = Number(e.target.value);
                      setPageSize(size);
                      setCurrentPage(1);
                    }}
                    scrollComponentId={scrollComponentId}
                    totalData={txsCount}
                  />
                ))}
        </Flex>
      )}
    </Box>
  );
};
