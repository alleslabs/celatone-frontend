import type { TxDataWithTimeStampJsonRpc } from "lib/services/types";

import {
  Flex,
  Heading,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { CustomTab } from "lib/components/CustomTab";
import { EmptyState } from "lib/components/state";
import { EvmTransactionsTable, TransactionsTable } from "lib/components/table";
import { useBlockDataJsonRpc } from "lib/services/block";
import { useTxsByBlockHeightSequencer } from "lib/services/tx";
import { useMemo } from "react";

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
        tx,
        txReceipt: evmBlockData.blockReceipts[index],
        timestamp: evmBlockData.block.timestamp,
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
      borderTopColor="gray.700"
      borderTopWidth="1px"
      direction="column"
      gap={6}
      pt={8}
    >
      <Heading as="h6" variant="h6">
        Transactions
      </Heading>
      <Tabs isLazy lazyBehavior="keepMounted">
        <TabList
          id={tableHeaderId}
          borderBottomWidth="1px"
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
