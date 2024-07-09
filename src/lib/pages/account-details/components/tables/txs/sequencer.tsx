import { Box, Flex } from "@chakra-ui/react";

import { useMobile, useTierConfig } from "lib/app-provider";
import { LoadNext } from "lib/components/LoadNext";
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

export const TxsTableSequencer = ({ address, onViewMore }: TxsTableProps) => {
  const isMobile = useMobile();
  const { isFullTier } = useTierConfig();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useTxsByAddressSequencer(
    address as BechAddr20,
    undefined,
    onViewMore ? 5 : 10
  );

  const isMobileOverview = isMobile && !!onViewMore;

  return (
    <Box mt={{ base: 4, md: 8 }}>
      {isMobileOverview ? (
        <MobileTitle
          title="Transactions"
          count={undefined}
          onViewMore={onViewMore}
          showCount={false}
        />
      ) : (
        <Flex direction="column" gap={6}>
          <TableTitle title="Transactions" mb={0} showCount={isFullTier} />
          {!isMobileOverview && (
            <TransactionsTable
              transactions={data}
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
              showRelations
            />
          )}
          {hasNextPage && (
            <>
              {onViewMore ? (
                <ViewMore onClick={onViewMore} />
              ) : (
                <LoadNext
                  text="Load more 10 transactions"
                  fetchNextPage={fetchNextPage}
                  isFetchingNextPage={isFetchingNextPage}
                />
              )}
            </>
          )}
        </Flex>
      )}
    </Box>
  );
};
