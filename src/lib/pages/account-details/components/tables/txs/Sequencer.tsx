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
import { useTxsByAddressSequencer } from "lib/services/tx";
import type { BechAddr20 } from "lib/types";

import type { TxsTableProps } from "./types";

export const TxsTableSequencer = ({
  address,
  scrollComponentId,
  onViewMore,
}: TxsTableProps) => {
  const isMobile = useMobile();
  const { isFullTier } = useTierConfig();

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

  const { data, isLoading, error } = useTxsByAddressSequencer(
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
        <Flex direction="column" gap={6}>
          <TableTitle
            title="Transactions"
            count={txsCount}
            mb={0}
            showCount={isFullTier}
          />
          <Alert variant="warning" gap={3}>
            <CustomIcon
              name="alert-circle-solid"
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
              transactions={data?.items}
              isLoading={isLoading}
              emptyState={
                error ? (
                  <ErrorFetching dataName="transactions" />
                ) : (
                  <EmptyState
                    withBorder
                    imageVariant="empty"
                    message="There are no transactions on this account, or they have been pruned from the LCD."
                  />
                )
              }
              showRelations={false}
            />
          )}
          {data?.items.length && (
            <>
              {onViewMore ? (
                <>
                  {!isLoading &&
                    (txsCount === undefined || txsCount > 5) &&
                    !isMobile && <ViewMore onClick={onViewMore} />}
                </>
              ) : (
                <>
                  {!!(txsCount && txsCount > 10) && (
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
                  )}
                </>
              )}
            </>
          )}
        </Flex>
      )}
    </Box>
  );
};
