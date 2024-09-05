import {
  Heading,
  Stack,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useCallback } from "react";

import { useContractDetailsTxs } from "../data";
import { TxsTabIndex } from "../types";
import { trackUseTab } from "lib/amplitude";
import { CustomTab } from "lib/components/CustomTab";
import type { BechAddr20 } from "lib/types";

import { EvmContractDetailsCosmosTxs } from "./EvmContractDetailsCosmosTxs";
import { EvmContractDetailsEvmTxs } from "./EvmContractDetailsEvmTxs";

interface EvmContractDetailsTxsProps {
  address: BechAddr20;
  onViewMore?: () => void;
  tab: TxsTabIndex;
  setTab: (tab: TxsTabIndex) => void;
}

export const EvmContractDetailsTxs = ({
  address,
  onViewMore,
  tab,
  setTab,
}: EvmContractDetailsTxsProps) => {
  const {
    cosmosTxs,
    evmTxs,
    isCosmosTxsLoading,
    isCosmosTxsFetchingNextpage,
    isEvmTxsLoading,
    isEvmTxsFetchingNextpage,
    fetchNextPage,
    hasNextPage,
  } = useContractDetailsTxs(address);

  const handleTabChange = useCallback(
    (nextTab: TxsTabIndex) => () => {
      if (nextTab === tab) return;
      trackUseTab(nextTab);
      setTab(nextTab);
    },
    [tab, setTab]
  );

  return (
    <Stack gap={6}>
      <Heading as="h6" variant="h6">
        Transactions
      </Heading>
      <Tabs
        index={Object.values(TxsTabIndex).indexOf(tab)}
        isLazy
        lazyBehavior="keepMounted"
      >
        <TabList>
          <CustomTab onClick={handleTabChange(TxsTabIndex.Cosmos)}>
            Cosmos
          </CustomTab>
          <CustomTab onClick={handleTabChange(TxsTabIndex.Evm)}>EVM</CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel p={0} pt={6}>
            <EvmContractDetailsCosmosTxs
              onViewMore={onViewMore}
              cosmosTxs={cosmosTxs}
              isCosmosTxsLoading={isCosmosTxsLoading}
              hasNextPage={hasNextPage}
              fetchNextPage={fetchNextPage}
              isFetchingNextPage={isCosmosTxsFetchingNextpage}
            />
          </TabPanel>
          <TabPanel p={0} pt={6}>
            <EvmContractDetailsEvmTxs
              onViewMore={onViewMore}
              evmTxs={evmTxs}
              isEvmTxsLoading={isEvmTxsLoading}
              cosmosTxsCount={cosmosTxs?.length}
              hasNextPage={hasNextPage}
              fetchNextPage={fetchNextPage}
              isFetchingNextPage={isEvmTxsFetchingNextpage}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
};