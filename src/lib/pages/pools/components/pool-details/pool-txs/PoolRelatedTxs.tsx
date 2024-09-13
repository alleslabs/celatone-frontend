import {
  Box,
  Flex,
  Heading,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";

import { PoolRelatedTxsTable } from "../tables/pool-txs";
import { trackUseTab } from "lib/amplitude";
import { CustomTab } from "lib/components/CustomTab";
import type { PoolDetail } from "lib/types";
import { PoolType } from "lib/types";

import { usePoolTxsTableCounts } from "./data";

enum TabIndex {
  All = "all",
  Swap = "swap",
  CLP = "clp",
  LP = "lp",
  Bonding = "bonding",
  Superfluid = "superfluid",
  Collect = "collect",
}

interface PoolRelatedTxsProps {
  pool: PoolDetail;
}

export const PoolRelatedTxs = ({ pool }: PoolRelatedTxsProps) => {
  const [tab, setTab] = useState(TabIndex.All);

  const {
    totalAllData = 0,
    isTotalAllLoading,
    totalSwapData = 0,
    isTotalSwapLoading,
    totalClpData = 0,
    isTotalClpLoading,
    totalLpData = 0,
    isTotalLpLoading,
    totalBondingData = 0,
    isTotalBondingLoading,
    totalSuperfluidData = 0,
    isTotalSuperfluidLoading,
    totalCollectData = 0,
    isTotalCollectLoading,
    totalMigrateData = 0,
    isTotalMigrateLoading,
  } = usePoolTxsTableCounts(pool.id);

  const handleTabChange = useCallback(
    (nextTab: TabIndex) => {
      if (nextTab === tab) return;
      trackUseTab(nextTab);
      setTab(nextTab);
    },
    [tab]
  );

  const tableHeaderId = "poolTableHeader";
  return (
    <Box>
      <Flex mt={12} gap={2} alignItems="center">
        <Heading as="h6" variant="h6">
          Related Transactions
        </Heading>
      </Flex>
      <Tabs>
        <TabList
          id={tableHeaderId}
          mt={4}
          borderBottom="1px"
          borderColor="gray.800"
        >
          <CustomTab
            count={totalAllData}
            isLoading={isTotalAllLoading}
            onClick={() => handleTabChange(TabIndex.All)}
          >
            All
          </CustomTab>
          <CustomTab
            count={totalSwapData}
            isDisabled={!totalSwapData}
            isLoading={isTotalSwapLoading}
            onClick={() => handleTabChange(TabIndex.Swap)}
          >
            Swap
          </CustomTab>
          {pool.type === PoolType.CL ? (
            <CustomTab
              count={totalClpData}
              isDisabled={!totalClpData}
              isLoading={isTotalClpLoading}
              onClick={() => handleTabChange(TabIndex.CLP)}
            >
              CLP
            </CustomTab>
          ) : (
            <CustomTab
              count={totalLpData}
              isDisabled={!totalLpData}
              isLoading={isTotalLpLoading}
              onClick={() => handleTabChange(TabIndex.LP)}
            >
              LP
            </CustomTab>
          )}
          <CustomTab
            count={totalBondingData}
            isDisabled={!totalBondingData}
            isLoading={isTotalBondingLoading}
            onClick={() => handleTabChange(TabIndex.Bonding)}
          >
            Bonding
          </CustomTab>
          {pool.isSuperfluid && (
            <CustomTab
              count={totalSuperfluidData}
              isDisabled={!totalSuperfluidData}
              isLoading={isTotalSuperfluidLoading}
              onClick={() => handleTabChange(TabIndex.Superfluid)}
            >
              Superfluid
            </CustomTab>
          )}
          {pool.type === PoolType.CL && (
            <CustomTab
              count={totalCollectData}
              isDisabled={!totalCollectData}
              isLoading={isTotalCollectLoading}
              onClick={() => handleTabChange(TabIndex.Collect)}
            >
              Collect
            </CustomTab>
          )}
          {(pool.type === PoolType.CL || pool.type === PoolType.BALANCER) && (
            <CustomTab
              count={totalMigrateData}
              isDisabled={!totalMigrateData}
              isLoading={isTotalMigrateLoading}
              onClick={() => trackUseTab("Migrate")}
            >
              Migrate
            </CustomTab>
          )}
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <PoolRelatedTxsTable
              pool={pool}
              countTxs={totalAllData}
              type="is_all"
              scrollComponentId={tableHeaderId}
            />
          </TabPanel>
          <TabPanel p={0}>
            <PoolRelatedTxsTable
              pool={pool}
              countTxs={totalSwapData}
              type="is_swap"
              scrollComponentId={tableHeaderId}
            />
          </TabPanel>
          {pool.type === PoolType.CL ? (
            <TabPanel p={0}>
              <PoolRelatedTxsTable
                pool={pool}
                countTxs={totalClpData}
                type="is_clp"
                scrollComponentId={tableHeaderId}
              />
            </TabPanel>
          ) : (
            <TabPanel p={0}>
              <PoolRelatedTxsTable
                pool={pool}
                countTxs={totalLpData}
                type="is_lp"
                scrollComponentId={tableHeaderId}
              />
            </TabPanel>
          )}
          <TabPanel p={0}>
            <PoolRelatedTxsTable
              pool={pool}
              countTxs={totalBondingData}
              type="is_bond"
              scrollComponentId={tableHeaderId}
            />
          </TabPanel>
          {pool.isSuperfluid && (
            <TabPanel p={0}>
              <PoolRelatedTxsTable
                pool={pool}
                countTxs={totalSuperfluidData}
                type="is_superfluid"
                scrollComponentId={tableHeaderId}
              />
            </TabPanel>
          )}
          {pool.type === PoolType.CL && (
            <TabPanel p={0}>
              <PoolRelatedTxsTable
                pool={pool}
                countTxs={totalCollectData}
                type="is_collect"
                scrollComponentId={tableHeaderId}
              />
            </TabPanel>
          )}
          {(pool.type === PoolType.CL || pool.type === PoolType.BALANCER) && (
            <TabPanel p={0}>
              <PoolRelatedTxsTable
                pool={pool}
                countTxs={totalMigrateData}
                type="is_migrate"
                scrollComponentId={tableHeaderId}
              />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </Box>
  );
};
