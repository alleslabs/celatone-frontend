import {
  Flex,
  Heading,
  Box,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";

import { usePoolTxsCount } from "../data";
import { CustomTab } from "lib/components/CustomTab";

import { PoolRelatedTxsTable } from "./table/pool-txs";

interface PoolRelatedTxsProps {
  poolId: number;
}

export const PoolRelatedTxs = ({ poolId }: PoolRelatedTxsProps) => {
  const { count: countAllTxs, countDisplay: countDisplayAllTxs } =
    usePoolTxsCount(poolId, "is_all");
  const { count: countSwapTxs, countDisplay: countDisplaySwapTxs } =
    usePoolTxsCount(poolId, "is_swap");
  const { count: countLpTxs, countDisplay: countDisplayLpTxs } =
    usePoolTxsCount(poolId, "is_lp");
  const { count: countBondTxs, countDisplay: countDisplayBondTxs } =
    usePoolTxsCount(poolId, "is_bond");
  const { count: countSuperfluidTxs, countDisplay: countDisplaySuperfluidTxs } =
    usePoolTxsCount(poolId, "is_superfluid");

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
          borderColor="pebble.800"
        >
          <CustomTab count={countDisplayAllTxs}>All</CustomTab>
          <CustomTab count={countDisplaySwapTxs}>Swap</CustomTab>
          <CustomTab count={countDisplayLpTxs}>LP</CustomTab>
          <CustomTab count={countDisplayBondTxs}>Bonding</CustomTab>
          <CustomTab count={countDisplaySuperfluidTxs}>Superfluid</CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <PoolRelatedTxsTable
              poolId={poolId}
              countTxs={countAllTxs}
              type="is_all"
              scrollComponentId={tableHeaderId}
            />
          </TabPanel>
          <TabPanel p={0}>
            <PoolRelatedTxsTable
              poolId={poolId}
              countTxs={countSwapTxs}
              type="is_swap"
              scrollComponentId={tableHeaderId}
            />
          </TabPanel>
          <TabPanel p={0}>
            <PoolRelatedTxsTable
              poolId={poolId}
              countTxs={countLpTxs}
              type="is_lp"
              scrollComponentId={tableHeaderId}
            />
          </TabPanel>
          <TabPanel p={0}>
            <PoolRelatedTxsTable
              poolId={poolId}
              countTxs={countBondTxs}
              type="is_bond"
              scrollComponentId={tableHeaderId}
            />
          </TabPanel>
          <TabPanel p={0}>
            <PoolRelatedTxsTable
              poolId={poolId}
              countTxs={countSuperfluidTxs}
              type="is_superfluid"
              scrollComponentId={tableHeaderId}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};
