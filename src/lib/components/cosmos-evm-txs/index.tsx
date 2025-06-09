import type { BechAddr20 } from "lib/types";

import {
  Heading,
  Stack,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { trackUseTab } from "lib/amplitude";
import { CustomTab } from "lib/components/CustomTab";
import { useCallback } from "react";

import { CosmosTxs } from "./CosmosTxs";
import { EvmTxs } from "./EvmTxs";
import { CosmosEvmTxsTab } from "./types";

interface CosmosEvmTxsProps {
  address: BechAddr20;
  onViewMore?: () => void;
  setTab: (tab: CosmosEvmTxsTab) => void;
  tab: CosmosEvmTxsTab;
  type: "account" | "contract";
}

export const CosmosEvmTxs = ({
  address,
  onViewMore,
  setTab,
  tab,
  type,
}: CosmosEvmTxsProps) => {
  const handleTabChange = useCallback(
    (nextTab: CosmosEvmTxsTab) => () => {
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
        index={Object.values(CosmosEvmTxsTab).indexOf(tab)}
        isLazy
        lazyBehavior="keepMounted"
      >
        <TabList>
          <CustomTab onClick={handleTabChange(CosmosEvmTxsTab.Cosmos)}>
            Cosmos
          </CustomTab>
          <CustomTab onClick={handleTabChange(CosmosEvmTxsTab.Evm)}>
            EVM
          </CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel p={0} pt={6}>
            <CosmosTxs address={address} type={type} onViewMore={onViewMore} />
          </TabPanel>
          <TabPanel p={0} pt={6}>
            <EvmTxs address={address} type={type} onViewMore={onViewMore} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
};
