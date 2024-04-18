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

import { usePoolTxsCount } from "../../data";
import { trackUseTab } from "lib/amplitude";
import { CustomTab } from "lib/components/CustomTab";
import type { PoolDetail } from "lib/types";
import { PoolType } from "lib/types";

import { PoolRelatedTxsTable } from "./tables/pool-txs";

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

  const handleTabChange = useCallback(
    (nextTab: TabIndex) => {
      if (nextTab === tab) return;
      trackUseTab(nextTab);
      setTab(nextTab);
    },
    [tab]
  );

  const {
    count: countAllTxs,
    countDisplay: countDisplayAllTxs,
    isLoading: isLoadingAllTxs,
  } = usePoolTxsCount(pool.id, "is_all");
  const {
    count: countSwapTxs,
    countDisplay: countDisplaySwapTxs,
    isLoading: isLoadingSwapTxs,
  } = usePoolTxsCount(pool.id, "is_swap");
  const {
    count: countLpTxs,
    countDisplay: countDisplayLpTxs,
    isLoading: isLoadingLpTxs,
  } = usePoolTxsCount(pool.id, "is_lp");
  const {
    count: countBondTxs,
    countDisplay: countDisplayBondTxs,
    isLoading: isLoadingBondTxs,
  } = usePoolTxsCount(pool.id, "is_bond");
  const {
    count: countSuperfluidTxs,
    countDisplay: countDisplaySuperfluidTxs,
    isLoading: isLoadingSuperfluidTxs,
  } = usePoolTxsCount(pool.id, "is_superfluid");
  const {
    count: countClpTxs,
    countDisplay: countDisplayClpTxs,
    isLoading: isLoadingClpTxs,
  } = usePoolTxsCount(pool.id, "is_clp");
  const {
    count: countCollectTxs,
    countDisplay: countDisplayCollectTxs,
    isLoading: isLoadingCollectTxs,
  } = usePoolTxsCount(pool.id, "is_collect");
  const {
    count: countMigrateTxs,
    countDisplay: countDisplayMigrateTxs,
    isLoading: isLoadingMigrateTxs,
  } = usePoolTxsCount(pool.id, "is_migrate");

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
            count={countDisplayAllTxs}
            isLoading={isLoadingAllTxs}
            onClick={() => handleTabChange(TabIndex.All)}
          >
            All
          </CustomTab>
          <CustomTab
            count={countDisplaySwapTxs}
            isDisabled={countDisplaySwapTxs === "0"}
            isLoading={isLoadingSwapTxs}
            onClick={() => handleTabChange(TabIndex.Swap)}
          >
            Swap
          </CustomTab>
          {pool.type === PoolType.CL ? (
            <CustomTab
              count={countDisplayClpTxs}
              isDisabled={countDisplayClpTxs === "0"}
              isLoading={isLoadingClpTxs}
              onClick={() => handleTabChange(TabIndex.CLP)}
            >
              CLP
            </CustomTab>
          ) : (
            <CustomTab
              count={countDisplayLpTxs}
              isDisabled={countDisplayLpTxs === "0"}
              isLoading={isLoadingLpTxs}
              onClick={() => handleTabChange(TabIndex.LP)}
            >
              LP
            </CustomTab>
          )}
          <CustomTab
            count={countDisplayBondTxs}
            isDisabled={countDisplayBondTxs === "0"}
            isLoading={isLoadingBondTxs}
            onClick={() => handleTabChange(TabIndex.Bonding)}
          >
            Bonding
          </CustomTab>
          {pool.isSuperfluid && (
            <CustomTab
              count={countDisplaySuperfluidTxs}
              isDisabled={countDisplaySuperfluidTxs === "0"}
              isLoading={isLoadingSuperfluidTxs}
              onClick={() => handleTabChange(TabIndex.Superfluid)}
            >
              Superfluid
            </CustomTab>
          )}
          {pool.type === PoolType.CL && (
            <CustomTab
              count={countDisplayCollectTxs}
              isDisabled={countDisplayCollectTxs === "0"}
              isLoading={isLoadingCollectTxs}
              onClick={() => handleTabChange(TabIndex.Collect)}
            >
              Collect
            </CustomTab>
          )}
          {(pool.type === PoolType.CL || pool.type === PoolType.BALANCER) && (
            <CustomTab
              count={countDisplayMigrateTxs}
              isDisabled={countDisplayMigrateTxs === "0"}
              isLoading={isLoadingMigrateTxs}
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
              countTxs={countAllTxs}
              type="is_all"
              scrollComponentId={tableHeaderId}
            />
          </TabPanel>
          <TabPanel p={0}>
            <PoolRelatedTxsTable
              pool={pool}
              countTxs={countSwapTxs}
              type="is_swap"
              scrollComponentId={tableHeaderId}
            />
          </TabPanel>
          {pool.type === PoolType.CL ? (
            <TabPanel p={0}>
              <PoolRelatedTxsTable
                pool={pool}
                countTxs={countClpTxs}
                type="is_clp"
                scrollComponentId={tableHeaderId}
              />
            </TabPanel>
          ) : (
            <TabPanel p={0}>
              <PoolRelatedTxsTable
                pool={pool}
                countTxs={countLpTxs}
                type="is_lp"
                scrollComponentId={tableHeaderId}
              />
            </TabPanel>
          )}
          <TabPanel p={0}>
            <PoolRelatedTxsTable
              pool={pool}
              countTxs={countBondTxs}
              type="is_bond"
              scrollComponentId={tableHeaderId}
            />
          </TabPanel>
          {pool.isSuperfluid && (
            <TabPanel p={0}>
              <PoolRelatedTxsTable
                pool={pool}
                countTxs={countSuperfluidTxs}
                type="is_superfluid"
                scrollComponentId={tableHeaderId}
              />
            </TabPanel>
          )}
          {pool.type === PoolType.CL && (
            <TabPanel p={0}>
              <PoolRelatedTxsTable
                pool={pool}
                countTxs={countCollectTxs}
                type="is_collect"
                scrollComponentId={tableHeaderId}
              />
            </TabPanel>
          )}
          {(pool.type === PoolType.CL || pool.type === PoolType.BALANCER) && (
            <TabPanel p={0}>
              <PoolRelatedTxsTable
                pool={pool}
                countTxs={countMigrateTxs}
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
