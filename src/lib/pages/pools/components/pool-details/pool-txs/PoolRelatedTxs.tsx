import type { PoolData } from "lib/types";

import {
  Box,
  Flex,
  Heading,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { trackUseTab } from "lib/amplitude";
import { CustomTab } from "lib/components/CustomTab";
import { UPPERBOUND_COUNT } from "lib/data";
import { PoolType } from "lib/types";
import { useCallback, useState } from "react";

import { PoolRelatedTxsTable } from "../tables/pool-txs";
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
  pool: PoolData;
}

const FALLBACK_COUNT = `${UPPERBOUND_COUNT}+`;

export const PoolRelatedTxs = ({ pool }: PoolRelatedTxsProps) => {
  const [tab, setTab] = useState(TabIndex.All);

  const {
    totalAllData,
    isTotalAllLoading,
    totalSwapData,
    isTotalSwapLoading,
    totalClpData,
    isTotalClpLoading,
    totalLpData,
    isTotalLpLoading,
    totalBondingData,
    isTotalBondingLoading,
    totalSuperfluidData,
    isTotalSuperfluidLoading,
    totalCollectData,
    isTotalCollectLoading,
    totalMigrateData,
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
      <Flex alignItems="center" gap={2} mt={12}>
        <Heading as="h6" variant="h6">
          Related Transactions
        </Heading>
      </Flex>
      <Tabs isLazy lazyBehavior="keepMounted">
        <TabList
          id={tableHeaderId}
          borderBottomWidth="1px"
          borderColor="gray.800"
          borderStyle="solid"
          mt={4}
        >
          <CustomTab
            count={totalAllData?.total}
            fallbackValue={FALLBACK_COUNT}
            isLoading={isTotalAllLoading}
            onClick={() => handleTabChange(TabIndex.All)}
          >
            All
          </CustomTab>
          <CustomTab
            count={totalSwapData?.total}
            fallbackValue={FALLBACK_COUNT}
            isDisabled={totalSwapData?.total === 0}
            isLoading={isTotalSwapLoading}
            onClick={() => handleTabChange(TabIndex.Swap)}
          >
            Swap
          </CustomTab>
          {pool.type === PoolType.CL ? (
            <CustomTab
              count={totalClpData?.total}
              fallbackValue={FALLBACK_COUNT}
              isDisabled={totalClpData?.total === 0}
              isLoading={isTotalClpLoading}
              onClick={() => handleTabChange(TabIndex.CLP)}
            >
              CLP
            </CustomTab>
          ) : (
            <CustomTab
              count={totalLpData?.total}
              fallbackValue={FALLBACK_COUNT}
              isDisabled={totalLpData?.total === 0}
              isLoading={isTotalLpLoading}
              onClick={() => handleTabChange(TabIndex.LP)}
            >
              LP
            </CustomTab>
          )}
          <CustomTab
            count={totalBondingData?.total}
            fallbackValue={FALLBACK_COUNT}
            isDisabled={totalBondingData?.total === 0}
            isLoading={isTotalBondingLoading}
            onClick={() => handleTabChange(TabIndex.Bonding)}
          >
            Bonding
          </CustomTab>
          {pool.isSuperfluid && (
            <CustomTab
              count={totalSuperfluidData?.total}
              fallbackValue={FALLBACK_COUNT}
              isDisabled={totalSuperfluidData?.total === 0}
              isLoading={isTotalSuperfluidLoading}
              onClick={() => handleTabChange(TabIndex.Superfluid)}
            >
              Superfluid
            </CustomTab>
          )}
          {pool.type === PoolType.CL && (
            <CustomTab
              count={totalCollectData?.total}
              fallbackValue={FALLBACK_COUNT}
              isDisabled={totalCollectData?.total === 0}
              isLoading={isTotalCollectLoading}
              onClick={() => handleTabChange(TabIndex.Collect)}
            >
              Collect
            </CustomTab>
          )}
          {(pool.type === PoolType.CL || pool.type === PoolType.BALANCER) && (
            <CustomTab
              count={totalMigrateData?.total}
              fallbackValue={FALLBACK_COUNT}
              isDisabled={totalMigrateData?.total === 0}
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
              countTxs={totalAllData?.total ?? 0}
              pool={pool}
              scrollComponentId={tableHeaderId}
              type="is_all"
            />
          </TabPanel>
          <TabPanel p={0}>
            <PoolRelatedTxsTable
              countTxs={totalSwapData?.total ?? 0}
              pool={pool}
              scrollComponentId={tableHeaderId}
              type="is_swap"
            />
          </TabPanel>
          {pool.type === PoolType.CL ? (
            <TabPanel p={0}>
              <PoolRelatedTxsTable
                countTxs={totalClpData?.total ?? 0}
                pool={pool}
                scrollComponentId={tableHeaderId}
                type="is_clp"
              />
            </TabPanel>
          ) : (
            <TabPanel p={0}>
              <PoolRelatedTxsTable
                countTxs={totalLpData?.total ?? 0}
                pool={pool}
                scrollComponentId={tableHeaderId}
                type="is_lp"
              />
            </TabPanel>
          )}
          <TabPanel p={0}>
            <PoolRelatedTxsTable
              countTxs={totalBondingData?.total ?? 0}
              pool={pool}
              scrollComponentId={tableHeaderId}
              type="is_bond"
            />
          </TabPanel>
          {pool.isSuperfluid && (
            <TabPanel p={0}>
              <PoolRelatedTxsTable
                countTxs={totalSuperfluidData?.total ?? 0}
                pool={pool}
                scrollComponentId={tableHeaderId}
                type="is_superfluid"
              />
            </TabPanel>
          )}
          {pool.type === PoolType.CL && (
            <TabPanel p={0}>
              <PoolRelatedTxsTable
                countTxs={totalCollectData?.total ?? 0}
                pool={pool}
                scrollComponentId={tableHeaderId}
                type="is_collect"
              />
            </TabPanel>
          )}
          {(pool.type === PoolType.CL || pool.type === PoolType.BALANCER) && (
            <TabPanel p={0}>
              <PoolRelatedTxsTable
                countTxs={totalMigrateData?.total ?? 0}
                pool={pool}
                scrollComponentId={tableHeaderId}
                type="is_migrate"
              />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </Box>
  );
};
