import type { BechAddr20 } from "lib/types";

import { Box } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { CosmosEvmTxs } from "lib/components/cosmos-evm-txs";
import { MobileTitle } from "lib/components/table";
import { useCosmosEvmTxs, useTxsByAddressSequencer } from "lib/services/tx";
import { useMemo } from "react";

import type { TxsTableProps } from "./types";

export const TxsTableSequencer = ({ address, onViewMore }: TxsTableProps) => {
  const isMobile = useMobile();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useTxsByAddressSequencer(
      address as BechAddr20,
      undefined,
      onViewMore ? 5 : 10
    );

  const txHashes = useMemo(() => data?.map((tx) => tx.hash) ?? [], [data]);
  const { data: evmTxsData, isLoading: isEvmTxsLoading } =
    useCosmosEvmTxs(txHashes);

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
    <CosmosEvmTxs
      cosmosEmptyMessage="There are no transactions on this account, or they have been pruned from the REST."
      cosmosTxs={data}
      evmEmptyMessage="There are no EVM transactions on this account."
      evmTxs={evmTxsData}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isCosmosTxsLoading={isLoading}
      isEvmTxsLoading={isEvmTxsLoading}
      isFetchingNextPage={isFetchingNextPage}
      onViewMore={onViewMore}
    />
  );
};
