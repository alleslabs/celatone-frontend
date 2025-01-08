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
import { UPPERBOUND_COUNT } from "lib/data";
import type { PoolData } from "lib/types";
import { PoolType } from "lib/types";

import { usePoolTxsTableCounts } from "./data";

enum TabIndex {
  All = "all",
  Bonding = "bonding",
  CLP = "clp",
  Collect = "collect",
  LP = "lp",
  Superfluid = "superfluid",
  Swap = "swap",
}

interface PoolRelatedTxsProps {
  pool: PoolData;
}

const FALLBACK_COUNT = `${UPPERBOUND_COUNT}+`;

export const PoolRelatedTxs = ({ pool }: PoolRelatedTxsProps) => {
  const [tab, setTab] = useState(TabIndex.All);

  const {
    isTotalAllLoading,
    isTotalBondingLoading,
    isTotalClpLoading,
    isTotalCollectLoading,
    isTotalLpLoading,
    isTotalMigrateLoading,
    isTotalSuperfluidLoading,
    isTotalSwapLoading,
    totalAllData,
    totalBondingData,
    totalClpData,
    totalCollectData,
    totalLpData,
    totalMigrateData,
    totalSuperfluidData,
    totalSwapData,
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
      <Flex alignItems="center" gap={2} mt={12}>
        <Heading as="h6" variant="h6">
          Related Transactions
        </Heading>
      </Flex>
      <Tabs isLazy lazyBehavior="keepMounted">
        <TabList
          id={tableHeaderId}
          mt={4}
          borderBottom="1px"
          borderColor="gray.800"
        >
          <CustomTab
            fallbackValue={FALLBACK_COUNT}
            count={totalAllData?.total}
            isLoading={isTotalAllLoading}
            onClick={() => handleTabChange(TabIndex.All)}
          >
            All
          </CustomTab>
          <CustomTab
            fallbackValue={FALLBACK_COUNT}
            isDisabled={totalSwapData?.total === 0}
            count={totalSwapData?.total}
            isLoading={isTotalSwapLoading}
            onClick={() => handleTabChange(TabIndex.Swap)}
          >
            Swap
          </CustomTab>
          {pool.type === PoolType.CL ? (
            <CustomTab
              fallbackValue={FALLBACK_COUNT}
              isDisabled={totalClpData?.total === 0}
              count={totalClpData?.total}
              isLoading={isTotalClpLoading}
              onClick={() => handleTabChange(TabIndex.CLP)}
            >
              CLP
            </CustomTab>
          ) : (
            <CustomTab
              fallbackValue={FALLBACK_COUNT}
              isDisabled={totalLpData?.total === 0}
              count={totalLpData?.total}
              isLoading={isTotalLpLoading}
              onClick={() => handleTabChange(TabIndex.LP)}
            >
              LP
            </CustomTab>
          )}
          <CustomTab
            fallbackValue={FALLBACK_COUNT}
            isDisabled={totalBondingData?.total === 0}
            count={totalBondingData?.total}
            isLoading={isTotalBondingLoading}
            onClick={() => handleTabChange(TabIndex.Bonding)}
          >
            Bonding
          </CustomTab>
          {pool.isSuperfluid && (
            <CustomTab
              fallbackValue={FALLBACK_COUNT}
              isDisabled={totalSuperfluidData?.total === 0}
              count={totalSuperfluidData?.total}
              isLoading={isTotalSuperfluidLoading}
              onClick={() => handleTabChange(TabIndex.Superfluid)}
            >
              Superfluid
            </CustomTab>
          )}
          {pool.type === PoolType.CL && (
            <CustomTab
              fallbackValue={FALLBACK_COUNT}
              isDisabled={totalCollectData?.total === 0}
              count={totalCollectData?.total}
              isLoading={isTotalCollectLoading}
              onClick={() => handleTabChange(TabIndex.Collect)}
            >
              Collect
            </CustomTab>
          )}
          {(pool.type === PoolType.CL || pool.type === PoolType.BALANCER) && (
            <CustomTab
              fallbackValue={FALLBACK_COUNT}
              isDisabled={totalMigrateData?.total === 0}
              count={totalMigrateData?.total}
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
              type="is_all"
              countTxs={totalAllData?.total ?? 0}
              pool={pool}
              scrollComponentId={tableHeaderId}
            />
          </TabPanel>
          <TabPanel p={0}>
            <PoolRelatedTxsTable
              type="is_swap"
              countTxs={totalSwapData?.total ?? 0}
              pool={pool}
              scrollComponentId={tableHeaderId}
            />
          </TabPanel>
          {pool.type === PoolType.CL ? (
            <TabPanel p={0}>
              <PoolRelatedTxsTable
                type="is_clp"
                countTxs={totalClpData?.total ?? 0}
                pool={pool}
                scrollComponentId={tableHeaderId}
              />
            </TabPanel>
          ) : (
            <TabPanel p={0}>
              <PoolRelatedTxsTable
                type="is_lp"
                countTxs={totalLpData?.total ?? 0}
                pool={pool}
                scrollComponentId={tableHeaderId}
              />
            </TabPanel>
          )}
          <TabPanel p={0}>
            <PoolRelatedTxsTable
              type="is_bond"
              countTxs={totalBondingData?.total ?? 0}
              pool={pool}
              scrollComponentId={tableHeaderId}
            />
          </TabPanel>
          {pool.isSuperfluid && (
            <TabPanel p={0}>
              <PoolRelatedTxsTable
                type="is_superfluid"
                countTxs={totalSuperfluidData?.total ?? 0}
                pool={pool}
                scrollComponentId={tableHeaderId}
              />
            </TabPanel>
          )}
          {pool.type === PoolType.CL && (
            <TabPanel p={0}>
              <PoolRelatedTxsTable
                type="is_collect"
                countTxs={totalCollectData?.total ?? 0}
                pool={pool}
                scrollComponentId={tableHeaderId}
              />
            </TabPanel>
          )}
          {(pool.type === PoolType.CL || pool.type === PoolType.BALANCER) && (
            <TabPanel p={0}>
              <PoolRelatedTxsTable
                type="is_migrate"
                countTxs={totalMigrateData?.total ?? 0}
                pool={pool}
                scrollComponentId={tableHeaderId}
              />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </Box>
  );
};
