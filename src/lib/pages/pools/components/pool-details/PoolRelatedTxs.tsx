import {
  Flex,
  Heading,
  Box,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";

import { usePoolTxsCount } from "../../data";
import { useTrack } from "lib/amplitude";
import { CustomTab } from "lib/components/CustomTab";
import type { PoolDetail } from "lib/types";
import { PoolType } from "lib/types";

import { PoolRelatedTxsTable } from "./tables/pool-txs";

interface PoolRelatedTxsProps {
  pool: PoolDetail;
}

export const PoolRelatedTxs = ({ pool }: PoolRelatedTxsProps) => {
  const { trackUseTab } = useTrack();
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
            onClick={() => trackUseTab("All")}
          >
            All
          </CustomTab>
          <CustomTab
            count={countDisplaySwapTxs}
            isLoading={isLoadingSwapTxs}
            onClick={() => trackUseTab("Swap")}
          >
            Swap
          </CustomTab>
          {pool.type === PoolType.CL ? (
            <CustomTab
              count={countDisplayClpTxs}
              isLoading={isLoadingClpTxs}
              onClick={() => trackUseTab("CLP")}
            >
              CLP
            </CustomTab>
          ) : (
            <CustomTab
              count={countDisplayLpTxs}
              isLoading={isLoadingLpTxs}
              onClick={() => trackUseTab("LP")}
            >
              LP
            </CustomTab>
          )}
          <CustomTab
            count={countDisplayBondTxs}
            isLoading={isLoadingBondTxs}
            onClick={() => trackUseTab("Bonding")}
          >
            Bonding
          </CustomTab>
          {pool.isSuperfluid && (
            <CustomTab
              count={countDisplaySuperfluidTxs}
              isLoading={isLoadingSuperfluidTxs}
              onClick={() => trackUseTab("Superfluid")}
            >
              Superfluid
            </CustomTab>
          )}
          {pool.type === PoolType.CL && (
            <CustomTab
              count={countDisplayCollectTxs}
              isLoading={isLoadingCollectTxs}
              onClick={() => trackUseTab("Collect")}
            >
              Collect
            </CustomTab>
          )}
          {(pool.type === PoolType.CL || pool.type === PoolType.BALANCER) && (
            <CustomTab
              count={countDisplayMigrateTxs}
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
