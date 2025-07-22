import type { TxDataWithTimeStampJsonRpc } from "lib/services/types";

import { Box } from "@chakra-ui/react";
import { CosmosEvmTxs } from "lib/components/cosmos-evm-txs";
import { useBlockDataJsonRpc } from "lib/services/block";
import { useTxsByBlockHeightSequencer } from "lib/services/tx";
import { useMemo } from "react";

interface BlockEvmTxsTablesSequencerProps {
  height: number;
}

export const BlockEvmTxsTablesSequencer = ({
  height,
}: BlockEvmTxsTablesSequencerProps) => {
  const { data: cosmosTxs, isLoading: isCosmosTxsLoading } =
    useTxsByBlockHeightSequencer(height);
  const { data: evmBlockData, isLoading: isEvmBlockDataLoading } =
    useBlockDataJsonRpc(height);

  const evmTxs = useMemo(() => {
    const txs: TxDataWithTimeStampJsonRpc[] = [];
    // TODO: double check if order matches
    evmBlockData?.block.transactions.forEach((tx, index) => {
      txs.push({
        timestamp: evmBlockData.block.timestamp,
        tx,
        txReceipt: evmBlockData.blockReceipts[index],
      });
    });
    return txs;
  }, [
    evmBlockData?.block.timestamp,
    evmBlockData?.block.transactions,
    evmBlockData?.blockReceipts,
  ]);

  return (
    <Box borderTopColor="gray.700" borderTopWidth="1px" pt={8}>
      <CosmosEvmTxs
        cosmosEmptyMessage="There are no submitted transactions in this block"
        cosmosTxs={cosmosTxs}
        evmEmptyMessage="There are no submitted EVM transactions in this block"
        evmTxs={evmTxs}
        isCosmosTxsLoading={isCosmosTxsLoading}
        isEvmTxsLoading={isEvmBlockDataLoading}
      />
    </Box>
  );
};
