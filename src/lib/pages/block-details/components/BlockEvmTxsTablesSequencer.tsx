import { Box } from "@chakra-ui/react";
import { CosmosEvmTxs } from "lib/components/cosmos-evm-txs";
import { useEvmInternalTxsByBlockHeightSequencer } from "lib/services/evm-internal-txs";
import { useEvmTxsByBlockHeightSequencer } from "lib/services/evm-txs";
import { useTxsByBlockHeightSequencer } from "lib/services/tx";

interface BlockEvmTxsTablesSequencerProps {
  height: number;
}

export const BlockEvmTxsTablesSequencer = ({
  height,
}: BlockEvmTxsTablesSequencerProps) => {
  const cosmosTxsData = useTxsByBlockHeightSequencer(height);
  const evmTxsData = useEvmTxsByBlockHeightSequencer(height);
  const evmInternalTxsData = useEvmInternalTxsByBlockHeightSequencer(height);

  return (
    <Box borderTopColor="gray.700" borderTopWidth="1px" pt={8}>
      <CosmosEvmTxs
        cosmosData={{
          data: cosmosTxsData,
          emptyMessage: "There are no submitted transactions in this block",
        }}
        evmData={{
          emptyMessage: "There are no submitted EVM transactions in this block",
          evmInternalTxsData,
          evmTxsData,
        }}
      />
    </Box>
  );
};
