import {
  Flex,
  Heading,
  Box,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";

import { CustomTab } from "lib/components/CustomTab";
import { useTxsCountByPoolId } from "lib/services/txService";

import { PoolRelatedTxsTable } from "./table/pool-txs";

interface PoolRelatedTxsProps {
  poolId: number;
}

export const PoolRelatedTxs = ({ poolId }: PoolRelatedTxsProps) => {
  const { data: countAllTxs = 0 } = useTxsCountByPoolId(poolId, "is_all");
  const { data: countSwapTxs = 0 } = useTxsCountByPoolId(poolId, "is_swap");
  const { data: countLpTxs = 0 } = useTxsCountByPoolId(poolId, "is_lp");
  const { data: countBondTxs = 0 } = useTxsCountByPoolId(poolId, "is_bond");
  const { data: countSuperfluidTxs = 0 } = useTxsCountByPoolId(
    poolId,
    "is_superfluid"
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
          borderColor="pebble.800"
        >
          <CustomTab count={countAllTxs}>All</CustomTab>
          <CustomTab count={countSwapTxs}>Swap</CustomTab>
          <CustomTab count={countLpTxs}>LP</CustomTab>
          <CustomTab count={countBondTxs}>Bonding</CustomTab>
          <CustomTab count={countSuperfluidTxs}>Superfluid</CustomTab>
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
