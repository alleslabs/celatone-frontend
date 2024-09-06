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

import { trackUseTab } from "lib/amplitude";
import { CustomTab } from "lib/components/CustomTab";
import { useTxsByPoolIdTableCounts } from "lib/services/tx";
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
  const { data, isLoading } = useTxsByPoolIdTableCounts(pool.id);
  const {
    all = 0,
    totalSwap = 0,
    totalLp = 0,
    totalBond = 0,
    totalSuperfluid = 0,
    totalClp = 0,
    totalCollect = 0,
    totalMigrate = 0,
  } = data || {};

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
            count={all}
            isLoading={isLoading}
            onClick={() => handleTabChange(TabIndex.All)}
          >
            All
          </CustomTab>
          <CustomTab
            count={totalSwap}
            isDisabled={!totalSwap}
            isLoading={isLoading}
            onClick={() => handleTabChange(TabIndex.Swap)}
          >
            Swap
          </CustomTab>
          {pool.type === PoolType.CL ? (
            <CustomTab
              count={totalClp}
              isDisabled={!totalClp}
              isLoading={isLoading}
              onClick={() => handleTabChange(TabIndex.CLP)}
            >
              CLP
            </CustomTab>
          ) : (
            <CustomTab
              count={totalLp}
              isDisabled={!totalLp}
              isLoading={isLoading}
              onClick={() => handleTabChange(TabIndex.LP)}
            >
              LP
            </CustomTab>
          )}
          <CustomTab
            count={totalBond}
            isDisabled={!totalBond}
            isLoading={isLoading}
            onClick={() => handleTabChange(TabIndex.Bonding)}
          >
            Bonding
          </CustomTab>
          {pool.isSuperfluid && (
            <CustomTab
              count={totalSuperfluid}
              isDisabled={!totalSuperfluid}
              isLoading={isLoading}
              onClick={() => handleTabChange(TabIndex.Superfluid)}
            >
              Superfluid
            </CustomTab>
          )}
          {pool.type === PoolType.CL && (
            <CustomTab
              count={totalCollect}
              isDisabled={!totalCollect}
              isLoading={isLoading}
              onClick={() => handleTabChange(TabIndex.Collect)}
            >
              Collect
            </CustomTab>
          )}
          {(pool.type === PoolType.CL || pool.type === PoolType.BALANCER) && (
            <CustomTab
              count={totalMigrate}
              isDisabled={!totalMigrate}
              isLoading={isLoading}
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
              countTxs={all}
              type="is_all"
              scrollComponentId={tableHeaderId}
            />
          </TabPanel>
          <TabPanel p={0}>
            <PoolRelatedTxsTable
              pool={pool}
              countTxs={totalSwap}
              type="is_swap"
              scrollComponentId={tableHeaderId}
            />
          </TabPanel>
          {pool.type === PoolType.CL ? (
            <TabPanel p={0}>
              <PoolRelatedTxsTable
                pool={pool}
                countTxs={totalClp}
                type="is_clp"
                scrollComponentId={tableHeaderId}
              />
            </TabPanel>
          ) : (
            <TabPanel p={0}>
              <PoolRelatedTxsTable
                pool={pool}
                countTxs={totalLp}
                type="is_lp"
                scrollComponentId={tableHeaderId}
              />
            </TabPanel>
          )}
          <TabPanel p={0}>
            <PoolRelatedTxsTable
              pool={pool}
              countTxs={totalBond}
              type="is_bond"
              scrollComponentId={tableHeaderId}
            />
          </TabPanel>
          {pool.isSuperfluid && (
            <TabPanel p={0}>
              <PoolRelatedTxsTable
                pool={pool}
                countTxs={totalSuperfluid}
                type="is_superfluid"
                scrollComponentId={tableHeaderId}
              />
            </TabPanel>
          )}
          {pool.type === PoolType.CL && (
            <TabPanel p={0}>
              <PoolRelatedTxsTable
                pool={pool}
                countTxs={totalCollect}
                type="is_collect"
                scrollComponentId={tableHeaderId}
              />
            </TabPanel>
          )}
          {(pool.type === PoolType.CL || pool.type === PoolType.BALANCER) && (
            <TabPanel p={0}>
              <PoolRelatedTxsTable
                pool={pool}
                countTxs={totalMigrate}
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
