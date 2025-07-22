import { CosmosEvmTxs } from "lib/components/cosmos-evm-txs";
import { useCosmosEvmTxs, useTxsByAddressSequencer } from "lib/services/tx";
import { useMemo } from "react";

import type { TxsTableProps } from "./types";

export const TxsTableSequencer = ({
  contractAddress,
  onViewMore,
}: TxsTableProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useTxsByAddressSequencer(contractAddress, undefined, onViewMore ? 5 : 10);

  const txHashes = useMemo(() => data?.map((tx) => tx.hash) ?? [], [data]);
  const { data: evmTxsData, isLoading: isEvmTxsLoading } =
    useCosmosEvmTxs(txHashes);

  return (
    <CosmosEvmTxs
      cosmosEmptyMessage="This contract does not have any transactions."
      cosmosTxs={data}
      evmEmptyMessage="There are no EVM transactions on this contract."
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
