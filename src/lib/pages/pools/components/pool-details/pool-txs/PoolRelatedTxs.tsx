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
            count={totalAllData?.total}
            isLoading={isTotalAllLoading}
            onClick={() => handleTabChange(TabIndex.All)}
            fallbackValue={FALLBACK_COUNT}
          >
            All
          </CustomTab>
          <CustomTab
            count={totalSwapData?.total}
            isDisabled={totalSwapData?.total === 0}
            isLoading={isTotalSwapLoading}
            onClick={() => handleTabChange(TabIndex.Swap)}
            fallbackValue={FALLBACK_COUNT}
          >
            Swap
          </CustomTab>
          {pool.type === PoolType.CL ? (
            <CustomTab
              count={totalClpData?.total}
              isDisabled={totalClpData?.total === 0}
              isLoading={isTotalClpLoading}
              onClick={() => handleTabChange(TabIndex.CLP)}
              fallbackValue={FALLBACK_COUNT}
            >
              CLP
            </CustomTab>
          ) : (
            <CustomTab
              count={totalLpData?.total}
              isDisabled={totalLpData?.total === 0}
              isLoading={isTotalLpLoading}
              onClick={() => handleTabChange(TabIndex.LP)}
              fallbackValue={FALLBACK_COUNT}
            >
              LP
            </CustomTab>
          )}
          <CustomTab
            count={totalBondingData?.total}
            isDisabled={totalBondingData?.total === 0}
            isLoading={isTotalBondingLoading}
            onClick={() => handleTabChange(TabIndex.Bonding)}
            fallbackValue={FALLBACK_COUNT}
          >
            Bonding
          </CustomTab>
          {pool.isSuperfluid && (
            <CustomTab
              count={totalSuperfluidData?.total}
              isDisabled={totalSuperfluidData?.total === 0}
              isLoading={isTotalSuperfluidLoading}
              onClick={() => handleTabChange(TabIndex.Superfluid)}
              fallbackValue={FALLBACK_COUNT}
            >
              Superfluid
            </CustomTab>
          )}
          {pool.type === PoolType.CL && (
            <CustomTab
              count={totalCollectData?.total}
              isDisabled={totalCollectData?.total === 0}
              isLoading={isTotalCollectLoading}
              onClick={() => handleTabChange(TabIndex.Collect)}
              fallbackValue={FALLBACK_COUNT}
            >
              Collect
            </CustomTab>
          )}
          {(pool.type === PoolType.CL || pool.type === PoolType.BALANCER) && (
            <CustomTab
              count={totalMigrateData?.total}
              isDisabled={totalMigrateData?.total === 0}
              isLoading={isTotalMigrateLoading}
              onClick={() => trackUseTab("Migrate")}
              fallbackValue={FALLBACK_COUNT}
            >
              Migrate
            </CustomTab>
          )}
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <PoolRelatedTxsTable
              pool={pool}
              countTxs={Number(totalAllData)}
              type="is_all"
              scrollComponentId={tableHeaderId}
            />
          </TabPanel>
          <TabPanel p={0}>
            <PoolRelatedTxsTable
              pool={pool}
              countTxs={Number(totalSwapData)}
              type="is_swap"
              scrollComponentId={tableHeaderId}
            />
          </TabPanel>
          {pool.type === PoolType.CL ? (
            <TabPanel p={0}>
              <PoolRelatedTxsTable
                pool={pool}
                countTxs={Number(totalClpData)}
                type="is_clp"
                scrollComponentId={tableHeaderId}
              />
            </TabPanel>
          ) : (
            <TabPanel p={0}>
              <PoolRelatedTxsTable
                pool={pool}
                countTxs={Number(totalLpData)}
                type="is_lp"
                scrollComponentId={tableHeaderId}
              />
            </TabPanel>
          )}
          <TabPanel p={0}>
            <PoolRelatedTxsTable
              pool={pool}
              countTxs={Number(totalBondingData)}
              type="is_bond"
              scrollComponentId={tableHeaderId}
            />
          </TabPanel>
          {pool.isSuperfluid && (
            <TabPanel p={0}>
              <PoolRelatedTxsTable
                pool={pool}
                countTxs={Number(totalSuperfluidData)}
                type="is_superfluid"
                scrollComponentId={tableHeaderId}
              />
            </TabPanel>
          )}
          {pool.type === PoolType.CL && (
            <TabPanel p={0}>
              <PoolRelatedTxsTable
                pool={pool}
                countTxs={Number(totalCollectData)}
                type="is_collect"
                scrollComponentId={tableHeaderId}
              />
            </TabPanel>
          )}
          {(pool.type === PoolType.CL || pool.type === PoolType.BALANCER) && (
            <TabPanel p={0}>
              <PoolRelatedTxsTable
                pool={pool}
                countTxs={Number(totalMigrateData)}
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
