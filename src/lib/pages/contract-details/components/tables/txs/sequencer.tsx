import { CosmosEvmTxs } from "lib/components/cosmos-evm-txs";
import { useEvmInternalTxsByAccountAddressSequencer } from "lib/services/evm-internal-txs";
import { useEvmTxsByAccountAddressSequencer } from "lib/services/evm-txs";
import { useTxsByAddressSequencer } from "lib/services/tx";

import type { TxsTableProps } from "./types";

export const TxsTableSequencer = ({
  contractAddress,
  onViewMore,
}: TxsTableProps) => {
  const cosmosTxsData = useTxsByAddressSequencer(
    contractAddress,
    undefined,
    onViewMore ? 5 : 10
  );
  const evmTxsData = useEvmTxsByAccountAddressSequencer(
    contractAddress,
    undefined,
    onViewMore ? 5 : 10
  );
  const evmInternalTxsData = useEvmInternalTxsByAccountAddressSequencer(
    contractAddress,
    onViewMore ? 5 : 10
  );

  return (
    <CosmosEvmTxs
      cosmosData={{
        data: cosmosTxsData,
        emptyMessage: "This contract does not have any transactions.",
        onViewMore,
      }}
      evmData={{
        emptyMessage: "There are no EVM transactions on this contract.",
        evmInternalTxsData,
        evmTxsData,
        onViewMore,
        showTimestamp: true,
      }}
    />
  );
};
