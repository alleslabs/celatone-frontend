import {
  Flex,
  Heading,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useMemo } from "react";

import { CustomTab } from "lib/components/CustomTab";
import { EmptyState } from "lib/components/state";
import { EvmTransactionsTable, TransactionsTable } from "lib/components/table";
import { useBlockDataJsonRpc } from "lib/services/block";
import { useTxsByBlockHeightSequencer } from "lib/services/tx";
import type { TxDataWithTimeStampJsonRpc } from "lib/services/types";

const tableHeaderId = "blockTxsTables";

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
    <Flex
      borderTopWidth="1px"
      gap={6}
      pt={8}
      borderTopColor="gray.700"
      direction="column"
    >
      <Heading as="h6" variant="h6">
        Transactions
      </Heading>
      <Tabs isLazy lazyBehavior="keepMounted">
        <TabList
          id={tableHeaderId}
          borderBottom="1px solid"
          borderColor="gray.700"
          overflowX="scroll"
        >
          <CustomTab count={cosmosTxs?.length}>Cosmos</CustomTab>
          <CustomTab count={evmTxs?.length}>EVM</CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel p={0} pt={{ base: 0, md: 6 }}>
            <TransactionsTable
              emptyState={
                <EmptyState
                  imageVariant="empty"
                  message="There are no submitted transactions in this block"
                />
              }
              isLoading={isCosmosTxsLoading}
              showRelations={false}
              showSuccess
              showTimestamp={false}
              transactions={cosmosTxs}
            />
          </TabPanel>
          <TabPanel p={0} pt={{ base: 0, md: 6 }}>
            <EvmTransactionsTable
              emptyState={
                <EmptyState
                  imageVariant="empty"
                  message="There are no submitted EVM transactions in this block"
                />
              }
              evmTransactions={evmTxs}
              isLoading={isEvmBlockDataLoading}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};
