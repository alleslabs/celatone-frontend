import {
  Heading,
  Stack,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useCallback } from "react";

import { useContractDetailsEvmTxs } from "../data";
import { TxsTabIndex } from "../types";
import { trackUseTab } from "lib/amplitude";
import { CustomTab } from "lib/components/CustomTab";
import { useTxsByAddressSequencer } from "lib/services/tx";
import type { BechAddr20 } from "lib/types";

import { EvmContractDetailsCosmosTxs } from "./EvmContractDetailsCosmosTxs";
import { EvmContractDetailsEvmTxs } from "./EvmContractDetailsEvmTxs";

interface EvmContractDetailsTxsProps {
  address: BechAddr20;
  onViewMore?: (tabIndex: TxsTabIndex) => void;
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
    data: txsData,
    fetchNextPage,
    hasNextPage,
    isLoading: isTxsLoading,
    isFetching: isTxsFetching,
    isFetchingNextPage,
    latestFetchedData,
  } = useTxsByAddressSequencer(address, undefined);

  const {
    data: evmTxsData,
    isLoading: isEvmTxsDataLoading,
    isFetching: isEvmTxsDataFetching,
  } = useContractDetailsEvmTxs(latestFetchedData);

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
      <Tabs index={Object.values(TxsTabIndex).indexOf(tab)}>
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
              txsData={txsData}
              isTxsLoading={isTxsLoading}
              hasNextPage={hasNextPage}
              fetchNextPage={fetchNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          </TabPanel>
          <TabPanel p={0} pt={6}>
            <EvmContractDetailsEvmTxs
              onViewMore={onViewMore}
              evmTxsData={evmTxsData}
              isEvmTxsDataLoading={isEvmTxsDataLoading}
              txsData={txsData}
              hasNextPage={hasNextPage}
              fetchNextPage={fetchNextPage}
              isFetchingNextPage={isFetchingNextPage}
              isTxsFetching={isTxsFetching}
              isEvmTxsDataFetching={isEvmTxsDataFetching}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
};
