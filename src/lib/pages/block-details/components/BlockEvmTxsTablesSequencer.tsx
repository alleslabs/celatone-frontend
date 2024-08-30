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
import type { TxDataJsonRpc } from "lib/services/types";

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
    const txs: TxDataJsonRpc[] = [];
    evmBlockData?.block.transactions.forEach((tx, index) => {
      txs.push({ tx, txReceipt: evmBlockData?.blockReceipts[index] });
    });
    return txs;
  }, [evmBlockData?.block.transactions, evmBlockData?.blockReceipts]);

  return (
    <Flex
      direction="column"
      gap={6}
      pt={8}
      borderTopColor="gray.700"
      borderTopWidth="1px"
    >
      <Heading as="h6" variant="h6">
        Transactions
      </Heading>
      <Tabs isLazy lazyBehavior="keepMounted">
        <TabList
          borderBottom="1px solid"
          borderColor="gray.700"
          overflowX="scroll"
          id={tableHeaderId}
        >
          <CustomTab count={cosmosTxs?.length}>Cosmos</CustomTab>
          <CustomTab count={evmTxs?.length}>Evm</CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel p={0} pt={{ base: 0, md: 6 }}>
            <TransactionsTable
              transactions={cosmosTxs}
              isLoading={isCosmosTxsLoading}
              emptyState={
                <EmptyState
                  imageVariant="empty"
                  message="There are no submitted transactions in this block"
                />
              }
              showSuccess
              showRelations={false}
              showTimestamp={false}
            />
          </TabPanel>
          <TabPanel p={0} pt={{ base: 0, md: 6 }}>
            <EvmTransactionsTable
              evmTransactions={evmTxs}
              isLoading={isEvmBlockDataLoading}
              emptyState={
                <EmptyState
                  imageVariant="empty"
                  message="There are no submitted evm transactions in this block"
                />
              }
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};
