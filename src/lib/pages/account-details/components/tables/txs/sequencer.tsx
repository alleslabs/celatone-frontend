import type { BechAddr20 } from "lib/types";

import { Box, Flex } from "@chakra-ui/react";
import { useEvmConfig, useMobile } from "lib/app-provider";
import { CosmosEvmTxs } from "lib/components/cosmos-evm-txs";
import { CosmosEvmTxsTab } from "lib/components/cosmos-evm-txs/types";
import { LoadNext } from "lib/components/LoadNext";
import { EmptyState, ErrorFetching } from "lib/components/state";
import {
  MobileTitle,
  TableTitle,
  TransactionsTable,
  ViewMore,
} from "lib/components/table";
import { useTxsByAddressSequencer } from "lib/services/tx";
import { useState } from "react";

import type { TxsTableProps } from "./types";

export const TxsTableSequencer = ({ address, onViewMore }: TxsTableProps) => {
  const isMobile = useMobile();
  const evm = useEvmConfig({ shouldRedirect: false });
  const [tab, setTab] = useState(CosmosEvmTxsTab.Cosmos);

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

  const title = "Transactions";
  const isMobileOverview = isMobile && !!onViewMore;

  if (isMobileOverview)
    return (
      <Box mt={[4, 8]}>
        <MobileTitle
          count={undefined}
          showCount={false}
          title={title}
          onViewMore={onViewMore}
        />
      </Box>
    );

  return (
    <Box mt={[4, 8]}>
      {evm.enabled ? (
        <CosmosEvmTxs
          address={address as BechAddr20}
          setTab={setTab}
          tab={tab}
          type="account"
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
