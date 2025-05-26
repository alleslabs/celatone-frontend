import type { BechAddr20 } from "lib/types";

import { Box, Flex } from "@chakra-ui/react";
import { useEvmConfig, useMobile } from "lib/app-provider";
import { LoadNext } from "lib/components/LoadNext";
import { EmptyState, ErrorFetching } from "lib/components/state";
import {
  MobileTitle,
  TableTitle,
  TransactionsTable,
  ViewMore,
} from "lib/components/table";
import { useTxsByAddressSequencer } from "lib/services/tx";

import type { TxsTableProps } from "./types";

export const TxsTableSequencer = ({ address, onViewMore }: TxsTableProps) => {
  const isMobile = useMobile();
  const evm = useEvmConfig({ shouldRedirect: false });

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useTxsByAddressSequencer(
    address as BechAddr20,
    undefined,
    onViewMore ? 5 : 10
  );

  const title = evm.enabled ? "Cosmos transactions" : "Transactions";
  const isMobileOverview = isMobile && !!onViewMore;

  return (
    <Box mt={[4, 8]}>
      {isMobileOverview ? (
        <MobileTitle
          count={undefined}
          showCount={false}
          title={title}
          onViewMore={onViewMore}
        />
      ) : (
        <Flex direction="column">
          <TableTitle mb={0} showCount={false} title={title} />
          {!isMobileOverview && (
            <TransactionsTable
              emptyState={
                error ? (
                  <ErrorFetching dataName="transactions" />
                ) : (
                  <EmptyState
                    imageVariant="empty"
                    message="There are no transactions on this account, or they have been pruned from the REST."
                    withBorder
                  />
                )
              }
              isLoading={isLoading}
              showRelations
              transactions={data}
            />
          )}
          {hasNextPage && (
            <>
              {onViewMore ? (
                <ViewMore onClick={onViewMore} />
              ) : (
                <LoadNext
                  fetchNextPage={fetchNextPage}
                  isFetchingNextPage={isFetchingNextPage}
                  text="Load more 10 transactions"
                />
              )}
            </>
          )}
        </Flex>
      )}
    </Box>
  );
};
